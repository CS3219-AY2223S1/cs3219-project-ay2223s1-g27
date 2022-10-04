import React from "react";
import Select from "react-select";
import { customStyles } from "../../constants/customStyles";
import { languageOptions } from "../../constants/languageOptions"; 
import { Box, FormHelperText } from "@mui/material";

const LanguagesDropdown = ({ onSelectChange, language }) => {
  return ( 
    <Box display={"flex"} flexDirection={"column"}>
    <FormHelperText>Coding Language</FormHelperText>
    <Select
      value={language.name}
      placeholder={language.name}
      options={languageOptions}
      styles={customStyles}
      defaultValue={language.name}
      onChange={(selectedOption) => onSelectChange(selectedOption)} /></Box>
  );
};

export default LanguagesDropdown;
