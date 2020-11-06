/*
 * Copyright 2018 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.75.0/testing/asserts.ts";

import { decode, encode, fromPublic, fromSeed } from "../modules/esm/mod.ts";

import { Codec } from "../src/codec.ts";
import { Prefix } from "../src/nkeys.ts";

// this was generated using nkey api in go
let data = {
  "seed": "SAAFYOZ5U4UBAJMHPITLSKDWAFBJNWH53K7LPZDQKOC5TXAGBIP4DY4WCA",
  "public_key": "AAASUT7FDZDS6UCTBE7JQS2G6KUZBJC5YW7VFVK45JLUK3UDVA6NXJWD",
  "private_key":
    "PBODWPNHFAICLB32E24SQ5QBIKLNR7O2X236I4CTQXM5YBQKD7A6GAJKJ7SR4RZPKBJQSPUYJNDPFKMQURO4LP2S2VOOUV2FN2B2QPG3AHUA",
  "nonce": "uPMbFqF4nSX75B0Nlk9uug==",
  "sig":
    "y9t/0VxLZET6fYlSL7whq52TSv8tP7FBXZdqbQhfdpKCa3pveV7889zqkpiQcv8ivwtACQwumPe6EgrxFc7yDw==",
};

Deno.test("integration - verify", () => {
  const te = new TextEncoder();
  const pk = fromPublic(data.public_key);
  let nonce = te.encode(data.nonce);
  let sig = decode(data.sig);
  assert(pk.verify(nonce, sig));

  const seed = fromSeed(te.encode(data.seed));
  assert(seed.verify(nonce, sig));
  const sig2 = seed.sign(nonce);
  const encsig = encode(sig2);
  assertEquals(encsig, data.sig);
});

Deno.test("integration - encoded seed returns stable values albertor", () => {
  let data = {
    "seed": "SUAGC3DCMVZHI33SMFWGEZLSORXXEYLMMJSXE5DPOJQWYYTFOJ2G64VAPY",
    "public_key": "UAHJLSMYZDJCBHQ2SARL37IEALR3TI7VVPZ2MJ7F4SZKNOG7HJJIYW5T",
    "private_key":
      "PBQWYYTFOJ2G64TBNRRGK4TUN5ZGC3DCMVZHI33SMFWGEZLSORXXEDUVZGMMRURATYNJAIV57UCAFY5ZUP22X45GE7S6JMVGXDPTUUUMRKXA",
    "nonce": "P6Gz7PfS+Cqt0qTgheqa9w==",
    "sig":
      "Dg8/bNrSx/TqBiETRjkVIa3+vx8bQc/DcoFBuFfUiHAEWDsSkzNLgseZlP+x9ndVCoka6YpDIoTzc5NjHTgPCA==",
  };

  const td = new TextDecoder();
  const v = Codec.encodeSeed(
    Prefix.User,
    new TextEncoder().encode("albertoralbertoralbertoralbertor"),
  );
  assertEquals(td.decode(v), data.seed);

  const kp = fromSeed(v);
  assertEquals(td.decode(kp.getSeed()), data.seed, "seed");
  assertEquals(kp.getPublicKey(), data.public_key, "public key");
  assertEquals(td.decode(kp.getPrivateKey()), data.private_key, "private key");
});
