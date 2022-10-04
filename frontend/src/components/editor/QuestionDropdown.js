import React from "react";
import Select from "react-select";
import { customStyles } from "../../constants/customStyles";
import { FormHelperText } from "@mui/material";

const QuestionDropdown = ({ handleQuestionChange, questions, questionName }) => {
  return (
    <>
    <FormHelperText>Question Selection</FormHelperText>
    <Select
      placeholder={questionName}
      // options={languageOptions}
      options={questions}
      value={questionName}
      styles={customStyles}
      onChange={handleQuestionChange} /></>
  );
};

export default QuestionDropdown;
