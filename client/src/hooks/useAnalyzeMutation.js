import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../constants/constants";
const useAnalyzeMutation = () => {
  const handleAnalysis = async (username) => {
    const res = await fetch(`${BASE_URL}/api/analysis`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ username }),
    });

    if (!res.ok) {
      throw new Error("something went wrong");
    }
    const data = await res.json();

    return data;
  };
  return useMutation({
    mutationKey: ["analyze"],
    mutationFn: (data) => handleAnalysis(data),
  });
};

export default useAnalyzeMutation;
