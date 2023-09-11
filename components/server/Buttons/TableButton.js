import React from "react";

function TableButton({
  setTableToBeDisplayed,
  setSecondTableToBeDisplayed,
  setSplitTable,
  children,
}) {
  return (
    <button
      className="bg-slate-300 rounded p-1"
      onClick={() => {
        if (children === "Conferences") {
          setSplitTable(true);
          setTableToBeDisplayed("Clarence Campbell");
          setSecondTableToBeDisplayed("Prince of Wales");
          return;
        }
        if (children === "League") {
          setSplitTable(false);
          setTableToBeDisplayed("League");
          return;
        }
        setTableToBeDisplayed(children);
      }}
    >
      {children}
    </button>
  );
}

export default TableButton;
