<template>
  <view class="details">
<!--      <web-view :src="newUrl" :progress="false" />-->
      <view style="text-align: center">
          <view class="title">{{details.title}}</view>
          <view class="viewCount" v-if="details.viewCount">浏览次数：{{details.viewCount}}</view>
          <view class="time" v-if="details.created">创建时间：{{details.created}}</view>
      </view>
          <view class="content" v-html="details.contentHtml"></view>
      <view style="text-align: left;margin: 40rpx 0 40rpx;">
          <view class="drafter" v-if="details.drafter">撰稿<span style="padding: 0 24rpx 0 8rpx;">|</span>{{details.drafter}}</view>
          <view class="reviewer" v-if="details.reviewer">编辑<span style="padding: 0 24rpx 0 8rpx;">|</span>{{details.reviewer}}</view>
          <view class="reviewer" v-if="details.auditPeople">审核<span style="padding: 0 24rpx 0 8rpx;">|</span>{{details.auditPeople}}</view>
      </view>
      <view style="margin-bottom: 60rpx;margin-top: 40rpx; text-align: center;display: flex;justify-content: center;width: 100%;" v-if="details.likeCount >= 0">
          <view class="detail-praise" @click="like(details.id)" :class="likeSeccess ? 'active' : ''">
              <img style="height: 40rpx;" :src="likeSeccess ? '../../static/icon/zan-white.png' : '../../static/icon/zan.png'">
              <span style="font-size: 32rpx;margin-top: 6rpx;margin-left: 10rpx;"> {{(details.likeCount)}}</span>
          </view>
      </view>
  </view>
</template>

<script>
import {queryNewsDetails,like} from "@/api/news"
// #ifdef H5
import Wechat from '@/utils/wechat.js'
const config = require('@/utils/config.js')
// #endif
export default {
  name: 'GraphicLessonsInfo',
  data() {
    return {
        newUrl:'',
        likeSeccess:false,
        show:false,
        details:{},
    }
  },
  computed: {

  },
    onLoad(options) {
      const { id } = options;
       this.queryNewsDetails(id)
    },
  methods: {
      like(id){
          if(this.likeSeccess){
              uni.showToast({
                  icon:"none",
                  title: '您已经点赞过',
                  duration: 2000
              })
              return
          }
          uni.showLoading({
              title: '点赞中',
              mask:true
          })
          let data = "?articleId=" + id
          like(data).then(res =>{
              if (res.code == 200) {
                  uni.hideLoading()
                  this.likeSeccess = true;
                  this.details.likeCount += 1
                  uni.showToast({
                      title: '点赞成功',
                      duration: 2000
                  });
              }
          })
      },
      queryNewsDetails(id){
          uni.showLoading({
              title: '加载中',
              mask:true
          })
          queryNewsDetails(id).then(res =>{
              uni.hideLoading()
              if (res.code == 200) {
                  this.details = res.data
                  this.likeSeccess = this.details.isZan
                  var sharedata = {
                      title: this.details.title, // 分享标题
                      imgUrl: config.domainAddress + this.details.thumbnail, // 分享图标
                      link: config.domainAddress + "/#/pages/NewsBulletin/details?id=" + id, // 分享链接
                      desc: this.details.summary ? this.details.summary : this.details.title, // 分享描述
                  }
                  Wechat.callWexinShare(
                      sharedata,
                      () => {
                          console.log("成功")
                      },
                      (failMsg) => {
                          console.log(failMsg)
                      }
                  )
              }
          })
      },
  },
}
</script>

<style lang="scss" scoped>
@media screen and (min-width : 992px) {
    .details {
        width: 40%;
        margin: auto;
    }
}
.details{
    color: #333;
    padding: 30rpx;
    font-weight: 300;
    font-size: 26rpx;
    display: block;
    .title{
        font-size: 18px;
        font-weight: bold;
        margin: 0 0 20rpx;
    }
    .viewCount {
        line-height: 1.4em;
        margin: 0 0 20rpx;
    }
    .time {
        line-height: 1.4em;
        margin: 0 0 20rpx;
    }

    ::v-deep .content {
        margin-top: 30px;
        font: 15px Microsoft YaHei, -apple-system, BlinkMacSystemFont, Open Sans, Helvetica Neue, arial, PingFang SC, Hiragino Sans GB, simsun, sans-serif !important;
        line-height: 20pt !important;

        p {
            text-indent: 2em !important;
            text-align: justify !important;
            font-size: 16px !important;
            line-height: 20pt !important;
            color: #000000 !important;
        }

        span {
            text-indent: 2em !important;
            text-align: justify !important;
            font-size: 16px !important;
            line-height: 20pt !important;
            color: #000000 !important;
        }

        img, video{
            display: block;
            margin-bottom: 10px !important;
            max-width: 100% !important;
        }
    }
    .drafter{
        text-align: center;
    }
    .reviewer{
        margin-top: 20rpx;
        text-align: center;
    }
    .detail-praise {
        width: 32%;
        height: 70rpx;
        border: 1px solid #ddd;
        border-radius: 140rpx;
        color: #999;
        text-align: center;
        vert-align: middle;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .active{
        background-color: #5ac725;
        color: #fff;
    }
}
</style>
