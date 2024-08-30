<template>
    <view v-loading="loading" class="lessons-info">
        <!-- <j-navbar title="课程内容" /> -->
        <view v-if="!viewFlag" class="viewEmpty">
            {{ viewMsg }}
        </view>
        <view v-if="viewFlag" class="container">
            <view class="video">
                <!-- <image :src="$formatImageUrl(lessonsInfo.image)"></image> -->
                <video style="width: 100vw; height: 47.37vw;" :src="studyVideo.videoUrl"></video>
            </view>
            <view class="details">
                <view class="details-title">{{ studyVideo.title }}</view>
                <view class="details-info">
                    <view class="left">
                        <!-- <view class="credit">{{ studyVideo.scores }}学分</view> -->
                        <view class="learned-person">
                            <view class="image-box">
                                <image :src="$formatImageUrl('eye.png')"></image>
                            </view>
                            {{ studyNum }}人学过
                        </view>
                    </view>
                    <view class="status" v-if="isStudy">
                        已学习
                        <!-- {{ studyVideo.progress == 100 ? '已学习' : '学至' + studyVideo.progress + '%' }} -->
                    </view>
                </view>
                <view class="details-other-lessons">
                    <view class="title">往期课程</view>
                    <view class="list">
                        <view class="list-item" v-for="item in pastVideoColumnList" :key="item.id">
                            <view class="image-box">
                                <image mode="aspectFill" :src="item.imageUrl"></image>
                            </view>
                            <view class="item-title">{{ item.title }}</view>
                        </view>
                    </view>
                </view>
                <view class="lessons-introduce">
                    <view class="introduce-title">课程介绍</view>
                    <u-parse :tagStyle="style" :content="studyVideo.content"></u-parse>
                    <!-- <view class="text">
                      <text>
                        {{ studyVideo.introduce }}
                      </text>
                    </view> -->
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import {
        addTzStudyUser,
        getPastVideoColumnList,
        getTzStudyVideoByApp,
        queryStudyCount,
        queryStudyStatus
    } from '@/api/tzStudyVideo'
    import util from '@/utils/util'
    import {createNamespacedHelpers, mapGetters} from 'vuex'

    const {mapState, mapMutations} = createNamespacedHelpers('user')

    export default {
        name: 'VideoLessonsInfo',
        data() {
            return {
                id: '',
                studyVideo: {},
                image: {},
                video: {},
                pastVideoColumnList: [],
                isStudy: false,
                studyNum: 0,
                viewFlag: true,
                viewMsg: '',
                style: {
                    img: 'width: 100%'
                }
            }
        },
        onLoad(option) {
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
                    this.getPastVideoColumn()
                    this.getStudyCount()
                    await this.getStudyStatus()
                    this.addTzStudy()
                }
            },
            getTzStudyVideoById() {
                let data = {
                    id: this.id + '',
                    partyMemberId: this.userInfo.id + ''
                }
                return new Promise((resolve, reject) => {
                    getTzStudyVideoByApp(data).then(res => {
                        if (res.code == '00000') {
                            this.viewFlag = true
                            this.studyVideo = res.data.studyVideo
                            this.image = res.data.image
                            this.video = res.data.video
                        } else {
                            this.viewFlag = false
                            this.studyVideo = {}
                            this.viewMsg = res.msg
                        }
                        resolve()

                    })
                })
            },
            getPastVideoColumn() {
                let data = {
                    id: this.id + '',
                    limit: 6 + '',
                    userId: this.userInfo.id + ''
                }
                getPastVideoColumnList(data).then(res => {
                    if (res.code == '00000') {
                        this.pastVideoColumnList = res.data
                    }
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
    .video {
      height: 360rpx;
    }
    .details {
      padding: $p-20;
      &-title {
        font-size: $little-font;
        font-weight: 700;
      }
      &-info {
        display: flex;
        justify-content: space-between;
        margin-top: $p-10;
        .left {
          display: flex;
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
      }
      &-other-lessons {
        margin-top: $p-20;
        .title {
          font-size: $little-font;
          font-weight: 700;
          margin: $p-10 0;
        }
        .list {
          display: flex;
          overflow-x: scroll;
          &-item {
            margin: 0 calc(10% / 6);
            width: 30%;
            .image-box {
              width: 200rpx;
              height: 160rpx;
              border-radius: $p-10;
              overflow: hidden;
            }
            .item-title {
              margin-top: $p-10;
              font-size: $small-font;
            }
          }
        }
      }
      .lessons-introduce {
        margin-top: $p-20;
        .introduce-title {
          font-size: $little-font;
          font-weight: 700;
          margin: $p-10 0;
        }
        .text {
          text-indent: 2em;
          display: flex;
          flex-direction: column;
          line-height: calc($p-10 * 5);
        }
      }
    }
  }
}
</style>
