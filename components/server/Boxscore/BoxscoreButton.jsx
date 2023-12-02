import Link from "next/link";

function BoxscoreButton({ leagueName, seasonNumber, gameId }) {
  const path = `/boxscore/${leagueName}/${seasonNumber}/${gameId}`;
  return <Link href={path}>Boxscore</Link>;
}

export default BoxscoreButton;
