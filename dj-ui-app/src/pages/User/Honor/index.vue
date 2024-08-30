<template>
	<view v-loading="loading">
		<view class="content-box">
			<view style="position: relative; height: 84rpx;">
				<view class="upload" @click="openPopup()">上传荣誉</view>
			</view>

			<view class="honor-list" v-for="(item, index) in honorList" :key="index">
				<view class="honor-class-box">
					<view style="flex: 1;">
						<view class="honor-class">
							<image mode="widthFix" src="@/static/images/user/honor-class.png"></image>
							<view class="honor-text">{{ findTitleByValue(item.honorClass, honorClass[0] ) }}</view>
						</view>
					</view>
					<view style="display: flex; justify-content: center;" @click="delPopupShow(item)">
						<u-icon v-if="item.status != 2" name="close-circle-fill" color="rgba(229, 229, 229, 1)" size="28rpx"></u-icon>
					</view>
				</view>

				<view class="content">
					<view class="honor-img">
						<!-- <image mode="widthFix" src="@/static/images/user/honor-img.png"></image> -->
						<image @click="previewImage(base + item.imagePath)" mode="aspectFill" :src="base + item.imagePath"></image>
					</view>
					<view class="honor-name-box">
						<view class="honor-name">{{ item.getYear }}年度/{{ item.honorName }}</view>
						<view class="person-name">
							<view style="flex: 1; word-break: break-all; padding-right: 10rpx;">
								<!-- {{ item.partyMember?item.partyMember.realName:'' }} -->
								颁奖单位：{{ item.awardName }}
							</view>
							<!-- 审核状态（1、待审核，2、审核通过，3、已驳回） -->
							<view class="honor-button pass" v-if="item.status == 1">
								<u-icon name="more-circle-fill" color="rgba(237, 123, 0, 1)" size="28rpx"></u-icon>
								<text style="margin-left: 5rpx;">待审核</text>
							</view>

							<view class="honor-button pass" v-if="item.status == 2">
								<u-icon name="checkmark-circle-fill" color="rgba(67, 207, 124, 1)" size="28rpx"></u-icon>
								<text style="margin-left: 5rpx;">审核通过</text>
							</view>

							<view class="honor-button pass" v-if="item.status == 3">
								<u-icon name="error-circle-fill" color="rgba(225, 53, 27, 1)" size="28rpx"></u-icon>
								<text style="margin-left: 5rpx;">已驳回</text>
							</view>

						</view>
					</view>
				</view>

			</view>

			<view v-if="moreFlag" style="margin: 20rpx 0;">
				<loadingIcon></loadingIcon>
			</view>
      <loadMore v-else :status="loadmoreStatus" @loadmore="loadmore()"></loadMore>

		</view>

		<u-popup customStyle="border-radius: 10rpx; max-height: calc(100% - 100rpx); width: calc(100% - 50rpx); padding: 40rpx;" :show="popupShow" mode="center" @open="popupOpen">
			<view style="height: 100%; display: flex; flex-direction: column;">
				<view style="font-size: 30rpx; font-weight: 700;">上传荣誉</view>
				<view style="flex: 1; overflow: auto;">
					<u--form labelPosition="top" :model="honorForm" :rules="rules" ref="uForm" :labelWidth="labelWidth" :labelStyle="labelStyle">
						<u-form-item label="荣誉名称" prop="honorName" borderBottom >
							<u--input fontSize="28rpx" v-model="honorForm.honorName" border="none" placeholder="请输入荣誉名称"></u--input>
						</u-form-item>

						<u-form-item label="荣誉照片" prop="honorImages" borderBottom >
							<u-upload
								:fileList="honorImages"
								@beforeRead="beforeRead"
								@afterRead="cropperImage"
								@delete="deletePic"
								name="5"
								:maxCount="1"
								width="140rpx"
								height="140rpx"
								:previewFullImage="false"
							></u-upload>
						</u-form-item>

						<u-form-item label="获奖对象姓名" prop="partyMemberName" :labelWidth="'190rpx'" borderBottom >
							<u--input fontSize="28rpx" v-model="honorForm.partyMemberName" disabled disabledColor="#ffffff" placeholder="请输入获奖对象姓名" border="none" ></u--input>
						</u-form-item>

						<u-form-item label="颁奖单位名称" prop="awardName" :labelWidth="'190rpx'" borderBottom >
							<u--input fontSize="28rpx" maxlength="100" v-model="honorForm.awardName" placeholder="请输入颁奖单位名称" border="none" ></u--input>
						</u-form-item>

						<u-form-item label="获奖年度" prop="getYear" borderBottom @click="showTime = true; hideKeyboard()">
							<u--input fontSize="28rpx" style="pointer-events: none;" v-model="honorForm.getYear" disabled disabledColor="#ffffff" placeholder="请选择获奖年度" border="none" ></u--input>
						</u-form-item>
						<yearPicker
							:show="showTime"
							:indexs="[31]"
							:closeOnClickOverlay="true"
							@confirm="timeSelect"
							@close="showTime = false"
							@cancel="showTime = false"
						></yearPicker>


						<u-form-item label="荣誉级别" prop="honorClassName" borderBottom @click="showClass = true; hideKeyboard()">
							<u--input fontSize="28rpx" style="pointer-events: none;" v-model="honorForm.honorClassName" disabled disabledColor="#ffffff" placeholder="请选择荣誉级别" border="none" ></u--input>
						</u-form-item>
					</u--form>
				</view>

				<view class="button-box">
					<view class="button" @click="popupShow = false">取消</view>
					<view class="button" @click="submit">上传</view>
				</view>

			</view>
		</u-popup>

		<u-picker
			:show="showClass"
			:columns="honorClass"
			keyName="label"
			:itemHeight="70"
			:closeOnClickOverlay="true"
			@close="showClass = false"
			@cancel="showClass = false"
			@confirm="classSelect"
		></u-picker>

		<u-popup customStyle="border-radius: 10rpx; width: calc(100% - 50rpx); padding: 40rpx;" :show="successShow" mode="center">
			<view class="success">
				<image class="success-img" mode="widthFix" src="@/static/images/user/success.png"></image>
				<view class="success-text1">上传成功</view>
				<view class="success-text2">管理员审核通过后可展示在荣誉墙</view>
				<view class="success-button" @click="successShow = false">确定</view>
			</view>
		</u-popup>

		<confirmPicker :show="pickerShow" :title="'确定要删除吗？'" @close="pickerShow = false" @confirm="delHonor()"></confirmPicker>
		<view class="cropper" v-if="cropper">
			<qf-image-cropper :src="cropperPath" :width="848" :height="576" :radius="0" @close="cropper = false; popupShow = true" @crop="afterRead"></qf-image-cropper>
		</view>

	</view>
</template>

<script>
import {getDictByType} from "@/api/tDictData"
import yearPicker from "@/components/year-picker/index"
import {uploadTinymceEditor} from '@/api/attachFile'
import {queryTzPartyHonorListOneselfPartyMember, addTzPartyHonor, delTzPartyHonor} from '@/api/tzPartyHonor'
import confirmPicker from '@/components/confirmPicker/index'
import loadMore from '@/components/loadMore/index'
import loadingIcon from '@/components/loadingIcon/index.vue'
import { mapGetters, createNamespacedHelpers } from 'vuex'
import util from '@/utils/util'
import {distinctData, getLoadmoreStatus} from '@/utils/pageUtil'
import {uploadFile} from "@/api/minionFile"

const { mapState, mapMutations } = createNamespacedHelpers('user')

export default {
	name: 'index',
	components: {
		yearPicker,
		confirmPicker,
    loadMore,
		loadingIcon
	},
	data() {
		return {
			base: util.minionUrl,
			labelStyle: {
				fontSize: '30rpx'
			},
			honorList: [],
			labelWidth: '130rpx',
			popupShow: false,
			honorImages: [],
			honorForm: {
				deptId: '',
				partyMemberId: '',
				partyMemberName: '',
				honorName: '',
				honorClassName: '',
				honorClass: '',
				getYear: '',
				honorType: 2,
				uploadId: '',
				uploadType: 2,
				imagePath: '',
				awardName: ''
			},
			rules: {
				honorName: [{required: true, message: '请输入荣誉名称', trigger: 'blur'}],
				getYear: [{required: true, message: '请选择获奖年度', trigger: 'blur'}],
				honorClassName: [{required: true, message: '请选择荣誉级别', trigger: 'blur'}],
				awardName: [{required: true, message: '请输入颁奖单位名称', trigger: 'blur'}]
			},
			showClass: false,
			honorClass: [],
			showTime: false,
			timeActions: [],
			successShow: false,
			pageNum: 1,
			pageSize: 10,
			moreFlag: false,
			pickerShow: false,
			delHonorInfo: null,
			loadmoreStatus: 'loadmore',
			cropper: false,
			cropperPath: '',
			cropperName: '',
			pageInfoIds: []
		}
	},
	created() {
		/*try {
			xm.setNavigationBarTitle({title: "个人荣誉管理"});
		} catch (error) {
			document.title = "个人荣誉管理";
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
			await this.getDict('honorClass')
			this.rest()
			this.getHonorList()
		},
		previewImage(url) {
			uni.previewImage({
				urls: [url]
			})
		},
		getDict(type) {
			return new Promise((resolve, reject) => {
				getDictByType(type).then(res => {
					if (type === 'honorClass') {
						this.honorClass = [res]
					}
					resolve(res)
				})
			})
		},
		rest() {
			this.pageInfoIds = []
			this.pageNum = 1
			this.honorList = []
		},
		loadmore() {
			if (this.moreFlag) {
				return
			}
			this.moreFlag = true
			this.pageNum++
			this.getHonorList()
		},
		getHonorList() {
			const data = {
				tzPartyHonor: {
						partyMemberId: this.userInfo.id,
				},
				pageVo: {
						pageNumber: this.pageNum,
						pageSize: this.pageSize
				},
			}
			queryTzPartyHonorListOneselfPartyMember({data: data}).then(res => {
				this.moreFlag = false
				if (res.code == '00000') {
					let {ids, resultData} = distinctData(this.pageInfoIds, res.data.records)
					this.pageInfoIds = ids
					this.honorList = this.honorList.concat(resultData)
					this.loadmoreStatus = getLoadmoreStatus(this.honorList, res.data)

					/* this.honorList = this.honorList.concat(res.data.records)
					if (this.honorList.length < res.data.total) {
						this.loadmoreStatus = 'loadmore'
					} else {
						this.loadmoreStatus = 'nomore'
					} */

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
		openPopup() {
			this.honorForm.deptId = this.userInfo.deptId
			this.honorForm.partyMemberId = this.userInfo.id
			this.honorForm.uploadId = this.userInfo.id
			this.honorForm.partyMemberName = this.userInfo.realName

			this.honorForm.honorName = ''
			this.honorForm.honorClassName = ''
			this.honorForm.honorClass = ''
			this.honorForm.getYear = ''
			this.honorForm.imagePath = ''
			this.honorImages = []
			this.popupShow = true

		},
		popupOpen() {

		},
		hideKeyboard() {
			uni.hideKeyboard()
		},
		timeSelect(e) {
			this.honorForm.getYear = e[0] + ''
			this.showTime = false
		},
		classSelect(e) {
			this.honorForm.honorClass = e.value[0].itemValue
			this.honorForm.honorClassName = e.value[0].label
			this.showClass = false
		},
		beforeRead(file, lists, name) {
			let tmp = file.name.split('.')
			if (file.type != 'image') {
				uni.$u.toast('请选择图片文件')
				return false
			}
			if (file.size > 5242880 * 2) {
				uni.$u.toast('文件不能大于10M')
				return false
			}
		},
		cropperImage(event) {
			this.popupShow = false

			let lists = [].concat(event.file)
			this.cropperPath = lists[0].url
			this.cropperName = lists[0].name
			this.cropper = true
		},
		async afterRead(event) {
			this.popupShow = true
			this.cropper = false

			let lists = [].concat(event.tempFilePath)
			let fileListLen = this.honorImages.length
			lists.map((item) => {
				this.honorImages.push({
					...item,
					status: 'uploading',
					//message: '上传中'
				})
			})
			for (let i = 0; i < lists.length; i++) {
				const result = await this.uploadFilePromise(lists[i])
				let item = this.honorImages[fileListLen]
				this.honorImages.splice(fileListLen, 1, Object.assign(item, {
					status: 'success',
					message: '',
					url: this.base + result
				}))
				fileListLen++
			}
		},
		deletePic(e) {
			this.honorImages = []
			this.form.imagePath = ''
		},
		async uploadFilePromise(file) {
			// let tmp = file.name.split('.')
			// let name = tmp[tmp.length - 1]

			let name = 'png'

			// let reader = new FileReader()
			// let blob = await fetch(file.url).then(r => r.blob())

			// reader.readAsDataURL(blob)
			return new Promise((resolve, reject) => {
				//reader.onload = () => {
					/* let data = {
						file: file,
						name: "image."+name
					}
					uploadTinymceEditor({ data: data}).then((res) => {
							this.honorForm.imagePath = res.data.filePath
							resolve(res.data.filePath)
					}) */
					uploadFile({imgUrl: file, imgName: this.cropperName}).then(res => {
            if (res.code == '000000') {
                this.honorForm.imagePath = res.fileName
                resolve(res.fileName)
            }
					})
				//}
			})
		},
		submit() {
			if (this.honorForm.imagePath == null || this.honorForm.imagePath.length == 0) {
				uni.showToast({
					icon: 'none',
					title: '请上传照片',
					duration: 2000
				})
				return
			}
			this.$refs.uForm.validate().then(res => {
				let data = {
					tzPartyHonor: this.honorForm,
					//bizTenantId: this.userInfo.tenantId
				}
				addTzPartyHonor({data: data}).then(res => {
					if (res.code == '00000') {
						this.popupShow = false
						this.successShow = true

						this.rest()
						this.getHonorList()
					}
				})
			})
		},
		delPopupShow(item) {
			this.delHonorInfo = item
			this.pickerShow = true
		},
		delHonor() {
			this.pickerShow = false
			delTzPartyHonor(this.delHonorInfo.id).then(res =>{
				if (res.code == '00000') {
					uni.showToast({
						icon: 'success',
						title: '删除成功！',
						duration: 2000
					})

					this.rest()
					this.getHonorList()
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
	.content-box {
		padding: 0 25rpx;

		.upload {
			text-align: center;
			margin-top: 24rpx;
			color: white;
			line-height: 60rpx;
			width: 142rpx;
			height: 60rpx;
			border-radius: 10rpx;
			background: rgba(225, 53, 27, 1);
			position: absolute;
			right: 0;
			cursor: pointer;
			user-select: none;
		}

		.honor-list {
			margin-top: 26rpx;

			.honor-class-box {
				display: flex;
				border-bottom: 1px solid rgba(238, 126, 0, 1);

				.honor-class {
					position: relative;
					width: 173rpx;
					margin-bottom: -1px;

					.honor-text {
						color: white;
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}
				}
			}

			.content {
				display: flex;
				margin-top: 17rpx;

				.honor-img {
					border-radius: 10rpx;
					overflow: hidden;
					width: $honor-image-width;
					height: $honor-image-height;
				}

				.honor-name-box {
					padding: 0 15rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					flex: 1;

					.honor-name {
						color: rgba(225, 53, 27, 1);
						font-size: 28rpx;
						font-weight: 700;
					}

					.person-name {
						margin-top: 10rpx;
						font-size: 28rpx;
						font-weight: 400;
						display: flex;

						.honor-button {
							width: 168rpx;
							height: 50rpx;
							border-radius: 10rpx;
							line-height: 50rpx;
							font-size: 24rpx;
							display: flex;
							align-items: center;
							justify-content: center;
						}

						.pass {
							color: rgba(67, 207, 124, 1);
							border: 1px solid rgba(67, 207, 124, 1);
						}

						.wait {
							color: rgba(237, 123, 0, 1);
							border: 1px solid rgba(237, 123, 0, 1);
						}

						.reject {
							color: rgba(225, 53, 27, 1);
							border: 1px solid rgba(225, 53, 27, 1);
						}
					}
				}

			}
		}

	}

	.button-box {
		display: flex;
		justify-content: center;
		margin-top: 70rpx;
		margin-bottom: 70rpx;

		.button {
			height: 60rpx;
			width: 236rpx;
			color: white;
			text-align: center;
			line-height: 60rpx;
			background: rgba(225, 53, 27, 1);
			border-radius: 10rpx;
			margin: 0 20rpx;
		}
	}

	.success {
		text-align: center;

		.success-img {
			width: 148rpx;
			margin: auto;
    }

		.success-text1 {
			margin-top: 30rpx;
			font-size: 36rpx;
			font-weight: 700;
		}

		.success-text2 {
			margin-top: 10rpx;
			font-size: 24rpx;
			color: rgba(128, 128, 128, 1);
			margin-bottom: 30rpx;
		}

		.success-button {
			color: white;
			background: rgba(225, 53, 27, 1);
			height: 70rpx;
			width: 306rpx;
			text-align: center;
			line-height: 70rpx;
			border-radius: 10rpx;
			margin: auto;
		}
	}

</style>
