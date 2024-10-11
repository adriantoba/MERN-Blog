import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function SwitchDark(props) {
  return (
    <div className="p-4">
      <label className="cursor-pointer">
        <input type="checkbox" className="hidden" {...props} />
        <div
          className={`w-14 p-1 rounded-full ${
            props.checked ? "bg-[#130f40]" : "bg-[#f0932b]"
          }`}
        >
          <div
            className={`w-fit p-0.5 shadow-sm rounded-full transition-all duration-500 ease-in-out text-white ${
              props.checked
                ? "bg-[#2e86de] translate-x-6 rotate-0"
                : "bg-white -rotate-180"
            }`}
          >
            {props.checked ? (
              <FaMoon size={20} fill="#f6e58d" />
            ) : (
              <FaSun size={20} fill="#f0932b" />
            )}
          </div>
        </div>
      </label>
    </div>
  );
}
