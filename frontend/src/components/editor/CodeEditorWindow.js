import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import { PREFIX_COLLAB_SVC, URL_COLLAB_SVC } from "../../configs";

const CodeEditorWindow = ({ onChange, language, code, theme }) => {
  const location = useLocation(); // Location contains username and selected difficulty level
  const [value, setValue] = useState(code || "");

  const updateValue = (value) => {
    setValue(value);
    onChange("code", value);
  }

  const handleEditorChange = (value) => {
    socket.emit('coding event', {
      room_id: location.state.room_id,
      newCode: value
    })
    updateValue(value);
  };

  const socket = io(URL_COLLAB_SVC, { 
    transports: ['websocket'],
    path: PREFIX_COLLAB_SVC
  });

  useEffect(() => {
    console.log(`finding room_id=${location.state.room_id}`);
    // Emit matching event here
    socket.emit('room', { room_id: location.state.room_id });  

    return () => { // component will unmount equivalent
      socket.emit('leave room', { room_id: location.state.room_id });
    }
  }, [])

  socket.on('receive code', (payload) => {
    console.log(`received payload ${payload.newCode}`)
    updateValue(payload.newCode)
  })

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="85vh"
        width={`100%`}
        language={language || "javascript"}
        value={value}
        theme={theme}
        defaultValue="// some comment"
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default CodeEditorWindow;
