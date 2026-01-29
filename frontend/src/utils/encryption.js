
import cryptoJs from "crypto-js";

const SECRET_KEY ="abcdef";

export const encryptMessage=(text)=>{
    if(!text){
        return "";
    }
    return cryptoJs.AES.encrypt(text,SECRET_KEY).toString();
};
export const decryptMessage=(text)=>{
    if(!text){
        return "";
    }
    try{
        const bytes =cryptoJs.AES.decrypt(text,SECRET_KEY);
        const originalText = bytes.toString(cryptoJs.enc.Utf8);
        return originalText || "Error decrypting message";
    }
    catch(error){
        console.error("Decryption failed:",error);
        return "[Encrypted Message]";
    }
};