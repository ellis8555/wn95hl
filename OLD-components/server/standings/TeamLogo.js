import Image from "next/image";

function TeamLogo({ name, width, height }) {
  return (
    <Image
      src={`/images/team-logos/${name}.png`}
      width={width}
      height={height}
      style={{ width: "auto", height: "auto" }}
      alt={name}
      quality={100}
    />
  );
}

export default TeamLogo;
