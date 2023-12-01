import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";

import { Injectable } from "@nestjs/common";

import { HashingService } from "./hashing.service";

const scryptAsync = promisify(scrypt);

@Injectable()
export class ScryptService extends HashingService {
  async hash(data: string | Buffer): Promise<string> {
    const salt = randomBytes(this.SALT_SIZE).toString(this.ENCODING);
    const hash = (await scryptAsync(data, salt, this.SALT_SIZE)) as Buffer;
    return salt + this.DELIMITER + hash.toString(this.ENCODING);
  }

  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    const [salt, hash] = encrypted.split(this.DELIMITER);
    const newHash = (await scryptAsync(data, salt, this.SALT_SIZE)) as Buffer;
    return hash === newHash.toString(this.ENCODING);
  }
}
