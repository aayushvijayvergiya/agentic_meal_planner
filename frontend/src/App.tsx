import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

function App() {
  const [status, setStatus] = useState<string>("loading...");

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div>
      <h1>Agentic Quickapp</h1>
      <p data-testid="backend-status">Backend status: {status}</p>
    </div>
  );
}

export default App;
