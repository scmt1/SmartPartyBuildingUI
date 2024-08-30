<template>
	<view v-loading="loading">
		<view class="content-box">
			<u-search @search="seek" @custom="seek" class="search" searchIconSize="45" placeholder="请输入关键词" v-model="search.keyword"></u-search>

			<view>

				<view class="vote-list" @click="$handlerNavigate({ url: '/pages/Vote/voteDetails' })">
					<view class="vote-cover">
						<image class="cover-img" mode="widthFix" src="@/static/images/vote/coverImg1.png"></image>
						<view class="tag">
							<image class="tag-bg" mode="widthFix" src="@/static/images/organizationLife/underway.png"></image>
							<view class="tag-text">进行中</view>
						</view>
					</view>
					<view class="vote-title">
						<u--text :bold="true" size="28rpx" :lines="1" text="“戮力同心”战疫情微视频网络投票活动"></u--text>
					</view>
					<view class="vote-time">
						<u-icon color="rgba(255, 160, 29, 1)" size="26rpx" name="clock-fill"></u-icon>
						<view>2023-05-01 00:00:00至2023-05-30 11:59:59</view>
					</view>
				</view>

				<view class="vote-list" >
					<view class="vote-cover">
						<image class="cover-img" mode="widthFix" src="@/static/images/vote/coverImg1.png"></image>
						<view class="tag">
							<image class="tag-bg" mode="widthFix" src="@/static/images/organizationLife/unplayed.png"></image>
							<view class="tag-text">未开始</view>
						</view>
					</view>
					<view class="vote-title" style="">
						<u--text :bold="true" size="28rpx" :lines="1" text="“戮力同心”战疫情微视频网络投票活动"></u--text>
					</view>
					<view class="vote-time">
						<u-icon color="rgba(255, 160, 29, 1)" size="26rpx" name="clock-fill"></u-icon>
						<view>2023-05-01 00:00:00至2023-05-30 11:59:59</view>
					</view>
				</view>

				<view class="vote-list" >
					<view class="vote-cover">
						<image class="cover-img" mode="widthFix" src="@/static/images/vote/coverImg1.png"></image>
						<view class="tag">
							<image class="tag-bg" mode="widthFix" src="@/static/images/organizationLife/over.png"></image>
							<view class="tag-text">已结束</view>
						</view>
					</view>
					<view class="vote-title">
						<u--text :bold="true" size="28rpx" :lines="1" text="“戮力同心”战疫情微视频网络投票活动"></u--text>
					</view>
					<view class="vote-time">
						<u-icon color="rgba(255, 160, 29, 1)" size="26rpx" name="clock-fill"></u-icon>
						<view>2023-05-01 00:00:00至2023-05-30 11:59:59</view>
					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import { createNamespacedHelpers } from 'vuex'
	const { mapState, mapMutations } = createNamespacedHelpers('user')

export default {
	name:"index",
	data() {
		return {
			search: {
				keyword: ''
			},
			voteList: [
				{

				},
				{

				},
				{

				}
			]
		}
	},
	created() {
		/*try {
			xm.setNavigationBarTitle({title: "投票活动"});
		} catch (error) {
			document.title = "投票活动";
		}*/
	},
	computed: {
		...mapState([
			'loading'
		])
	},
	onReady() {
		this.setLoading(false);
	},
	onLoad(){
		this.setLoading(true);
	},
	methods: {
		...mapMutations(['setLoading']),
		seek() {

		}
	}
}
</script>

<style lang="scss" scoped>

	.content-box {
		width: 100%;
		display: inline-block;
		padding: $content-box-padding;
		padding-top: 30rpx;
		padding-bottom: 30rpx;

		.search {
			background: rgba(242, 242, 242, 1);
			border-radius: 40px;
			height: 80rpx;
			font-size: 26rpx;

			::v-deep .u-search__content__input--placeholder {
				font-size: 25rpx;
			}

			::v-deep .u-search__action--active {
				background-color: rgba(225, 53, 27, 1);
				border-radius: 40px;
				height: 70rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: white;
				width: 140rpx;
				margin-right: 10rpx;
				font-size: 25rpx;
			}
		}

		.vote-list {
			margin-top: 30rpx;

			.vote-cover {
				border-radius: 15rpx;
				overflow: hidden;
				position: relative;

				.tag {
					position: absolute;
					top: 28rpx;
					.tag-bg {
						position: absolute;
						width: 120rpx;
					}
					.tag-text {
						position: absolute;
						color: white;
						width: 80rpx;
						left: 15rpx;
						top: 6rpx;
						font-size: 24rpx;
						font-weight: bold;
					}
				}
			}

			.vote-title {
				font-weight: bold;
				font-size: 30rpx;
				margin-top: 15rpx;
			}

			.vote-time {
				display: flex;
				font-size: 24rpx;
			}

		}

	}
</style>
