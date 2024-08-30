<template>
	<view>
		<view class="nav">
			<view class="nav-title" v-for="(item, index) in config"
				:key="index"
				@click="changeType(index)"
				:class="defaultIndex === index ? 'active' : ''">
				{{ item.name }}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'nav1',
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
			changeType(type) {
				this.$emit('changeType', type)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav {
		display: flex;
		justify-content: center;
		padding-bottom: 10rpx;
		padding-top: 10rpx;

		.nav-title {
			padding: 0 20rpx 15rpx;
			font-size: 25rpx;
			font-weight: bold;
			position: relative;
			transition: all 0.2s ease-in;
			margin: auto;

			&::after {
				content: "";
				position: absolute;
				width: 55rpx;
				height: 6rpx;
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