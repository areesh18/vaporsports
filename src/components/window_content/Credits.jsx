import Image from "next/image";
export default function Credits() {
  return (
    <div className="relative w-full h-full flex items-center justify-center ">
      <Image src='/Credits.png' preload fill alt="Credits" />
    </div>
  );
}
