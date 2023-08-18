import Image from "next/image";

function TeamLogo({ name }) {
  return (
    <Image
      src={`/images/team-logos/${name}.png`}
      width={50}
      height={30}
      style={{ width: "auto", height: "auto" }}
      alt={name}
    />
  );
}

export default TeamLogo;
