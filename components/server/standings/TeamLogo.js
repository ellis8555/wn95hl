import Image from "next/image";

function TeamLogo({ name }) {
  return (
    <Image
      src={`/images/team-logos/${name}.png`}
      width={25}
      height={15}
      style={{ width: "auto", height: "auto" }}
      alt={name}
    />
  );
}

export default TeamLogo;
