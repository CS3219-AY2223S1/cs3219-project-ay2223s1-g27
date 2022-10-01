import React from "react";
import Select from "react-select";
import { customStyles } from "../../constants/customStyles";
import { languageOptions } from "../../constants/languageOptions";

const LanguagesDropdown = ({ onSelectChange, language }) => {
  return (
    <Select
      value={language.name}
      placeholder={language.name}
      options={languageOptions}
      styles={customStyles}
      defaultValue={language.name}
      onChange={(selectedOption) => onSelectChange(selectedOption)}
    />
  );
};

export default LanguagesDropdown;
