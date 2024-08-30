	<template>
		<view>
			<view class="tabContent" v-show="true">
				<view v-for="(item, index) in tableData" :key="index">
					<view class="paramBox">
						<view class="param-title">{{item.name}}</view>
						<view v-for="(subItem, subIndex) in item.list" :key="subIndex">
						<view class="param-item">
							<label>{{subItem.name}}</label>
							<text class="text">{{subItem.value}}</text>
						</view>
						</view>
					</view>
				</view>
				<view style="height: 30rpx;"></view>
			</view>
		</view>
	</template>

	<script>
		export default {
			props: {
				tableData: {
					type: Array,
					default () {
						return []
					}
				}
			},
			data() {
				return {

				}
			},
			methods: {

			}
		}
	</script>

	<style scoped>
		.tabContent {
			background: #fff;
			overflow: hidden;
		}

		.param-title {
			height: 100rpx;
			line-height: 80rpx;
			margin: 20rpx 30rpx 0;
			font-size: 36rpx;
            font-weight: bold;
			text-indent: 30rpx;
            text-align: center;
            border-bottom: 1rpx solid #303133;
		}

		.param-item {
			height: 80rpx;
			line-height: 80rpx;
			font-size: 30rpx;
			border-bottom: 1rpx solid #303133;
			margin: 0 30rpx;
			border-left: 1rpx solid #303133;
			border-right: 1rpx solid #303133;
			display: flex;
		}

		.param-item label {
			width: 160rpx;
			color: #333;
            text-align: center;
            border-right: 1rpx solid #303133;
		}
        .param-item .text{
            color: #333;
            padding-left: 20rpx;
        }
	</style>
