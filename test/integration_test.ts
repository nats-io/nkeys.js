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

import {
  fromPublic,
  fromSeed,
  encode,
  decode,
} from "../modules/esm/mod.ts";

import { Codec } from "../src/codec.ts";
import { Prefix } from "../src/nkeys.ts";

// this was generated using nkey api in go
let data = {
  "seed": "SAAF4UIJKVC4GYUK5BY62RPQMKN2GQXK6MYVEU7WOYVNKL5F5BC7PZZJRA",
  "public_key": "ADO3TKZ3CCL5KBBMSN72KCHIZW6GM4FFULQCNYSAWHQENDGUZ53UXRRH",
  "private_key":
    "PBPFCCKVIXBWFCXIOHWUL4DCTORUF2XTGFJFH5TWFLKS7JPIIX36PXNZVM5RBF6VAQWJG75FBDUM3PDGOCS2FYBG4JALDYCGRTKM652LINDQ",
  "nonce": "Zh88CD_2MhTNes_fOxXihw==",
  "sig":
    "1m_-jJwKlT0McnKUUuPnMfxCAeKQzwaBYfSMFSYRVUXkl-GqMe3pXk3uK1MYzbdG0SA-KJ58t2KLWnI39agOBg==",
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
    "nonce": "6dlxYWUcKivV8ot-nfzL3A==",
    "sig":
      "Wu21cRoaNo2sYlQbH_Uc5KAkxqpEAcshXTYZDUyRTuk0wKy7bgPRvjU6CQUDTzBJVvJH7rPv3MuGZ3aDpwqMCg==",
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
