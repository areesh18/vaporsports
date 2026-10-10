"use client";
import Image from "next/image";
import { useRef } from "react";
import Draggable from "react-draggable";
export default function Window({
  title,
  children,
  className = "",
  zIndex,
  onFocus,
  onPrevious,
  onNext,
}) {
  const nodeRef = useRef(null);
  return (
    <Draggable handle=".window-header" cancel=".no-drag" nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        style={{ zIndex }}
        onPointerDownCapture={onFocus}
        className={`absolute bg-surface rounded-[10px] px-[5px] pb-[5px] ${className}`}
      >
        <div className="w-full h-full flex flex-col">
          <div className="window-header cursor-grab h-[38px] w-full  flex items-center justify-start">
            <div className="px-[12px] w-fit h-full  flex items-center gap-[8px]">
              <button type="button" className="cursor-pointer">
                <Image
                  src="/icons/close.svg"
                  alt=""
                  preload
                  width={11}
                  height={11}
                  className="select-none"
                />
              </button>
              <button type="button" className="cursor-pointer">
                <Image
                  src="/icons/resize.svg"
                  alt=""
                  preload
                  width={11}
                  height={11}
                  className="select-none"
                />
              </button>
              {/* Chevrons add later */}
              <div className="flex items-center ">
                <button
                  type="button"
                  onClick={onPrevious}
                  
                  aria-label="Previous"
                  className="no-drag cursor-pointer"
                >
                  <Image
                    src="/icons/chevron_left.svg"
                    alt=""
                    preload
                    width={32}
                    height={38}
                    draggable={false}
                    className=" select-none"
                  />
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  
                  aria-label="Next"
                  className="no-drag -ml-[11px] cursor-pointer"
                >
                  <Image
                    src="/icons/chevron_right.svg"
                    alt=""
                    preload
                    width={32}
                    height={38}
                    draggable={false}
                    className=" select-none "
                  />
                </button>
              </div>
              <p className="font-sf text-muted text-[11px] font-bold tracking-[0px] leading-[16px]">
                {title}
              </p>
            </div>
          </div>
          <div className="h-full w-full rounded-[6px] bg-white overflow-hidden">{children}</div>
        </div>
      </div>
    </Draggable>
  );
}
