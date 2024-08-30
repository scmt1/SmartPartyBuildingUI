<template>
  <view class="video-lessons">
    <view class="list" v-if="columnList && columnList != null && columnList.length > 0">
      <view class="list-item" v-for="item in columnList" :key="item.id" @click="$handlerNavigate({url: '/pages/Lessons/VideoLessonsList?id=' + item.id })">
        <view class="wrapper">
          <image mode="aspectFill" :src="item.imagePath"></image>
          <view class="title">{{ item.name }}</view>
        </view>
      </view>
      <!-- <view class="list-item"></view> -->
      <!-- <view class="list-item"></view> -->
      <!-- <view class="list-item"></view> -->
      <!-- <view class="list-item"></view> -->
    </view>
		<view v-else
			style="color: rgb(96, 98, 102); text-align: center; margin-top: 30rpx;">
			暂无内容
		</view>
  </view>
</template>

<script>
import { getVideoColumnListByType } from '@/api/tzVideoColumn'
import { mapGetters } from 'vuex'
import util from "@/utils/util"

export default {
  name: 'VideoLessons',
  data() {
    return {
			columnList: []
    }
  },
  mounted() {
		this.getVideoColumnList()
  },
	computed: {
		...mapGetters([
			'userInfo'
		])
	},
  methods: {
		getVideoColumnList() {
			let data = {
				//deptId: this.userInfo.deptId + '',
          partyId: this.userInfo.id+'',
				type: '2' // 1图文栏目，2视频栏目
			}
			getVideoColumnListByType(data).then(res => {
				if (res.code == '00000') {
					this.columnList = res.data
				}
			})
		}
  },
}
</script>

<style lang="scss" scoped>
.video-lessons {
  height: 100%;
  /* background: pink; */
  padding: $p-20;
  .list {
    display: flex;
    flex-wrap: wrap;
    /* justify-content: space-around; */
    &-item {
      width: 47%;
      /* max-width: 340rpx; */
			height: calc((100vw - 40rpx) * 0.47 / 32 * 29 + 80rpx);
      margin: 0 calc(6% / 4);
      margin-bottom: $p-20;
      display: flex;
      flex-direction: column;
      align-items: center;
      .wrapper {
        width: 100%;
				height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        image {
          flex: 1;
          border-radius: $p-10;
        }
        .title {
          margin: $p-10 0;
          font-size: 700;
          height: 60rpx;
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>
