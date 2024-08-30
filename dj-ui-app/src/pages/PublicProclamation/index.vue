<template>
	<view v-loading="loading">
		<view>
			<image mode="widthFix" src="@/static/images/publicProclamation/top.png"></image>
		</view>
		<view style="padding: 30rpx 25rpx; display: flex; flex-direction: column;">

			<view style="margin-bottom: 30rpx;" v-for="(item,index) in newsList" :key="index" @click="$handlerNavigate({ url: '/pages/NewsBulletin/details?url='+item.url })">
				<view style="display: flex;">
					<view style="margin-top: 12rpx; width: 10rpx; height: 10rpx; background: rgba(225, 53, 27, 1); border-radius: 50%;"></view>
					<view style="flex: 1; padding: 0 20rpx;">
						<u--text style="font-weight: 400" lineHeight="40rpx" :lines="2" size="30rpx" :text="item.title"></u--text>
					</view>
					<view style="font-size: 26rpx; color: rgba(128, 128, 128, 1);">
						{{item.created}}
					</view>
				</view>
				<view class="interval"></view>
			</view>

			<view style="margin-top: 20rpx;" v-if="moreFlag">
				<loadingIcon></loadingIcon>
			</view>
			<loadMore v-else style="margin: 10rpx 0;" :status="loadmoreStatus" @loadmore="loadmore()"></loadMore>
		</view>

	</view>
</template>

<script>
import {queryNews} from '@/api/news'
import loadMore from '@/components/loadMore/index'
import loadingIcon from '@/components/loadingIcon/index.vue'
import { createNamespacedHelpers } from 'vuex'
import {distinctData, getLoadmoreStatus2} from '@/utils/pageUtil'
import util from "@/utils/util"
const { mapState, mapMutations } = createNamespacedHelpers('user')

export default {
	components: {
		loadMore,
		loadingIcon
	},
	data() {
		return{
			newsList:[],
			loadmoreStatus: 'loadmore',
			pageNumber:1,
            pageSize:10,
			moreFlag: false,
			pageInfoIds: [],
            categoryId: '',
		}
	},
	computed: {
		...mapState([
			'loading'
		])
	},
	onReady() {
		this.setLoading(false);
	},
	onLoad(option){
        this.categoryId = option.categoryId
		this.setLoading(true);
        this.queryNewsByPage()
	},
	methods:{
		...mapMutations(['setLoading']),
		loadmore() {
			if (this.moreFlag) {
				return
			}
			this.moreFlag = true
			this.pageNumber++
			this.queryNewsByPage()
		},
		queryNewsByPage(){
            let data = "?categoryId="+this.categoryId+"&pageNum="+this.pageNumber+"&pageSize="+this.pageSize
            queryNews(data).then(res => {
				if (res.code == 200) {
					let {ids, resultData} = distinctData(this.pageInfoIds, res.data.records)
                    let list = resultData;
                    for (let i = 0; i < list.length; i++) {
                        list[i].url = list[i].url.replace("http://10.4.117.31:7380", util.newsUrl);
                        if(list[i].thumbnail){
                            list[i].thumbnail = list[i].thumbnail.replace("http://10.4.117.31:7000", util.minionUrl);
                        }
                    }
					this.pageInfoIds = ids
					this.newsList = this.newsList.concat(list)
					this.loadmoreStatus = getLoadmoreStatus2(this.newsList, res.data.records.length, res.data.total)
				} else {
					uni.showToast({
						icon: 'none',
						title: res.msg,
						duration: 2000
					})
				}
				this.moreFlag = false
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.interval {
		margin-top: 20rpx;
		width: 100%;
		height: 1px;
		transform: scale(1, 0.4);
		background: rgb(208, 208, 208);
	}
</style>
