import { createHash } from "crypto";

export function hashIp(ip: string): string {
  return createHash("sha256").update(ip + (process.env.IP_SALT ?? "abstimmung2026")).digest("hex").slice(0, 16);
}
