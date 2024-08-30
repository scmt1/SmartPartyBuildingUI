<template>
  <!-- <u-swiper :list="list3" indicator indicatorMode="line" circular></u-swiper> -->
  <view class="swiper-container">
    <view class="uni-margin-wrap">
      <swiper
        class="swiper"
        :class="{ margin: config.margin }"
        indicatorActiveColor="#ce1126"
        v-bind="config"
				@change="currentChange"
      >
        <swiper-item
          v-for="(item, index) in data"
          :key="index"
          @click="handlerClick(item)"
        >
          <image mode="aspectFill" :src="item.image" alt=""></image>
          <view class="item-title" v-if="config.isTitleShow && item.title" >{{ item.title }}</view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>

export default {
  name: 'j-swiper',
  props: ['config', 'data'],
  data() {
    return {}
  },
  mounted() {
    // console.log('config', this.config)
  },
  methods: {
    handlerClick(data) {
    	this.$emit('choose', data)
    },
		currentChange(event) {
			this.$emit('change', event.detail.current)
		}
  },
}
</script>

<style lang="scss" scoped>
.swiper-container {
  width: 100%;
  height: 100%;
  .swiper {
    width: 100%;
    height: 100%;
    &.margin {
      uni-swiper-item {
        padding: 0 10rpx;
        width: 100%;
        box-sizing: border-box;
        position: relative;
        .item-title {
          // width: 100%;
          width: calc(100% - 20rpx);
          height: 50rpx;
          line-height: 50rpx;
          text-align: center;
          color: #fff;
          position: absolute;
          z-index: 9999;
          bottom: 0;
          background: rgba(0, 0, 0, 0.37);
          font-size: 26rpx;
        }
        &:last-child {
          padding-left: 5rpx;
          padding-right: 0;
          .item-title {
            width: calc(100% - 5rpx);
          }
        }
        &:first-child {
          padding-left: 0;
          padding-right: 5rpx;
          .item-title {
            width: calc(100% - 5rpx);
          }
        }
      }
    }
  }
  .uni-margin-wrap {
    height: 100%;
  }
}
</style>
