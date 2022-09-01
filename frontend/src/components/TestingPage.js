import { useState } from "react";
import axios from "axios";

function TestingPage() {
  const URI_USER_SVC = "http://user-service-service:8000";
  const URI_MATCHING_SVC = "http://matching-service-service:8001";

  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");
  
  axios.get(URI_USER_SVC).then((res) => setA(res.data)).catch(function(error){
    console.log(error);
    console.log(error.status);
    console.log(error.code);
  });
  axios.get(URI_MATCHING_SVC).then((res) => setB(res.data)).catch(function(error){
    console.log(error);
    console.log(error.status);
    console.log(error.code);
  });
  axios.get("http://NONSENSE:8080").then((res) => console.log(res)).catch(function(error){
    console.log(error); // Network Error
    console.log(error.status); // undefined
    console.log(error.code); // undefined
  });
  fetch(URI_USER_SVC, requestOptions).then((res) => res.json()).then(data => {
    setC(data.data)
  })
  fetch(URI_MATCHING_SVC, requestOptions).then((res) => res.json()).then(data => {
    setD(data.data)
  })
  return (
    <>
      <p>Hello New Testing page</p>
      <p>{a}</p>
      <p>{b}</p>
      <p>{c}</p>
      <p>{d}</p>
      <p>{URI_USER_SVC}</p>
      <p>{URI_MATCHING_SVC}</p>
    </>
  );
}

export default TestingPage;
