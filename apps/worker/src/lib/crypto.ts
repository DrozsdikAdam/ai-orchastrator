import * as crypto from "crypto";
import { env } from "../config/env";

const algorithm = "aes-256-gcm"
const key = Buffer.from(env.ENCRYPTION_KEY, "hex");

const encrypt = (text: string): string => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let cipherText = cipher.update(text, "utf-8", "hex") + cipher.final("hex");
    const authTag = cipher.getAuthTag();
    let encrypted = iv.toString("hex");

    encrypted += ":" + authTag.toString("hex");
    encrypted += ":" + cipherText;
    return encrypted;
}

const decrypt = (hash: string): string => {
    const [iv, auth, encrypted] = hash.split(":");
    let decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, "hex"));
    decipher.setAuthTag(Buffer.from(auth, "hex"));
    const decrypted = decipher.update(encrypted, "hex", "utf-8") + decipher.final("utf-8");
    return decrypted;
}

export { encrypt, decrypt };