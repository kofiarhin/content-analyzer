import { useEffect } from "react";
import { BASE_URL } from "./constants/constants";
import Footer from "./components/Footer/Footer";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Home from "./Pages/Home/Home";

const App = () => {
  useEffect(() => {
    const getData = async () => {
      const res = await fetch(BASE_URL);
      const data = await res.json();
      console.log("base_url: ", BASE_URL);
    };

    getData();
  }, []);

  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
