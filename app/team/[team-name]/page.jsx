import TeamLogo from "@/components/server/standings/TeamLogo";

function page({ params }) {
  const teamName = params["team-name"];

  return (
    <>
      <div className="text-center text-slate-300 text-xl mt-2">{`${teamName}'s page details arriving soon...`}</div>
      <div className="flex justify-center mt-8">
        <TeamLogo name={teamName} width={100} height={100} />
      </div>
    </>
  );
}

export default page;
