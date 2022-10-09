import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { jwtDecode } from '../../util/auth';
import { useCookies } from 'react-cookie';
import { Alert, Snackbar, Link } from "@mui/material";
import { io } from "socket.io-client";
import { isUnauthorizedError } from '@thream/socketio-jwt/build/UnauthorizedError.js'
import CodeEditorWindow from "./CodeEditorWindow";
import QuestionWindow from "./QuestionWindow";
import axiosApiInstance from "../../axiosApiInstance"
import { classnames } from "../../util/general";
import { languageOptions } from "../../constants/languageOptions";
import { PREFIX_COLLAB_SVC, URL_COLLAB_SVC, URL_QUESTION_SVC_COMPILE } from "../../configs";

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

const CodeEditorLanding = () => {
  const location = useLocation(); // Location contains username and selected difficulty level
  const [cookies] = useCookies();
  const [alertOpen, setAlertOpen] = useState(false);
  const [otherUser, setOtherUser] = useState("");
  const [code, setCode] = useState(javascriptDefault);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);
  const [titleSlug, setTitleSlug] = useState("");

  const socket = io(URL_COLLAB_SVC, {
    transports: ['websocket'],
    path: PREFIX_COLLAB_SVC,
    auth: {
      token: `Bearer ${cookies['access_token']}`
    }
  });

  socket.on('connect_error', (error) => {
    if (isUnauthorizedError(error)) {
      // TODO might need to handle the error here
      console.log('User token has expired')
    }
  })

  useEffect(() => {
    // Emit matching event here
    socket.emit('room', { room_id: location.state.room_id });

    return () => { // component will unmount equivalent
      socket.emit('leave room', { room_id: location.state.room_id, username: jwtDecode(cookies['refresh_token']).username });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  socket.on('receive leave', (data) => {
    console.log(`user ${data.username} has left the room`);
    setOtherUser(data.username)
    setAlertOpen(true);
  })

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const onSelectChange = (sl) => {
    socket.emit('language event', { room_id: location.state.room_id, language_id: sl.id })
    setLanguage(sl);
  };

  socket.on('receive language', (payload) => {
    console.log(payload)
    languageOptions.forEach(x => {
      if (x.id === payload.language_id) {
        console.log(`setting language to${x.name}`)
        setLanguage(x);
      }
    })
  })

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
      .then(function(response) {
        setProcessing(false);
        setOutputDetails(response.data);
        socket.emit('output event', { room_id: location.state.room_id, outputDetails: response.data })
        return;
      })
      .catch((err) => {
        console.log("err", err);
        setProcessing(false);
        showErrorToast();
      });
  };

  socket.on('receive output', (payload) => {
    showSuccessToast(`Compiled Successfully!`);
    setOutputDetails(payload.outputDetails)
  })

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
  }

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
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          <span>{`${otherUser} has left the room! `}</span>
          <span>{`Continue `}
            <Link href={`https://leetcode.com/problems/${titleSlug}`} target="_blank" rel="noopener noreferrer" underline="always">
              here
            </Link>
          </span>
        </Alert>
      </Snackbar>
      <div className="flex flex-row">
        <div className="px-4 py-2">
          <LanguagesDropdown
            language={language}
            onSelectChange={onSelectChange}
          />
        </div>
        <div className="px-4 py-2">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
      </div>
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-row w-full h-full justify-start items-end">
          <div className="grid grid-cols-2 gap-4 w-full">
            <QuestionWindow socket={socket} titleSlug={titleSlug} setTitleSlug={setTitleSlug} />
            <CodeEditorWindow
              code={code}
              onChange={onChange}
              language={language?.value}
              theme={theme.value}
              socket={socket}
            />
          </div>
        </div>

        <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
          <OutputWindow outputDetails={outputDetails} />
          <div className="flex flex-col items-end">
            <CustomInput
              customInput={customInput}
              setCustomInput={setCustomInput}
            />
            <button
              onClick={handleCompile}
              disabled={!code}
              className={classnames(
                "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                !code ? "opacity-50" : ""
              )}
            >
              {processing ? "Processing..." : "Compile and Execute"}
            </button>
          </div>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </div>
      </div>
    </>
  );
};

export default CodeEditorLanding;
