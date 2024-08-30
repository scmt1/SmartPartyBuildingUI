<template>
  <view v-loading="loading" class="graphic-list" v-if="showFlag">
    <!-- <j-navbar title="课程列表" /> -->
    <view class="container">
      <view class="top-image">
        <image mode="widthFix" :src="base + columnInfo.topPath"></image>
      </view>
      <view class="lesson-introduce">
        <view class="introduce-title">{{ columnInfo.name }}</view>
        <view class="introduce-info">
          {{ columnInfo.description }}
				</view>
      </view>
      <view style="background: rgba(235, 236, 237, 1); height: 18rpx;"></view>
      <view class="list">
        <view class="list-title">课程列表</view>
        <view
          class="list-item"
          v-for="(item, index) in studyVideoList"
          :key="index"
          @click="$handlerNavigate({ url: '/pages/Lessons/GraphicLessonsInfo?id=' + item.id })"
        >
          <view class="item-top">
            <view class="lesson-title double-text">{{ item.title }}</view>
            <view class="image" v-if="item.imageUrl">
              <image :src="base + item.imageUrl"></image>
            </view>
          </view>
          <view class="lesson-info">
            <view class="left">
              <view class="status" v-if="item.isStudy">已学习</view>
              <!-- <view class="credit">{{ item.scores }}学分</view> -->
              <view class="learned-person">
								<view class="image-box">
									<image :src="$formatImageUrl('eye.png')"></image>
								</view>
									{{ item.studyNum }}人学过
							</view>
            </view>
            <!-- <view class="right">
              <view class="icon-text">
								<u-icon name="volume-fill" color="#E1351B" size="22"></u-icon>播报
							</view>
            </view> -->
          </view>
        </view>

			<view style="margin-top: 20rpx;" v-if="moreFlag">
				<loadingIcon></loadingIcon>
			</view>
			<loadMore v-else style="margin-top: 20rpx;" :status="loadmoreStatus" @loadmore="loadmore()"></loadMore>

      </view>
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
  name: 'GraphicLessonsList',
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
		init() {
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

					/* this.studyVideoList = this.studyVideoList.concat(res.data.records)
					if (this.studyVideoList.length < res.data.total) {
						this.loadmoreStatus = 'loadmore'
					} else {
						this.loadmoreStatus = 'nomore'
					} */
				}
				this.moreFlag = false
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

.graphic-list {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .top-image {
    width: 100%;
  }
  .lesson-introduce {
    padding: $p-20;
    //background: $info-bg;
    .introduce-title {
      font-weight: 700;
      font-size: $little-font;
      margin-bottom: $p-20;
    }
    .introduce-info {
      text-indent: 2em;
    }
  }
  .list {
    padding: $p-20;
    &-title {
      font-weight: 700;
      font-size: $little-font;
    }
    &-item {
      display: flex;
      flex-direction: column;
      padding: $p-20 0;
      border-bottom: 1px solid $border-color;
    }
    .item-top {
      display: flex;
      height: 120rpx;
      .lesson-title {
        height: 70rpx;
      }
      .image {
        width: 240rpx;
        margin-left: $p-20;
        border-radius: $p-10;
        overflow: hidden;
      }
    }
    .lesson-info {
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
}
</style>
