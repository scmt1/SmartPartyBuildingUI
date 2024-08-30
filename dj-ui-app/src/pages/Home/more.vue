<template>
	<view style="height: 100vh;">
		<view class="header-box">
			<image src="@/static/images/home/top.png" mode="widthFix" style="width: 100vw;"></image>
		</view>
		<view class="content-box">
			<view class="menu-box">
				<view class="content">
					<view class="menu" @click="$handlerNavigate({ url: '/pages/BranchOverview/index' })">
						<image class="image" mode="widthFix" src="@/static/images/home/zbgk.png"></image>
						<view class="name">支部概况</view>
					</view>
					<view class="menu" @click="$handlerNavigate({ url: '/pages/OrganizationLife/index' })">
						<image class="image" mode="widthFix" src="@/static/images/home/shyk.png"></image>
						<view class="name">三会一课</view>
					</view>
					<view class="menu" @click="$handlerNavigate({ url: '/pages/Study/Study' })">
						<image class="image" mode="widthFix" src="@/static/images/home/djxx.png"></image>
						<view class="name">党建学习</view>
					</view>
					<view class="menu" @click="$handlerNavigate({ url: '/pages/PartyMemberDeptTransfer/index' })">
						<image class="image" mode="widthFix" src="@/static/images/home/tphd.png"></image>
						<view class="name">组织关系转接</view>
					</view>
				</view>
				<view class="content">
					<view class="menu" @click="$handlerNavigate({ url: '/pages/CostPayment/index' })">
						<image class="image" mode="widthFix" src="@/static/images/home/dfjn.png"></image>
						<view class="name">党费交纳</view>
					</view>
					<view class="menu" @click="$handlerNavigate({ url: '/pages/Honor/index' })">
						<image class="image" mode="widthFix" src="@/static/images/home/dnry.png"></image>
						<view class="name">党内荣誉</view>
					</view>
					<view class="menu" @click="$handlerNavigate({ url: '/pages/PartyMemberOutflow/index' })">
						<image class="image" mode="widthFix" src="@/static/images/home/dylc.png"></image>
						<view class="name">党员流出</view>
					</view>
					<view v-if="userInfo.buttonRole&&userInfo.buttonRole!=''" class="menu" @click="$handlerNavigate({ url: '/pages/Spectaculars/index' })">
						<image class="image" mode="widthFix" src="@/static/images/home/view.png"></image>
						<view class="name">手机看板</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapGetters, createNamespacedHelpers } from 'vuex'
export default {
computed: {
	...mapGetters([
		'userInfo'
	])
}

}
</script>

<style lang="scss" scoped>
	.header-box {
		z-index: 1;
	}
	.content-box {
		padding: $content-box-padding;
		margin-top: -60rpx;
		height: calc(100% - 280rpx);


		.menu-box {
			position: relative;
			z-index: 2;
			background-color: white;
			padding: 20rpx 20rpx 45rpx 20rpx;
			border-radius: 10rpx;
			box-shadow: 0rpx 5rpx 5rpx 2rpx #dcdcdc;
			display: flex;
			flex-direction: column;
			height: 100%;
			overflow-y: auto;
			overflow-x: hidden;

			.content {
				display: flex;
				margin-top: 30rpx;

				.menu {
					text-align: center;
					width: 25%;
					.image {
						width: 100rpx;
						margin: auto;
					}
					.name {
						font-size: 28rpx;
						margin-top: 10rpx;
					}
				}
			}
		}
	}
</style>
