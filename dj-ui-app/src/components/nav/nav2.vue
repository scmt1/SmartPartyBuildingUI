<template>
	<view>
		<view class="nav">
			<view class="nav-title" v-for="(item, index) in config"
				:key="index"
				@click="changeType(item.value)"
				:class="defaultIndex == item.value ? 'active' : ''">
				{{ item.name }}
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'nav2',
	props: {
		defaultIndex: {
			type: Number,
			default: 0
		},
		config: {
			type: Array,
			default: () => []
		}
	},
	methods: {
		changeType(value) {
			this.$emit('changeType', value)
		}
	}
}
</script>

<style lang="scss" scoped>
	.nav {
		display: flex;
		justify-content: center;
		padding-bottom: 15rpx;
		height: 90rpx;
		padding-top: 20rpx;
		position: fixed;
		width: 100vw;
		top: 0;
		z-index: 9;
		background: white;
		
		.nav-title {
			padding: 0 20rpx 15rpx;
			font-size: 34rpx;
			font-weight: bold;
			position: relative;
			font-weight: 700;
			transition: all 0.2s ease-in;
		
			&::after {
				content: "";
				position: absolute;
				width: 55rpx;
				height: 4rpx;
				border-radius: 3px;
				background-color: transparent;
				bottom: 4rpx;
				left: 50%;
				transform: translateX(-50%);
			}
		
			&.active::after {
				background-color: #f85513;
			}
		}
	}
</style>