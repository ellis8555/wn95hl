import Image from "next/image";

function LeagueLogo({ name, width, height }) {
  return (
    <Image
      src={`/images/league-logos/${name}.png`}
      width={width}
      height={height}
      style={{ width: "auto", height: "auto" }}
      alt={name}
      quality={100}
    />
  );
}

export default LeagueLogo;
