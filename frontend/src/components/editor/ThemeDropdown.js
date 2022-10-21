import React from "react";
import Select from "react-select";
import { codeMirrorThemes } from "../../lib/defineTheme";
import { customStyles } from "../../constants/customStyles";
import { Box, FormHelperText } from "@mui/material";

const ThemeDropdown = ({ handleThemeChange, theme }) => {
  return (
    <Box display={"flex"} flexDirection={"column"}>
      <FormHelperText>Editor Theme</FormHelperText>
      <Select
        placeholder={`Select Theme`}
        // options={languageOptions}
        options={Object.entries(codeMirrorThemes).map(([themeId, themeName]) => ({
          label: themeName,
          value: themeId,
          key: themeId,
        }))}
        value={theme}
        styles={customStyles}
        onChange={handleThemeChange} /></Box>
  );
};

export default ThemeDropdown;
