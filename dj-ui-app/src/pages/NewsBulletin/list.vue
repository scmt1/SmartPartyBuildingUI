<template>
    <view>
        <view v-loading="loading">
            <view style="padding: 0 25rpx;">
                <view class="news-box middle">
                    <view v-if="newsList.length > 0" v-for="(item,index) in newsList" :key="index">
                        <view class="news-list-image"  @click="$handlerNavigate({ url: '/pages/NewsBulletin/details?id='+item.id })">
                            <view class="content">
<!--                                <view class="left xfdx">-->
<!--                                    {{item.categoryList[0].id == 21 ? '机关动态' : item.categoryList[0].id == 2 ? '专题专栏' :-->
<!--                                    item.categoryList[0].id == 11 ? '党建信息' : item.categoryList[0].id == 31 ? '先锋典型' : item.categoryList[0].id == 41 ? '党建微视' :''}}-->
<!--                                </view>-->
                                <view class="right-text">
                                    <view>
                                        <u--text :lines="2" size="30rpx" lineHeight="40rpx" :text="item.title"></u--text>
                                    </view>
                                    <view class="list-bottom">
                                        <view class="time">{{item.created}}</view>
                                    </view>
                                </view>
<!--                                <view class="look">-->
<!--                                    <image class="xq-icon" src="@/static/icon/xfdx-icon.png"></image>-->
<!--                                </view>-->
                            </view>
                            <view class="interval"></view>
                        </view>
                    </view>
                    <view v-if="newsList.length == 0" style="margin-top: 100rpx;" class="empty">
                        <u-empty mode="data" icon-size="140"></u-empty>
                    </view>
                    <view v-if="loadAll" style="text-align: center;font-size: 30rpx;color: rgb(208, 208, 208);padding-bottom: 20rpx;">到底了</view>
                </view>
            </view>
        </view>
        <!-- 回到顶部 -->
        <back-top-btn v-if="showBacktop" />
    </view>
</template>

<script>
import {queryNews} from '@/api/news'
import loadMore from '@/components/loadMore/index'
import loadingIcon from '@/components/loadingIcon/index.vue'
import { createNamespacedHelpers } from 'vuex'
import {distinctData, getLoadmoreStatus2} from '@/utils/pageUtil'
import util from "@/utils/util"
import backTopBtn from "components/back-top-btn/index";
const { mapState, mapMutations } = createNamespacedHelpers('user')

export default {
	name:"index",
	components: {
		loadMore,
		loadingIcon,
        backTopBtn
	},
	data() {
		return{
			newsList: [],
			pageNumber: 1,
			pageSize: 10,
			loadmoreStatus: 'loadmore',
			moreFlag: false,
			categoryId: '',
			pageInfoIds: [],
            pages:0,
            loadAll:false,
            scrollTop: 0,
            showBacktop: false,
            title:""
		}
	},
	computed: {
		...mapState([
			'loading'
		])
	},
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
        if (this.scrollTop > 600) {
            this.showBacktop = true;
        } else if (this.scrollTop < 600) {
            this.showBacktop = false;
        }
    },
	onReady() {
		this.setLoading(false);
	},
	onLoad(option){
	    this.categoryId = option.categoryId
        if(option.title){
            this.title = option.title
        }
		this.setLoading(true);
        this.queryNewsByPage()
	},
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        if (this.pageNumber < this.pages) {
            this.pageNumber += 1;
            this.queryNewsByPage()
        } else {
            this.loadAll = true;
        }
    },
	methods: {
		...mapMutations(['setLoading']),
		loadmore() {
			if (this.moreFlag) {
				return
			}
			this.pageNumber++
			this.queryNewsByPage()
		},
		queryNewsByPage(){
            uni.showLoading({
                title:"加载中",
                mask:true
            })
			let data = "?pageNum="+this.pageNumber+"&pageSize="+this.pageSize
            if(this.title){
                data = data + "&title="+this.title
            }
            if(this.categoryId){
                data = data + "&categoryId="+this.categoryId
            }

            queryNews(data).then(res => {
				if (res.code == 200) {
					let {ids, resultData} = distinctData(this.pageInfoIds, res.data.records)
                    let list = resultData;
                    for (let i = 0; i < list.length; i++) {
                        let imgReg = /<img.*?(?:>|\/>)/gi //匹配图片中的img标签
                        let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i // 匹配图片中的src
                        let str = list[i].contentHtml
                        let arr = str.match(imgReg)  //筛选出所有的img
                        let srcArr = []
                        if(arr != null && arr.length > 0){
                            for (let i = 0; i < arr.length; i++) {
                                let src = arr[i].match(srcReg)
                                // 获取图片地址
                                srcArr.push(src[1])
                            }
                        }

                        list[i].url = list[i].url.replace("http://10.4.117.31:7380", util.newsUrl);
                        if(list[i].thumbnail){
                            list[i].thumbnail = list[i].thumbnail.replace("http://10.4.117.31:7000", util.minionUrl);
                        }else{
                            list[i].thumbnail = srcArr[0];
                            if(list[i].thumbnail && list[i].thumbnail.indexOf("http://10.4.117.31:7000")){
                                list[i].thumbnail = list[i].thumbnail.replace("http://10.4.117.31:7000", util.minionUrl);
                            }
                        }
                    }
					this.pageInfoIds = ids
					this.newsList = this.newsList.concat(list)
                    this.pages = res.data.pages;
					// this.loadmoreStatus = getLoadmoreStatus2(this.newsList, res.data.records.length, res.data.total)
				} else {
					uni.showToast({
						icon: 'none',
						title: res.msg,
						duration: 2000
					})
				}
				uni.hideLoading()
				this.moreFlag = false
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.top-text {
		padding: 20rpx;
		line-height: 50rpx;
		font-size: 28rpx;
		font-weight: 700;
		background: rgba(242, 242, 242, 1);
	}

	.news-box {
		display: flex;
		flex-direction: column;

		.news-list {
			padding: 20rpx 0;
			display: flex;
			flex-direction: column;

			.list-bottom {
				margin-top: 10rpx;
				display: flex;
				color: rgb(134, 134, 134);
				.time {
					flex: 1;
				}
			}
			.interval {
				margin-top: 20rpx;
				width: 100%;
				height: 1px;
				transform: scale(1, 0.4);
				background: rgb(208, 208, 208);
			}
		}

		.news-list-image {
			padding: 20rpx 0;
			display: flex;
			flex-direction: column;

			.content {
				display: flex;
				align-items: center;
                position: relative;

				.right-image {
					width: 225rpx;
				}

                .left{
                    color: #fff;
                    writing-mode: vertical-rl;
                    padding: 10rpx;
                    border-radius: 10rpx;
                    font-size: 26rpx;
                    margin-right: 16rpx;
                    font-family: jtBlod;
                }
                .jgdt{
                    background-color: #007AE8;
                }
                .ztzl{
                    background-color: #17B700;
                }
                .djxx{
                    background-color: #B200D1;
                }
                .xfdx{
                    background-color: #C40900;
                }
                .djws{
                    background-color: #EB6F16;
                }

				.right-text {
					flex: 1;
					display: flex;
					flex-direction: column;

					.list-bottom {
						margin-top: 10rpx;
						display: flex;
						color: rgb(134, 134, 134);
						.time {
							flex: 1;
						}
					}
				}
                .look {
                    position: absolute;
                    right: 0;
                    top: 0;

                    .xq-icon {
                        width: 160rpx;
                        height: 52rpx;
                    }
                }

				.left-image {
					width: $news-image-width;
					height: $news-image-height;
					border-radius: 10rpx;
					overflow: hidden;
				}
			}

			.interval {
				margin-top: 20rpx;
				width: 100%;
				height: 1px;
				transform: scale(1, 0.4);
				background: rgb(208, 208, 208);
			}
		}

		.public-list {
			padding: 20rpx 0;
			display: flex;
			flex-direction: column;

			.list-title {
				overflow: hidden;
				height: 67rpx;
				text-overflow: ellipsis;
				-o-text-overflow: ellipsis;
				-ms-text-overflow: ellipsis;
				line-clamp: 2;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				box-orient: vertical;
				display: -webkit-box;
				flex: 1;
				padding-right: 30rpx;
			}
			.interval {
				margin-top: 20rpx;
				width: 100%;
				height: 1px;
				transform: scale(1, 0.4);
				background: rgb(208, 208, 208);
			}
		}

	}
	.middle {
		margin-bottom: 0;
	}
    .empty{
        ::v-deep .u-empty__text{
            font-size: 28rpx !important;
        }
    }
    //::v-deep .u-text__value{
    //    width: 420rpx;
    //}
</style>
