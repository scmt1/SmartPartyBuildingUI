<template>
	<view v-loading="loading">

		<view style="padding: 30rpx 25rpx 0 25rpx;">

			<view v-if="dataList.length > 0" :class="item.acceptStatus == 0 ? 'log-list-box wait': 'log-list-box over'" v-for="(item, index) in dataList" :key="index">
				<view class="left">
					<view>
						<text v-if="item.transferType == 1">
							从“{{ item.oldTzSysDept?item.oldTzSysDept.name:'' }}”转移到“{{ item.newTzSysDept.name }}”
						</text>
						<text v-else-if="item.transferType == 2">
							从“{{ item.oldTzSysDept.name }}”转移到“{{ item.areaName != null?item.areaName.replaceAll(',',''):'' }}{{ item.inBranchName }}”
						</text>
					</view>
					<view class="time">
						<text>{{ item.createDate }}</text>
					</view>
				</view>
				<view>
					<view :class="item.acceptStatus == 0 ?'wait-button': 'over-button'">
						{{ getDirectLabelByValue(item.acceptStatus, transferStatus) }}
					</view>
				</view>
			</view>
      <empty v-if="dataList.length == 0" text="暂无记录"></empty>

			<view v-if="moreFlag" style="margin: 20rpx 0;">
				<loadingIcon></loadingIcon>
			</view>
			<loadMore v-else style="margin: 20rpx 0;" :status="loadmoreStatus" @loadmore="loadmore()"></loadMore>

		</view>


	</view>
</template>

<script>
// import {getDictByType} from "@/api/tDictData"
import {getDictByCode} from "@/api/jcxfSysDictionary"
import {getTransferPageByPartyMemberId} from '@/api/partyMemberDeptTransferLog'
import loadMore from '@/components/loadMore/index'
import loadingIcon from '@/components/loadingIcon/index.vue'
import { mapGetters, createNamespacedHelpers } from 'vuex'
import {distinctData, getLoadmoreStatus} from '@/utils/pageUtil'
import empty from '@/components/empty/index.vue'

const { mapState, mapMutations } = createNamespacedHelpers('user')

export default {
	name: "transferLog",
	components: {
		loadMore,
		loadingIcon,
    empty
	},
	data() {
		return {
			search: {
				partyMemberDeptTransferLog: {
					partyId: ''
				},
				pageVo: {
					pageNumber: 1,
					pageSize: 10
				}
			},
			dataList: [],
			loadmoreStatus: 'loadmore',
			moreFlag: false,
			transferStatus: [],
			pageInfoIds: []
		}
	},
	created() {
		/*try {
			xm.setNavigationBarTitle({title: "转接记录"});
		} catch (error) {
			document.title = "转接记录";
		}*/
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
		this.init()
		this.setLoading(false);
	},
	onLoad(){
		this.setLoading(true);
	},
	methods: {
		...mapMutations(['setLoading']),
		async init() {
			await this.getDict('partyTransferAcceptStatus')
			this.getTransferPage()
		},
		getDict(type) {
			return new Promise((resolve, reject) => {
				getDictByCode(type).then(res => {
					if (type === 'partyTransferAcceptStatus') {
						this.transferStatus = res.data
					}
					resolve(res)
				})
			})
		},
		loadmore() {
			if (this.moreFlag) {
				return
			}
			this.moreFlag = true
			this.search.pageVo.pageNumber++
			this.getTransferPage()
		},
		getTransferPage() {
			this.search.partyMemberDeptTransferLog.partyId = this.userInfo.id
			let data = {
				partyMemberDeptTransferLog: this.search.partyMemberDeptTransferLog,
				pageVo: this.search.pageVo
			}
			getTransferPageByPartyMemberId({data: data}).then(res => {
				if (res.code == '00000') {
					let {ids, resultData} = distinctData(this.pageInfoIds, res.data.records)
					this.pageInfoIds = ids
					this.dataList = this.dataList.concat(resultData)
					this.loadmoreStatus = getLoadmoreStatus(this.dataList, res.data)
					
					/* this.dataList = this.dataList.concat(res.data.records)
					if (this.dataList.length < res.data.total && res.data.total > 0 && res.data.total > 0) {
						this.status = 'loadmore'
					} else {
						this.status = 'nomore'
					} */

				}
				this.moreFlag = false
			})
		},
		getDirectLabelByValue(value, direct) {
		  if (!value) {
		    return
		  }
			for (let i = 0; i < direct.length; i++) {
				if (value == direct[i].itemValue) {
						return direct[i].label
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.log-list-box {
	border-radius: 10rpx;
	overflow: hidden;
	padding: 30rpx 20rpx;
	font-size: 28rpx;
	line-height: 40rpx;
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;

	.left {
		flex: 1;
		padding-right: 20rpx;

		.time {
			margin-top: 30rpx;
			font-size: 26rpx;
		}
	}


	.wait-button {
		color: white;
		width: 141rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border-radius: 10rpx;
		background: rgba(225, 53, 27, 1);
	}

	.over-button {
		color: rgba(199, 144, 69, 1);
		width: 141rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border-radius: 10rpx;
		background: rgba(255, 247, 241, 1);
	}

}

.wait {
	background-image: url(@/static/images/partyMemberDeptTransfer/bg-wait.png);
	background-size: 100% 100%;
	color: rgba(184, 31, 7, 1);
}

.over {
	background-image: url(@/static/images/partyMemberDeptTransfer/bg-over.png);
	background-size: 100% 100%;
	color: rgba(199, 144, 69, 1);

}
</style>
