import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, HashRouter } from "react-router-dom";
import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/index.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <Router>
    <App />
  </Router>
  </HashRouter>
);