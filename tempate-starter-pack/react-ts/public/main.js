import React from "https://esm.sh/react@18?bundle";
import { createRoot } from "https://esm.sh/react-dom@18/client?bundle";

// Direct App component for WebContainer
function App({ name }) {
  return React.createElement(
    'div',
    { 
      style: { 
        fontFamily: "system-ui, sans-serif", 
        padding: "1rem", 
        color: "#000", 
        background: "#fff" 
      } 
    },
    [
      React.createElement(
        'h1',
        { style: { fontWeight: 800, fontSize: "1.5rem" } },
        `Hello ${name}!`
      ),
      React.createElement(
        'p',
        null,
        'Start editing to see some magic happen :)'
      )
    ]
  );
}

createRoot(document.getElementById("app")).render(React.createElement(App, { name: "WebContainer" }));
