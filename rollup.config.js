import { terser } from "rollup-plugin-terser";
import pluginTypescript from "@rollup/plugin-typescript";
import pluginCommonjs from "@rollup/plugin-commonjs";
import pluginNodeResolve from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import camelCase from 'camelcase';
import dts from "rollup-plugin-dts";
import * as path from "path";
import pkg from "./package.json";
import jison from 'rollup-plugin-jison';

const packageName = pkg.name.replace(/^@.*\//, "");
const moduleName = camelCase(packageName, { pascalCase: true });
const inputFileName = "src/index.ts";
const author = pkg.author;
const banner = `
  /**
   * @license
   * author: ${author}
   * ${packageName}.js v${pkg.version}
   * Released under the ${pkg.license} license.
   */
`;

const base = `dist/${packageName}.js`;

export default [
  {
    input: inputFileName,
    output: [
      {
        name: moduleName,
        file: base,
        format: "iife",
        banner,
        globals: {
        },
      },
      {
        name: moduleName,
        file: base.replace(".js", ".min.js"),
        format: "iife",
        banner,
        plugins: [terser()],
        globals: {
        },
      },
    ],
    external: [
    ],
    plugins: [
      jison(),
      pluginTypescript(),
      pluginCommonjs({
        extensions: [".js", ".ts"],
      }),
      babel({
        babelHelpers: "bundled",
        configFile: path.resolve(__dirname, ".babelrc.js"),
      }),
      pluginNodeResolve({
        browser: true,
      }),
    ],
  },

  // ES
  {
    input: inputFileName,
    output: [
      {
        file: pkg.module,
        format: "es",
        banner,
        exports: "named",
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ],
    plugins: [
      jison(),
      pluginTypescript(),
      pluginCommonjs({
        extensions: [".js", ".ts"],
      }),
      babel({
        babelHelpers: "bundled",
        configFile: path.resolve(__dirname, ".babelrc.js"),
      }),
      pluginNodeResolve({
        browser: false,
      }),
    ],
  },

  // CommonJS
  {
    input: inputFileName,
    output: [
      {
        file: pkg.main,
        format: "cjs",
        banner,
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ],
    plugins: [
      jison(),
      pluginTypescript(),
      pluginCommonjs({
        extensions: [".js", ".ts"],
      }),
      babel({
        babelHelpers: "bundled",
        configFile: path.resolve(__dirname, ".babelrc.js"),
      }),
      pluginNodeResolve({
        browser: false,
      }),
    ],
  },

  {
    input: inputFileName,
    output: [
      {
        file: base.replace(".js", ".d.ts"),
        format: "cjs",
      },
    ],
    plugins: [dts()],
  }
];