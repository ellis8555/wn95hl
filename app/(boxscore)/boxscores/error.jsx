"use client";

function Error({error}) {
  return (
    <main>
      <h1 className="mt-4 text-3xl text-center">{error.message}</h1>
    </main>
  );
}

export default Error;