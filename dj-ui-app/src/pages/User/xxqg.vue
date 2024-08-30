<template>
	<view v-loading="loading">
		<view style="position: relative;">
			<image mode="widthFix" src="@/static/images/user/xxqg-top.png"></image>
			<view class="introduce">
				<view class="text1">学习强国积分排名</view>
				<view class="text2">
					<image class="img" mode="widthFix" src="@/static/images/user/zz-icon.png"></image>
					所属党组织
				</view>
				<view class="text3">{{ userInfo.deptName }}</view>
			</view>
		</view>
		<view class="title">
			<view class="h1">排名</view>
			<view class="h2">党组织名称</view>
			<view class="h3">学员参与度</view>
			<view class="h4">人均积分</view>
		</view>
		<view class="list" v-for="(item, index) in data" :key="index">
			<view class="h1">
				<view v-if="item.sort == 1">
					<image class="image" mode="aspectFit" src="@/static/images/user/huangjin.png"></image>
				</view>
				<view v-else-if="item.sort == 2">
					<image class="image" mode="aspectFit" src="@/static/images/user/baiyin.png"></image>
				</view>
				<view v-else-if="item.sort == 3">
					<image class="image" mode="aspectFit" src="@/static/images/user/qingtong.png"></image>
				</view>
				<view v-else style="text-align: center;">
					{{ item.sort }}
				</view>
			</view>
			<view class="h2">
				{{ item.deptName }}
			</view>
			<view class="h3">
				{{ item.activePercent != null && item.activePercent != '' ? formatFloat(item.activePercent)+'%' : '0.00%'}}
			</view>
			<view class="h4">
				<view v-if="item.sort == 1" class="first">
					{{ item.averageScore }}
				</view>
				<view v-else-if="item.sort == 2" class="second">
					{{ item.averageScore }}
				</view>
				<view v-else-if="item.sort == 3" class="third">
					{{ item.averageScore }}
				</view>
				<view v-else>
					{{ item.averageScore }}
				</view>
			</view>
		</view>

		<loadMore :status="status" @loadmore="loadmore()"></loadMore>
	</view>
</template>

<script>
import loadMore from '@/components/loadMore/index.vue'
import {queryByPage} from '@/api/tzXxxqg'
import { mapGetters, createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('user')

export default {
	name: 'xxqg',
	components: {
		loadMore
	},
	data() {
		return {
			pageVo: {
				pageNumber: 1,
				pageSize: 20
			},
			status: 'loadmore',
			data: [],
			moreFlag: false
		}
	},
	computed: {
		...mapGetters([
			'userInfo'
		]),
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
	created() {
		/*try {
			xm.setNavigationBarTitle({title: "党组织强国积分排名"});
		} catch (error) {
			document.title = "党组织强国积分排名";
		}*/
		this.data = []
		this.getList()
	},
	methods: {
		...mapMutations(['setLoading']),
		loadmore() {
			if (this.moreFlag) {
				return
			}
			this.moreFlag = true
			this.pageVo.pageNumber++
			this.getList()
		},
		getList() {
			let data = this.pageVo

			queryByPage({data: data}).then(res => {
				this.moreFlag = false
				if (res.code == '00000') {
					this.data = this.data.concat(res.data.records)

					if (this.data.length < res.data.total) {
						this.status = 'loadmore'
					} else {
						this.status = 'nomore'
					}
				}
			})
		},
		formatFloat(num) {
			let n = 2
			let a = num.toString().split('.')
			if (a.length === 2 && a[1].toString().length > 2) {
					n = a[1].toString().length - 2
			}

			num = num * 100

			let f = parseFloat(num)
			if (isNaN(f)) return false
			f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); // floor 舍 round 四舍五入 ceil 入
			let s = f.toString()
			let rs = s.indexOf('.')
			//判定如果是整数，增加小数点再补0
			if (rs < 0) {
					rs = s.length
					s += '.'
			}
			while (s.length <= rs + n) {
					s += '0'
			}
			return s
		}
	}
}
</script>

<style lang="scss" scoped>
.introduce {
	color: white;
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	padding-left: 50rpx;
	padding-right: 250rpx;

	.text1 {
		font-size: 40rpx;
		font-weight: 700;
	}

	.text2 {
		margin-top: 20rpx;
		display: flex;
		font-size: 26rpx;
		align-items: center;
		line-height: 40rpx;

		.img {
			width: 20rpx;
			margin-right: 10rpx;
		}
	}

	.text3 {
		padding-left: 30rpx;
		font-size: 26rpx;
		line-height: 40rpx;
	}
}

.title {
	display: flex;
	font-size: 28rpx;
	font-weight: 700;
	text-align: center;
	padding: 0 10rpx;
	margin-top: 16rpx;
	.h1 {
		width: 80rpx;
	}

	.h2 {
		flex: 1;
	}

	.h3 {
		width: 150rpx;
	}

	.h4 {
		width: 140rpx;
	}
}

.list {
	display: flex;
	text-align: center;
	font-size: 28rpx;
	margin-top: 25rpx;
	margin-bottom: 40rpx;
	align-items: flex-start;
	padding: 0 10rpx;

	.h1 {
		text-align: left;
		width: 80rpx;
		font-weight: 900;
		.image {
			width: 75rpx;
			height: 60rpx;
		}
	}

	.h2 {
		flex: 1;
		text-align: left;
	}

	.h3 {
		width: 150rpx;
	}

	.h4 {
		width: 140rpx;
		color: rgba(224, 42, 29, 1);

		.first {
			color: rgba(253, 182, 58, 1);
		}

		.second {
			color: rgba(97, 119, 217, 1);
		}

		.third {
			color: rgba(170, 88, 64, 1);
		}
	}
}
</style>
