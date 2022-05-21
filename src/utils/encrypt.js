import JSEncrypt from 'jsencrypt'

const privateKey =
  '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'

const publicKey =
  'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA5cySmrx9vlTGe/uLV4/rSXcmgnlavZIJ4XuPalmVVqlDlT23ANDLxT4KmJF4hfFoANpR9M+zq3HvDYrcuDp6Em6GA8kF4r109JWo77Nxi0hcvenLXb/gIVLp75F41Yue/WRCGFB6EOS68VOD1ofGiK16yWzM0ykOr0f91lcSGb14b0fPSO56FxfkG/zTfolb0i/hdTcWnSl4akXJFT4y+Zd8csUFIoL7xRa2JZuWIs+b3m+MMRhVifWSx1DZ/fDUjiRjSLaxuXawSjBxHYn0MFQR8zco6xWJnFT34qx9PpNGSsImcr8JVcm2cazKg/4HDqGWKyJE+P9sZ5O/Bd4Z3Du+bWZ3F1KgQeod7zUcIy9AJ2WXyaLhEFofrNS1urzdXPhKGZeQnLZDe5EXZc04+9NjQkUN1N22Si5efEIKnAcf8O/JUTm1YW3cRWm5CsXWFQRTq0K1++D+DpzsK9lpU4Yh7daneLOm1cjiiZR9HXdhT0SrjJS8qnj2FgcGWDA/kBx0OQ1PL1AeTguZdILgBogPvvxYu5hv0RlpzeAZCduSA8NF4ldHKYwIfUoU/0WrLj63T0lvCg7Vt35OpPtzPj/gHQR3+ErjjRTnt4FKEu04E3YiZmHcBL1bEjoOOVZK3hIkcoqTNaORxv/cxQbU5P1froE0jntOy530BIlOrCMCAwEAAQ=='

export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey)
  return encryptor.encrypt(txt)
}

export async function encryptedStr(str) {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(
    `-----BEGIN PUBLIC KEY-----${publicKey}-----END PUBLIC KEY-----`
  )
  return encrypt.encrypt(str)
}

export function encryptedStrNoAsync(str) {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(
    `-----BEGIN PUBLIC KEY-----${publicKey}-----END PUBLIC KEY-----`
  )
  return encrypt.encrypt(str)
}

/**
 * @author
 * @description RSA加密
 * @param data
 * @returns {Promise<{param: PromiseLike<ArrayBuffer>}|*>}
 */
export async function encryptedData(data) {
  return {
    param: encryptedStr(JSON.stringify(data)),
  }
}

/**
 * @author
 * @description RSA解密
 * @param data
 * @returns {PromiseLike<ArrayBuffer>}
 */
export function decryptedData(data) {
  const decrypt = new JSEncrypt()
  decrypt.setPrivateKey(
    `-----BEGIN RSA PRIVATE KEY-----${privateKey}-----END RSA PRIVATE KEY-----`
  )
  data = decrypt.decrypt(JSON.stringify(data))
  return data
}
