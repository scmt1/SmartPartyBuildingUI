<!--<template>-->
<!--	<view v-loading="loading">-->
<!--		<view v-if="thumbnail&&thumbnail!==''">-->
<!--			<image mode="widthFix" :src="baseUrl + thumbnail"></image>-->
<!--		</view>-->
<!--		<view class="top-text" v-if="content&&content!==''">-->
<!--			{{content}}-->
<!--		</view>-->
<!--		<view style="padding: 0 25rpx;">-->

<!--			<view class="news-box middle">-->
<!--			<view v-for="(item,index) in newsList" :key="index">-->
<!--				<view v-if="!item.thumbnail||item.thumbnail==''" class="news-list" @click="$handlerNavigate({ url: '/pages/NewsBulletin/details?id='+item.id })">-->
<!--					<view class="content">-->
<!--						<view class="right-text">-->
<!--							<view>-->
<!--								<u&#45;&#45;text size="30rpx" lineHeight="40rpx" :text="item.highlightTitle"-->
<!--								></u&#45;&#45;text>-->
<!--							</view>-->
<!--						</view>-->
<!--					</view>-->
<!--					<view class="list-bottom">-->
<!--						<view>{{item.user.nickname}}</view>-->
<!--						<view class="time">{{item.modified}}</view>-->
<!--						&lt;!&ndash; <view style="display: flex;">-->
<!--							<u-icon color="red" size="25rpx" name="volume-fill"></u-icon>-->
<!--							<text style="font-size: 22rpx; color: black;">播报</text>-->
<!--						</view> &ndash;&gt;-->
<!--					</view>-->
<!--					<view class="interval"></view>-->
<!--				</view>-->

<!--				<view  v-else class="news-list-image" @click="$handlerNavigate({ url: '/pages/NewsBulletin/details?id='+item.id })">-->
<!--					<view class="content">-->
<!--						<view class="right-text">-->
<!--							<view>-->
<!--								<u&#45;&#45;text size="30rpx" lineHeight="40rpx" :text="item.highlightTitle"-->
<!--								></u&#45;&#45;text>-->
<!--							</view>-->
<!--						</view>-->
<!--						<view class="left-image" >-->
<!--								<image mode="aspectFill" :src="baseUrl + item.thumbnail"></image>-->
<!--						</view>-->
<!--					</view>-->
<!--					<view class="list-bottom">-->
<!--						<view>{{item.user.nickname}}</view>-->
<!--						<view class="time">{{item.modified}}</view>-->
<!--						&lt;!&ndash; <view style="display: flex;">-->
<!--							<u-icon color="red" size="25rpx" name="volume-fill"></u-icon>-->
<!--							<text style="font-size: 22rpx; color: black;">播报</text>-->
<!--						</view> &ndash;&gt;-->
<!--					</view>-->
<!--					<view class="interval"></view>-->
<!--				</view>-->
<!--				</view>-->
<!--			</view>-->

<!--		</view>-->
<!--		<view v-if="moreFlag" style="margin: 20rpx 0;">-->
<!--			<loadingIcon></loadingIcon>-->
<!--		</view>-->
<!--		<loadMore v-else style="margin: 20rpx 0;" :status="loadmoreStatus" @loadmore="loadmore()"></loadMore>-->
<!--	</view>-->
<!--</template>-->

<!--<script>-->
<!--import util from "@/utils/util"-->
<!--import {queryNewsByPage,querySpecial,querySpecialDetail} from '@/api/news'-->
<!--import loadMore from '@/components/loadMore/index'-->
<!--import loadingIcon from '@/components/loadingIcon/index.vue'-->
<!--import { createNamespacedHelpers } from 'vuex'-->
<!--import {distinctData, getLoadmoreStatus2} from '@/utils/pageUtil'-->

<!--const { mapState, mapMutations } = createNamespacedHelpers('user')-->

<!--export default {-->
<!--	name:"index",-->
<!--	components: {-->
<!--		loadMore,-->
<!--		loadingIcon-->
<!--	},-->
<!--	data(){-->
<!--		return{-->
<!--			id:'',-->
<!--			newsList:[],-->
<!--			pageNumber:1,-->
<!--			baseUrl:util.newsUrl,-->
<!--			loadmoreStatus: 'loadmore',-->
<!--			thumbnail:'',-->
<!--			content:'',-->
<!--			moreFlag: false,-->
<!--			specialDetail:null,-->
<!--			pageInfoIds: []-->
<!--		}-->
<!--	},-->
<!--	onLoad(options){-->
<!--		/* this.thumbnail = options.thumbnail-->
<!--		this.content= options.content */-->
<!--		if(options.id){-->
<!--			this.id = options.id-->
<!--			this.querySpecialDetail(options.id)-->
<!--			this.queryNewsByPage(options.id)-->
<!--		}-->
<!--		this.setLoading(true);-->
<!--	},-->
<!--	created() {-->
<!--		/*try {-->
<!--			xm.setNavigationBarTitle({title: "专题报道"});-->
<!--		} catch (error) {-->
<!--			document.title = "专题报道";-->
<!--		}*/-->
<!--	},-->
<!--	computed: {-->
<!--		...mapState([-->
<!--			'loading'-->
<!--		])-->
<!--	},-->
<!--	onReady() {-->
<!--		this.setLoading(false);-->
<!--	},-->
<!--	methods: {-->
<!--		...mapMutations(['setLoading']),-->
<!--		querySpecialDetail(id){-->
<!--			let data = "?id="+id-->
<!--			querySpecialDetail(data).then(res => {-->
<!--				if (res.state=="ok") {-->
<!--					this.specialDetail = res.detail-->
<!--					this.content =  res.detail.content-->
<!--					this.thumbnail = res.detail.thumbnail-->
<!--					// uni.navigateTo({ url: '/pages/Home/Home' })-->
<!--				} else {-->
<!--					uni.showToast({-->
<!--						icon: 'none',-->
<!--						title: res.msg,-->
<!--						duration: 2000-->
<!--					})-->
<!--				}-->
<!--			})-->
<!--		},-->
<!--		loadmore() {-->
<!--			if (this.moreFlag) {-->
<!--				return-->
<!--			}-->
<!--			this.moreFlag = true-->
<!--			this.pageNumber++-->
<!--			this.queryNewsByPage(this.id)-->
<!--		},-->
<!--		queryNewsByPage(categoryId){-->
<!--			let data = "?categoryId="+categoryId+"&pageNumber="+this.pageNumber-->

<!--			queryNewsByPage(data).then(res => {-->
<!--				if (res.state=="ok") {-->
<!--					let {ids, resultData} = distinctData(this.pageInfoIds, res.page.list)-->
<!--					this.pageInfoIds = ids-->
<!--					this.newsList = this.newsList.concat(resultData)-->
<!--					this.loadmoreStatus = getLoadmoreStatus2(this.newsList, res.page.list, res.page.totalRow)-->
<!--					-->
<!--					/* this.newsList = this.newsList.concat(res.page.list)-->
<!--					if (this.newsList.length < res.page.totalRow) {-->
<!--						this.status = 'loadmore'-->
<!--					} else {-->
<!--						this.status = 'nomore'-->
<!--					} */-->
<!--				} else {-->
<!--					uni.showToast({-->
<!--						icon: 'none',-->
<!--						title: res.msg,-->
<!--						duration: 2000-->
<!--					})-->
<!--				}-->
<!--				this.moreFlag = false-->
<!--			})-->
<!--		}-->
<!--	}-->
<!--}-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--	.top-text {-->
<!--		padding: 20rpx;-->
<!--		line-height: 50rpx;-->
<!--		font-size: 28rpx;-->
<!--		font-weight: 700;-->
<!--		background: rgba(242, 242, 242, 1);-->
<!--	}-->

<!--	.news-box {-->
<!--		display: flex;-->
<!--		flex-direction: column;-->

<!--		.news-list {-->
<!--			padding: 20rpx 0;-->
<!--			display: flex;-->
<!--			flex-direction: column;-->

<!--			.list-bottom {-->
<!--				margin-top: 10rpx;-->
<!--				display: flex;-->
<!--				color: rgb(134, 134, 134);-->
<!--				.time {-->
<!--					margin-left: 25rpx;-->
<!--					flex: 1;-->
<!--				}-->
<!--			}-->
<!--			.interval {-->
<!--				margin-top: 20rpx;-->
<!--				width: 100%;-->
<!--				height: 1px;-->
<!--				transform: scale(1, 0.4);-->
<!--				background: rgb(208, 208, 208);-->
<!--			}-->
<!--		}-->

<!--		.news-list-image {-->
<!--			padding: 20rpx 0;-->
<!--			display: flex;-->
<!--			flex-direction: column;-->

<!--			.content {-->
<!--				display: flex;-->
<!--				align-items: center;-->

<!--				.right-image {-->
<!--					width: 225rpx;-->
<!--				}-->

<!--				.right-text {-->
<!--					flex: 1;-->
<!--					display: flex;-->
<!--					flex-direction: column;-->
<!--					margin-right: 20rpx;-->

<!--					.list-bottom {-->
<!--						margin-top: 10rpx;-->
<!--						display: flex;-->
<!--						color: rgb(134, 134, 134);-->
<!--						.time {-->
<!--							margin-left: 25rpx;-->
<!--							flex: 1;-->
<!--						}-->
<!--					}-->
<!--				}-->

<!--				.left-image {-->
<!--					width: $news-image-width;-->
<!--					height: $news-image-height;-->
<!--					border-radius: 10rpx;-->
<!--					overflow: hidden;-->
<!--				}-->
<!--			}-->

<!--	.list-bottom {-->
<!--		margin-top: 10rpx;-->
<!--		display: flex;-->
<!--		color: rgb(134, 134, 134);-->
<!--		.time {-->
<!--			margin-left: 25rpx;-->
<!--			flex: 1;-->
<!--		}-->
<!--	}-->

<!--			.interval {-->
<!--				margin-top: 20rpx;-->
<!--				width: 100%;-->
<!--				height: 1px;-->
<!--				transform: scale(1, 0.4);-->
<!--				background: rgb(208, 208, 208);-->
<!--			}-->
<!--		}-->

<!--		.public-list {-->
<!--			padding: 20rpx 0;-->
<!--			display: flex;-->
<!--			flex-direction: column;-->

<!--			.list-title {-->
<!--				overflow: hidden;-->
<!--				height: 67rpx;-->
<!--				text-overflow: ellipsis;-->
<!--				-o-text-overflow: ellipsis;-->
<!--				-ms-text-overflow: ellipsis;-->
<!--				line-clamp: 2;-->
<!--				-webkit-line-clamp: 2;-->
<!--				-webkit-box-orient: vertical;-->
<!--				box-orient: vertical;-->
<!--				display: -webkit-box;-->
<!--				flex: 1;-->
<!--				padding-right: 30rpx;-->
<!--			}-->
<!--			.interval {-->
<!--				margin-top: 20rpx;-->
<!--				width: 100%;-->
<!--				height: 1px;-->
<!--				transform: scale(1, 0.4);-->
<!--				background: rgb(208, 208, 208);-->
<!--			}-->
<!--		}-->

<!--	}-->
<!--	.middle {-->
<!--		margin-bottom: 0;-->
<!--	}-->
<!--</style>-->
