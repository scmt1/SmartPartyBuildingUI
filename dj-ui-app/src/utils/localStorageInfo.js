export const setLocalStorageInfo = (key, info) => {
	uni.setStorageSync(key, info)
}


export const getLocalStorageInfo = (key) => {
	return uni.getStorageSync(key)
}

export const removeLocalStorageInfo = (key) => {
  uni.removeStorageSync(key)
}
