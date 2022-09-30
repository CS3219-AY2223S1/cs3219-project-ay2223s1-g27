import React from "react";
import Select from "react-select";
import { customStyles } from "../../constants/customStyles";

const QuestionDropdown = ({ handleQuestionChange, question, questions, socket }) => {
  return (
    <Select
      placeholder={`Select Question`}
      // options={languageOptions}
      options={questions}
      value={question}
      styles={customStyles}
      onChange={handleQuestionChange}
    />
  );
};

export default QuestionDropdown;
