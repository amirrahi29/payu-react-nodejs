import React from "react";

export default function Failure() {

  return (
    <div style={{
      fontFamily:"sans-serif",
      padding:"40px",
      textAlign:"center"
    }}>

      <h1 style={{color:"red"}}>Payment Failed</h1>

      <p>Something went wrong with your transaction.</p>

      <a href="/" style={{
        marginTop:"20px",
        display:"inline-block",
        textDecoration:"none",
        background:"#007bff",
        color:"#fff",
        padding:"10px 20px",
        borderRadius:"5px"
      }}>
        Try Again
      </a>

    </div>
  );
}