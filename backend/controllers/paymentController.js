const crypto = require("crypto");
const db = require("../db");

const PAYU_KEY = process.env.PAYU_KEY;
const PAYU_SALT = process.env.PAYU_SALT;
const PAYU_BASE_URL = process.env.PAYU_BASE_URL;

exports.createPayment = (req, res) => {

  const { amount, productinfo, firstname, email, phone } = req.body;

  const txnid = "txn" + Date.now();

  const data = {
    key: PAYU_KEY,
    txnid,
    amount,
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

};



exports.paymentSuccess = (req, res) => {

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

  ]);

  res.redirect("http://localhost:3000/payment-success");

};



exports.paymentFailure = (req, res) => {

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

  ]);

  res.redirect("http://localhost:3000/payment-failure");

};