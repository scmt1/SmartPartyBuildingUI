export function fileByteToBlob(data) {
    // 首先将对象转换成普通数组 得到长度
    let cacheArr = new Array();
    for (let i in data) {
        cacheArr[i] = data[i];
    }
    let len = cacheArr.length;
    // 构造ArrayBuffer 并通过Uint8Array的实例来对其修改 将普通的数组转成ArrayBuffer数组
    let buffer = new ArrayBuffer(len);
    let arr = new Uint8Array(buffer);

    for (let i = 0; i < len; i++) {
        arr[i] = cacheArr[i];
    }

    let blob = new Blob([arr], { type: "" });
    return blob
}
