import { useState } from "react";
import "./analysisForm.styles.scss";
import { BASE_URL } from "../../constants/constants";
import Spinner from "../../components/Spinner/Spinner";

const AnalysisForm = ({ onData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/api/analysis`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ username }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.log("Response status:", res.status);
        console.log("Response text:", text);
        let errorData;
        try {
          errorData = JSON.parse(text);
        } catch (e) {
          console.error("JSON parse error:", e.message);
          errorData = { error: "Unknown error" };
        }
        throw new Error(errorData.error || "Failed to fetch data");
      }

      const data = await res.json();
      onData(data);
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div id="analysis-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          onChange={handleChange}
          value={username}
          placeholder="Enter YouTube username here"
        />
        <button type="submit">Start Analysis</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AnalysisForm;
