import React, {  useState } from "react";
import { useLocation } from "react-router-dom";
import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({ onChange, language, code, theme, socket }) => {
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

  socket.on('receive code', (payload) => {
    updateValue(payload.newCode)
  })

  return (
    <div style={{paddingTop: '10px'}}className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="85vh"
        width={`100%`} 
        language={language || "javascript"}
        value={value}
        theme={theme}
        defaultValue="// Start editing here"
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default CodeEditorWindow;
