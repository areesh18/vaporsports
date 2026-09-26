"use client";
import Image from "next/image";
import { useRef } from "react";
import Draggable from "react-draggable";
export default function Window({ title, children, className = "" }) {
  const nodeRef = useRef(null);
  return (
    <Draggable handle=".window-header" nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        className={`absolute bg-surface rounded-[10px] px-[5px] pb-[5px] ${className}`}
      >
        <div className="w-full h-full flex flex-col">
          <div className="window-header cursor-grab h-[38px] w-full  flex items-center justify-start">
            <div className="px-[12px] w-fit h-full  flex items-center gap-[8px]">
              <button type="button" className="cursor-pointer">
                <Image
                  src="/icons/close.svg"
                  alt=""
                  width={12}
                  height={12}
                  className="select-none"
                />
              </button>
              <button type="button" className="cursor-pointer">
                <Image
                  src="/icons/resize.svg"
                  alt=""
                  width={12}
                  height={12}
                  className="select-none"
                />
              </button>
              {/* Chevrons add later */}
              <Image
                src="/icons/chevron.svg"
                alt=""
                width={53}
                height={38}
                draggable={false}
                className=" select-none"
              />
              <p className="font-sf text-muted text-[13px] font-bold tracking-[0px] leading-[16px]">
                {title}
              </p>
            </div>
          </div>
          <div className="h-full w-full rounded-[6px] bg-white">{children}</div>
        </div>
      </div>
    </Draggable>
  );
}
