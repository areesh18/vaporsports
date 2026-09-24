/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      "*.{glsl,vs,fs,vert,frag}": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
  reactCompiler: true,
};

export default nextConfig;
