<template>
  <view v-loading="loading" class="answer">
    <j-navbar title="专项答题" />
    <view class="container">
      <view class="list">
        <view class="list-item" v-for="item in list" :key="item.id" @click="$handlerNavigate({ url: '/pages/Answer/AnswerIntroduce' })">
          <view class="image-box">
            <image :src="$formatImageUrl(item.image)"></image>
            <view class="status">
              <image mode="widthFix" v-if="item.status === 1" src="@/static/images/status-1.png"></image>
              <image mode="widthFix" v-if="item.status === -1" src="@/static/images/status-0.png"></image>
            </view>
          </view>
          <view class="details">
            <view class="details-title">{{ item.title }}</view>
            <view class="details-info">
              <view class="left">
                <view class="j-icon">
                  <image src="@/static/images/exam.png"></image>
                </view>
                <text>考试时长: {{ item.duration }}分钟</text>
              </view>
              <view class="right">
                <view class="j-icon">
                  <image src="@/static/images/score.png"></image>
                </view>
                <text v-if="item.score === -1">未学习</text>
                <text v-else>个人成绩: {{ item.score }}分</text>
              </view>
            </view>
            <view class="details-time">
              <view class="j-icon">
                <image mode="widthFix" src="@/static/images/time.png" style="width: 30rpx;"></image>
              </view>
              <text>{{ $formatTime(item.time[0], 'YYYY-MM-DD HH:mm:ss') }} 至 {{ $formatTime(item.time[1], 'YYYY-MM-DD HH:mm:ss') }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getAnswerList } from '@/api/answer'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('user')
export default {
  name: 'SpecialAnswer',
  data() {
    return {
      list: []
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
      const { data } = await getAnswerList()
      // console.log(data)
      this.list = [...data.records]
    }
  },
}
</script>

<style lang="scss" scoped>
.answer {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .container {
    padding: $p-20;
    .list {
      &-item {
        margin-bottom: $p-20;
        .image-box {
          height: 300rpx;
          position: relative;
          .status {
            width: 120rpx;
            position: absolute;
            top: 10%;
          }
        }
        .details {
          /* height: 140rpx; */
          margin-top: 25rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          &-title {
            font-size: $little-font;
            font-weight: 700;
          }
          &-info {
            display: flex;
            justify-content: space-between;
            margin: 20rpx 0;
						font-size: 27rpx;
            .left,
            .right {
              display: flex;
              /* color: $gray-color; */
              .j-icon {
                margin-right: $p-10;
              }
            }
          }
          &-time {
						font-size: 27rpx;
            display: flex;
            /* color: $gray-color; */
            .j-icon {
              margin-right: $p-10;
            }
          }
        }
      }
    }
  }
}
</style>
