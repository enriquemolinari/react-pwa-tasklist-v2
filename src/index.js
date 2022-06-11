import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.min.css";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";

const Msg = (props) => (
  <div>
    A new version is available. Click{" "}
    <Button size="sm" onClick={() => onAlertToastClick(props.reg)}>
      here
    </Button>{" "}
    to update it now. Or, close this message and the application will be updated
    the next time you open it.
  </div>
);

function onNewRelease(registration) {
  toast(<Msg reg={registration} />, {
    position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: false,
  });
}

function onAlertToastClick(registration) {
  registration.waiting.postMessage({ type: "SKIP_WAITING" });
}

navigator.serviceWorker.addEventListener("controllerchange", () => {
  window.location.reload();
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
//serviceWorkerRegistration.unregister();
serviceWorkerRegistration.register({ onUpdate: onNewRelease });
