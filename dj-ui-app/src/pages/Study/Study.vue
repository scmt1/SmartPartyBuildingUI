<template>
  <view class="study" v-loading="loading">
    <!-- <j-navbar title="在线学习" /> -->
    <view class="container">
      <view class="top-swiper" v-if="topList.length > 0">
        <j-swiper :data="topList" :config="topSwiperConfig" @choose="goLessonsInfo"/>
      </view>
      <view class="user-condition">

        <view v-if="lastStudyInfo" style="margin-buttom: 40rpx;">
          <view class="last-study mtb-20" >
            <view class="last-study-left">
              <view class="title">您上次已经学习到</view>
              <view class="lesson single-text" style="font-size: 28rpx;">{{ lastStudyInfo.title }}</view>
              <!-- <view class="progress">
                <text class="text">学至8%</text>
                <u-line-progress
                  :percentage="8"
                  height="26"
                  :showText="false"
                  activeColor="rgba(225, 53, 27, 1)"
                >
                </u-line-progress>
              </view> -->
            </view>
						<!-- 1图文 2视频 -->
            <view v-if="lastColumnInfo.type == '1' " class="last-study-right" @click="$handlerNavigate({ url: '/pages/Lessons/GraphicLessonsInfo?id='+lastStudyInfo.id })">
              <image mode="aspectFill" :src="lastStudyInfo.imageUrl"></image>
            </view>
						<view v-if="lastColumnInfo.type == '2' " class="last-study-right" @click="$handlerNavigate({ url: '/pages/Lessons/VideoLessonsInfo?id='+lastStudyInfo.id })">
						  <image mode="aspectFill" :src="lastStudyInfo.imageUrl"></image>
						</view>
          </view>
        </view>

        <view class="lessons">
          <view class="base-title">
            <text class="title-left">在线课程</text>
            <view
              class="title-right"
              @click="$handlerNavigate({ url: '/pages/Lessons/OnlineLessons' })"
							style="font-size: 26rpx;"
              >更多<u-icon name="arrow-right" size="22"></u-icon
            ></view>
          </view>
          <view class="lessons-graphic">
            <view class="second-title">图文课程</view>
            <view class="list" v-if="imgList.length > 0">
              <view class="list-item" v-for="(item, index) in imgList" :key="index" @click="$handlerNavigate({ url: '/pages/Lessons/GraphicLessonsInfo?id='+item.id })">
                <view class="list-item-top">
                  <view class="top-title">{{ item.title }}</view>
                  <image v-if="item.imageUrl" class="image" :src="item.imageUrl"></image>
                </view>
                <view class="list-item-sort">
								{{ item.tzVideoColumn?item.tzVideoColumn.name:'' }}
								<!-- <view class="icon-text">
									<u-icon
										name="volume-fill"
										color="#E1351B"
										size="22"
                    >
										</u-icon>播报
								</view> -->
								</view>
              </view>
            </view>
						<view class="empty" v-else>暂无推荐图文课程</view>
            <!-- <view class="bottom-image" v-if="data.titleImage">
              <image mode="widthFix" :src="$formatImageUrl(data.titleImage)"></image>
            </view> -->
          </view>
          <view class="lessons-video">
            <view class="second-title">视频课程</view>
            <j-swiper2 v-if="videoList.length > 0" style="height: 200rpx;" :config="videoSwiperConfig" :data="videoList"  @choose="goLessonsInfo"/>
						<view class="empty" v-else>暂无推荐视频课程</view>
          </view>

          <!-- <view class="answer">
            <view class="second-title">专项答题</view>
            <view class="answer-list">
              <view
                @click="$handlerNavigate({ url: '/pages/Answer/SpecialAnswer' })"
                class="answer-list-item"
                v-for="item in data.answerList"
                :key="item.id"
              >
                <image mode="widthFix" :src="$formatImageUrl(item.image)"></image>
                <view class="status">
                  <image
                    v-if="item.status == 1"
                    :src="$formatImageUrl('status-1.png')"
                  ></image>
                  <image
                    v-if="item.status == 0"
                    :src="$formatImageUrl('status-0.png')"
                  ></image>
                </view>
              </view>
            </view> -->

				</view>
			</view>
		</view>
	</view>
</template>

<script>
import util from "@/utils/util"
import { getTzStudyVideoListByType, getLastStudyByUserId, getVideoColumnListByPage } from '@/api/tzStudyVideo'
import { mapGetters, createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('user')

export default {
  name: 'Study',
  data() {
    return {
			imgList: [],
			videoList: [],
			topList: [],
      topSwiperConfig: {
        autoplay: true,
        circular: true,
        'indicator-dots': true,
      },
      videoSwiperConfig: {
        // 'display-multiple-items': 3,
        // 'previous-margin': '20rpx',
        // 'next-margin': '20rpx'
        autoplay: false,
        margin: true,
        isTitleShow: true,
      },
			lastStudyInfo: null,
			lastColumnInfo: null
    }
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
		this.setLoading(false)
	},
  onShow() {
    this.topList = []
    this.queryTzStudyVideo('top')
    this.queryTzStudyVideo('1')
    this.queryTzStudyVideo('2')
    this.getLastStudy()
    // this.setLoading(true)
  },
	methods: {
		...mapMutations(['setLoading']),
		getLastStudy() {
			getLastStudyByUserId(this.userInfo.id + '').then(res => {
				if (res.code == '00000' && res.data != null) {
                    if(res.data.studyVideo.imageUrl){
                        res.data.studyVideo.imageUrl = res.data.studyVideo.imageUrl.replace("http://10.4.117.31:7000", util.minionUrl);
                    }
					this.lastStudyInfo = res.data.studyVideo
					this.lastColumnInfo = res.data.column
				} else {
					this.lastStudyInfo = null
					this.lastColumnInfo = null
				}
			})
		},
		queryTzStudyVideo(type) {
			let data = {
				type: type,
				userId: this.userInfo.id + ''
			}
			getTzStudyVideoListByType(data).then(res => {
				if (res.code == '00000') {
					if (type == '1') {
                        let list = res.data;
                        for (let i = 0; i < list.length; i++) {
                            list[i].imageUrl = list[i].imageUrl.replace("http://10.4.117.31:7000", util.minionUrl);
                        }
						this.imgList = list
						if (this.imgList == null || this.imgList.length == 0) {
							this.getVideoList('1')
						}
					} else if (type == '2') {
						let item = []
						for (let i = 0; i < res.data.length; i++) {
							const va = res.data[i]
                            if(va.imageUrl){
                                va.imageUrl = va.imageUrl.replace("http://10.4.117.31:7000", util.minionUrl);
                            }
							const value = {
								id: va.id,
								title: va.title,
								columnType: va.tzVideoColumn.type,
								image: va.imageUrl
							}
							item.push(value)
							if (item.length == 3 || i == res.data.length - 1) {
								this.videoList.push(item)
								item = []
							}
						}

						if (this.videoList == null || this.videoList.length == 0) {
							this.getVideoList('2')
						}

					} else if (type == 'top') {
						for (let i = 0; i <  res.data.length; i++) {
                            if(res.data[i].imageUrl){
                                res.data[i].imageUrl = res.data[i].imageUrl.replace("http://10.4.117.31:7000", util.minionUrl);
                            }
							let val = {
								id: res.data[i].id,
								columnType: res.data[i].tzVideoColumn.type,
								image: res.data[i].imageUrl
							}
							this.topList.push(val)
						}
					}
				}
			})
		},
		goLessonsInfo(data) {
			// 1图文栏目，2视频栏目
			if (data.columnType == '1') {
				uni.navigateTo({
					url: '/pages/Lessons/GraphicLessonsInfo?id='+data.id
				})
			} else if (data.columnType == '2') {
				uni.navigateTo({
					url: '/pages/Lessons/VideoLessonsInfo?id='+data.id
				})
			}
		},
		getVideoList(type) {
			let data = {
				columnType: type,
				userId: this.userInfo.id + '',
				pageVo: {
					pageNumber: 1,
					pageSize: 6
				}
			}
			getVideoColumnListByPage({data: data}).then(res => {
				if (res.code == '00000') {
					if (type == '1') {
                        let list = res.data.records;
                        for (let i = 0; i < list.length; i++) {
                            list[i].imageUrl = list[i].imageUrl.replace("http://10.4.117.31:7000", util.minionUrl);
                        }
						this.imgList = list
					} else if (type == '2') {
						let item = []
						for (let i = 0; i < res.data.records.length; i++) {
							const va = res.data.records[i]
                            if(va.imageUrl){
                                va.imageUrl = va.imageUrl.replace("http://10.4.117.31:7000", util.minionUrl);
                            }
							const value = {
								id: va.id,
								title: va.title,
								columnType: va.tzVideoColumn.type,
								image: va.imageUrl
							}
							item.push(value)
							if (item.length == 3 || i == res.data.records.length - 1) {
								this.videoList.push(item)
								item = []
							}
						}
					}
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.empty {
	margin-top: 20rpx;
	background: rgba(245, 245, 245, 1);
	border-radius: 10rpx;
	padding: 30rpx 20rpx;
	font-size: 26rpx;
	line-height: 50rpx;
	text-align: center;
	color: rgb(96, 98, 102);
}

.study {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.top-swiper {
  width: 100%;
  height: 480rpx;
}
.user-condition {
  padding: $p-20;
  .condition-main {
    display: flex;
    height: 140rpx;
    justify-content: space-between;
    .item {
      width: 47%;
      border-radius: 10rpx;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      padding: $p-20;
      .icon {
        width: 80rpx;
        height: 80rpx;
      }
      .content {
        width: 160rpx;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        font-size: $medium-font;
        .blod {
          font-weight: 700;
          font-size: $big-font;
        }
      }
      &.credit {
        background: linear-gradient(
          180deg,
          rgba(254, 232, 209, 1) 0%,
          rgba(253, 203, 162, 1) 100%
        );
        color: rgba(235, 132, 62, 1);
      }
      &.rank {
        background: linear-gradient(
          180deg,
          rgba(255, 194, 196, 1) 0%,
          rgba(255, 224, 219, 1) 100%
        );
        color: rgba(215, 53, 48, 1);
      }
    }
  }
  .last-study {
    display: flex;
    height: 160rpx;
    /* background: red; */
    &-left {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .title {
        font-size: $medium-font;
        font-weight: 700;
      }
      .progress {
        position: relative;
        margin-top: calc($p-20 * 1);
        .text {
          position: absolute;
          right: 0;
          bottom: 100%;
          font-size: 26rpx;
          color: rgba(225, 53, 27, 1);
        }
      }
    }
    &-right {
			border-radius: 10rpx;
			overflow: hidden;
      width: $study-image-width;
      height: $study-image-height;
      margin-left: $p-20;
    }
  }

  .no-user {
    text-align: center;
    text {
      color: #e1351b;
    }
  }
  .lessons {


    .second-title {
      height: 40rpx;
      display: flex;
      align-items: center;
      font-weight: 700;
			font-size: 30rpx;

      &::before {
        content: '';
        display: block;
        width: 8rpx;
        height: 80%;
        border-radius: 14rpx;
        background: rgba(225, 53, 27, 1);
        margin-right: 4rpx;
      }
    }
    .base-title {
      .u-icon {
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }
    .lessons-graphic {
      .list {
        /* padding: $p-20 0; */
        &-item {
          padding: $p-20 0;
          border-bottom: 1px solid #e5e5e5;
          &-top {
            display: flex;
            height: 100%;
            margin-bottom: $p-20;
            .top-title {
							font-size: 30rpx;
							line-height: 45rpx;
              flex: 1;
            }
            .image {
							border-radius: 10rpx;
              width: $study-image-width;
              height: $study-image-height;
              margin-left: $p-20;
            }
          }
          &-sort {
            display: flex;
            justify-content: space-between;
            color: #888888;
            font-size: $base-font;
          }
        }
      }
      .bottom-image {
        margin: $p-20 0;
        //height: 140rpx;
      }
    }
    .lessons-video {
      padding: $p-20 0;
      height: 300rpx;
      margin-bottom: 40rpx;
      .second-title {
        margin-bottom: $p-20;
      }
    }
    .answer {
      padding: $p-20 0;
      &-list {
        &-item {
          //height: 300rpx;
          margin: calc($p-20 * 2) 0;
          position: relative;
          &:last-child {
            margin-bottom: 0;
          }
          /* image {
            height: 100%;
          } */
          .status {
            width: 160rpx;
            height: 60rpx;
            position: absolute;
            top: $p-20;
          }
        }
      }
    }
  }
}
</style>
