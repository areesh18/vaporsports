"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Spinner } from "./Spinner";
import passthroughVertex from "@/shaders/vertex.glsl";
import fieldFragment from "@/shaders/fieldPass.frag.glsl";
import compositeFragment from "@/shaders/composite.frag.glsl";

const MAX_DPR = 1;
// The noise field is rendered at this fraction of the container size, then
// upsampled (bilinear) in the composite pass. The field is inherently soft
// (it's blurred noise), so this is visually lossless while cutting the
// expensive fbm work by roughly FIELD_SCALE^2.
const FIELD_SCALE = 0.5;

export default function HeroShader() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    let disposed = false;
    let running = false;
    let frame;

    const dpr = Math.min(window.devicePixelRatio, MAX_DPR);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.autoClear = false;

    const canvas = renderer.domElement;
    canvas.style.opacity = "0";
    canvas.style.transition = "opacity .8s ease";
    canvas.style.display = "block";
    container.appendChild(canvas);

    // -- Shared fullscreen quad geometry/camera for both passes --
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);

    // -- Pass 1: expensive noise field, rendered small --
    const fieldUniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      // Real full-resolution canvas height, kept separate from the field
      // target's own (smaller) resolution — needed so BLOOM_PX scales
      // correctly regardless of FIELD_SCALE.
      uFullResY: { value: 1 },
    };
    const fieldMaterial = new THREE.ShaderMaterial({
      vertexShader: passthroughVertex,
      fragmentShader: fieldFragment,
      uniforms: fieldUniforms,
    });
    const fieldMesh = new THREE.Mesh(geometry, fieldMaterial);
    const fieldScene = new THREE.Scene();
    fieldScene.add(fieldMesh);

    const fieldTarget = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      depthBuffer: false,
      stencilBuffer: false,
    });

    // -- Pass 2: cheap fullscreen composite (mask + CA + LUT + grain) --
    const compositeUniforms = {
      uField: { value: fieldTarget.texture },
      uResolution: { value: new THREE.Vector2() },
      uTime: { value: 0 },
    };
    const compositeMaterial = new THREE.ShaderMaterial({
      vertexShader: passthroughVertex,
      fragmentShader: compositeFragment,
      uniforms: compositeUniforms,
    });
    const compositeMesh = new THREE.Mesh(geometry, compositeMaterial);
    const compositeScene = new THREE.Scene();
    compositeScene.add(compositeMesh);

    const resize = () => {
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);

      renderer.setSize(w, h);
      compositeUniforms.uResolution.value.set(w * dpr, h * dpr);

      const fw = Math.max(1, Math.round(w * dpr * FIELD_SCALE));
      const fh = Math.max(1, Math.round(h * dpr * FIELD_SCALE));
      fieldTarget.setSize(fw, fh);
      fieldUniforms.uResolution.value.set(fw, fh);
      fieldUniforms.uFullResY.value = h * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    // -- Context loss: stop cleanly instead of spamming a dead canvas --
    const handleContextLost = (e) => {
      e.preventDefault();
      running = false;
      cancelAnimationFrame(frame);
    };
    const handleContextRestored = () => {
      if (!disposed) start();
    };
    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener(
      "webglcontextrestored",
      handleContextRestored,
      false,
    );

    // -- Pause when tab/section isn't visible --
    const handleVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!disposed) {
        start();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const timer = new THREE.Timer();

    const animate = (timestamp) => {
      if (!running) return;
      timer.update(timestamp);
      const t = timer.getElapsed();
      fieldUniforms.uTime.value = t;
      compositeUniforms.uTime.value = t;

      renderer.setRenderTarget(fieldTarget);
      renderer.render(fieldScene, camera);

      renderer.setRenderTarget(null);
      renderer.render(compositeScene, camera);

      frame = requestAnimationFrame(animate);
    };

    const start = () => {
      if (running) return;
      running = true;
      animate(performance.now());
    };

    renderer.compileAsync(fieldScene, camera).then(() => {
      if (disposed) return; // React StrictMode unmounted us mid-compile
      start();
      canvas.style.opacity = "1";
    });

    return () => {
      disposed = true;
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);

      fieldMaterial.dispose();
      compositeMaterial.dispose();
      geometry.dispose();
      fieldTarget.dispose();
      renderer.dispose();
      renderer.forceContextLoss();

      if (canvas.parentNode === container) container.removeChild(canvas);
    };
  }, []);

  return (
    <div className="fixed inset-0 p-[10px] bg-white">
      <div
        ref={containerRef}
        className="relative h-full w-full rounded-[16px] overflow-hidden"
      />
    </div>
  );
}
