import CryptoJS from "crypto-js";
const secretKey: string = process.env.NEXT_PUBLIC_SECRET_KEY || "";
console.log(secretKey);

export const encryptData = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

export const decryptData = (encryptedData: string): any => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
