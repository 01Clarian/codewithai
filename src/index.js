import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/index.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";

createRoot(document.getElementById("root")).render(
  <Router>
    <App />
  </Router>
);