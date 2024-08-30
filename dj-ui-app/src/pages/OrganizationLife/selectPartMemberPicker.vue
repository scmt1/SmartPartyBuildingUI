<template>
	<!-- <view style="height: 500px;"> -->

		<u-popup :show="show" mode="center" @close="popupClose" @open="popupOpen">
			<view class="popup-content">
				<view class="popup-title">
					<view class="name">添加拟{{ label }}人员</view>
					<view class="selectAll" @click="selectAllPartyMember()">
						<radio value="all" :checked="isAllPartyMember" color="rgba(225, 53, 27, 1)">全选</radio>
					</view>
				</view>

				<view style="overflow-y: auto; margin-top: 10rpx;">
					<label class="list" v-for="(item, index) in partyMemberList" :key="index" @click="selectPartyMember(item)">
						<view class="img">
							<image v-if="item.avatar && item.avatar.length > 0" mode="aspectFill" :src="item.avatar"></image>
							<image v-else mode="aspectFill" src="@/static/images/user/default-avatar.png"></image>
						</view>
						<view class="name">
							{{ item.realName }}
						</view>
						<view>
							<radio :value="item.id +''" :checked="item.checked" color="rgba(225, 53, 27, 1)"/>
						</view>
					</label>
				</view>

				<view class="initiateMeeting-box">
					<view class="initiateMeeting" @click="popupOk()">
						确认添加
					</view>
				</view>
			</view>
		</u-popup>
	<!-- </view> -->
</template>

<script>
import {queryOneselfPartyMemberList} from '@/api/partyMember'
import util from '@/utils/util'
export default {
	name: 'selectPartMemberPicker',
	props: {
		label: {
			type: String,
			default: ''
		},
		deptId: {
			type: String,
			default: ''
		},
		selectPartyMemberList: {
			type: Array,
			default: []
		},
		popupShow: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			show: false,
			partyMemberList: [],
			isAllPartyMember: false,
			selectPartyMemberNum: 0,
			base: util.jcxfUrl
		}
	},
	watch: {
		popupShow() {
			if (this.popupShow) {
				this.selectPartyMemberNum = 0
				this.partyMemberList = []
				this.isAllPartyMember = false
				this.show = true
			}
		}
	},
	methods: {
		getAllPartMemberList() {
			let data = {
				deptId: this.deptId,
				delFlag: 0
			}
			queryOneselfPartyMemberList({ data: data }).then(res =>{
				if (res.code == '00000') {
					let data =  res.data
					for (let i = 0; i < data.length; i++) {
					    if(data[i].avatar){
                            data[i].avatar = data[i].avatar.replace("http://10.4.117.31:7000", util.minionUrl);
                        }
						for (let n = 0; n < this.selectPartyMemberList.length; n++) {
							if (data[i].id == this.selectPartyMemberList[n].id) {
								data[i].checked = true
								this.selectPartyMemberNum++
							}
						}
					}

					if (this.selectPartyMemberNum == data.length) {
						this.isAllPartyMember = true
					}

					this.partyMemberList = data
				}
			})
		},
		popupClose() {
			this.$emit('close')

			this.isAllPartyMember = false
			/* for (let i = 0; i < this.partyMemberList.length; i++) {
				if (this.partyMemberList[i].checked) {
					this.partyMemberList[i].checked = false
				}
			} */
			this.selectPartyMemberNum = 0
			this.show = false

		},
		popupOpen() {
			this.getAllPartMemberList()
		},
		selectAllPartyMember() {
			if (!this.isAllPartyMember) {
				this.isAllPartyMember = true
				for (let i = 0; i < this.partyMemberList.length; i++) {
					if (!this.partyMemberList[i].checked) {
						this.partyMemberList[i].checked = true
					}
				}

				this.selectPartyMemberNum = this.partyMemberList.length
			} else {
				this.isAllPartyMember = false
				for (let i = 0; i < this.partyMemberList.length; i++) {
					if (this.partyMemberList[i].checked) {
						this.partyMemberList[i].checked = false
					}
				}

				this.selectPartyMemberNum = 0
			}
		},
		selectPartyMember(value) {
			value.checked = !value.checked
			if (value.checked) {
				this.selectPartyMemberNum++
			} else {
				this.selectPartyMemberNum--
			}

			if (this.selectPartyMemberNum == this.partyMemberList.length) {
				this.isAllPartyMember = true
			} else if (this.selectPartyMemberNum < this.partyMemberList.length) {
				this.isAllPartyMember = false
			}

			this.$forceUpdate()
		},
		popupOk() {
			let select = []

			for (let i = 0; i < this.partyMemberList.length; i++) {
				if (this.partyMemberList[i].checked) {
					select.push(this.partyMemberList[i])
				}
			}

			if (select.length == 0) {
				uni.$u.toast('请选择拟参会人员')
				return
			}

			this.$emit('returnSelect', select)

			this.show = false
		}
	}
}
</script>

<style lang="scss" scoped>

	.popup-content {
		margin-top: 20rpx;
		width: calc(100vw - 45rpx);
		padding: 15rpx 25rpx;
		display: flex;
		flex-direction: column;
		// height: 50%;
		max-height: calc(100vh - 150rpx);
		.popup-title {
			display: flex;
			.name {
				font-weight: bold;
				flex: 1;
				font-size: 30rpx;
			}
			.selectAll {
				color: rgb(225, 53, 27);
			}
		}

		.list {
			display: flex;
			align-items: center;
			margin-top: 15rpx;

			.img {
				border-radius: 50%;
				overflow: hidden;
				width: 120rpx;
				height: 120rpx;
			}
			.name {
				font-size: 26rpx;
				padding-left: 30rpx;
				flex: 1;
			}
		}
	}

	.initiateMeeting-box {
		margin: 40rpx 0 20rpx 0;
		padding: 0 80rpx;

		.initiateMeeting {
			width: 100%;
			border-radius: 10rpx;
			padding: 20rpx;
			text-align: center;
			color: #fff;
			font-weight: bold;
			font-size: 30rpx;
			background: rgb(225, 53, 27);
		}
	}

	::v-deep .u-popup__content {
		border-radius: 10rpx;
	}
</style>
