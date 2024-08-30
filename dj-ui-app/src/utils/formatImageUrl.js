// 根据不同的环境，返回不同的图片地址

export const formatImageUrl = (url) => {
  // if (!url) return
  // if (process.env.NODE_ENV === 'development')
    return require(`static/images/${url}`)
  // if (process.env.NODE_ENV === 'production') return url
}
