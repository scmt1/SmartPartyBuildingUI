<template>
  <view v-loading="loading" class="video-list" v-if="showFlag">
    <!-- <j-navbar title="课程列表" /> -->
    <view class="container">
      <view class="image-box">
        <image mode="aspectFill" :src="columnInfo.topPath"></image>
      </view>
      <view class="info">
        <view class="info-title">{{ columnInfo.name }}</view>
        <view class="info-introduce">
            {{ columnInfo.description }}
        </view>
      </view>
      <view style="background: rgba(235, 236, 237, 1); height: 18rpx;"></view>
      <view class="list">
        <view class="list-title">课程列表</view>
        <view class="list-item" v-for="item in studyVideoList" :key="item.id" @click="$handlerNavigate({url: '/pages/Lessons/VideoLessonsInfo?id='+ item.id})">
          <view class="lesson-info">
            <view class="lesson-info-title">{{ item.title }}</view>
            <view class="lesson-info-presenter">节目主讲人: {{ item.keynoteSpeaker }}</view>
            <view class="lesson-info-other">
              <view class="status" v-if="item.isStudy">
								已学习
								<!-- {{ item.progress == 100 ? '已学习' : '学至' + item.progress + '%' }} -->
							</view>
              <!-- <view class="credit">{{ item.scores }}学分</view> -->
              <view class="learned-person">
								<view class="image-box">
									<image :src="$formatImageUrl('eye.png')"></image>
								</view>
								{{ item.studyNum }}人学过
							</view>
            </view>
          </view>
          <view class="right-image">
            <image mode="aspectFill" :src="base + item.imageUrl"></image>
          </view>
        </view>
      </view>

			<view style="margin-top: 20rpx;" v-if="moreFlag">
				<loadingIcon></loadingIcon>
			</view>
			<loadMore v-else style="margin-top: 20rpx;" :status="loadmoreStatus" @loadmore="loadmore()"></loadMore>

    </view>
  </view>
	<view v-else class="viewEmpty">
		暂不可查看
	</view>
</template>

<script>
import { getVideoColumn } from '@/api/tzVideoColumn'
import { getVideoColumnListByPage } from '@/api/tzStudyVideo'
import loadMore from '@/components/loadMore/index'
import loadingIcon from '@/components/loadingIcon/index.vue'
import util from "@/utils/util"
import { mapGetters, createNamespacedHelpers } from 'vuex'
import {distinctData, getLoadmoreStatus} from '@/utils/pageUtil'

const { mapState, mapMutations } = createNamespacedHelpers('user')

export default {
  name: 'VideoLessonsList',
	components: {
		loadMore,
		loadingIcon
	},
  data() {
    return {
			base: util.minionUrl,
			id: '',
			columnInfo: {},
			studyVideoList: [],
			search: {
				pageNum: 1,
				pageSize: 10
			},
			moreFlag: false,
			loadmoreStatus: 'loadmore',
			showFlag: false,
			pageInfoIds: []
    }
  },
	onLoad(option){
		this.id = option.id
	},
    onShow(){
        this.init()
        // this.setLoading(true);
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
    init() {
        this.studyVideoList = []
        this.getVideoColumnInfo()
    },
    loadmore() {
    	if (this.moreFlag) {
    		return
    	}
    	this.moreFlag = true
    	this.search.pageNum++
    	this.getVideoList()
    },
		getVideoColumnInfo() {
			getVideoColumn(this.id).then(res => {
				if (res.code == '00000') {
					this.columnInfo = res.data
					if (this.columnInfo.showStatus == '1') {
						this.showFlag = true
						this.getVideoList()
					}
				}
			})
		},
		getVideoList() {
			let data = {
				tzStudyVideo: {
					columnId: this.id
				},
				userId: this.userInfo.id + '',
				pageVo: {
					pageNumber: this.search.pageNum,
					pageSize: this.search.pageSize
				}
			}
			getVideoColumnListByPage({data: data}).then(res => {
				if (res.code == '00000') {
					let {ids, resultData} = distinctData(this.pageInfoIds, res.data.records)
					this.pageInfoIds = ids
					this.studyVideoList = this.studyVideoList.concat(resultData)
					this.loadmoreStatus = getLoadmoreStatus(this.studyVideoList, res.data)
				}
				this.moreFlag = false
			})
		}
  },
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

.video-list {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .container {
    .image-box {
      height: 360rpx;
    }
  }
  .info {
    margin: 0 $p-20;
    padding: $p-20 0;
    //border-bottom: 1px solid $border-color;
    &-title {
      font-weight: 700;
      font-size: $little-font;
    }
    &-introduce {
      text-indent: 2em;
    }
  }
  .list {
    padding: $p-20;
    &-title {
      font-size: $little-font;
      font-weight: 700;
    }
    &-item {
      display: flex;
      padding: $p-20 0;
      border-bottom: 1px solid $border-color;
      .lesson-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-right: $p-20;
        &-title {
          font-size: $little-font;
          font-weight: 700;
					line-height: 40rpx;
        }
				&-presenter {
					margin-top: 20rpx;
				}
        &-other {
          display: flex;
					margin-top: 20rpx;
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
      .right-image {
        width: $study-image-width;
				height: $study-image-height;
        border-radius: $p-10;
        overflow: hidden;
      }
    }
  }
}
</style>
