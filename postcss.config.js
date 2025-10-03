import cssnano from "cssnano";
import postcssPresetEnv from "postcss-preset-env";

const config = {
  plugins: [
    cssnano({
      preset: "default",
    }),
    postcssPresetEnv({
      stage: 1,
    })
  ],
};

export default config;