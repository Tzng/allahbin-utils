import CryptoJS from 'crypto-js';
import { v4 as uuidv4, validate as validateUUID } from 'uuid';
import JSEncrypt from 'jsencrypt';

/**
 * 加密工具类
 * 提供 UUID 生成、MD5 哈希、RSA 加密解密、AES 对称加密等功能
 */
export const cryptoUtils = {
  /**
   * 生成 UUID v4
   * @returns {string} 返回一个随机生成的 UUID v4 字符串
   * @example
   * ```typescript
   * const uuid = cryptoUtils.uuid();
   * console.log(uuid); // "550e8400e29b41d4a716446655440000"
   * ```
   */
  uuid(): string {
    return uuidv4().replace(/-/g, '');
  },

  /**
   * 生成字符串的 MD5 哈希值
   * @param {string} input - 需要进行 MD5 加密的输入字符串
   * @param {string} [salt] - 可选的盐值，用于增强安全性
   * @returns {string} 返回 MD5 哈希值的十六进制字符串
   * @example
   * ```typescript
   * // 基础 MD5
   * const hash1 = cryptoUtils.md5('hello world');
   * console.log(hash1); // "5d41402abc4b2a76b9719d911017c592"
   * 
   * // 带盐值的 MD5
   * const hash2 = cryptoUtils.md5('password', 'mysalt');
   * console.log(hash2); // "a1b2c3d4e5f6..."
   * ```
   */
  md5(input: string, salt?: string): string {
    const data = salt ? input + salt : input;
    return CryptoJS.MD5(data).toString();
  },

  /**
   * 生成简短的 UUID（8位）
   * @returns {string} 返回一个8位的短 UUID 字符串
   * @example
   * ```typescript
   * const shortUuid = cryptoUtils.miniUuid();
   * console.log(shortUuid); // "a1b2c3d4"
   * ```
   */
  miniUuid(): string {
    return Math.random().toString(36).substring(2, 10);
  },

  /**
   * 验证 UUID 格式是否正确
   * @param {string} uuid - 需要验证的 UUID 字符串
   * @returns {boolean} 如果格式正确返回 true，否则返回 false
   * @example
   * ```typescript
   * const isValid = cryptoUtils.isValidUUID('550e8400-e29b-41d4-a716-446655440000');
   * console.log(isValid); // true
   * ```
   */
  isValidUUID(uuid: string): boolean {
    return validateUUID(uuid);
  },

  /**
   * RSA 加密
   * @param {string} text - 需要加密的文本
   * @param {string} publicKey - RSA 公钥（PEM 格式）
   * @returns {string | false} 返回加密后的 Base64 字符串，失败返回 false
   * @example
   * ```typescript
   * const publicKey = `-----BEGIN PUBLIC KEY-----
   * MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
   * -----END PUBLIC KEY-----`;
   * 
   * const encrypted = cryptoUtils.rsaEncrypt('Hello World', publicKey);
   * console.log(encrypted); // "base64 encrypted string"
   * ```
   */
  rsaEncrypt(text: string, publicKey: string): string | false {
    try {
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(publicKey);
      return encrypt.encrypt(text);
    } catch (error) {
      console.error('RSA 加密失败:', error);
      return false;
    }
  },

  /**
   * RSA 解密
   * @param {string} encryptedText - 需要解密的 Base64 字符串
   * @param {string} privateKey - RSA 私钥（PEM 格式）
   * @returns {string | false} 返回解密后的原文，失败返回 false
   * @example
   * ```typescript
   * const privateKey = `-----BEGIN PRIVATE KEY-----
   * MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAL...
   * -----END PRIVATE KEY-----`;
   * 
   * const decrypted = cryptoUtils.rsaDecrypt(encryptedText, privateKey);
   * console.log(decrypted); // "Hello World"
   * ```
   */
  rsaDecrypt(encryptedText: string, privateKey: string): string | false {
    try {
      const decrypt = new JSEncrypt();
      decrypt.setPrivateKey(privateKey);
      return decrypt.decrypt(encryptedText);
    } catch (error) {
      console.error('RSA 解密失败:', error);
      return false;
    }
  },

  /**
   * 生成 RSA 密钥对
   * @param {number} [keySize=1024] - 密钥长度，默认 1024 位
   * @returns {object} 返回包含公钥和私钥的对象
   * @example
   * ```typescript
   * const keyPair = cryptoUtils.generateRSAKeyPair(2048);
   * console.log(keyPair.publicKey);  // "-----BEGIN PUBLIC KEY-----..."
   * console.log(keyPair.privateKey); // "-----BEGIN PRIVATE KEY-----..."
   * ```
   */
  generateRSAKeyPair(keySize: number = 1024): { publicKey: string; privateKey: string } {
    const encrypt = new JSEncrypt({ default_key_size: keySize.toString() });
    return {
      publicKey: encrypt.getPublicKey(),
      privateKey: encrypt.getPrivateKey()
    };
  },

  /**
   * AES 加密（使用字符串密钥）
   * @param {string} text - 需要加密的文本
   * @param {string} key - 加密密钥（字符串）
   * @returns {string} 返回加密后的文本（包含 IV 和密文）
   * @example
   * ```typescript
   * const encrypted = cryptoUtils.aesEncrypt('Hello World', 'mySecretKey123');
   * console.log(encrypted); // "iv:ciphertext"
   * ```
   */
  aesEncrypt(text: string, key: string): string {
    try {
      // 使用 CryptoJS 进行 AES 加密
      const encrypted = CryptoJS.AES.encrypt(text, key).toString();
      return encrypted;
    } catch (error) {
      console.error('AES 加密失败:', error);
      throw new Error('AES 加密失败');
    }
  },

  /**
   * AES 解密（使用字符串密钥）
   * @param {string} encryptedText - 需要解密的文本（包含 IV 和密文）
   * @param {string} key - 解密密钥（字符串）
   * @returns {string} 返回解密后的原文
   * @example
   * ```typescript
   * const decrypted = cryptoUtils.aesDecrypt(encryptedText, 'mySecretKey123');
   * console.log(decrypted); // "Hello World"
   * ```
   */
  aesDecrypt(encryptedText: string, key: string): string {
    try {
      // 使用 CryptoJS 进行 AES 解密
      const decrypted = CryptoJS.AES.decrypt(encryptedText, key);
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedText) {
        throw new Error('解密失败，可能是密钥错误或数据损坏');
      }
      
      return decryptedText;
    } catch (error) {
      console.error('AES 解密失败:', error);
      throw new Error('AES 解密失败');
    }
  }
};