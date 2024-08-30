<template>
	<view style="padding: 25rpx 0 0 0; display: flex; flex-direction: column;">

		<!-- <view class="button-box">
			<view class="button">
				应缴日期按年
				<u-icon class="icon" size="20rpx" color="red" name="arrow-down-fill"></u-icon>
			</view>
			<view class="button">
				应缴日期按月
				<u-icon class="icon" size="20rpx" color="red" name="arrow-down-fill"></u-icon>
			</view>
		</view> -->

		<view style="flex: 1 0 auto; height: 0; width: 100%; overflow: auto;">
			<view :class="index == 0?'list': 'list top'" v-for="(item, index) in dataList" :key="index">
				<view class="title-box">
<!--					<image class="title-icon" mode="widthFix" src="@/static/images/CostPayment/icon.png"></image>-->
					<text class="title-text">{{ formartDate(item.payMonth, 'yyyy年MM月') }}应缴费用</text>
				</view>
				<view class="content-box">
					<view class="content-title">
						<view class="title">交纳金额</view>
						<view>{{ item.actuallyPay.toFixed(2) }}</view>
					</view>
					<view class="content-title">
						<view class="title">所属党支部</view>
						<view style="flex: 1;">{{ item.deptName }}</view>
					</view>
					<view class="content-title" v-if="item.isInsteadPay == '1'">
						<view class="title">代缴人</view>
						<view style="flex: 1;">{{ item.insteadPayPartyMemberName }}</view>
					</view>
					<view class="content-title">
						<view class="title">支付日期</view>
						<view>{{ formartDate(item.payTime, 'yyyy-MM-dd HH:mm:ss') }}</view>
					</view>
				</view>
			</view>
			<view style="margin-top: 20rpx;" v-if="moreFlag">
				<loadingIcon></loadingIcon>
			</view>
			<loadMore v-else :status="loadmoreStatus" @loadmore="loadmore()"></loadMore>
		</view>

	</view>
</template>

<script>
import {getPayFeeDetailPageByPartyMember} from '@/api/payFeeDetail'
import loadMore from '@/components/loadMore/index'
import {distinctData, getLoadmoreStatus} from '@/utils/pageUtil'
import loadingIcon from '@/components/loadingIcon/index.vue'

import { mapGetters } from 'vuex'

export default {
	name:"costLog",
	components: {
		loadMore,
		loadingIcon
	},
	data() {
		return {
			pageSize: 10,
			pageNum: 1,
			dataList: [],
			moreFlag: false,
			loadmoreStatus: 'loadmore',
			pageInfoIds: []
		}
	},
	computed: {
		...mapGetters([
			'userInfo'
		])
	},
	mounted() {
		this.getPayFeeDetail()
	},
	methods: {
		loadmore() {
			if (this.moreFlag) {
				return
			}
			this.moreFlag = true
			this.pageNum++
			this.getPayFeeDetail()
		},
		getPayFeeDetail() {
			let data = {
				partyMemberId: this.userInfo.id + '',
				status: '1',
				// isInsteadPay: '0',
				pageVo: {
					pageNumber: this.pageNum,
					pageSize: this.pageSize
				},
				orderBy: 'pay_time'
			}
			getPayFeeDetailPageByPartyMember({data: data}).then(res => {
				this.moreFlag = false
				if (res.code == '00000') {
					let {ids, resultData} = distinctData(this.pageInfoIds, res.data.records)
					this.pageInfoIds = ids
					this.dataList = this.dataList.concat(resultData)
					this.loadmoreStatus = getLoadmoreStatus(this.dataList, res.data)

					/* this.dataList = this.dataList.concat(res.data.records)
					if (this.dataList.length < res.data.total && res.data.total > 0) {
						this.status = 'loadmore'
					} else {
						this.status = 'nomore'
					} */
				}
			})
		},
		formartDate(date, fmt) {
			if (date == undefined || date == null || date.toString().trim().length <= 0) {
					return ''
			}
			if (typeof date === 'string') {
					date = new Date(date)
			}
			date = date == undefined ? new Date() : date
			date = typeof date == 'number' ? new Date(date) : date
			fmt = fmt || 'yyyy-MM-dd HH:mm:ss'
			let obj = {
					'y': date.getFullYear(), // 年份，注意必须用getFullYear
					'M': date.getMonth() + 1, // 月份，注意是从0-11
					'd': date.getDate(), // 日期
					'q': Math.floor((date.getMonth() + 3) / 3), // 季度
					'w': date.getDay(), // 星期，注意是0-6
					'H': date.getHours(), // 24小时制
					'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
					'm': date.getMinutes(), // 分钟
					's': date.getSeconds(), // 秒
					'S': date.getMilliseconds() // 毫秒
			}
			let week = ['天', '一', '二', '三', '四', '五', '六']
			for (var i in obj) {
					fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
							var val = obj[i] + ''
							if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val]
							for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
							return m.length == 1 ? val : val.substring(val.length - m.length)
					})
			}

			return fmt
		}
	}
}
</script>

<style lang="scss" scoped>
	.button-box {
		height: 50rpx;

		.button {
			font-size: 28rpx;
			border: 1px solid red;
			color: red;
			display: inline-block;
			margin-left: 15rpx;
			padding: 12rpx 30rpx 12rpx 15rpx;
			float: right;
			position: relative;
			border-radius: 5rpx;

			.icon {
				position: absolute;
				right: 5rpx;
				top: 50%;
				transform: translateY(-50%);
			}
		}

	}



	.list {
		background: rgb(249, 249, 249);
		border-radius: 10rpx;
		padding: 25rpx;

		.title-box {
			display: flex;

			.title-icon {
				width: 37rpx;
			}

			.title-text {
				//margin-left: 20rpx;
				font-size: 28rpx;
				font-weight: 700;
			}
		}

		.content-box {
			margin-top: 10rpx;
			line-height: 45rpx;
			color: rgb(92, 92, 92);
			font-size: 28rpx;

			.content-title {
				display: flex;

				.title {
					width: 170rpx;
				}
			}
		}

	}

	.top {
		margin-top: 30rpx;
	}
</style>
