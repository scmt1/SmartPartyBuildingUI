<template>
  <view v-loading="loading" class="details">
    <j-navbar title="学分明细" />
    <view class="container">
      <view class="search">
        <u-search
          placeholder="请输入关键词"
          height="60rpx"
          v-model="searchWord"
          @custom="confirmSearch"
          @search="confirmSearch"
        ></u-search>
      </view>
      <view class="my-credit">
        <image :src="$formatImageUrl('my-credit.png')"></image>
        <view class="credit-info">
          <text>我的积分</text>
          <text class="count">{{ userCredit }}</text>
        </view>
      </view>
      <view class="credit-list">
        <j-section-swiper :config="config">
          <template #[item.slot] v-for="(item, index) in config">
            <view :key="index">
              <j-nodata v-if="!computedData(item.slot).length" />
              <template v-else>
                <view
                  class="list-item"
                  v-for="child in computedData(item.slot)"
                  :key="item.id"
                >
                  <view class="item-left">
                    <view class="title">
                      <view class="type">{{
                        child.sort === 'lesson'
                          ? '课程'
                          : child.sort === 'answer'
                          ? '答题'
                          : '其他'
                      }}</view
                      ><view class="single-text">{{ child.title }}</view></view
                    >
                    <view class="complete-time"
                      >完成时间: <text>{{ child.completeTime }}</text></view
                    >
                  </view>
                  <view class="item-right">+{{ child.score }}</view>
                </view>
              </template>
            </view>
          </template>
        </j-section-swiper>
      </view>
    </view>
  </view>
</template>

<script>
import { getData } from '@/api/credit'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('user')
	
export default {
  name: 'Details',
  data() {
    return {
      searchWord: '',
      config: [
        {
          name: '全部类型',
          slot: 'all',
        },
        {
          name: '课程学习',
          slot: 'lesson',
        },
        {
          name: '专项答题',
          slot: 'answer',
        },
      ],
      creditList: [],
      userCredit: null,
      confirmSearchWord: '',
    }
  },
  computed: {
	  ...mapState([
		'loading'
	  ]),
    computedData() {
      return (type) => {
        if (type === 'all') {
          return this.creditList.filter((item) =>
            item.title.includes(this.confirmSearchWord)
          )
        } else {
          return this.creditList.filter(
            (item) =>
              item.sort === type && item.title.includes(this.confirmSearchWord)
          )
        }
      }
    },
  },
  watch: {
    searchWord: function (newVal) {
      if (!newVal) {
        this.confirmSearchWord = ''
      }
    },
  },
  async onLoad() {
    const result = await getData()
    //console.log('res', result)
    this.creditList = result.data.creditDetails
    this.userCredit = result.data.userCredit
    this.setLoading(true);
  },
  onReady() {
  	this.setLoading(false);
  },
  methods: {
  	...mapMutations(['setLoading']),
    // 确认搜索
    confirmSearch() {
      this.confirmSearchWord = this.searchWord
    },
  },
}
</script>

<style lang="scss" scoped>
.details {
  height: 100vh;
  /* padding: $p-20; */
  display: flex;
  flex-direction: column;
  .container {
    display: flex;
    flex-direction: column;
    padding: $p-20;
  }
  .search {
    display: flex;
    height: 60rpx;
    .u-search {
      flex: 1;
    }
  }
  .my-credit {
    margin: $p-20 0;
    height: 200rpx;
    position: relative;
    .credit-info {
      position: absolute;
      top: 50%;
      left: 10%;
      display: flex;
      flex-direction: column;
      transform: translateY(-50%);
      color: #996840;
      .count {
        font-size: calc($big-font * 1.5);
        color: #563010;
      }
    }
  }
  .credit-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    .list-item {
      display: flex;
      align-items: center;
      height: 200rpx;
      border-bottom: 1px solid $border-color;
      padding: $p-20;
      .item-left {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .title {
          flex: 3;
          font-size: $medium-font;
          font-weight: 700;
          display: flex;
          align-items: center;
          margin-bottom: $p-20;
          .type {
            font-size: $small-font;
            width: 80rpx;
            height: 30rpx;
            background: $primary-color;
            color: #fff;
            display: flex;
            justify-content: space-around;
            align-items: center;
            font-weight: normal;
            border-radius: 10rpx;
            margin-right: $p-20;
          }
        }
        .complete-time {
          flex: 2;
          color: $gray-color;
          text {
            margin-left: $p-20;
          }
        }
      }
      .item-right {
        width: 100rpx;
        font-size: calc($big-font * 1.3);
        text-align: right;
        color: $primary-color;
        margin-left: $p-20;
      }
    }
  }
}
</style>
