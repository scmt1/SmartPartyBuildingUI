<template>
	<view v-loading="loading">
		<view style="padding: 25rpx;">
			<u--form labelPosition="top" :model="form" :labelStyle="labelStyle" :rules="rules" ref="uForm" :labelWidth="labelWidth">

				<u-form-item label="流出党支部" prop="deptName" :borderBottom="borderBottom" >
					<u--input fontSize="30rpx" v-model="form.deptName" :disabled="true" disabledColor="#ffffff" border="none"></u--input>
				</u-form-item>

				<u-form-item class="item" label="姓名" prop="realName"  :borderBottom="borderBottom" >
					<u--input fontSize="30rpx" v-model="form.realName" :disabled="true" disabledColor="#ffffff" border="none"></u--input>
				</u-form-item>

				<u-form-item class="item" label="民族" prop="national"  :borderBottom="borderBottom" >
					<u--input fontSize="30rpx" v-model="form.nationalTitle" :disabled="true" disabledColor="#ffffff" border="none"></u--input>
				</u-form-item>

				<u-form-item class="item" label="身份证号" prop="idcard"  :borderBottom="borderBottom" >
					<u--input fontSize="30rpx" v-model="form.idcard" :disabled="true" disabledColor="#ffffff" border="none"></u--input>
				</u-form-item>

				<u-form-item class="item" label="联系方式" prop="phone"  :borderBottom="borderBottom" >
					<u--input fontSize="30rpx" v-model="form.phone" :disabled="true" disabledColor="#ffffff" border="none" placeholder="请输入联系方式"></u--input>
				</u-form-item>

				<u-form-item class="item" label="流动类型" prop="outType"  :borderBottom="borderBottom"  @click="openType()">
					<u--input style="pointer-events: none;" fontSize="30rpx" v-model="form.floatingOutTypeTitle" disabled disabledColor="#ffffff" placeholder="请选择流动类型" border="none" ></u--input>
					<u-icon v-if="borderBottom" slot="right" size="10rpx" name="arrow-down-fill"></u-icon>
				</u-form-item>
				<u-picker
					:show="showType"
					:columns="typeList"
					keyName="label"
					:itemHeight="70"
					:closeOnClickOverlay="true"
					@close="showType = false"
					@cancel="showType = false"
					@confirm="typeSelect"
				></u-picker>

				<u-form-item class="item" label="流动状态" prop="floatingStatus"  :borderBottom="borderBottom"  @click="openStatus()">
					<u--input style="pointer-events: none;" fontSize="30rpx" v-model="form.floatingStatusTitle" disabled disabledColor="#ffffff" placeholder="请选择流动状态" border="none" ></u--input>
					<u-icon v-if="borderBottom" slot="right" size="10rpx" name="arrow-down-fill"></u-icon>
				</u-form-item>
				<u-picker
					:show="showStatus"
					:columns="statusList"
					keyName="label"
					:itemHeight="70"
					:closeOnClickOverlay="true"
					@close="showStatus = false"
					@cancel="showStatus = false"
					@confirm="statusSelect"
				></u-picker>

				<u-form-item class="item" label="流动到何处" prop="floatingPlace"  :borderBottom="borderBottom"  @click="openAddressPicker()">
					<u--input style="pointer-events: none;" fontSize="30rpx" v-model="form.floatingPlace" disabled disabledColor="#ffffff" placeholder="请选择流动到区域" border="none" ></u--input>
					<u-icon v-if="borderBottom" slot="right" size="10rpx" name="arrow-down-fill"></u-icon>
				</u-form-item>

				<uni-popup ref="areaPopup" type="bottom" background-color="#fff">
					<select-area :closeButton="true" :defaultAreaName="defaultAreaName" :defaultAreaId="defaultAreaId" @confirm="selectAreaConfirm" @close="selectAreaClose"></select-area>
				</uni-popup>

				<!-- <addressPicker :show="addressPickerShow"
					:indexs="address.indexs"
					:areaId="address.areaId"
					:closeOnClickOverlay="true"
					:addressData="address.addressData"
					@confirm="addressConfirm"
					@close="addressPickerShow = false"
				></addressPicker> -->

				<u-form-item class="item" label="流动到部门" prop="flowTargetDept"  :borderBottom="borderBottom">
					<u--input fontSize="30rpx" maxlength="100" v-model="form.flowTargetDept" :disabled="disabled" disabledColor="#ffffff" placeholder="请输入流动到部门" border="none" ></u--input>
				</u-form-item>


				<u-form-item class="item" label="流出日期" prop="floatingDate"  :borderBottom="borderBottom" @click="openTime()">
					<u--input style="pointer-events: none;" fontSize="30rpx" v-model="form.floatingDate" disabled disabledColor="#ffffff" placeholder="请选择流出日期" border="none" ></u--input>
					<u-icon v-if="borderBottom" slot="right" size="10rpx" name="arrow-down-fill"></u-icon>
				</u-form-item>
				<u-datetime-picker
					ref="datetimePicker"
					:show="showTime"
					mode="date"
					:itemHeight="70"
					closeOnClickOverlay
					@close="showTime = false"
					@confirm="changeTime"
					@cancel="showTime = false"
					:formatter="formatter"
				></u-datetime-picker>

				<u-form-item class="item" label="从事职业" prop="working"  :borderBottom="borderBottom"  @click="openflowType()">
					<u--input style="pointer-events: none;" fontSize="30rpx" v-model="form.flowTypeTitle" disabled disabledColor="#ffffff" placeholder="请选择从事职业" border="none" ></u--input>
					<u-icon v-if="borderBottom" slot="right" size="10rpx" name="arrow-down-fill"></u-icon>
				</u-form-item>
				<u-picker
					:show="showflowType"
					:columns="flowTypeList"
					keyName="label"
					:itemHeight="70"
					:closeOnClickOverlay="true"
					@close="showflowType = false"
					@cancel="showflowType = false"
					@confirm="flowTypeSelect"
				></u-picker>

			</u--form>

			<view class="hint-title">
				注意事项
			</view>
			<view class="hint-text">
				流动党员是指由于就业或居住地变化等原因，在3个月以上无法正常参加所在党组织活动的党员。1.外出前，应向所在党组织报告外出事由、时间、地点及联系方式,点击"流出"键，准确填写流出地点。2.外出返回后，及时将"流出"状态调整为正常，并如实向党组织汇报外出期间的情况。
			</view>
			<view class="button-box">
				<view v-if="!validate" class="qr-button" @click="apply()">
					确认提交
				</view>

				<view v-else-if="validate" style="display: flex;">
					<view class="del-button" @click="popupConfirm = true">
						流回
					</view>
					<view v-if="!borderBottom" class="update-button" @click="updateInfo()">
						修改
					</view>
					<view v-if="borderBottom" class="update-button" @click="submit()">
						修改
					</view>

				</view>
			</view>
		</view>

		<!-- <u-popup customStyle="padding: 80rpx 0; width: 70%; border-radius: 10rpx;" mode="center" :show="popupConfirm">
			<view>
				<view class="popupConfirm-title">确定要转回已流回状态吗？</view>
				<view class="popupConfirm-box">
					<view class="popupConfirm-button" @click="popupConfirm = false">取消</view>
					<view class="popupConfirm-button" @click="handleReturn()">确定</view>
				</view>
			</view>
		</u-popup> -->
		<confirmPicker :show="popupConfirm0" :title="'确定要流出吗？'" @close="popupConfirm = false" @confirm="popupConfirm0 = false; submit()"></confirmPicker>
		<confirmPicker :show="popupConfirm" :title="'确定要转回已流回状态吗？'" @close="popupConfirm = false" @confirm="popupConfirm = false; handleReturn()"></confirmPicker>

	</view>
</template>

<script>
import addressPicker from '@/uni_modules/address-picker/components/address-picker/address-picker'
import selectArea from '@/components/select-area/index'
// import {getDictByType} from "@/api/tDictData"
import {getDictByCode} from "@/api/jcxfSysDictionary"
// import {addFlowOutPartyMember, getPartyInfo, setReturnPartyMember} from '@/api/partyMember'
import { mapGetters, createNamespacedHelpers } from 'vuex'
import {addFloatingMember, getPartyFloatingByPartyMemberId, setReturnPartyMember, updateFloatingMember} from '@/api/jcxfPartyFloatingMember'
import confirmPicker from '@/components/confirmPicker/index'

const { mapState, mapMutations } = createNamespacedHelpers('user')
export default {
	name:"Home",
	components: {
		addressPicker,
		selectArea,
		confirmPicker
	},
	data() {
		return {
			borderBottom: true,
			disabled: false,
			popupConfirm: false,
			labelStyle: {
				fontSize: '28rpx',
				color: 'rgba(128, 128, 128, 1)'
			},
			form: {
				deptName: '',
				id: '',
				floatingType: '2' ,// 类型(1:流入,2:流出)
				partyId: '',
				realName: '',
				sex: '',
				nationalTitle: '',
				national: '',
				idcard: '',
				phone: '',
				outType: '',
				floatingOutTypeTitle: '',
				floatingStatus: '',
				floatingStatusTitle: '',
				deptId: '',
				areaId: '',
				floatingPlace: '',
				flowTargetDept: '',
				floatingDate: '',
				working: '',
				flowTypeTitle: '',
				createBy: '',
				updateBy: '',
			},
			rules: {
				deptName: [{ required: true, message: '流出党支部不能为空', trigger: 'blur' }],
				realName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
				national: [{ required: true, message: '民族不能为空', trigger: 'blur' }],
				idcard: [{ required: true, message: '身份证号不能为空', trigger: 'blur' }],
				phone: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }],
				outType: [{ required: true, message: '请选择流动类型', trigger: 'blur' }],
				floatingStatus: [{ required: true, message: '请选择流动状态', trigger: 'blur' }],
				floatingPlace: [{ required: true, message: '请选择流动到地区', trigger: 'blur' }],
				flowTargetDept: [{ required: true, message: '请输入流动到的部门', trigger: 'blur' }],
				floatingDate: [{ required: true, message: '请选择流出日期', trigger: 'blur' }],
				working: [{ required: true, message: '请选择从事职业', trigger: 'blur' }],
			},
			labelWidth: '160rpx',
			showType: false,
			typeList: [],
			showStatus: false,
			statusList: [],
			showTime: false,
			showflowType: false,
			flowTypeList: [],
			addressPickerShow: false,
			/* address: {
				indexs: [0, 0, 0],
				areaId: [],
				addressData: []
			}, */
			validate: false,
			nationList: [],
			defaultAreaName: [],
			defaultAreaId: [],
			popupConfirm0: false
		}
	},
	onReady() {
		// 微信小程序需要用此写法
		this.$refs.datetimePicker.setFormatter(this.formatter)
	},
	created() {
		/*try {
			xm.setNavigationBarTitle({title: "党员流出"})
		} catch (error) {
			document.title = "党员流出"
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
		this.getAllDict()
		this.setLoading(false);
	},
	onLoad(){
		this.setLoading(true);
	},
	methods: {
		...mapMutations(['setLoading']),
		async getAllDict() {
			await this.getDict('nation')
			await this.getDict('floatingOutType')
			await this.getDict('floatingStatus')
			await this.getDict('flowType')
			this.getPartyMemberInfo()
		},
		setForm() {
			// this.form.id = this.userInfo.id
			this.form.deptName = this.userInfo.deptName
			this.form.realName = this.userInfo.realName
			this.form.national = this.userInfo.national
			this.form.nationalTitle = this.findTitleByValue(this.userInfo.national, this.nationList)
			this.form.idcard =  this.userInfo.idcard
			this.form.phone = this.userInfo.phone
			this.form.deptId = this.userInfo.deptId
			this.form.partyId = this.userInfo.id
			this.form.sex = this.userInfo.sex
		},
		resetForm() {
			this.form = {
				id: '',
				deptName: '',
				realName: '',
				nationalTitle: '',
				national: '',
				idcard: '',
				phone: '',
				outType: '',
				floatingOutTypeTitle: '',
				floatingStatus: '',
				floatingStatusTitle: '',
				areaId: '',
				floatingPlace: '',
				flowTargetDept: '',
				floatingDate: '',
				working: '',
				flowTypeTitle: '',
				isFlow: '1'
			}
		},
		getDict(type) {
      return new Promise((resolve, reject) => {
				getDictByCode(type).then(res =>{
					let data = res.data

					if (type === 'nation') {
						this.nationList = data
						this.setForm()
					} else if (type === 'floatingOutType') {
						this.typeList = [data]
					} else if (type === 'floatingStatus') {
						this.statusList = [data]
					} else if (type == 'flowType') {
						this.flowTypeList = [data]
					}
          resolve(res)
				})
      })
		},
		getPartyMemberInfo() {
			getPartyFloatingByPartyMemberId(this.userInfo.id).then(res => {
				if (res.code == '00000' && res.data != null && res.data.floatingBack == '0') {
					this.form.id = res.data.id
					this.form.outType = res.data.outType
					this.form.floatingStatus = res.data.floatingStatus
					this.form.working = res.data.working
					let place = res.data.floatingPlace
					if (place && place != null) {
					    if(place.split(',').length > 1){
                            for (let i = 1;i < place.split(',').length; i++) {
                                this.form.floatingPlace += place.split(',')[i]
                            }
                        }else{
                            this.form.floatingPlace += place
                        }
					}
					this.form.flowTargetDept = res.data.flowTargetDept


					this.form.floatingDate = uni.$u.timeFormat(res.data.floatingDate, 'yyyy-mm-dd')

					// let areaIds = res.data.areaId.split('-')
					// this.form.areaId = areaIds[0] + '-' + areaIds[1] + '-' + areaIds[2]

					this.form.floatingOutTypeTitle = this.findTitleByValue(this.form.outType, this.typeList[0])
					this.form.floatingStatusTitle = this.findTitleByValue(this.form.floatingStatus, this.statusList[0])
					this.form.flowTypeTitle = this.findTitleByValue(this.form.working, this.flowTypeList[0])

					//console.log(this.form)

					this.validate = true
					this.borderBottom = false
					this.disabled = true
				} else {
					this.validate = false
					this.borderBottom = true
					this.disabled = false
				}
			})
		},
		findTitleByValue(value, dic) {
			for (let i = 0; i < dic.length; i++) {
				if (dic[i].itemValue == value) {
					return dic[i].label
				}
			}
		},
		openType() {
			this.hideKeyboard()
			if (this.borderBottom) {
				this.showType = true
			}
		},
		typeSelect(e) {
			this.form.floatingOutTypeTitle = e.value[0].label
			this.form.outType = e.value[0].itemValue
			this.showType = false
		},
		openStatus() {
			this.hideKeyboard()
			if (this.borderBottom) {
				this.showStatus = true
			}
		},
		statusSelect(e) {
			this.form.floatingStatusTitle = e.value[0].label
			this.form.floatingStatus = e.value[0].itemValue
			this.showStatus = false
		},
		openflowType() {
			this.hideKeyboard()
			if (this.borderBottom) {
				this.showflowType = true
			}
		},
		flowTypeSelect(e) {
			this.form.flowTypeTitle = e.value[0].label
			this.form.working = e.value[0].itemValue
			this.showflowType = false
		},
		hideKeyboard() {
			uni.hideKeyboard()
		},
		openTime() {
			this.hideKeyboard()
			if (this.borderBottom) {
				this.showTime = true
			}
		},
		changeTime(e) {
			this.form.floatingDate = uni.$u.timeFormat(e.value, 'yyyy-mm-dd')
			this.showTime = false
		},
		formatter(type, value) {
			if (type === 'year') {
					return `${value}年`
			}
			if (type === 'month') {
					return `${value}月`
			}
			if (type === 'day') {
					return `${value}日`
			}

			return value
		},
		openAddressPicker() {
			this.hideKeyboard()
			if (this.borderBottom) {
				this.addressPickerShow = true

				this.$refs.areaPopup.open()
			}
		},
		/* addressConfirm(e) {
			this.form.floatingPlace = e.value[0] + ' - ' + e.value[1] + ' - ' +e.value[2]
			this.form.areaId = e.areaId[0] + '-' + e.areaId[1] + '-' + e.areaId[2]

			this.address.indexs = e.indexs
			this.address.areaId = e.areaId
			this.address.addressData = e.value
			this.addressPickerShow = false
		}, */
		selectAreaConfirm(e) {
		    if(e){
                this.form.floatingPlace = e.areaName
                this.form.areaId = e.areaId

                this.defaultAreaName = e.areaNameValue
                this.defaultAreaId = e.areaIdValue
                this.$refs.areaPopup.close()
            }
		},
		selectAreaClose() {
			this.$refs.areaPopup.close()
		},
		apply() {
			this.$refs.uForm.validate().then(res => {
				this.popupConfirm0 = true
			}).catch(errors => {
                uni.$u.toast('请完善信息')
            })
		},
		submit() {
			let data = this.form
			this.form.createBy = this.userInfo.id
			if (this.form.id == null || this.form.id == '') {
				addFloatingMember({ data: this.form }).then(res => {
					if (res.code == '00000') {
						uni.showToast({
							icon: 'success',
							title: '提交成功！',
							duration: 2000
						})

						this.validate = true
						this.borderBottom = false
						this.disabled = true
                        uni.navigateTo({
                            url: "/pages/Home/Home"
                        })
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg,
							duration: 2000
						})
					}
				})
			} else {
				updateFloatingMember({ data: this.form }).then(res => {
					if (res.code == '00000') {
						uni.showToast({
							icon: 'success',
							title: '提交成功！',
							duration: 2000
						})

						this.validate = true
						this.borderBottom = false
						this.disabled = true
                        uni.navigateTo({
                            url: "/pages/Home/Home"
                        })
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg,
							duration: 2000
						})
					}
				})
			}
		},
		updateInfo() {
			this.borderBottom = true
			this.disabled = false
		},
		handleReturn() {
			this.popupConfirm = false
			let ids = [this.userInfo.id]
			this.form.updateBy = this.userInfo.id
			setReturnPartyMember(ids).then(res => {
				if (res.code == '00000') {
					uni.showToast({
						icon: 'success',
						title: '流回成功！',
						duration: 2000
					})

					this.resetForm()
					this.setForm()
					this.getPartyMemberInfo()
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
	.item {
		margin-top: 25rpx;
	}

	.hint-title {
		margin-top: 40rpx;
		font-size: 32rpx;
	}

	.hint-text {
		font-size: 26rpx;
		color: rgba(128, 128, 128, 1);
		padding: 20rpx;
		line-height: 50rpx;
	}

	.button-box {
		margin-top: 60rpx;
		margin-bottom: 40rpx;

		.qr-button {
			font-size: 30rpx;
			font-weight: 700;
			color: white;
			background: rgba(225, 53, 27, 1);
			text-align: center;
			width: 576rpx;
			height: 80rpx;
			line-height: 80rpx;
			margin: auto;
			border-radius: 10rpx;
		}

		.del-button {
			font-size: 30rpx;
			font-weight: 700;
			color: rgba(225, 53, 27, 1);
			text-align: center;
			border: 1px solid rgba(225, 53, 27, 1);
			width: 274rpx;
			height: 80rpx;
			line-height: calc(80rpx - 2px);
			margin: auto;
			border-radius: 10rpx;
		}

		.update-button {
			border: 1px solid rgba(225, 53, 27, 1);
			font-size: 30rpx;
			font-weight: 700;
			color: white;
			background: rgba(225, 53, 27, 1);
			text-align: center;
			width: 274rpx;
			height: 80rpx;
			line-height: 80rpx;
			margin: auto;
			border-radius: 10rpx;
		}
	}

	.popupConfirm-title {
		font-size: 30rpx;
		font-weight: 700;
		text-align: center;
	}

	.popupConfirm-box {
		display: flex;
		margin-top: 40rpx;
		justify-content: center;

		.popupConfirm-button {
			font-weight: 700;
			font-size: 30rpx;
			border-radius: 10rpx;
			background: rgba(225, 53, 27, 1);
			cursor: pointer;
			user-select: none;
			color: white;
			height: 60rpx;
			width: 180rpx;
			text-align: center;
			line-height: 60rpx;
			margin: 0 13rpx;
		}
	}
</style>
