require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= MYSQL CONNECTION =================

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.log("DB connection error:", err);
  } else {
    console.log("MySQL connected successfully");
  }
});

// ================= PAYU CONFIG =================

const PAYU_KEY = process.env.PAYU_KEY;
const PAYU_SALT = process.env.PAYU_SALT;
const PAYU_BASE_URL =
  process.env.PAYU_BASE_URL || "https://test.payu.in/_payment";

if (!PAYU_KEY || !PAYU_SALT) {
  console.error("Missing PAYU_KEY or PAYU_SALT");
  process.exit(1);
}

// ================= CREATE PAYMENT =================

app.post("/api/pay", (req, res) => {

  const { amount, productinfo, firstname, email, phone } = req.body;

  if (!amount || !productinfo || !firstname || !email || !phone) {
    return res.status(400).json({
      error: "amount, productinfo, firstname, email, phone required",
    });
  }

  const txnid = "txn" + Date.now();
  const amt = parseFloat(amount).toFixed(2);

  const data = {
    key: PAYU_KEY,
    txnid,
    amount: amt,
    productinfo,
    firstname,
    email,
    phone,
    surl: "http://localhost:8082/api/payment-success",
    furl: "http://localhost:8082/api/payment-failure",
    service_provider: "payu_paisa",
  };

  const hashString =
    `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${PAYU_SALT}`;

  const hash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");

  data.hash = hash;

  res.json({
    paymentUrl: PAYU_BASE_URL,
    params: data
  });

});

// ================= SUCCESS CALLBACK =================

app.post("/api/payment-success", (req, res) => {

  console.log("PAYMENT SUCCESS:", req.body);

  const data = req.body;

  const sql = `
    INSERT INTO transactions
    (txnid, mihpayid, status, amount, productinfo, firstname, email, phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    data.txnid,
    data.mihpayid,
    data.status,
    data.amount,
    data.productinfo,
    data.firstname,
    data.email,
    data.phone
  ], (err) => {

    if (err) {
      console.log("DB Error:", err);
    }

  });

  res.redirect("http://localhost:3000/payment-success");

});

// ================= FAILURE CALLBACK =================

app.post("/api/payment-failure", (req, res) => {

  console.log("PAYMENT FAILURE:", req.body);

  const data = req.body;

  const sql = `
    INSERT INTO transactions
    (txnid, mihpayid, status, amount, productinfo, firstname, email, phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    data.txnid,
    data.mihpayid,
    data.status,
    data.amount,
    data.productinfo,
    data.firstname,
    data.email,
    data.phone
  ], (err) => {

    if (err) {
      console.log("DB Error:", err);
    }

  });

  res.redirect("http://localhost:3000/payment-failure");

});

// ================= TRANSACTION LIST =================

app.get("/api/transactions", (req, res) => {

  db.query(
    "SELECT * FROM transactions ORDER BY id DESC",
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);

    }
  );

});

// ================= SERVER START =================

const PORT = process.env.PORT || 8082;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});