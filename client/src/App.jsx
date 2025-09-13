import "./app.styles.scss";
import React from "react";
import useAnalyzeMutation from "./hooks/useAnalyzeMutation";
import { useState } from "react";

const App = () => {
  const { data, mutate } = useAnalyzeMutation();
  const [username, setUsername] = useState("@devkofi");

  console.log({ data });

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
      </div>
    </div>
  );
};

export default App;
