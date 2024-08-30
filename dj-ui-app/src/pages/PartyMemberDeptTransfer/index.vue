<template>
	<view v-loading="loading">
		<view class="content-box">
			<view class="u-demo-block__content">
				<u--form labelPosition="left" labelWidth="260rpx" :labelStyle="labelStyle" :model="form" ref="uForm">

					<view class="title">
						<view class="text">基本信息</view>
						<view class="button" @click="$handlerNavigate({ url: '/pages/PartyMemberDeptTransfer/transferLog' })">转接记录</view>
					</view>

					<u-form-item class="item" label="党员姓名" borderBottom>
						<u--input fontSize="32rpx" v-model="userInfo.realName" disabled disabledColor="#ffffff" border="none" placeholder="请输入党员姓名"></u--input>
					</u-form-item>

					<u-form-item class="item" label="身份证号" borderBottom>
						<u--textarea autoHeight v-model="userInfo.idcard" disabled style="background-color: white; padding: 0; font-size: 32rpx;" border="none" placeholder="请输入身份证号"></u--textarea>
					</u-form-item>

					<u-form-item class="item" label="现所在支部" borderBottom>
						<u--textarea autoHeight v-model="userInfo.deptName" disabled style="background-color: white; padding: 0; font-size: 32rpx;" border="none" placeholder="请输入现所在支部名称"></u--textarea>
					</u-form-item>

					<view v-if="!waitFlag">
						<view class="item title">目标支部</view>
						<view class="item" style="display: flex;">
							<view @click="typeChange(1)" style="position: relative; width: 35rpx;">
								<radio style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" :checked="form.transferType == 1?true:false" color="rgba(225, 53, 27, 1)" />
							</view>
							<view style="flex: 1; padding-left: 10rpx;">
								<u-form-item label="市内" borderBottom @click="popupShow = true">
									<u--textarea autoHeight style="pointer-events: none; background-color: white; padding: 0; font-size: 32rpx;" v-model="view.deptName" border="none" disabled placeholder="请输入本市支部名称搜索"></u--textarea>
									<u-icon style="padding-left: 5rpx;" size="28rpx" slot="right" name="arrow-right"></u-icon>
								</u-form-item>
							</view>
						</view>

						<view style="display: flex;">
							<view @click="typeChange(2)" style="position: relative; width: 35rpx;">
								<radio style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" :checked="form.transferType == 2?true:false" color="rgba(225, 53, 27, 1)" />
							</view>
							<view style="flex: 1; padding-left: 10rpx;">
								<u-form-item label="市外" @click="openSelectArea">
									<u--input style="pointer-events: none;" fontSize="32rpx" v-model="form.areaName" disabled disabledColor="#ffffff" border="none" placeholder="请选择区域"></u--input>
								</u-form-item>
							</view>
						</view>

						<view style="margin-bottom: 100rpx; padding-left: 45rpx;">
							<u-form-item class="item" borderBottom>
								<u--input fontSize="32rpx" v-model="form.inBranchName" border="none" placeholder="请输入市外组织全称"></u--input>
							</u-form-item>
						</view>

						<view :class="!subFlag?'bottom-button1': 'bottom-button2'" @click="confirmApplay()">
							转接组织关系
						</view>
					</view>


					<view v-if="waitFlag">
						<view class="item title">转接申请</view>
						<view class="log-list-box wait">
							<view class="left">
								<view>
									<text v-if="view.transferLog.transferType == 1">
										从“{{ view.transferLog.oldTzSysDept.name }}”转移到“{{ view.transferLog.newTzSysDept.name }}”
									</text>
									<text v-else-if="view.transferLog.transferType == 2">
										从“{{  view.transferLog.oldTzSysDept.name }}”转移到“{{ view.transferLog.areaName + view.transferLog.transferAddress }}”
									</text>
								</view>
								<view style="margin-top: 30rpx; font-size: 26rpx;">
									<text>{{ view.transferLog.createDate }}</text>
								</view>
							</view>
							<view>
								<view class="wait-button">
									待处理
								</view>
							</view>
						</view>
						<view class="bottom-button2" @click="confirmPickerShow = true">
							撤回转接申请
						</view>
					</view>

				</u--form>
			</view>
		</view>

		<u-popup closeable customStyle="max-height: calc(100% - 105rpx); border-radius: 10rpx" :show="popupShow" mode="center" @close="popupShow = false">
			<view class="popup-content" style="height: 100%;">
					<view>
						<u--form labelPosition="left" labelWidth="260rpx" :labelStyle="labelStyle" :model="search" ref="uForm2">
							<u-form-item label="支部名称" borderBottom>
								<u--input focus fontSize="32rpx" v-model="search.deptName" border="none" placeholder="请输入本市支部名称搜索" @change="inputChange"></u--input>
							</u-form-item>
						</u--form>
					</view>

					<view style="margin-top: 40rpx; flex; 1; overflow: auto;">
						<view v-if="deptList.length == 0 && !loading" style="text-align: center; color: rgb(192, 196, 204);">
							暂无搜索结果
						</view>
						<u-loading-icon v-if="loading" mode="semicircle"></u-loading-icon>
						<view v-else>
							<template v-for="(item, index) in deptList">
								<view :class="search.selectedInfo == item?'deptInfo active':'deptInfo'" @click="selectDept(item)">
									{{ item.name }}
									<view  style="display: inline-block;">
										<u-icon v-if="search.selectedInfo == item" name="checkbox-mark" color="rgba(225, 53, 27, 1)" size="28rpx"></u-icon>
									</view>
									<u-divider text=""></u-divider>
								</view>
							</template>
						</view>
					</view>

					<view class="button" @click="chooseDept()">
						<text v-if="Object.keys(search.selectedInfo).length > 0">确定</text>
						<text v-else>关闭</text>
					</view>

			</view>
		</u-popup>

		<uni-popup ref="areaPopup" type="bottom" background-color="#fff">
			<select-area :maxLevel="3" :closeButton="true" :defaultAreaName="[]" :defaultAreaId="[]" @confirm="selectAreaConfirm" @close="selectAreaClose"></select-area>
		</uni-popup>

		<!-- <addressPicker :show="addressPickerShow"
			:indexs="address.indexs"
			:areaId="address.areaId"
			:closeOnClickOverlay="true"
			:addressData="address.addressData"
			@confirm="addressConfirm"
			@close="addressPickerShow = false"
		></addressPicker> -->

		<confirmPicker :show="confirmApplay1" :title="'市内申请需要审核，确定要提交吗？'" @close="confirmApplay1 = false" @confirm="confirmApplay1 = false; save()"></confirmPicker>
		<confirmPicker :show="confirmApplay2" :title="'市外申请无需审核，账号将停止使用，确定要提交吗？'" @close="confirmApplay2 = false" @confirm="confirmApplay2 = false; save()"></confirmPicker>
		<confirmPicker :show="confirmPickerShow" :title="'确定要撤回转接申请吗？'" @close="confirmPickerShow = false" @confirm="cancelTransfer()"></confirmPicker>

	</view>
</template>

<script>
import {getAllDeptListByName} from '@/api/tzSysDept'
import {addPartyMemberDeptTransfer, getTransferPageByPartyMemberId, delPartyMemberDeptTransfer} from '@/api/partyMemberDeptTransferLog'
import confirmPicker from '@/components/confirmPicker/index'
import addressPicker from '@/uni_modules/address-picker/components/address-picker/address-picker'
import selectArea from '@/components/select-area/index'
import _ from 'lodash'
import { mapGetters, createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('user')
import {removeLocalStorageInfo} from '@/utils/localStorageInfo'

export default {
	name:"index",
	components: {
		confirmPicker,
		addressPicker,
		selectArea
	},
	data() {
		return {
			labelStyle: {
				fontSize: '32rpx',
			},
			form: {
				partyId: '',
				outBranchId: '',
				inBranchId: '',
				areaId: '',
				areaName: '',
				transferType: 1, // 转移类型(1:市内,2:市外)
				inBranchName: ''
			},
			view: {
				deptName: '',
				transferLog: {
					oldTzSysDept: {},
					newTzSysDept: {}
				},
				area: ''
			},
			subFlag: false,
			waitFlag: false,
			search: {
				deptName: '',
				selectedInfo: {},
				partyMemberDeptTransferLog: {
					partyId: '',
					acceptStatus: 0 // 处理状态(0:待处理,1:接收,2：打回)
				},
				pageVo: {
					pageNumber: 1,
					pageSize: 1
				}
			},
			popupShow: false,
			deptList: [],
			loading: false,
			confirmPickerShow: false,
			addressPickerShow: false,
			address: {
				indexs: [0, 0, 0],
				areaId: [],
				addressData: []
			},
			confirmApplay1: false,
			confirmApplay2: false
		}
	},
	watch: {
		'form': {
			handler(newValue, oldValue) {
				if (this.form.partyId.toString().length > 0 && this.form.outBranchId.toString().length > 0) {
					if (this.form.transferType == 1) {
						if (this.form.inBranchId.length > 0) {
							this.subFlag = true
							return
						}
					} else if (this.form.transferType == 2) {
						if (this.form.areaId.toString().length > 0 && this.form.inBranchName.toString().length > 0) {
							this.subFlag = true
							return
						}
					}
				}
				this.subFlag = false
			},
			deep: true
		},
	},
	computed: {
		...mapGetters([
			'userInfo'
		]),
		/* ...mapState([
			'loading'
		]) */
	},
	created() {
		/*try {
			xm.setNavigationBarTitle({title: "组织关系转接"});
		} catch (error) {
			document.title = "组织关系转接";
		}*/
	},
	onReady() {
		this.setForm()
		this.getTransferPage()
		this.setLoading(false);
	},
	onLoad(){
		this.setLoading(true);
	},
	methods: {
		...mapMutations(['setLoading']),
		/* addressConfirm(e) {
			this.form.areaName = e.value[0] + ' - ' + e.value[1] + ' - ' +e.value[2]
			this.form.areaId = e.areaId[2]

			this.address.indexs = e.indexs
			this.address.areaId = e.areaId
			this.address.addressData = e.value
			this.addressPickerShow = false
		}, */
		confirmApplay() {
			if (this.form.transferType == '1') {
				this.confirmApplay1 = true
			} else if (this.form.transferType == '2') {
				this.confirmApplay2 = true
			}
		},
		openSelectArea() {
			this.$refs.areaPopup.open()
		},
		selectAreaConfirm(e) {
			this.form.areaName = e.areaName
			this.form.areaId = e.areaId
			this.$refs.areaPopup.close()
		},
		selectAreaClose() {
			this.$refs.areaPopup.close()
		},
		getTransferPage() {
			this.search.partyMemberDeptTransferLog.partyId = this.userInfo.id
			let data = {
				partyMemberDeptTransferLog: this.search.partyMemberDeptTransferLog,
				pageVo: this.search.pageVo
			}
			getTransferPageByPartyMemberId({data: data}).then(res => {
				if (res.code == '00000') {
					if (res.data.records.length > 0) {
						this.view.transferLog = res.data.records[0]
						this.waitFlag = true
					} else {
						this.view.transferLog = {
							oldTzSysDept: {},
							newTzSysDept: {}
						}
						this.waitFlag = false
					}
				}
			})
		},
		setForm() {
			this.form.partyId = this.userInfo.id + ''
			this.form.outBranchId = this.userInfo.deptId + ''
		},
		typeChange(type) {
			this.form.transferType = type
		},
		inputChange() {
			if (this.search.deptName != '' && this.search.deptName.length > 0) {
				this.loading = true
				this.throttledMethod(this)
			}
		},
		throttledMethod: _.debounce(_this => {
				_this.getDeptList()
		}, 2000),
		getDeptList() {
			let data = {
				deptName: this.search.deptName,
				deptId: this.userInfo.deptId + '',
				typeList: [631, 632, 931, 932]
			}
			getAllDeptListByName(data).then(res =>{
				this.loading = false
				if (res.code == '00000') {
					this.deptList = res.data
				}
			})
		},
		selectDept(item) {
			if (item.id != this.userInfo.deptId) {
				this.search.selectedInfo = item
			} else {
				uni.showToast({
					icon: 'none',
					title: '不可选择当前自身所在部门',
					duration: 3000
				})
			}
		},
		chooseDept() {
			if (Object.keys(this.search.selectedInfo).length > 0) {
				this.form.inBranchId = this.search.selectedInfo.id +''
				this.view.deptName = this.search.selectedInfo.name +''
				this.setForm()
			}

			this.popupShow = false
		},
		save() {
			if (!this.subFlag) {
				return
			}
			let data = {
				partyMemberDeptTransferLog: this.form,
				deptId: this.userInfo.deptId + ''
			}
			data.partyMemberDeptTransferLog.createBy = this.userInfo.id
			addPartyMemberDeptTransfer({ data: data }).then(res => {
				if(res.code == '00000') {
					uni.showToast({
						icon: 'success',
						title: '提交成功！',
						duration: 2000
					})
					if (this.form.transferType == '1') {
						this.getTransferPage()
					} else if (this.form.transferType == '2') {
						// 市外清除缓存
						let _this = this
						setTimeout(function() {
						  removeLocalStorageInfo('userInfo')
						  removeLocalStorageInfo('token')
						  _this.$store.dispatch('user/setUserInfo', {})
						  lightAppJssdk.navigation.close ({
						  	success:function(data){//成功回调
						  	},
						  	fail:function(data){//错误返回
						  	}
						  })
						}, 2000)
					}
				} else {
					uni.showToast({
						icon: 'none',
						title: res.msg,
						duration: 4000
					})
				}
			})
		},
		cancelTransfer() {
			this.confirmPickerShow = false
			delPartyMemberDeptTransfer(this.view.transferLog.id).then(res =>{
				if (res.code == '00000') {
					uni.showToast({
						icon: 'success',
						title: '撤回成功！',
						duration: 2000
					})
					this.getTransferPage()
				} else {
					uni.showToast({
						icon: 'none',
						title: res.msg,
						duration: 2000
					})
				}
			})
		}
	}
}
</script>


<style lang="scss" scoped>
::v-deep .u-textarea__field {
		font-size: 32rpx;
	}
	.popup-content {
		width: calc(100vw - 45rpx);
		padding: 50rpx 25rpx;
		display: flex;
		flex-direction: column;
		line-height: 30rpx;

		.deptInfo {
			font-size: 26rpx;
			margin-bottom: 20rpx;
		}

		.active {
			font-weight: 700;
		}

		.button {
			margin-top: 40rpx;
			text-align: center;
			color: white;
			font-weight: 700;
			height: 80rpx;
			width: 100%;
			line-height: 80rpx;
			font-size: 30rpx;
			background: rgba(225, 53, 27, 1);
			border-radius: 10rpx;
		}
	}

	::v-deep .uni-radio-input {
		height: 30rpx;
		width: 30rpx;
	}

	.item {
		margin-top: 25rpx;
	}

	.log-list-box {
		margin-top: 20rpx;
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
	}

	.wait {
		background-image: url(@/static/images/partyMemberDeptTransfer/bg-wait.png);
		background-size: 100% 100%;
		color: rgba(184, 31, 7, 1);
	}

	.content-box {
		padding: $content-box-padding;

		.title {
			display: flex;
			padding-top: 35rpx;
			font-size: 32rpx;
			font-weight: bold;

			.text {
				flex: 1;
			}

			.button {
				font-size: 26rpx;
				width: 142rpx;
				height: 56rpx;
				line-height: 56rpx;
				text-align: center;
				color: white;
				background: rgba(225, 53, 27, 1);
				border-radius: 10rpx;
			}
		}

		.bottom-button1 {
			//border: 7rpx solid rgb(242, 75, 192);
			margin: auto;
			text-align: center;
			color: white;
			font-weight: 700;
			height: 80rpx;
		  width: 567rpx;
			line-height: 80rpx;
			font-size: 30rpx;
			background: rgba(240, 154, 140, 1);
			border-radius: 10rpx;
		}

		.bottom-button2 {
			//border: 7rpx solid rgb(242, 75, 192);
			margin: auto;
			text-align: center;
			color: white;
			font-weight: 700;
			height: 80rpx;
		  width: 567rpx;
			line-height: 80rpx;
			font-size: 30rpx;
			background: rgba(225, 53, 27, 1);
			border-radius: 10rpx;
		}
	}
</style>
