import Image from "next/image";

function GeneralLogo({ name, width, height }) {
  return (
    <Image
      src={`/images/general-logos/${name}.png`}
      width={width}
      height={height}
      style={{ width: "auto", height: "auto" }}
      alt={name}
      quality={100}
    />
  );
}

export default GeneralLogo;
