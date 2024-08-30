
import JSEncrypt from 'jsencrypt'

const publicKey =
  `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhz/PNIDGvAOI8W0+MCBa
+Cerd/UuiJbbhVN3h90TQbg7zm0Iing9XEVLBpXodvs8Et4jGO3FQp07vwSggcp8
fc/uVovEQHa7NqLuFEwcLkm779qEBavgit0fZklrbVebFfbFgB1INglkoeSmO1YK
wgiPIAXMC5L/29f0eFs3HelHhbOvTwuYQ8z75haQPeEAt21ZYODXBDS7SG38Kiel
qc9dVJxFpUzI620UQHxttMBI7S7AQD9oOHLrkjaPKnGwrZNcz12d8jsjtSvSw/fn
VaDiAQtaPwf2yWBRb6NhhZKjFIJYMx65iQeO5PFaS/Uh0iYbT0dWF0gfgjVyG/Gb
BwIDAQAB
-----END PUBLIC KEY-----`

const privateKey = 
  `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAhz/PNIDGvAOI8W0+MCBa+Cerd/UuiJbbhVN3h90TQbg7zm0I
ing9XEVLBpXodvs8Et4jGO3FQp07vwSggcp8fc/uVovEQHa7NqLuFEwcLkm779qE
Bavgit0fZklrbVebFfbFgB1INglkoeSmO1YKwgiPIAXMC5L/29f0eFs3HelHhbOv
TwuYQ8z75haQPeEAt21ZYODXBDS7SG38Kielqc9dVJxFpUzI620UQHxttMBI7S7A
QD9oOHLrkjaPKnGwrZNcz12d8jsjtSvSw/fnVaDiAQtaPwf2yWBRb6NhhZKjFIJY
Mx65iQeO5PFaS/Uh0iYbT0dWF0gfgjVyG/GbBwIDAQABAoIBADTnNcKguJvkehWN
mKy0i0DUK5MhmZEeCUIOkwvW4uhrCyHErnmTbNUB2cX6r1KTFT2AHJRstSNIY41l
Xu9F6ApCYkUCKMLaboKBmsTfvIoyl0vL2qZpQ8ytj9Gv2FCN2wDtZPWm/o78f5t/
17IQBuc899cbzWOdnW09/MdzTozpFCB6J2O8o0qxXrHx5Sl2TTZrjEd06gNXSKHx
AsdKf3GVsiNyE3RK/99JI2qZkk8COzDFvCBNHD7qDyTYY4+2Gg3lxU++vJ95+ZvY
+3MBiZpfT3wW+XaQwpxIG4YNkwYGgv6qBMzxMgzJY4jmmL2VvUaoo2RSNVpj761v
xngainkCgYEAklHWl3c7sJ7B2YI5Aetf05FpHk8pr+pmCV+y5tVlYA5bd177mPAy
XgWfL/EIDO90azBeZLmGwGiMlq0ahIC2BRgzIDA8vM5q/GPJ6AblIf1OFsPccGFJ
n3d+V1CTNYy9UqcCCUwhS/Ox3+6lrO/N/fYJxD6woiTWG0OUwDD2ujsCgYEA7KGZ
znRWfZYeBk4rUY1CdyFQuqoqQrsBCVE90UBLSYfysA1A0RLzShb0+ztNYdp41StS
1IU9sCuhmuFW4IyyNywzk2XWFojmH2kVjGM/C1SKGYcoU7dQVvhMSys+22+lPVyv
HpvVLuOkrBfWpAp4QrQi3uO2ytRsbG2wWDOmiaUCgYBqiw7wAdFD/YX4BNvP6v0/
CC379PbM8qhUAQw7C34i4LF3jYE0zwpN7lgIx8Dt8lraRkElpPZbGoXsnaWmgDaK
JSHtOVKwxLmgiGUYABVOl60J5Jqadizu4krr928J2i5thdB0xqukK5IFFjgrYf6k
A0j/Tgq+NoZ1GdOx0rWFywKBgQCPuqyQoUtzpr3/+HUJaPLpJ1xAtWFL/QhpH2ab
9iCEvkWjt7kaBRevdfhBrUiYWjowyMrb+T56BlZ3m83IQM1zA68kJaP/NhIJHCwR
hKrjd+sWDGlrSBpNaS32LoNUiCDm/6gCwIahn3YDbctbAlz/ryjLF6eM1bAxwAJv
4JeUXQKBgE0HX6p5HIcySOTCm5QOpkflc1udmoByQjWfYQ6vws9095Yt6yewihQ5
iOYxDdOOXabHZq+7CZPD2I3IJ/yZXaNhNg68mZbJC7UfiQpJ2mH+KMck4panJeTk
mZe30HlAxMmX3lufwK3mCg8ZGlTBLI3tL+bNgAWhy5P90syqUB5F
-----END RSA PRIVATE KEY-----`

// 加密
export function encrypt(txt) {
    const encryptor = new JSEncrypt() // 创建加密对象实例
    encryptor.setPublicKey(publicKey) // 设置公钥
    return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt) {
    const decryptor = new JSEncrypt() // 创建解密对象实例
    decryptor.setPrivateKey(privateKey) // 设置私钥
    return decryptor.decrypt(txt) // 对数据进行解密
}
