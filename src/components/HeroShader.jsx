"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Spinner } from "./Spinner";
import vertexShader from "@/shaders/vertex.glsl";
import fragmentShader from "@/shaders/fragment.glsl";

const MAX_DPR = 1;

export default function HeroShader() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    let disposed = false;
    let frame;

    const dpr = Math.min(window.devicePixelRatio, MAX_DPR);

    const renderer = new THREE.WebGLRenderer({
      antialias: false, // pointless on a fullscreen quad, and costs memory
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance", // avoid the integrated GPU on laptops
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);

    const canvas = renderer.domElement;
    canvas.style.opacity = "0";
    canvas.style.transition = "opacity .8s ease";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });
    const mesh = new THREE.Mesh(geometry, material);
    const scene = new THREE.Scene();
    scene.add(mesh);

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w * dpr, h * dpr); // device pixels
    };
    resize();
    window.addEventListener("resize", resize);

    // Compile without blocking the main thread.
    /* console.time("shader compile"); */
    renderer.compileAsync(scene, camera).then(() => {
      /* console.timeEnd("shader compile"); */
      if (disposed) return; // React StrictMode unmounted us mid-compile

      const timer = new THREE.Timer();
      const animate = (timestamp) => {
        timer.update(timestamp);
        uniforms.uTime.value = timer.getElapsed();

        renderer.render(scene, camera); // single pass, straight to screen

        frame = requestAnimationFrame(animate);
      };
      animate(performance.now());
      canvas.style.opacity = "1"; // fade in after the first real frame
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);

      material.dispose();
      geometry.dispose();
      renderer.dispose();
      renderer.forceContextLoss(); // frees the GPU context on dev remounts

      if (canvas.parentNode === container) container.removeChild(canvas);
    };
  }, []);

  return (
    <div className="fixed inset-0 p-[10px] bg-white">
      <div
        ref={containerRef}
        className="relative h-full w-full rounded-[16px] overflow-hidden"
      />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 inline-flex items-center justify-center bg-white  text-black rounded-[6px] gap-[4px] px-[8px] py-[2px]">
        <Spinner className="size-3 opacity-36" />
        <div className=" flex  h-[16px]  items-center justify-center">
          <p className="font-sf  text-[12px]  leading-[16px] tracking-[-2%] opacity-36">
            Website Coming Soon
          </p>
        </div>
      </div>
    </div>
  );
}
