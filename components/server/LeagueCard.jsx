import Link from "next/link";
import LeagueLogo from "./Logos/LeagueLogo";

function LeagueCard({ leagueName, seasonNumber, correspondingSeasonNumber }) {
  return (
    <Link href={`/league/${leagueName}//${seasonNumber}`}>
      <div className="flex flex-col mx-8 sm:mx-0 gap-6 border rounded-md p-8 shadow-2xl text-center">
        <LeagueLogo name={leagueName} width="100" height="100" />
        <div>{`${leagueName.toUpperCase()}${correspondingSeasonNumber} standings`}</div>
      </div>
    </Link>
  );
}

export default LeagueCard;
