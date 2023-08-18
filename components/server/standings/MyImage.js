import Image from "next/image";

function MyImage({ name }) {
  return (
    <Image
      src={`/images/team-logos/${name}.png`}
      width={50}
      height={30}
      alt={name}
    />
  );
}

export default MyImage;
