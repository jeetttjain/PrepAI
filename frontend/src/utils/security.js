import { toast } from "react-hot-toast";

/**
 * Advanced Client-Side Security System
 * Prevents standard inspect-element access, shortcuts, and deters console debugging.
 */
export const initializeClientSecurity = () => {
  // Only activate when not in standard local development or when requested
  const isProduction = process.env.NODE_ENV === "production" || window.location.hostname !== "localhost";

  // If local development, we can print a console log message
  if (!isProduction) {
    console.log("🛡️ PrepAI Security system loaded in development mode (Inspection controls bypassable on localhost).");
  }

  // 1. Disable Right Click Context Menu
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    toast.error("Security Policy: Inspection and context actions are disabled.", {
      id: "sec-toast-right-click",
      duration: 2000,
    });
  });

  // 2. Disable Keyboard Shortcuts for Inspect Page & View Source
  document.addEventListener("keydown", (e) => {
    // F12 key
    if (e.key === "F12" || e.keyCode === 123) {
      e.preventDefault();
      triggerSecurityAlert("Developer console access is restricted.");
      return false;
    }

    // Ctrl+Shift+I (Inspect element)
    if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.keyCode === 73)) {
      e.preventDefault();
      triggerSecurityAlert("Inspection is restricted.");
      return false;
    }

    // Ctrl+Shift+J (Console window)
    if (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j" || e.keyCode === 74)) {
      e.preventDefault();
      triggerSecurityAlert("Console window access is restricted.");
      return false;
    }

    // Ctrl+Shift+C (Inspect element selection mode)
    if (e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c" || e.keyCode === 67)) {
      e.preventDefault();
      triggerSecurityAlert("Element inspection selection is restricted.");
      return false;
    }

    // Ctrl+U (View Page Source)
    if (e.ctrlKey && (e.key === "U" || e.key === "u" || e.keyCode === 85)) {
      e.preventDefault();
      triggerSecurityAlert("Viewing page source is restricted.");
      return false;
    }

    // Ctrl+S (Save Page)
    if (e.ctrlKey && (e.key === "S" || e.key === "s" || e.keyCode === 83)) {
      e.preventDefault();
      triggerSecurityAlert("Saving page assets is restricted.");
      return false;
    }
  });

  // Helper to show security toast
  const triggerSecurityAlert = (msg) => {
    toast.error(`🛡️ PrepAI Security: ${msg}`, {
      id: "security-toast-alert",
      duration: 3000,
      style: {
        background: "#7f1d1d",
        color: "#fecaca",
        border: "1px solid #dc2626",
      },
    });
  };

  // 3. Prevent DevTools via Debugger Loop (Only for deployed applications to prevent local disruption)
  if (isProduction) {
    const preventInspectionLoop = () => {
      // Inline function executing an infinite debugger loop if DevTools are active
      (function () {
        const check = function () {
          try {
            (function () {
              return function (type) {
                return (
                  type === "single"
                    ? (function () {
                        // eslint-disable-next-line no-debugger
                        debugger;
                      })()
                    : (function () {
                        // eslint-disable-next-line no-debugger
                        debugger;
                      })()
                );
              };
            })()("single");
          } catch (e) {
            // ignore
          }
        };
        setInterval(check, 1000);
      })();
    };
    
    // Defer a bit to allow page rendering before debugger cycle starts
    setTimeout(preventInspectionLoop, 2000);
  }
};
