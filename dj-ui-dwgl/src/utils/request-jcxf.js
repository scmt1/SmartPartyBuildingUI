// 请求封装
import {getLocalStorageInfo} from '@/utils/localStorageInfo'


// const baseURL = 'http://localhost:9379/cms/'
// const baseURL = 'http://192.168.5.79:9379/cms/'
const baseURL = 'https://lz12371.cn/'

export const request = (url, options) => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', baseURL + url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText))
            }
        }

        let td = new FormData()
        td.append('file', options)
        xhr.send(td);
    });
};
