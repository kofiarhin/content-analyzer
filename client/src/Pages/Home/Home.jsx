import "./home.styles.scss";
import { useState } from "react";
import AnalysisForm from "../../components/AnalysisForm/AnalysisForm";

const Home = () => {
  const [resData, setResData] = useState(null);

  const handleOnData = (data) => {
    setResData(data);
  };

  console.log({ data: resData });

  return (
    <div id="home">
      <h1 className="heading center">Analyze Youtube Channel</h1>
      <AnalysisForm onData={handleOnData} />

      {resData && (
        <div id="res">
          {/* res-unit */}
          <div className="res-unit">
            <h2>Top Videos</h2>
            {resData.top_videos?.map((item, index) => (
              <p key={index}>
                {" "}
                {index + 1}. {item}
              </p>
            ))}
          </div>
          {/* end res-unit */}
          {/* res-unit */}
          <div className="res-unit">
            <h2>Insights</h2>
            <p>{resData.engagement_insights}</p>
          </div>
          {/* end res-unit */}
          {/* res-unit */}
          <div className="res-unit"></div> <h2>Summary</h2>
          <p>{resData?.summary}</p>
          {/* end res-unit */}
          {/* res-unit */}
          <div className="res-unit">
            <h2>Recommendations</h2>
            {resData?.recommendations?.map((item, index) => {
              return (
                <p>
                  {" "}
                  {index + 1}. {item}{" "}
                </p>
              );
            })}
          </div>
          {/* end res-unit */}
        </div>
      )}
    </div>
  );
};

export default Home;
