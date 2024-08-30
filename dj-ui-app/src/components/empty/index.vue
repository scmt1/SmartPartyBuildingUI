<template>
	<view class="empty" :style="style">
		{{ text }}
	</view>
</template>

<script>
export default {
	name: 'introduce',
	props: {
		text: {
			type: String,
			default: ''
		},
		height: {
			type: Number,
			default: 110
		},
		radius: {
			type: Number,
			default: 0
		},
		marginTop: {
			type: Number,
			default: 0
		},
        marginBottom: {
            type: Number,
            default: 0
        }
	},
	data() {
		return {
			style: {
				lineHeight: this.height + 'rpx',
				height: this.height + 'rpx',
				borderRadius: this.radius + 'rpx',
				marginTop: this.marginTop + 'rpx',
                marginBottom: this.marginBottom + 'rpx'
			}
		}
	}
}
</script>

<style>
	.empty {
		text-align: center;
		background: rgba(245, 245, 245, 1);
		font-size: 26rpx;
		color: rgb(96, 98, 102);
	}
</style>
