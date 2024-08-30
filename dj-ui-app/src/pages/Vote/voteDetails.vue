<template>
	<view v-loading="loading">
		<view>
			<image mode="widthFix" src="@/static/images/vote/coverImg1.png"></image>
		</view>

		<view class="content-box">

			<view>
				<view :class="boxClassName">
					<view style="z-index: 9;" :class="leftClassName" @click="changeSearchType(1)">活动信息</view>
					<view style="z-index: 9;" :class="middleClassName" @click="changeSearchType(2)">参选列表</view>
					<view style="z-index: 9;" :class="rightClassName" @click="changeSearchType(3)">参选排名</view>
				</view>

				<voteInfo style="z-index: 1;"  v-if="search.type == 1"></voteInfo>
				<candidateList style="z-index: 1;" v-else-if="search.type == 2"></candidateList>
				<ranking style="z-index: 1;" v-else-if="search.type == 3"></ranking>
			</view>

		</view>
	</view>
</template>

<script>
	import voteInfo from './voteInfo.vue'
	import candidateList from './candidateList.vue'
	import ranking from './ranking.vue'
	import { createNamespacedHelpers } from 'vuex'
	const { mapState, mapMutations } = createNamespacedHelpers('user')
	export default {
		name:"voteDetails",
		components: {
			voteInfo,
			candidateList,
			ranking
		},
		data() {
			return {
				boxClassName: 'change-box change-box-left',
				leftClassName: 'change left-selected active',
				middleClassName: 'change border-right',
				rightClassName: 'change',
				search: {
					type: 1
				}
			}
		},
		computed: {
			...mapState([
				'loading'
			])
		},
		created() {
			/*try {
				xm.setNavigationBarTitle({title: "活动详情"});
			} catch (error) {
				document.title = "活动详情";
			}*/
		},
		onReady() {
			this.setLoading(false);
		},
		onLoad(){
		this.setLoading(true);
	},
		methods: {
			...mapMutations(['setLoading']),
			changeSearchType(type) {
				if (type == 1) {
					this.boxClassName = 'change-box change-box-left'
					this.leftClassName = 'change left-selected active'
					this.middleClassName = 'change border-right'
					this.rightClassName = 'change'

				} else if (type == 2) {
					this.boxClassName = 'change-box change-box-middle'
					this.leftClassName = 'change'
					this.middleClassName = 'change middle-selected active'
					this.rightClassName = 'change'

				} else if (type == 3) {
					this.boxClassName = 'change-box change-box-right'
					this.leftClassName = 'change border-right'
					this.middleClassName = 'change'
					this.rightClassName = 'change right-selected active'

				}
				this.search.type = type
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content-box {
		padding: 30rpx 25rpx;

		.change-box {
			display: flex;
			font-weight: bold;
			border: 1rpx solid rgba(225, 53, 27, 1);
			height: 70rpx;

			.change {
				display: flex;
				align-items: center;
				text-align: center;
				flex: 1;
				justify-content: center;
				color: rgba(225, 53, 27, 1);
				position: relative;
				font-size: 32rpx;
				margin-top: -1px;
				margin-left: -1px;
				height: calc(70rpx - 1px);
			}
			.active {
				background: rgba(225, 53, 27, 1);
				color: white;
			}
			.left-selected {
				border-top-left-radius: 10rpx;
				border-bottom-left-radius: 20rpx;
				border-top-right-radius: 25rpx;
			}

			.middle-selected {
				border-bottom-left-radius: 25rpx;
				border-top-right-radius: 25rpx;
			}

			.right-selected {
				margin-right: -1px;
				border-top-right-radius: 10rpx;
				border-bottom-right-radius: 20rpx;
				border-top-left-radius: 25rpx;
			}

			.border-right {
				border-right: 1px solid rgba(225, 53, 27, 1);
			}

			.icon {
				position: absolute;
				right: 80rpx;
				top: 50%;
				bottom: 30rpx;
				width: 15rpx;
			}
		}
		.change-box-left {
			border-top-left-radius: 12rpx;
			border-top-right-radius: 12rpx;
			border-bottom-left-radius: 20rpx;
			border-bottom-right-radius: 12rpx;
		}
		.change-box-middle {
			border-radius: 12rpx;
		}
		.change-box-right {
			border-top-left-radius: 12rpx;
			border-top-right-radius: 12rpx;
			border-bottom-left-radius: 12rpx;
			border-bottom-right-radius: 20rpx;
		}

	}
</style>
