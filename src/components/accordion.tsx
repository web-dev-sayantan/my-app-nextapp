"use client";

import React, { useState } from "react";

interface AccordionProps {
  question: string;
  answer: string;
}

function Accordion({ question, answer }: AccordionProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="my-2 flex-col bg-amber-500 rounded-lg">
      <button
        onClick={() => {
          setOpen(!open);
        }}
        className="flex justify-between items-center w-full 
        px-2 py-1 font-medium"
      >
        <span className="text-black text-left">{question}</span>
        <span className="text-2xl leading-4">{open ? "-" : "+"}</span>
      </button>

      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out 
        bg-amber-800 text-neutral-300 rounded-b-lg
        ${open ? "grid-rows-[1fr] opacity-100 px-2 pr-4 font-extralight py-6" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden text-left">{answer}</div>
      </div>
    </div>
  );
}

export default Accordion;
