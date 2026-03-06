import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import Success from "./Success";
import Failure from "./Failure";

const root = ReactDOM.createRoot(document.getElementById("root"));

const path = window.location.pathname;

if (path === "/payment-success") {
  root.render(<Success />);
}
else if (path === "/payment-failure") {
  root.render(<Failure />);
}
else {
  root.render(<App />);
}