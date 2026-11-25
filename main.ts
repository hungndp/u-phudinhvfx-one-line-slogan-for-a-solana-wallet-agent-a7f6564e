// One-Line Slogan for a Solana Wallet Agent — make.fun entry.
//
// Writes one slogan (at most 20 words, at most 140 characters, a single
// line) to /output/entry.txt. Deterministic: the same slogan every run.
//
// Slogan shape (walrus post-mortem lesson): concrete number up front
// ("10 SOL") + concrete mechanism ("trades while you sleep") + concrete
// payoff last ("every coin it earns comes home"), twist word last.
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SLOGAN =
  "Give your wallet agent 10 SOL: it trades while you sleep, and every coin it earns comes home.";

const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

// The gate: /output/entry.txt must be UTF-8 text of 1 to 140 characters,
// a single line, at most 20 words. Refuse to write anything that breaks it.
function validateSlogan(text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (text.length < 1 || text.length > 140) {
    throw new Error(`slogan is ${text.length} chars, gate allows 1-140`);
  }
  if (words.length > 20) {
    throw new Error(`slogan is ${words.length} words, brief allows at most 20`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("slogan must be a single line");
  }
  if (text.trim() !== text) {
    throw new Error("slogan must not have leading or trailing whitespace");
  }
}

// Grader-environment rule: the grader runs as uid 65534 on a read-only
// filesystem with /output writable but its parent NOT writable, so NEVER
// delete the output directory itself — mkdir it and clear only its
// contents, then write into it.
function clearDirContents(dir) {
  for (const name of readdirSync(dir)) {
    rmSync(join(dir, name), { recursive: true, force: true });
  }
}

function main() {
  validateSlogan(SLOGAN);
  mkdirSync(OUT_DIR, { recursive: true });
  clearDirContents(OUT_DIR);
  writeFileSync(OUT_FILE, SLOGAN, "utf8");
}

main();
