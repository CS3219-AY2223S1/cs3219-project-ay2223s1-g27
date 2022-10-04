export const customStyles = {
    control: (styles) => ({
      ...styles,
      width: "100%",
      maxWidth: "16rem",
      minWidth: "16rem",
      borderRadius: "5px",
      color: "#000",
      fontSize: "1rem",
      lineHeight: "1.75rem",
      backgroundColor: "#FFFFFF",
      cursor: "pointer",
      border: "1px solid #bcbcbc", 
    }),
    option: (styles) => {
      return {
        ...styles,
        color: "#000",
        fontSize: "1rem",
        lineHeight: "1.75rem",
        width: "100%",
        background: "#fff",
        ":hover": {
          backgroundColor: "rgb(243 244 246)",
          color: "#000",
          cursor: "pointer",
        },
      };
    },
    menu: (styles) => {
      return {
        ...styles,
        backgroundColor: "#fff",
        maxWidth: "15rem",
        border: "1px solid #bcbcbc",
        borderRadius: "5px", 
      };
    },
  
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "#000",
        fontSize: "1rem",
        lineHeight: "1.75rem",
      };
    },
  };
  