import Link from "next/link";

function BoxscoreButton({ leagueName, seasonNumber, gameId }) {
  const path = `/boxscore/${leagueName}/${seasonNumber}/${gameId}`;
  return (
    <div className="bg-green-600 text-xs p-[.1rem] text-white rounded w-fit m-auto">
      <Link href={path}>Boxscore</Link>
    </div>
  );
}

export default BoxscoreButton;
