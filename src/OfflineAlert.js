import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OfflineAlert({ offline }) {
  const toastId = React.useRef(null);
  const wasOffline = React.useRef(false);

  useEffect(() => {
    if (offline) {
      wasOffline.current = true;
      toastId.current = toast.warn(
        "There is no Internet connection. Veryfing...",
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
        }
      );
    } else {
      toast.dismiss(toastId.current);
      if (wasOffline.current)
        toast.info("Internet connection is back!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: true,
        });
      wasOffline.current = false;
    }

    return () => toast.dismiss(toastId.current);
  }, [offline]);

  return <ToastContainer />;
}
