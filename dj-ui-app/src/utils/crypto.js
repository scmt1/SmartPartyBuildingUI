/**
 * 工具类
 * AES加密
 * 特别注意：（1）AES加密中需要前后端共同协商一个密文(密钥),用来加密/解密的（2）偏移量。
 * abcdefG123456789 代表此次密文
*/
import CryptoJS from 'crypto-js'

let keyStr = '-mall4j-password' // 密文（密钥）

//ECB模式
// 加密
export function encrypt (word) { // word, keyStr第一个参数是加密的字段名字  第二个是key值（16位）
 let key = CryptoJS.enc.Utf8.parse(keyStr)
 let srcs = CryptoJS.enc.Utf8.parse(word)
 let encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})
 return encrypted.toString()
}
   // 解密
export function decrypt (word) {
 let key = CryptoJS.enc.Utf8.parse(keyStr)// Latin1 w8m31+Yy/Nw6thPsMpO5fg==
 let decrypt = CryptoJS.AES.decrypt(word, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})
 return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

