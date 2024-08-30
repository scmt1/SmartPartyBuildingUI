<template>
  <view v-loading="loading" class="lessons-info">
    <!-- <j-navbar title="课程内容" /> -->
		<view v-if="!viewFlag" class="viewEmpty">
			{{ viewMsg }}
		</view>
    <view v-if="viewFlag" class="container">
      <view class="info-top">
        <view class="info-top-title">{{ studyVideo.title }}</view>
        <view class="info-top-time">
					{{$formatTime(studyVideo.postTime, 'yyyy年MM月DD日 HH:mm:ss')}}发布
				</view>
        <view class="info-top-information" style="margin: 10rpx 0;">
          <view class="left">
            <view class="status" v-if="isStudy">已学习</view>
            <!-- <view class="credit">{{ studyVideo.scores }}学分</view> -->
            <view class="learned-person">
							<view class="image-box">
								<image :src="$formatImageUrl('eye.png')"></image>
							</view>{{ studyNum }}人学过
						</view>
          </view>

        </view>
      </view>

      <view class="lesson-text">
				<u-parse :tagStyle="style" :content="studyVideo.content"></u-parse>
      </view>
    </view>
  </view>
</template>

<script>
import {getTzStudyVideoByApp, queryStudyStatus, addTzStudyUser, queryStudyCount} from '@/api/tzStudyVideo'
import util from '@/utils/util'
import { mapGetters, createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('user')

export default {
  name: 'GraphicLessonsInfo',
  data() {
    return {
			id: '',
			studyVideo: {},
			isStudy: false,
			studyNum: 0,
			viewFlag: true,
			viewMsg: '',
			style: {
				img: 'width: 100%'
			}
    }
  },
	onLoad(option){
		this.id = option.id
		this.init()
    this.setLoading(true);
	},
	computed: {
		...mapGetters([
			'userInfo'
		]),
		...mapState([
			'loading'
		])
	},
	onReady() {
		this.setLoading(false);
	},
	methods: {
		...mapMutations(['setLoading']),
		async init() {
			await this.getTzStudyVideoById()
			if (this.viewFlag) {
				this.getStudyCount()
				await this.getStudyStatus()
				this.addTzStudy()
			}
		},
		getTzStudyVideoById() {
			let data = {
				id: this.id+ '',
				partyMemberId: this.userInfo.id +''
			}
			return new Promise((resolve, reject) => {
				getTzStudyVideoByApp(data).then(res => {
					if (res.code == '00000') {
						this.viewFlag = true
						res.data.studyVideo.content = res.data.studyVideo.content.replace(/px;/g, 'rpx;')
						this.studyVideo = res.data.studyVideo
					} else {
						this.viewFlag = false
						this.studyVideo = {}
						this.viewMsg = res.msg
					}
					resolve()
				})
			})
		},
		getStudyStatus() {
			return new Promise((resolve, reject) => {
				let data = {
					tzStudyUser: {
						studyId: this.id,
						userId: this.userInfo.id
					}
				}
				queryStudyStatus({data: data}).then(res => {
					if (res.code == '00000' && res.data.length > 0) {
						this.isStudy = true
					} else {
						this.isStudy = false
					}
					resolve(res)
				})
			})
		},
		getStudyCount() {
			queryStudyCount(this.id).then(res => {
				if (res.code == '00000') {
					this.studyNum = res.data
				}
			})
		},
		addTzStudy() {
			let data = {
				tzStudyUser: {
					studyId: this.id,
					userId: this.userInfo.id
				}
			}
			addTzStudyUser({data: data}).then(res => {

			})
		}
  }
}
</script>

<style lang="scss" scoped>
.viewEmpty {
	font-size: 32rpx;
	color: rgb(189, 191, 197);
	text-align: center;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.lessons-info {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .container {
    padding: $p-20;
  }
  /* padding: $p-20; */
  .info-top {
    &-title {
      font-size: $little-font;
      font-weight: 700;
    }
    &-time {
      color: $gray-color;
      font-size:28rpx;
      margin: 20rpx 0;
    }
    &-information {
      display: flex;
      justify-content: space-between;
      margin-top: $p-10;
      .left {
        display: flex;
				align-items: center;

        .status {
          width: 100rpx;
          font-size: $small-font;
          display: flex;
          justify-content: space-around;
          align-items: center;
          color: $white;
          border-radius: $p-10;
          background: linear-gradient(131.12deg, #fd982e 0%, #ed5c2f 100%);
					padding: 8rpx 0;
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
		text-align: justify;

    .text {
      display: flex;
      text-indent: 2em;
      line-height: calc($p-20 * 3);
      margin-bottom: $p-20;
    }
  }
}
</style>
