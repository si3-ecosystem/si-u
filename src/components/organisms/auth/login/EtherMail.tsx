/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";

import jwt from "jsonwebtoken";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setAddress, setConnected, setUser } from "@/redux/slice/userSlice";

const EtherMail = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const stylesAppliedRef = useRef(false);

  useEffect(() => {
    // Event listener for successful signin
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.addEventListener("EtherMailSignInOnSuccess", (event: any) => {
      const __loginEvent = event;
      const ethermailUser = jwt.decode(__loginEvent.detail.token);

      dispatch(setUser(ethermailUser));
      dispatch(setConnected(true));
      dispatch(setAddress(ethermailUser.wallet));

      router.replace("/");
    });

    // Load EtherMail script
    const loadScript = () => {
      const p = document.createElement("script");
      p.src = "https://cdn-email.ethermail.io/sdk/v2/ethermail.js";

      p.setAttribute("a", "66e644fcb593edd053b3f5ca");
      p.setAttribute("b", "si3");
      p.setAttribute("c", "login");

      document.body.appendChild(p);
    };

    loadScript();

    // Define the style function - available to the window for the on-mounted attribute
    window.setStyle = function () {
      applyStyles();
    };

    // Set up observer to watch for the ethermail-login element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (
              node.nodeName &&
              node.nodeName.toLowerCase() === "ethermail-login"
            ) {
              setTimeout(applyStyles, 100); // Small delay to ensure shadowRoot is available
            }
          });
        }
      });
    });

    // Start observing
    observer.observe(document.body, { childList: true, subtree: true });

    // Function to apply styles to the ethermail component
    const applyStyles = () => {
      if (stylesAppliedRef.current) return;

      const element = document.querySelector("ethermail-login");
      if (element && element.shadowRoot) {
        const style = document.createElement("style");
        style.textContent = `
          .ethermail-login-button {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100% !important;
            cursor: pointer !important;
            border-radius: 0.5rem !important;
            border: 1px solid #f3f4f6 !important;
            background-color: #f3f4f6 !important;
            padding: 0.5rem 1rem !important;
            transition: background-color 0.3s !important;
            color: #000 !important;
            font-weight: 500 !important;
            font-size: 1rem !important;
            margin-left: -1rem !important;
          }

          @media (max-width: 748px) {
            .ethermail-login-button {
              font-size: 0.875rem !important;
            }
          }

          .ethermail-login-button:hover {
            background-color: #e5e7eb !important;
          }

          .ethermail-login-button img {
            filter: invert(0.8);
          }

          .ethermail-login-button:hover img {
            filter: invert(1);
          }
        `;
        element.shadowRoot.appendChild(style);
        stylesAppliedRef.current = true;
        console.log("EtherMail styles applied");
      }
    };

    // Try to apply styles immediately if element already exists
    // setTimeout(applyStyles, 500);
    applyStyles();

    return () => {
      observer.disconnect();
    };
  }, [dispatch, router]);

  return (
    <div className="w-full overflow-hidden rounded-lg border">
      <ethermail-login
        widget="67b0e30547bb5daf3c21fa37"
        type="wallet"
        permissions="write"
        on-mounted="setStyle"
        label="Continue With Ethermail "
      ></ethermail-login>
    </div>
  );
};

export default EtherMail;
