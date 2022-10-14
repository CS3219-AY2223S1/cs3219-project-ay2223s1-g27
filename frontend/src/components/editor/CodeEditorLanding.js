import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Alert, Box, Button, Snackbar, Link } from "@mui/material";
import { isUnauthorizedError } from "@thream/socketio-jwt/build/UnauthorizedError.js";
// import CodeEditorWindow from "./CodeEditorWindow";
import Editor from "@monaco-editor/react";
import QuestionWindow from "./QuestionWindow";
import axiosApiInstance from "../../axiosApiInstance";
import { languageOptions } from "../../constants/languageOptions";
import { URL_QUESTION_SVC_COMPILE } from "../../configs";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { defineTheme } from "../../lib/defineTheme";
import useKeyPress from "../../hooks/useKeyPress";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";

const javascriptDefault = `// some comment`;

const CodeEditorLanding = ({ socket }) => {
  const location = useLocation(); // Location contains username and selected difficulty level
  const [alertOpen, setAlertOpen] = useState(false);
  const [otherUser, setOtherUser] = useState("");
  const [code, setCode] = useState(javascriptDefault);
  const [codeSnippets, setCodeSnippets] = useState([]);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);
  const [titleSlug, setTitleSlug] = useState("");

  socket.on("connect_error", (error) => {
    if (isUnauthorizedError(error)) {
      // TODO might need to handle the error here
      console.log("User token has expired");
    }
  });

  socket.on("receive leave", (data) => {
    console.log(`user ${data.username} has left the room`);
    setOtherUser(data.username);
    setAlertOpen(true);
  });

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const onSelectChange = (sl) => {
    socket.emit("language event", {
      room_id: location.state.room_id,
      language_id: sl.id,
    });
    setLanguage(sl);
  };

  useEffect(() => {
    updateCodeSnippet(codeSnippets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const updateCodeSnippet = (codeSnippets) => {
    console.log(language);
    const codeSnippet = codeSnippets.find((codeSnippet) => {
      return codeSnippet.lang.toLowerCase() === language.value.toLowerCase();
    });
    setCode(codeSnippet?.code || "");
  };

  socket.on("receive language", (payload) => {
    console.log(payload);
    languageOptions.forEach((x) => {
      if (x.id === payload.language_id) {
        console.log(`setting language to${x.name}`);
        setLanguage(x);
      }
    });
  });

  useEffect(() => {
    if (enterPress && ctrlPress) {
      handleCompile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctrlPress, enterPress]);

  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      // encode source code in base64
      source_code: btoa(code),
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: URL_QUESTION_SVC_COMPILE,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
      },
      data: formData,
    };

    axiosApiInstance
      .request(options)
      .then(function (response) {
        setProcessing(false);
        showSuccessToast(`Received results!`);
        setOutputDetails(response.data);
        socket.emit("output event", {
          room_id: location.state.room_id,
          outputDetails: response.data,
        });
        return;
      })
      .catch((err) => {
        console.log("err", err);
        setProcessing(false);
        showErrorToast();
      });
  };

  socket.on("receive output", (payload) => {
    showSuccessToast(`Received results!`);
    setOutputDetails(payload.outputDetails);
  });

  const handleEditorChange = (value) => {
    socket.emit("coding event", {
      room_id: location.state.room_id,
      newCode: value,
    });
    onChange("code", value);
  };

  socket.on("receive code", (payload) => {
    onChange("code", payload.newCode);
  });

  function handleThemeChange(th) {
    const theme = th;

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }

  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleClose = () => {
    setAlertOpen(false);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Snackbar open={alertOpen} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
          <span>{`${otherUser} has left the room! `}</span>
          <span>
            {`Continue `}
            <Link
              href={`https://leetcode.com/problems/${titleSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              underline="always"
            >
              here
            </Link>
          </span>
        </Alert>
      </Snackbar>

      <Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          style={{ marginBottom: "1%" }}
        >
          <QuestionWindow
            socket={socket}
            titleSlug={titleSlug}
            setTitleSlug={setTitleSlug}
            setCodeSnippets={setCodeSnippets}
            updateCodeSnippet={updateCodeSnippet}
          />
          <Box
            display={"flex"}
            flexDirection={"row"}
            style={{ marginTop: "1%" }}
          >
            <LanguagesDropdown
              language={language}
              onSelectChange={onSelectChange}
            />
            <div style={{ marginRight: "15px" }}></div>
            <ThemeDropdown
              handleThemeChange={handleThemeChange}
              theme={theme}
            />
          </Box>
          <div
            style={{ paddingTop: "10px" }}
            className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl"
          >
            <Editor
              height="85vh"
              width={`100%`}
              language={language?.value || "javascript"}
              value={code}
              theme={theme.value}
              defaultValue="// Start editing here"
              onChange={handleEditorChange}
            />
          </div>
        </Box>
        <OutputWindow outputDetails={outputDetails} />
        <CustomInput
          customInput={customInput}
          setCustomInput={setCustomInput}
        />
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            marginBottom: "10px",
          }}
        >
          <Button
            onClick={handleCompile}
            disabled={!code}
            variant="contained"
            style={{
              textTransform: "none",
              borderWidth: "2px",
              borderRadius: "7px",
              backgroundColor: !code ? "#bcbcbc" : "#1e293b",
              fontSize: "15px",
              fontWeight: "bold",
            }}
          >
            {" "}
            {processing ? "Processing..." : "Compile & Execute"}
          </Button>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </Box>
      </Box>
    </>
  );
};

export default CodeEditorLanding;
