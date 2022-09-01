import { useState } from "react";
import axios from "axios";

function TestingPage() {
  const URI_USER_SVC = "http://user-service-service:8000";
  const URI_MATCHING_SVC = "http://matching-service-service:8001";
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  axios.get(URI_USER_SVC).then((res) => setA(res.data));
  axios.get(URI_MATCHING_SVC).then((res) => setB(res.data));
  axios.get("http://NONSENSE:8080").then((res) => console.log(res));
  return (
    <>
      <p>New Testing page</p>
      <p>{a}</p>
      <p>{b}</p>
      <p>{URI_USER_SVC}</p>
      <p>{URI_MATCHING_SVC}</p>
    </>
  );
}

export default TestingPage;
