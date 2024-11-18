/*
 * Copyright 2018-2024 The NATS Authors
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

import { Codec } from "./codec.ts";
import { type KeyPair, NKeysError, NKeysErrorCode } from "./nkeys.ts";
import nacl from "tweetnacl";

/**
 * @ignore
 */
export class PublicKey implements KeyPair {
  publicKey?: Uint8Array;

  constructor(publicKey: Uint8Array) {
    this.publicKey = publicKey;
  }

  getPublicKey(): string {
    if (!this.publicKey) {
      throw new NKeysError(NKeysErrorCode.ClearedPair);
    }
    return new TextDecoder().decode(this.publicKey);
  }

  getPrivateKey(): Uint8Array {
    if (!this.publicKey) {
      throw new NKeysError(NKeysErrorCode.ClearedPair);
    }
    throw new NKeysError(NKeysErrorCode.PublicKeyOnly);
  }

  getSeed(): Uint8Array {
    if (!this.publicKey) {
      throw new NKeysError(NKeysErrorCode.ClearedPair);
    }
    throw new NKeysError(NKeysErrorCode.PublicKeyOnly);
  }

  sign(_: Uint8Array): Uint8Array {
    if (!this.publicKey) {
      throw new NKeysError(NKeysErrorCode.ClearedPair);
    }
    throw new NKeysError(NKeysErrorCode.CannotSign);
  }

  verify(input: Uint8Array, sig: Uint8Array): boolean {
    if (!this.publicKey) {
      throw new NKeysError(NKeysErrorCode.ClearedPair);
    }
    const buf = Codec._decode(this.publicKey);
    return nacl.sign.detached.verify(input, sig, buf.slice(1));
  }

  clear(): void {
    if (!this.publicKey) {
      return;
    }
    this.publicKey.fill(0);
    this.publicKey = undefined;
  }

  seal(_: Uint8Array, _recipient: string, _nonce?: Uint8Array): Uint8Array {
    throw new NKeysError(NKeysErrorCode.InvalidNKeyOperation);
  }

  open(_: Uint8Array, _sender: string): Uint8Array | null {
    throw new NKeysError(NKeysErrorCode.InvalidNKeyOperation);
  }
}
