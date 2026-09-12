declare module "paytmchecksum" {
  export default class PaytmChecksum {
    static generateSignature(params: Record<string, unknown> | string, key: string): Promise<string>;
    static verifySignature(
      params: Record<string, unknown> | string,
      key: string,
      checksum: string
    ): boolean;
  }
}
