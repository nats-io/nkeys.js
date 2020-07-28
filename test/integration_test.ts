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
  assertEquals,
  assert,
} from "https://deno.land/std@0.61.0/testing/asserts.ts";
import { fromPublic, fromSeed, Prefix } from "../src/nkeys.ts";
import { Codec } from "../src/codec.ts";
import { decode, encode } from "../src/util.ts";

// this was generated using nkey api in go
let data = {
  "seed": "SAAK7IAXLQQ2A65HJCMUBR6IG6GP3AOXQGEPCNQIIAG7ZZ7XCEFIROMY6U",
  "public_key": "ACLG5IASA6EMBRAUOXXWX44GNBZPDJO3A3RYDT7FDYYEPBJIBRGP6WHZ",
  "nonce": "2w2TrJVMAqwqZbg0nXovhQ==",
  "sig":
    "F64qNsH2n_XllIX7qYa1YqTTH_K61tPHlvvsN_lhlo-tCpTaKfp0_yWnw5IsQeaiSqwN2rUs20Rk1VV9vtiBBw==",
};

Deno.test("integration - verify", () => {
  const te = new TextEncoder();
  const pk = fromPublic(data.public_key);
  let nonce = te.encode(data.nonce);
  let sig = decode(data.sig);
  assert(pk.verify(nonce, sig));

  const seed = fromSeed(te.encode(data.seed));
  assert(seed.verify(nonce, sig));
});

Deno.test("integration - encoded seed returns stable values albertor", () => {
  let data = {
    "seed": "SUAGC3DCMVZHI33SMFWGEZLSORXXEYLMMJSXE5DPOJQWYYTFOJ2G64VAPY",
    "public_key": "UAHJLSMYZDJCBHQ2SARL37IEALR3TI7VVPZ2MJ7F4SZKNOG7HJJIYW5T",
    "private_key":
      "PBQWYYTFOJ2G64TBNRRGK4TUN5ZGC3DCMVZHI33SMFWGEZLSORXXEDUVZGMMRURATYNJAIV57UCAFY5ZUP22X45GE7S6JMVGXDPTUUUMRKXA",
    "nonce": "",
    "sig": "",
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
