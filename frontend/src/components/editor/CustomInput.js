import React from "react";
import { classnames } from "../../util/general";

const CustomInput = ({ customInput, setCustomInput }) => {
  return (
    <>
      {" "}
      <textarea
        style={{borderColor: '#bcbcbc'}}
        rows="5"
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder={`Insert your input here...`}
        className={classnames(
          "focus:outline-none w-full border-2 border-gray z-10 rounded-md px-4 py-2 transition duration-200 bg-white mt-2"
        )}
      ></textarea>
    </>
  );
};

export default CustomInput;
