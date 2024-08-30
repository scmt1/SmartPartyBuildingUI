<template>
  <view class="nav-bar">
    <view class="back">
      <u-icon name="arrow-left" color="#fff" @click="handlerback"></u-icon>
    </view>
    <view class="title">{{ title }}</view>
  </view>
</template>

<script>
  export default {
    name:"j-navbar",
    props: ['title'],
    // mounted() {
    //   console.log(uni.getSystemInfoSync())
    //   console.log(uni.getMenuButtonBoundingClientRect())
    // },
    methods: {
      handlerback() {
        uni.navigateBack()
      }
    },
  }
</script>

<style lang="scss" scoped>
.nav-bar {
  width: 100%;
  height: 88rpx;
  //background: url('@/static/images/nav-bar.png') center no-repeat;
  //background-size: 100% 200%;
  display: flex;
  position: relative;
  .back {
    position: absolute;
    width: 60rpx;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .title {
    flex: 1;
    //color: $white;
    color: black;
    font-size: $medium-font;
    font-weight: $font-weight;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
