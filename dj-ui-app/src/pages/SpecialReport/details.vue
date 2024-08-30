<template>
  <view v-loading="loading" class="lessons-info">
    <view class="container">
      <view class="info-top">
        <view class="info-top-title">{{ lessonInfo.title }}</view>
        <view class="info-top-time"
          >{{
            $formatTime(lessonInfo.time, 'yyyy年MM月DD日 HH:mm:ss')
          }}发布</view
        >
      </view>
      <view class="lesson-image">
        <image :src="$formatImageUrl('study-swiper.png')"></image>
      </view>
      <view class="lesson-text">
        <text
          class="text"
          v-for="(item, index) in lessonInfo.textList"
          :key="index"
          >{{ item }}</text
        >
      </view>
    </view>
  </view>
</template>

<script>
import { getGraphicDetails } from '@/api/lessons'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('user')
	
export default {
  name: 'GraphicLessonsInfo',
  data() {
    return {
      lessonInfo: {},
    }
  },
  onReady() {
    this.getData()
	this.setLoading(false);
  },
  computed: {
  	...mapState([
  		'loading'
  	])
  },
  onLoad(){
		this.setLoading(true);
	},
  methods: {
  	...mapMutations(['setLoading']),
    async getData() {
      const { data } = await getGraphicDetails()
      // console.log(data)
      this.lessonInfo = data
    },
  },
}
</script>

<style lang="scss" scoped>
.lessons-info {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .container {
    padding: $p-20;
  }
  .info-top {
    &-title {
      font-size: $little-font;
      font-weight: 700;
    }
    &-time {
      color: $gray-color;
      font-size: $small-font;
      margin: $p-10 0;
    }
    &-information {
      display: flex;
      justify-content: space-between;
      margin-top: $p-10;
      .left {
        display: flex;
        .status {
          width: 100rpx;
          font-size: $small-font;
          display: flex;
          justify-content: space-around;
          align-items: center;
          color: $white;
          border-radius: $p-10;
          background: linear-gradient(131.12deg, #fd982e 0%, #ed5c2f 100%);
        }
        .status {
          margin-right: $p-20;
        }
        .credit {
          color: $primary-color;
          margin-right: $p-20;
        }
        .learned-person {
          display: flex;
          align-items: center;
          .image-box {
            width: 36rpx;
            height: 20rpx;
            margin-right: $p-10;
          }
          color: $gray-color;
        }
      }
    }
  }
  .lesson-image {
    margin: $p-20 0;
    width: 100%;
    height: 360rpx;
    display: flex;
    justify-content: space-around;
    image {
      max-width: 680rpx;
    }
  }
  .lesson-text {
    .text {
      display: flex;
      text-indent: 2em;
      line-height: calc($p-20 * 3);
      margin-bottom: $p-20;
    }
  }
}
</style>
