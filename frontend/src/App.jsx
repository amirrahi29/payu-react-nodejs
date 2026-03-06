import React from "react";

function App() {

  const buyPlan = async (plan) => {

    const product = {
      amount: plan.amount,
      productinfo: plan.name + " Plan",
      firstname: "Test",
      email: "test@example.com",
      phone: "9999999999",
    };

    try {
      const res = await fetch("http://localhost:8082/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const data = await res.json();

      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.paymentUrl;

      Object.keys(data.params).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = data.params[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

    } catch (err) {
      alert("Payment initiation failed");
    }
  };

  const plans = [
    { name: "Basic", amount: "1.00" },
    { name: "Pro", amount: "2.00" },
    { name: "Premium", amount: "3.00" }
  ];

  return (
    <div style={{fontFamily:"sans-serif", padding:"40px"}}>

      <h1 style={{textAlign:"center"}}>Choose Your Plan</h1>

      <div style={{
        display:"flex",
        justifyContent:"center",
        gap:"30px",
        marginTop:"40px"
      }}>

        {plans.map((plan) => (

          <div key={plan.name} style={{
            border:"1px solid #ddd",
            borderRadius:"10px",
            padding:"30px",
            width:"200px",
            textAlign:"center",
            boxShadow:"0 4px 10px rgba(0,0,0,0.1)"
          }}>

            <h2>{plan.name}</h2>

            <h3>₹{plan.amount}</h3>

            <button
              onClick={() => buyPlan(plan)}
              style={{
                marginTop:"15px",
                padding:"10px 20px",
                border:"none",
                background:"#007bff",
                color:"#fff",
                borderRadius:"5px",
                cursor:"pointer"
              }}
            >
              Buy
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default App;