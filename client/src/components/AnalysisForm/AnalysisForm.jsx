import { useState } from "react";
import "./analysisForm.styles.scss";
import { BASE_URL } from "../../constants/constants";
import Spinner from "../../components/Spinner/Spinner";

const AnalysisForm = ({ onData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");

  const handleChange = (e) => {
    Home;
    setUrl(e.target.value);
  };

  if (isLoading) {
    return <Spinner />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
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
      setIsLoading(false);
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
