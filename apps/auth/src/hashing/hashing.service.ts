import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class HashingService {
  protected readonly DELIMITER = ":";
  protected readonly SALT_SIZE = 64;
  protected readonly ENCODING = "base64";

  abstract hash(data: string | Buffer): Promise<string>;
  abstract compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}
