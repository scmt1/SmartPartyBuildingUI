export const setLocalStorageInfo = (key, info) => {
  localStorage.setItem(key, JSON.stringify(info));
};
export const setSessionStorageInfo = (key, info) => {
  sessionStorage.setItem(key, JSON.stringify(info));
};

export const getLocalStorageInfo = (key) => {
  return window.localStorage.getItem(key)
    ? JSON.parse(window.localStorage.getItem(key))
    : null;
};

export const getSessionStorageInfo = (key) => {
  return window.sessionStorage.getItem(key)
    ? JSON.parse(window.sessionStorage.getItem(key))
    : null;
};

const setCookie = (cname, cvalue, exdays) => {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + '; ' + expires;
};
