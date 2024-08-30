<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j promo-con">
    <view class="suspension-btn" @tap="handleScorllTop">
      <image src="@/static/images/icon/back-to-top.png" />
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    handleScorllTop() {
      uni.pageScrollTo({
        duration: 100,
        scrollTop: 0
      })
    }
  }
}
</script>

<style>
@import "./index.css";
</style>
