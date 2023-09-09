import React from "react";

function TableButton({ setTableToBeDisplayed, children }) {
  return (
    <button
      className="bg-slate-300 rounded-full p-2"
      onClick={() => {
        setTableToBeDisplayed(children);
      }}
    >
      {children}
    </button>
  );
}

export default TableButton;
