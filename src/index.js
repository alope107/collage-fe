import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import useInterval from "./hooks/useInterval";
import reportWebVitals from "./reportWebVitals";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleReCaptchaProvider reCaptchaKey="6LdZCzQmAAAAAL9Si_CLXxMGFj09JhQcseB6Hh1d">
      <App retrier={useInterval}/>
    </GoogleReCaptchaProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
