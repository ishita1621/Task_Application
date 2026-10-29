import axiosInstance from "../services/AxiosInstance";

// Convert the PEM public key into bytes
function pemToArrayBuffer(pem: string): ArrayBuffer {
    const base64 = pem
        .replace("-----BEGIN PUBLIC KEY-----", "")
        .replace("-----END PUBLIC KEY-----", "")
        .replace(/\s/g, "");

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes.buffer;
}

// Encrypt password using the backend's public key
export async function encryptPassword(
    password: string
): Promise<string> {
    // 1. Get public key from backend
    const response = await axiosInstance.get("/auth/public-key");

    const result = response.data;

    // 2. Import public key into Web Crypto API
    const publicKey = await crypto.subtle.importKey(
        "spki",
        pemToArrayBuffer(result.publicKey),
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        false,
        ["encrypt"]
    );

    // 3. Convert password to bytes
    const passwordBytes = new TextEncoder().encode(password);

    // 4. Encrypt password
    const encryptedBuffer = await crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
        },
        publicKey,
        passwordBytes
    );

    // 5. Convert encrypted bytes to Base64 for JSON transmission
    const encryptedBytes = new Uint8Array(encryptedBuffer);

    let binary = "";

    for (const byte of encryptedBytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary);
}
