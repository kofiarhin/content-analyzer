import { useState } from "react";
import "./analysisForm.styles.scss";
import { BASE_URL } from "../../constants/constants";
import Spinner from "../../components/Spinner/Spinner";

const AnalysisForm = ({ onData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");

  const handleChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/api/analysis`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        throw new Error("There was a problem fetching data");
      }

      const data = await res.json();
      onData(data);
    } catch (error) {
      console.error(error.message);
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
          name="url"
          onChange={handleChange}
          value={url}
          placeholder="Enter YouTube channel URL here"
        />
        <button type="submit">Start Analysis</button>
      </form>
    </div>
  );
};

export default AnalysisForm;