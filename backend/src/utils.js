import "dotenv/config";

export async function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

const secretKey = process.env.SECRET_KEY;

export async function encrypt(text) {
    let encrypted = "";
    for (let i = 0; i < text.length; i++) {
        encrypted += String.fromCharCode(
            text.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length)
        );
    }
    return encrypted;
}

export async function decrypt(encryptedText) {
    let decrypted = "";
    for (let i = 0; i < encryptedText.length; i++) {
        decrypted += String.fromCharCode(
            encryptedText.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length)
        );
    }
    return decrypted;
}
