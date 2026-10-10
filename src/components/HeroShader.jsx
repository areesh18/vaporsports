"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import passthroughVertex from "@/shaders/vertex.glsl";
import fieldFragment from "@/shaders/fieldPass.frag.glsl";
import compositeFragment from "@/shaders/composite.frag.glsl";

const MAX_DPR = 1;
const FIELD_SCALE = 0.5;

const MOBILE_BREAKPOINT = 768;
const MOBILE_FPS = 30;

export default function HeroShader() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    let disposed = false;
    let running = false;
    let frame;
    let lastFrameTime = 0;

    const isMobile = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT}px)`,
    ).matches;

    const frameInterval = isMobile ? 1000 / MOBILE_FPS : 0;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

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

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geometry = new THREE.PlaneGeometry(2, 2);

    // Pass 1: procedural field at reduced resolution.
    const fieldUniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
    };

    const fieldMaterial = new THREE.ShaderMaterial({
      vertexShader: passthroughVertex,
      fragmentShader: fieldFragment,
      uniforms: fieldUniforms,
    });

    const fieldScene = new THREE.Scene();

    fieldScene.add(new THREE.Mesh(geometry, fieldMaterial));

    const fieldTarget = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      depthBuffer: false,
      stencilBuffer: false,
    });

    // Pass 2: blur reconstruction, mask, color and grain.
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

    const compositeScene = new THREE.Scene();

    compositeScene.add(new THREE.Mesh(geometry, compositeMaterial));

    const resize = () => {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);

      renderer.setSize(width, height);

      compositeUniforms.uResolution.value.set(width * dpr, height * dpr);

      const fieldWidth = Math.max(1, Math.round(width * dpr * FIELD_SCALE));

      const fieldHeight = Math.max(1, Math.round(height * dpr * FIELD_SCALE));

      fieldTarget.setSize(fieldWidth, fieldHeight);

      fieldUniforms.uResolution.value.set(fieldWidth, fieldHeight);
    };

    resize();

    window.addEventListener("resize", resize);

    const timer = new THREE.Timer();

    const animate = (timestamp) => {
      if (!running || disposed) return;

      // Limit actual GPU rendering on narrow screens.
      if (
        frameInterval > 0 &&
        lastFrameTime !== 0 &&
        timestamp - lastFrameTime < frameInterval
      ) {
        frame = requestAnimationFrame(animate);
        return;
      }

      lastFrameTime = timestamp;

      timer.update(timestamp);

      const time = timer.getElapsed();

      fieldUniforms.uTime.value = time;
      compositeUniforms.uTime.value = time;

      // Pass 1: render the expensive field.
      renderer.setRenderTarget(fieldTarget);
      renderer.render(fieldScene, camera);

      // Pass 2: composite to the screen.
      renderer.setRenderTarget(null);
      renderer.render(compositeScene, camera);

      frame = requestAnimationFrame(animate);
    };

    const start = () => {
      if (disposed || running || document.hidden) return;

      running = true;
      lastFrameTime = 0;

      frame = requestAnimationFrame(animate);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    const handleContextLost = (event) => {
      event.preventDefault();
      stop();
    };

    const handleContextRestored = () => {
      if (!disposed && !document.hidden) {
        start();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    canvas.addEventListener("webglcontextlost", handleContextLost, false);

    canvas.addEventListener(
      "webglcontextrestored",
      handleContextRestored,
      false,
    );

    // Compile both passes before revealing the canvas.
    Promise.all([
      renderer.compileAsync(fieldScene, camera),
      renderer.compileAsync(compositeScene, camera),
    ])
      .then(() => {
        if (disposed) return;

        canvas.style.opacity = "1";
        start();
      })
      .catch((error) => {
        if (!disposed) {
          console.error("Hero shader compilation failed:", error);
        }
      });

    return () => {
      disposed = true;
      stop();

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

      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
