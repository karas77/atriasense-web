"use client";

import { useEffect, useRef } from "react";

const TRAIL = 14;

const VERT = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
#define TRAIL_COUNT ${TRAIL}
varying vec2 v_uv;
uniform float u_aspect;
uniform float u_time;
uniform float u_energy;
uniform vec3 u_startColor;
uniform vec3 u_midColor;
uniform vec3 u_endColor;
uniform vec3 u_trail[TRAIL_COUNT]; // x, y, yaş (0 yeni, 1 eski)

vec3 ramp(float t) {
  return t < 0.5 ? mix(u_startColor, u_midColor, t * 2.0) : mix(u_midColor, u_endColor, (t - 0.5) * 2.0);
}

void main() {
  vec2 uv = v_uv;
  // Akışkan görünüm için hafif dalgalanma.
  uv += 0.012 * vec2(sin(uv.y * 9.0 + u_time * 1.3), cos(uv.x * 8.0 - u_time * 1.1));
  vec2 p = vec2(uv.x * u_aspect, uv.y);

  vec3 col = vec3(0.0);
  float alpha = 0.0;
  for (int i = 0; i < TRAIL_COUNT; i++) {
    vec3 t = u_trail[i];
    float life = 1.0 - t.z;
    if (life <= 0.0) continue;
    vec2 q = vec2(t.x * u_aspect, t.y);
    float r = mix(0.05, 0.19, float(i) / float(TRAIL_COUNT - 1)) * (0.6 + 0.4 * life);
    float d = distance(p, q);
    float w = exp(-(d * d) / (r * r)) * pow(life, 1.4);
    col += ramp(float(i) / float(TRAIL_COUNT - 1)) * w;
    alpha += w;
  }
  col = alpha > 0.0 ? col / alpha : col;
  float a = clamp(alpha, 0.0, 1.0) * 0.82 * u_energy;
  gl_FragColor = vec4(col * a, a);
}`;

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

/** Kartın üzerinde, imleci izleyen renkli akışkan iz (WebGL). */
export function FluidTrail({ palette }: { palette: [string, string, string] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const allowed = window.matchMedia(
      "(min-width: 1025px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!allowed.matches) return;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return;
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const uAspect = u("u_aspect");
    const uTime = u("u_time");
    const uEnergy = u("u_energy");
    const uTrail = u("u_trail");
    gl.uniform3fv(u("u_startColor"), hexToRgb(palette[0]));
    gl.uniform3fv(u("u_midColor"), hexToRgb(palette[1]));
    gl.uniform3fv(u("u_endColor"), hexToRgb(palette[2]));
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const trail = Array.from({ length: TRAIL }, () => ({ x: 0.5, y: 0.5, age: 1 }));
    const pointer = { x: 0.5, y: 0.5 };
    const smooth = { x: 0.5, y: 0.5 };
    let energy = 0;
    let inside = false;
    let raf = 0;
    let last = performance.now();
    const start = last;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const r = host.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uAspect, r.width / Math.max(1, r.height));
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      energy += ((inside ? 1 : 0) - energy) * Math.min(1, dt * (inside ? 6 : 2.4));
      smooth.x += (pointer.x - smooth.x) * Math.min(1, dt * 14);
      smooth.y += (pointer.y - smooth.y) * Math.min(1, dt * 14);
      // İz: en yeni nokta başta; her kare eski noktalar bir adım geride takip eder.
      for (let i = TRAIL - 1; i > 0; i--) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * 0.42;
        trail[i].y += (trail[i - 1].y - trail[i].y) * 0.42;
        trail[i].age = Math.min(1, trail[i].age + dt * 0.9);
      }
      trail[0].x = smooth.x;
      trail[0].y = smooth.y;
      trail[0].age = inside ? 0 : Math.min(1, trail[0].age + dt);

      const data = new Float32Array(TRAIL * 3);
      trail.forEach((p, i) => data.set([p.x, p.y, Math.min(1, p.age + i * 0.03)], i * 3));
      gl.uniform3fv(uTrail, data);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform1f(uEnergy, energy);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (inside || energy > 0.01) raf = requestAnimationFrame(frame);
      else raf = 0;
    };

    const wake = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = host.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) / r.width;
      pointer.y = 1 - (e.clientY - r.top) / r.height;
      wake();
    };
    const enter = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      inside = true;
      const r = host.getBoundingClientRect();
      pointer.x = smooth.x = (e.clientX - r.left) / r.width;
      pointer.y = smooth.y = 1 - (e.clientY - r.top) / r.height;
      trail.forEach((p) => Object.assign(p, { x: pointer.x, y: pointer.y, age: 1 }));
      wake();
    };
    const leave = () => {
      inside = false;
      wake();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointerleave", leave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointerleave", leave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [palette]);

  return <canvas ref={canvasRef} className="fluid-trail" aria-hidden="true" />;
}
