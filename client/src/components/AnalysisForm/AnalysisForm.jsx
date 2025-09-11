import { useState } from "react";
import "./analysisForm.styles.scss";
import { BASE_URL } from "../../constants/constants";

const AnalysisForm = ({ onData }) => {
  const [url, setUrl] = useState("https://www.youtube.com/@devkofi");

  const handleChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/analysis`, {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        throw new Error("tehre was a problem fetching data");
      }
      const data = await res.json();
      onData(data);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div id="analysis-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="url"
          onChange={handleChange}
          value={url}
          placeholder="enter youtuve change url here"
        />
        <button>Start Analysis</button>
      </form>
    </div>
  );
};

export default AnalysisForm;
