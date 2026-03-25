import React from "react";

interface ButtonProps {
  text: string;
  bgcolor: string;
  txtcolor: string;
}

function Button({ text, bgcolor, txtcolor }: ButtonProps) {
  return (
    <button
      className={`${bgcolor} ${txtcolor} font-extrabold text-xs uppercase py-2 px-4 rounded-lg`}
    >
      {text}
    </button>
  );
}

export default Button;
