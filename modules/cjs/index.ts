/**
 * @ignore
 */
//@ts-ignore: building in node
const nacl = require("tweetnacl");
/**
 * @ignore
 */
//@ts-ignore: injection of configuration
const helper = {
  randomBytes: nacl.randomBytes,
  verify: nacl.sign.detached.verify,
  fromSeed: nacl.sign.keyPair.fromSeed,
  sign: nacl.sign.detached,
  scalarBaseMultiply: nacl.scalarMult.base,
  seal: nacl.box,
  open: nacl.box.open,
};

/**
 * @ignore
 */
//@ts-ignore: building in node
const { setEd25519Helper } = require("./helper.ts");
setEd25519Helper(helper);

/**
 * @ignore
 */
//@ts-ignore: building in node
export * from "./mod.ts";
