import React from "react";
import ReactDOM from "react-dom";
import "./index.css"; // Importing your global CSS file here
import App from "./App";  // The main App component

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root") // Make sure this matches the id in your index.html
);
