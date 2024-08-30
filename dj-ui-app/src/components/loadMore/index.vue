<template>
	<view style="padding: 15rpx 0;">
		<u-loadmore :line="false" fontSize="30rpx" :status="loadmoreStatus" @loadmore="loadmore()"></u-loadmore>
	</view>
</template>

<script>
export default {
	name:"index",
	props: {
		status: {
			type: String,
			default: 'loadmore'
		}
	},
	watch: {
		status(val){
			this.loadmoreStatus = val
		}
	},
	data() {
		return {
			loadmoreStatus: this.status
		}
	},
	methods: {
		loadmore() {
			this.$emit('loadmore')
		}
	}
}
</script>

<style scoped lang="scss">
	::v-deep {
		.u-loadmore__content__text {
			font-size: 28rpx !important;
			color:#999 !important;
		}
	}
</style>
