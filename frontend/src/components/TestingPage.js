import { useState } from "react";
import axios from "axios";

function TestingPage() {
  const URI_MATCHING_SVC = process.env.REACT_APP_URI_MATCHING_SVC || "http://localhost:8001";
  const [a, setA] = useState("");
  axios.get(URI_MATCHING_SVC).then((res) => setA(res.data)).catch(function(error){
    console.log(error);
    console.log(error.status);
    console.log(error.code);
  });
  return (
    <>
      <p>Hello New Testing page</p>
      <p>{a}</p>
      <p>{URI_MATCHING_SVC}</p>
    </>
  );
}

export default TestingPage;
