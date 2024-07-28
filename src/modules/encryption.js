const CryptoJS = require('react-native-crypto-js');

export const secretKey = 'maidulsOfficialExpenseApplication';
export const encryptObjData = value => {
  return CryptoJS.AES.encrypt(JSON.stringify(value), secretKey).toString();
};
export const encryptObjForAPI = value => {
  let encJsonObj = CryptoJS.AES.encrypt(
    JSON.stringify(value),
    secretKey,
  ).toString();
  return encJsonObj;
};
export const decryptObjData = name => {
  let bytes = CryptoJS.AES.decrypt(name, secretKey);
  let mainObj = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return mainObj;
};
export const decryptObjFromAPI = name => {
  let bytes = CryptoJS.AES.decrypt(name, secretKey);
  let mainObj = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return mainObj;
};
