import Link from "next/link";
import Image from "next/image";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";

function TeamLogo({
  name,
  width,
  height,
  leagueName = DEFAULT_LEAGUE,
  seasonNumber = MOST_RECENT_SEASON,
  gameType = "season",
}) {
  return (
    <Link href={`/teams/${leagueName}/${seasonNumber}/${name}/${gameType}`}>
      <Image
        src={`/images/team-logos/${name}.png`}
        width={width}
        height={height}
        style={{ width: "auto", height: "auto" }}
        alt={name}
        quality={100}
      />
    </Link>
  );
}

export default TeamLogo;
