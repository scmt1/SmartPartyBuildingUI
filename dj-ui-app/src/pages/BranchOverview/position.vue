<template>
	<view class="content-box">
		<view class="interval"></view>

		<view class="content">
			<view class="title">阵地介绍</view>
			<view v-if="data.activeDept && data.activeDept.positionIntroduction && data.activeDept.positionIntroduction.length > 0" class="textarea">
				{{ data.activeDept.positionIntroduction }}
			</view>
			<empty v-else text="暂无阵地介绍" :height="150"></empty>
		</view>

		<view class="interval2"></view>

		<view class="content">
			<view class="title">阵地图片</view>
			<view v-if="data.activeAttachFiles && data.activeAttachFiles.length > 0" class="image-list">
				<view class="image" v-if="data.activeAttachFiles" v-for="(item, index) in data.activeAttachFiles" :key="index">
                    <image v-if="item.photo.indexOf('upload') > -1" mode="widthFix" :src="base + item.photo"></image>
                    <image v-else mode="widthFix" :src="item.photo"></image>
				</view>
			</view>
			<empty v-else text="暂无阵地图片" :height="150"></empty>
		</view>

	</view>
</template>

<script>
import empty from '@/components/empty/index.vue'
import util from '@/utils/util'

export default {
	name: 'introduce',
	components: {
		empty
	},
	props: {
		data: {
			type: Object,
			default: {
				activeDept: {},
				activeAttachFiles: []
			}
		}
	},
	data() {
		return {
			base: util.jcxfUrl,
		}
	}
}
</script>

<style lang="scss" scoped>
	.content-box {
		padding: $content-box-padding;
		.interval {
			height: 1px;
			transform: scale(1, 0.8);
			background-color: rgba(229, 229, 229, 1);
		}
		.interval2 {
			height: 1px;
			transform: scale(1, 0.8);
			background-color: rgba(229, 229, 229, 1);
			margin-top: 25rpx;
		}
		.content {
			margin-top: 25rpx;

			.title {
				font-size: 30rpx;
				font-weight: bold;
			}
			.textarea {
				line-height: 50rpx;
				font-size: 30rpx;
				margin-top: 15rpx;
				text-align: justify;
				text-align-last: left;
			}
			.image-list {
				display: flex;
				flex-direction: column;
				margin-top: 15rpx;
				.image {
					margin-bottom: 15rpx;
				}
			}
		}
	}

</style>
