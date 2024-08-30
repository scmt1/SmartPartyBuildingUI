import {router} from '../router/index';
import {Modal} from "view-design";
import Cookies from "js-cookie";

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
    if (!name) return;
    let item = window.localStorage.getItem(name);
    if(item == null && name == 'accessToken') {
        Modal.confirm({
            title: "系统提示",
            content: "登录状态已过期，请重新登录?",
            loading: true,
            okText: "重新登录",
            cancelText: "取消",
            onOk: () => {
                Modal.remove();
                // 未登录 清除已登录状态 清除锁屏状态
                Cookies.set('userInfo', '');
                Cookies.set("locking", "0");
                setStore('accessToken', '');
                router.push('/login');
            },
            onCancel: () => {
                // 未登录 清除已登录状态 清除锁屏状态
                Cookies.set('userInfo', '');
                Cookies.set("locking", "0");
                setStore('accessToken', '');
                router.push('/login');
            },
        });
    }
    return item;
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
    if (!name) return;
    window.localStorage.removeItem(name);
}
