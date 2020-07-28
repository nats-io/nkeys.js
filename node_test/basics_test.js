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
//
const test = require("ava");
const {
  createAccount,
  createOperator,
  createUser,
  fromPublic,
  fromSeed,
  NKeysErrorCode,
} = require("../lib/index");
const {
  createCluster,
  createServer,
} = require("../lib/nkeys");

function testClear(t, kp) {
  kp.clear();

  t.throws(() => {
    kp.getPublicKey();
  }, { code: NKeysErrorCode.ClearedPair });

  t.throws(() => {
    kp.getPrivateKey();
  }, { code: NKeysErrorCode.ClearedPair });

  t.throws(() => {
    kp.getSeed();
  }, { code: NKeysErrorCode.ClearedPair });

  t.throws(() => {
    const data = new TextEncoder().encode("hello");
    kp.sign(data);
  }, { code: NKeysErrorCode.ClearedPair });

  t.throws(() => {
    const data = new TextEncoder().encode("hello");
    const sig = kp.sign(data);
    kp.verify(data, sig);
  }, { code: NKeysErrorCode.ClearedPair });
}

function doTest(t, kp, kind) {
  t.truthy(kp);

  const seed = kp.getSeed();
  t.is(seed[0], "S".charCodeAt(0));
  t.is(seed[1], kind.charCodeAt(0));

  const publicKey = kp.getPublicKey();
  t.is(publicKey[0], kind.charAt(0));

  const data = new TextEncoder().encode("HelloWorld");
  const sig = kp.sign(data);
  t.is(sig.length, 64);
  t.true(kp.verify(data, sig));

  const sk = fromSeed(seed);
  t.true(sk.verify(data, sig));

  const pub = fromPublic(publicKey);
  t.is(pub.getPublicKey(), publicKey);
  t.true(pub.verify(data, sig));

  t.throws(() => {
    pub.getPrivateKey();
  }, { code: NKeysErrorCode.PublicKeyOnly });
  t.true(pub.verify(data, sig));

  t.throws(() => {
    pub.getSeed();
  }, { code: NKeysErrorCode.PublicKeyOnly });

  testClear(t, kp);
  testClear(t, pub);
}

test("basics - operator", (t) => {
  doTest(t, createOperator(), "O");
});

test("basics - account", (t) => {
  doTest(t, createAccount(), "A");
});

test("basics - user", (t) => {
  doTest(t, createUser(), "U");
});

test("basics - cluster", (t) => {
  doTest(t, createCluster(), "C");
});

test("basics - server", (t) => {
  doTest(t, createServer(), "N");
});
