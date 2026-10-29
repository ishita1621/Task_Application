
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const privateKeyPath = path.join(
    process.cwd(),
    "keys",
    "private.pem"
);

export function decryptPassword(
    encryptedPassword: string
): string {
    // Read the private key
    const privateKey = fs.readFileSync(
        privateKeyPath,
        "utf8"
    );

    // Decode the Base64 encrypted value
    const encryptedBuffer = Buffer.from(
        encryptedPassword,
        "base64"
    );

    // Decrypt using RSA-OAEP with SHA-256
    const decryptedBuffer = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        encryptedBuffer
    );

    // Convert decrypted bytes into the original password
    return decryptedBuffer.toString("utf8");
}
