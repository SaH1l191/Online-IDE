import React from "https://esm.sh/react@18?bundle";
import { createRoot } from "https://esm.sh/react-dom@18/client?bundle";

// Direct App component for WebContainer
function App({ name }: { name: string }) {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "1rem", color: "#000", background: "#fff" }}>
      <h1 style={{ fontWeight: 800, fontSize: "1.5rem" }}>Hello {name}!</h1>
      <p>Start editing to see some magic happen :)</p>
    </div>
  );
}

createRoot(document.getElementById("app")!).render(<App name="WebContainer" />);