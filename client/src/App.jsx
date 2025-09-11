import { useEffect } from "react";
import { BASE_URL } from "./constants/constants";

const App = () => {
  useEffect(() => {
    const getData = async () => {
      const res = await fetch(BASE_URL);
      const data = await res.json();
      console.log("base_url: ", BASE_URL);
      console.log({ data });
    };

    getData();
  }, []);

  return (
    <div>
      <h1 className="heading center">Hello World</h1>
    </div>
  );
};

export default App;
