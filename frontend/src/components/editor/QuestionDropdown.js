import React from "react";
import Select from "react-select";
import { customStyles } from "../../constants/customStyles";

const QuestionDropdown = ({ handleQuestionChange, questions, questionName }) => {
  return (
    <Select
      placeholder={questionName}
      // options={languageOptions}
      options={questions}
      value={questionName}
      styles={customStyles}
      onChange={handleQuestionChange}
    />
  );
};

export default QuestionDropdown;
