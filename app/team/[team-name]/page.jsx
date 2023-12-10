function page({ params }) {
  const teamName = params["team-name"];

  return (
    <div className="text-center text-slate-300 text-xl mt-2">{`${teamName}'s page details arriving soon...`}</div>
  );
}

export default page;
