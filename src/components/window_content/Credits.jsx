import Image from "next/image";
export default function Credits() {
  return (
    <div className="relative w-full h-full flex items-center justify-center ">
      <Image src='/Credits.png' fill alt="Catalogue Tshirt" />
    </div>
  );
}
