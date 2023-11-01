"use client";

function Error({ error }) {
  return (
    <>
      <div className="text-center text-slate-300 mt-4">
        Boxscores can't be loaded
      </div>
      <div className="text-center text-slate-300 mt-4">{error.message}</div>
    </>
  );
}

export default Error;
