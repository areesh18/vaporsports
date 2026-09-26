import Image from "next/image";
export default function Catalogue() {
  return (
    <div className="relative w-full h-full flex items-center justify-center ">
      <Image src='/tshirt.png' fill alt="Catalogue Tshirt" />
    </div>
  );
}
