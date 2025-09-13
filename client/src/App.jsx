import "./app.styles.scss";
import React from "react";
import useAnalyzeMutation from "./hooks/useAnalyzeMutation";
import { useState } from "react";

const App = () => {
  const { data, mutate } = useAnalyzeMutation();
  const [username, setUsername] = useState("@devkofi");

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutate(username);
  };
  const handleChange = (e) => {
    setUsername(e.target.value);
  };
  return (
    <div id="app">
      <div className="container">
        <h1 className="heading center">Youtube Content Analyzer</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="username"
            placeholder="Enter username here"
            value={username}
            onChange={handleChange}
          />
          <button type="submit">Start Analysis</button>
        </form>

        {data && <p className="heading"> {data.summary} </p>}
      </div>
    </div>
  );
};

export default App;
