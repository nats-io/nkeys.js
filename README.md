# nkeys.js

A public-key signature system based on Ed25519 for the
[NATS ecosystem system](https://nats.io) for JavaScript.

[![license](https://img.shields.io/github/license/nats-io/ts-nats.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![nkeys.js](https://github.com/nats-io/nkeys.js/workflows/nkeys.js/badge.svg)](https://github.com/nats-io/nkeys.js/actions)
[![npm](https://img.shields.io/npm/v/nkeys.js.svg)](https://www.npmjs.com/package/nkeys.js)
[![npm](https://img.shields.io/npm/dm/nkeys.js.svg)](https://www.npmjs.com/package/nkeys.js)
[![npm @nats-io/nkeys](https://img.shields.io/npm/v/%40nats-io%2Fnkeys)](https://www.npmjs.com/package/@nats-io/nkeys)
[![npm](https://img.shields.io/npm/dm/%40nats-io%2Fnkeys)](https://www.npmjs.com/package/@nats-io/nkeys)

With the 2.0.0 release, the libraries changed npm `nkeys.js` to
`@nats-io/nkeys`.

The nkeys.js library works in Deno, Node.js, Bun, and the browser!

## Installation

The nkeys library is available on both
[npm](https://www.npmjs.com/package/nkeys.js) and
[jsr.io](https://jsr.io/@nats-io/nkeys)

```bash
deno add @nats-io/nkeys
```

```javascript
import { createUser, fromPublic, fromSeed } from "@nats-io/nkeys";
```

In Node:

```bash
npm install nkeys.js
```

```javascript
const { createUser, fromSeed, fromPublic } = require("nkeys.js");
// or
import { createUser, fromPublic, fromSeed } from "nkeys.js";
```

On your browser projects copy `node_modules/nkeys.js/nkeys.mjs` to your document
root, and then

```javascript
import { createUser, fromPublic, fromSeed } from "https://host/path/nkeys.mjs";
```

## Basic Usage

The [documentation is here](https://nats-io.github.io/nkeys.js/)

```typescript
// create an user nkey KeyPair (can also create accounts, operators, etc).
const user = createUser();

// A seed is the public and private keys together.
const seed: Uint8Array = user.getSeed();

// Seeds are encoded into Uint8Array, and start with
// the letter 'S'. Seeds need to be kept safe and never shared
console.log(`seeds start with s: ${seed[0] === "S".charCodeAt(0)}`);

// A seed's second letter encodes it's type:
// `U` for user,
// `A` for account,
// `O` for operators
console.log(`nkey is for a user? ${seed[1] === "U".charCodeAt(0)}`);

// To view a seed, simply decode it:
console.log(new TextDecoder().decode(seed));

// you can recreate the keypair with its seed:
const priv = fromSeed(seed);

// Using the KeyPair, you can cryptographically sign content:
const data = new TextEncoder().encode("Hello World!");
const sig = priv.sign(data);

// and verify a signature:
const valid = user.verify(data, sig);
if (!valid) {
  console.error("couldn't validate the data/signature against my key");
} else {
  console.error("data was verified by my key");
}

// others can validate using your public key:
const publicKey = user.getPublicKey();
const pub = fromPublic(publicKey);
if (!pub.verify(data, sig)) {
  console.error(`couldn't validate the data/signature with ${publicKey}`);
} else {
  console.info(`data was verified by ${publicKey}`);
}

// when extracting with seeds or private keys
// you should clear them when done:
seed.fill(0);

// you should also clear the keypairs:
user.clear();
priv.clear();
```

## Supported Node Versions

Our support policy for Nodejs versions follows
[Nodejs release support](https://github.com/nodejs/Release). We will support and
build nkeys.js on even-numbered Nodejs versions that are current or in LTS.

Note that this library no longer shims `atob`, `btoa`, `TextEncoder`, nor
`TextDecoder`. These should be available in fairly old node builds going as far
back as Node 16. If you need to run on an older environment, use one of the
older versions on npm.

## License

Unless otherwise noted, the NATS source files are distributed under the Apache
Version 2.0 license found in the LICENSE file.
