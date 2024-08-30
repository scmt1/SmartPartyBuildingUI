<template>
  <view v-loading="loading" class="answer-introduce">
    <j-navbar title="专项答题" />
    <view class="container introduce">
      <view class="introduce-title">2023年5月党建知识专项第题活动</view>
      <view class="introduce-details">
        <view class="item time">
          <view class="image-box">
            <image src="@/static/images/answer-time.png"></image>
          </view>
          <view class="info">
            <text class="title">60分钟</text>
            <text>考试时间</text>
          </view>
        </view>
        <view class="item score">
          <view class="image-box">
            <image src="@/static/images/answer-score.png"></image>
          </view>
          <view class="info">
            <text class="title">100分</text>
            <text>考试总分</text>
          </view>
        </view>
        <view class="item pass-score">
          <view class="image-box">
            <image src="@/static/images/answer-pass.png"></image>
          </view>
          <view class="info">
            <text class="title">60分</text>
            <text>及格分数</text>
          </view>
        </view>
        <view class="item count">
          <view class="image-box">
            <image src="@/static/images/answer-count.png"></image>
          </view>
          <view class="info">
            <text class="title">10题</text>
            <text>题目数量</text>
          </view>
        </view>
      </view>
      <view class="introduce-info">
        <view class="title">
          <view class="star before">
            <image src="@/static/images/star-1.png"></image>
          </view>
          <view class="title-text">考试说明</view>
          <view class="star after">
            <image src="@/static/images/star-1.png"></image>
          </view>
        </view>
        <view class="text">
          <text
            >本次党建知识专项答题活动旨在通过学习竞赛形式普及党史知识，营造比学赶超氛围，引导大家加深对党的历史的理解和把握，激发爱党爱国热情，坚定报国之志，增强坚定走中国特色社会主义道路信心。</text
          ><text
            >以赛促学，检验学习教育成果。历次集中教育活动都以思想教育、理论学习打头，这次党史学习教育，第一位的任务也是加强思想理论武装，强调要抓好学习。只有走心的学习、真切的领悟，才能从党的百年历史中汲取继续前进的智慧和力量。而开展党史知识竞赛活动，则是促进学习往深里走、往实里走的有效形式，也是检验学习成果的有效载体。在全国竞赛之前，各地纷纷组织开展竞赛活动，层层选拔优秀选手，以赛比学，检验前段时间的学习效果，以赛促学，在竞赛中找到不足，激发党员干部党史学习教育的荣誉感，争当党史知识学习“达人”，推动党史学习教育深入群众、深入基层、深入人心。</text
          >
        </view>
      </view>
      <view class="introduce-button">
        <u-button size="small" @click="$handlerNavigate({ url: '/pages/Answer/SingleChoice' })">开始考试</u-button>
      </view>
    </view>

		<view style="margin-top: 20rpx;">
			<image mode="widthFix" src="@/static/images/answer-bt-bg.png"></image>
		</view>

  </view>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('user')
	
export default {
  name: 'AnswerIntroduce',
  computed: {
  	...mapState([
  		'loading'
  	])
  },
  onReady() {
  	this.setLoading(false);
  },
  onLoad(){
		this.setLoading(true);
	},
  methods: {
  	...mapMutations(['setLoading']),
  }
}
</script>

<style lang="scss" scoped>
.answer-introduce {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
	background: rgb(252, 249, 243);

  .introduce {
		flex: 1;
    padding: $p-20;
    //background: url('@/static/images/answer-bg.png');
    /* position: relative; */
    display: flex;
    flex-direction: column;
    /* &::after {
      content: '';
      display: block;
      width: 100%;
      height: 300rpx;
      background: url('@/static/images/answer-bt-bg.png');
      background-size: 100% 100%;
      // position: absolute;
      // bottom: 0;
      // z-index: 2;
    } */
    &-title {
      text-align: center;
      font-size: $little-font;
      font-weight: 700;
    }
    &-details {
      background: $white;
      display: flex;
      flex-wrap: wrap;
      margin: $p-20 0;
      .item {
        width: calc(50% - $p-20);
        font-size: $small-font;
        height: 120rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        .image-box {
          width: 60rpx;
          height: 60rpx;
        }
        .info {
          display: flex;
          flex-direction: column;
          margin-left: $p-20;
          .title {
            font-weight: 700;
            font-size: $little-font;
          }
        }
      }
      .time,
      .pass-score {
        margin-left: $p-20;
      }
      .score,
      .count {
        margin-right: $p-20;
      }
      .time,
      .score {
        border-bottom: calc(1px / 2) solid $border-color;
      }
      .time,
      .pass-score {
        border-right: calc(1px / 2) solid $border-color;
      }
    }
    &-info {
      background: $white;
      padding: $p-20;
      display: flex;
      flex-direction: column;
      //overflow: hidden;
      .text {
        text-indent: 2em;
        font-size: 28rpx;
        display: flex;
        flex-direction: column;
        line-height: 50rpx;
        //overflow-y: scroll;
      }
      .title {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: $p-20;
        .star {
          width: 10rpx;
          height: 10rpx;
          &.before {
            &::before {
              content: ""
            }
          }
        }
        .title-text {
          margin: 0 calc($p-10 - 4rpx);
          font-size: $little-font;
          color: $primary-color;
        }
      }
    }
    &-button {
      margin: 50rpx 0;
      .u-button {
				height: 70rpx;
				width: 300rpx;
				font-size: 28rpx;
				font-weight: 700;
				border-radius: 10rpx;
        background: $primary-color;
        color: $white;
      }
    }
  }
}
</style>
