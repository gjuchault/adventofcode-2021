const path = require("path");
const fs = require("fs-extra");
const esbuild = require("esbuild");

const dayNumber = Number(process.argv.at(-1));

if (Number.isNaN(dayNumber)) {
  throw new Error("Expecting day to be set. Example: `yarn day 1`");
}

const entryPoint = path.join(__dirname, `../src/day${dayNumber}/index.ts`);
const outfile = path.join(__dirname, `../build/day${dayNumber}.js`);

async function main() {
  console.log(`🚚 Building day ${dayNumber}...`);
  const now = Date.now();

  await esbuild.build({
    platform: "node",
    target: "esnext",
    format: "cjs",
    bundle: true,
    nodePaths: [path.join(__dirname, "../src")],
    sourcemap: true,
    entryPoints: [entryPoint],
    outfile,
  });

  console.log(`✅ Done in ${Date.now() - now}ms`);

  require(outfile);
}

main();
