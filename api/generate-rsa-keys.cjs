
const {
    generateKeyPairSync,
} = require("node:crypto");

const fs = require("node:fs");
const path = require("node:path");

// Generate RSA public and private keys
const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,

    publicKeyEncoding: {
        type: "spki",
        format: "pem",
    },

    privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
    },
});

// Create keys folder if it doesn't exist
const keysDirectory = path.join(__dirname, "keys");

fs.mkdirSync(keysDirectory, { recursive: true });

// Save public key
fs.writeFileSync(
    path.join(keysDirectory, "public.pem"),
    publicKey
);

// Save private key
fs.writeFileSync(
    path.join(keysDirectory, "private.pem"),
    privateKey
);

console.log("RSA key pair generated successfully!");
