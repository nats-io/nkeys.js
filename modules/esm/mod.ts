import { denoHelper } from "./deps.ts";
import { setEd25519Helper } from "../../src/helper.ts";
setEd25519Helper(denoHelper);
export * from "../../src/mod.ts";
