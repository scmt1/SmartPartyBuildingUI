<template>
  <view class="graphic">
		<view v-if="topList && topList != null && topList.length > 0">
			<view class="graphic-swiper">
			  <j-swiper :config="swiperConfig" :data="topList" @choose="goNext" @change="changeTitle"></j-swiper>
			</view>
			<view class="title">
			  <u--text size="30rpx" lines="1" :text="topShowTitle"></u--text>
			</view>
		</view>

    <view class="list" v-if="imgList && imgList != null && imgList.length > 0">
			<view class="base-title">精选课程</view>
      <view class="list-item" v-for="item in imgList" :key="item.id" @click="$handlerNavigate({url: '/pages/Lessons/GraphicLessonsInfo?id='+ item.id})">
        <view class="list-item-top">
          <view class="top-title">{{ item.title }}</view>
          <image v-if="item.imageUrl" class="image" :src="item.imageUrl"></image>
        </view>
        <view class="list-item-sort">
					{{ item.tzVideoColumn.name }}
					<!-- <view class="icon-text">
						<u-icon name="volume-fill" color="#E1351B" size="22"></u-icon>
						播报
					</view> -->
				</view>
      </view>
    </view>

    <view class="education" v-if="columnList && columnList !=null && columnList.length > 0">
      <view class="base-title">专题教育</view>
      <view class="education-list">
        <view class="item" @click="$handlerNavigate({url: '/pages/Lessons/GraphicLessonsList?id=' + item.id})" v-for="item in columnList" :key="item.id">
          <image mode="widthFix" :src="item.imagePath"></image>
        </view>
      </view>
    </view>

		<view v-if="(topList == null && imgList == null && columnList == null) ||
			(topList.length == 0 && imgList.length == 0 && columnList.length == 0)"
			style="color: rgb(96, 98, 102); text-align: center; margin-top: 30rpx;">
			暂无内容
		</view>


  </view>
</template>

<script>
import { getTzStudyVideoListByType } from '@/api/tzStudyVideo'
import { getVideoColumnListByType } from '@/api/tzVideoColumn'
import { mapGetters } from 'vuex'
import util from "@/utils/util"

export default {
  name: 'GraphicLessons',
  data() {
    return {
			topList: [],
			imgList: [],
      data: {},
      swiperConfig: {
        autoplay: true,
        circular: true,
        'indicator-dots': true,
      },
			columnList: [],
			topShowTitle: ''
    }
  },
  mounted() {
		this.queryTzStudyVideo('top')
		this.queryTzStudyVideo('1')
		this.getVideoColumnList()
  },
	computed: {
		...mapGetters([
			'userInfo'
		])
	},
	methods: {
		goNext(data) {
			uni.navigateTo({
				url: '/pages/Lessons/GraphicLessonsInfo?id=' + data.id
			})
		},
		changeTitle(index) {
			this.topShowTitle = this.topList[index].title
		},
		queryTzStudyVideo(type) {
			let data = {
				type: type,
				userId: this.userInfo.id + ''
			}
			if (type == 'top') {
				data.topType = '1'
			}
			getTzStudyVideoListByType(data).then(res => {
				if (res.code == '00000') {
					if (type == '1') {
						this.imgList = res.data
					} else if (type == 'top') {
						for (let i = 0; i <  res.data.length; i++) {
							let val = {
								id: res.data[i].id,
								title: res.data[i].title,
								image: res.data[i].imageUrl
							}
							this.topList.push(val)
							if (i == 0) {
								this.topShowTitle = res.data[i].title
							}
						}
					}
				}
			})
		},
		getVideoColumnList() {
			let data = {
				//deptId: this.userInfo.deptId + '',
          partyId: this.userInfo.id +'',
				type: '1' // 1图文栏目，2视频栏目
			}
			getVideoColumnListByType(data).then(res => {
				if (res.code == '00000') {
					this.columnList = res.data
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.graphic {
  height: 100%;
  &-swiper {
    height: 480rpx;
  }
  .title {
    padding: $p-20;
    background: #f2f2f2;
  }
  .list {
    padding: $p-20;
    &-item {
      padding: $p-20 0;
      border-bottom: 1px solid #e5e5e5;
      &-top {
        display: flex;
        height: 100%;
        margin-bottom: $p-20;
        .top-title {
          flex: 1;
					font-size: 28rpx;
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
  .education {
    padding: $p-20;
    &-list {
      .item {
				border-radius: 10rpx;
				overflow: hidden;
        margin: $p-20 0;
      }
    }
  }
}
</style>
