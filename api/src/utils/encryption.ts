
import fs from "node:fs";
import path from "node:path";

const publicKeyPath = path.join(
    process.cwd(),
    "keys",
    "public.pem"
);

export function getPublicKey(): string {
    return fs.readFileSync(publicKeyPath, "utf8");
}
