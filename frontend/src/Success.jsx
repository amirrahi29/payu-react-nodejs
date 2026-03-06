import React from "react";

export default function Success() {

  return (
    <div style={{
      fontFamily:"sans-serif",
      padding:"40px",
      textAlign:"center"
    }}>

      <h1 style={{color:"green"}}>Payment Successful</h1>

      <p>Your transaction has been completed successfully.</p>

      <a href="/" style={{
        marginTop:"20px",
        display:"inline-block",
        textDecoration:"none",
        background:"#007bff",
        color:"#fff",
        padding:"10px 20px",
        borderRadius:"5px"
      }}>
        Back to Home
      </a>

    </div>
  );
}