// src/pages/Home/Home.jsx
import "./home.styles.scss";
import { useState } from "react";
import AnalysisForm from "../../components/AnalysisForm/AnalysisForm";

const Home = () => {
  const [resData, setResData] = useState(null);

  const handleOnData = (data) => {
    setResData(data);
  };

  return (
    <div id="home">
      <h1 className="heading center">Analyze YouTube Channel</h1>
      <AnalysisForm onData={handleOnData} />

      {resData && (
        <div id="res">
          {/* res-unit */}
          <div className="res-unit">
            <h2>Top Videos</h2>
            {resData?.top_videos?.map((item, index) => (
              <p key={index}>
                {index + 1}. {item}
              </p>
            ))}
          </div>
          {/* end res-unit */}

          {/* res-unit */}
          <div className="res-unit">
            <h2>Insights</h2>
            <p>{resData?.engagement_insights}</p>
          </div>
          {/* end res-unit */}

          {/* res-unit */}
          <div className="res-unit">
            <h2>Summary</h2>
            <p>{resData?.summary}</p>
          </div>
          {/* end res-unit */}

          {/* res-unit */}
          <div className="res-unit">
            <h2>Recommendations</h2>
            {resData?.recommendations?.map((item, index) => (
              <p key={index}>
                {index + 1}. {item}
              </p>
            ))}
          </div>
          {/* end res-unit */}

          {/* res-unit */}
          <div className="res-unit">
            <h2>Suggested Topics</h2>
            {resData?.suggested_topics?.map((s, index) => (
              <div className="suggested-unit" key={`${s.topic}-${index}`}>
                <h3>
                  {index + 1}. {s.topic}
                </h3>
                <p>{s.description}</p>
              </div>
            ))}
          </div>
          {/* end res-unit */}
        </div>
      )}
    </div>
  );
};

export default Home;
