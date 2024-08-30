<template>
  <u-swiper
    :list="list2"
    keyName="image"
    showTitle
    :autoplay="false"
    circular
    :displayMultipleItems="3"
    previous-margin="20rpx"
    nextMargin="20rpx"
    bgColor="#ffffff"
    height="100%"
    @click="test"
  ></u-swiper>
</template>

<script>
export default {
  data() {
    return {
      list2: [
        {
          image: 'https://cdn.uviewui.com/uview/swiper/swiper2.png',
          title: '昨夜星辰昨夜风，画楼西畔桂堂东',
        },
        {
          image: 'https://cdn.uviewui.com/uview/swiper/swiper1.png',
          title: '身无彩凤双飞翼，心有灵犀一点通',
        },
        {
          image: 'https://cdn.uviewui.com/uview/swiper/swiper3.png',
          title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳',
        },
        {
          image: 'https://cdn.uviewui.com/uview/swiper/swiper2.png',
          title: '昨夜星辰昨夜风，画楼西畔桂堂东',
        },
        {
          image: 'https://cdn.uviewui.com/uview/swiper/swiper1.png',
          title: '身无彩凤双飞翼，心有灵犀一点通',
        },
        {
          image: 'https://cdn.uviewui.com/uview/swiper/swiper3.png',
          title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳',
        },
      ],
    }
  },
  methods: {
    test(item) {
      //console.log(123)
      //console.log(item)
    }
  },
}
</script>
