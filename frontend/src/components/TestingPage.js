import { useState } from "react";
import axios from "axios";

function TestingPage() {
  const URI_USER_SVC = process.env.URI_USER_SVC || "http://localhost:8000";
  const URI_MATCHING_SVC =
    process.env.URI_MATCHING_SVC || "http://localhost:8001";
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  axios.get(URI_USER_SVC).then((res) => setA(res.data));
  axios.get(URI_MATCHING_SVC).then((res) => setB(res.data));
  return (
    <>
      <p>{a}</p>
      <p>{b}</p>
    </>
  );
}

export default TestingPage;
