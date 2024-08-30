<template>
	<view v-loading="loading">
		<view class="top"></view>
		<view class="nav-box">
			<view class="nav">
				<image class="icon" mode="aspectFit" src="@/static/images/user/head-icon.png"></image>
				<view class="name">头像</view>
				<view class="right">
					<view class="avatar-img">
						<u-upload
							:fileList="images"
							@beforeRead="beforeRead"
							@afterRead="cropperImage"
							name="5"
							:maxCount="1"
							width="80rpx"
							height="80rpx"
							:previewFullImage="false"
						>
							<image v-if="userInfo.avatar == null || userInfo.avatar.length == 0" style="width: 80rpx; height: 80rpx;" mode="aspectFill" src="@/static/images/user/default-avatar.png"></image>
							<image else style="width: 80rpx; height: 80rpx;" mode="aspectFill" :src="userInfo.avatar"></image>
						</u-upload>
					</view>
					<view >
						<u-icon name="arrow-right" size="28rpx" color="rgba(56, 56, 56, 1)"></u-icon>
					</view>
				</view>
			</view>

			<view class="nav">
				<image class="icon" mode="aspectFit" src="@/static/images/user/phone-icon.png"></image>
				<view class="name">电话</view>
				<view class="right" @click="changeInfo.newPhone = userInfo.phone; changePhoneShow = true">
					<view class="phone">{{ userInfo.phone }}</view>
					<view class="right-icon">
						<u-icon name="edit-pen-fill" size="28rpx" color="rgba(225, 53, 27, 1)"></u-icon>
						<view>更改</view>
					</view>
				</view>
			</view>

			<!-- <view class="nav" style="margin-top: 50rpx;" @click="$handlerNavigate({ url: '/pages/User/ChangePassword/index' })">
				<image class="icon" mode="aspectFit" src="@/static/images/user/password-icon.png"></image>
				<view class="name">密码管理</view>
				<view class="right">
					<view>
						<u-icon name="arrow-right" size="28rpx" color="rgba(56, 56, 56, 1)"></u-icon>
					</view>
				</view>
			</view> -->


			<view class="nav" style="margin-top: 50rpx;">
				<image class="icon" mode="aspectFit" src="@/static/images/user/real-name-icon.png"></image>
				<view class="name">个人实名认证</view>
				<view class="right">
					<view class="real-name">
						{{ userInfo.realName }}
					</view>
					<view class="authentication">
						已认证
					</view>
				</view>
			</view>

			<view class="cropper" v-if="cropper">
				<qf-image-cropper :src="cropperPath" :width="300" :height="300" :radius="0" @close="cropper = false" @crop="afterRead"></qf-image-cropper>
			</view>

			<u-popup closeable closeOnClickOverlay @close="changePhoneShow = false" customStyle="border-radius: 10rpx; width: calc(100% - 50rpx); padding: 40rpx;" :show="changePhoneShow" mode="center">
				<view class="phone-text">手机号码</view>
				<view class="form-box">
					<u--form :labelStyle="labelStyle" labelPosition="left" :model="changeInfo" labelWidth="55rpx"  ref="uForm">
						<u-form-item label="" borderBottom>
							<u--input type="number" focus fontSize="28rpx" class="input" v-model="changeInfo.newPhone" border="none" clearable  placeholder="请输入手机号码"></u--input>
						</u-form-item>
					</u--form>
				</view>
				<view class="next-button-false" @click="savePhone">
					保存
				</view>
			</u-popup>

		</view>
	</view>
</template>

<script>
import {uploadTinymceEditor} from '@/api/attachFile'
import {updatePartyMemberAvatar, getPartyInfo, changePhone} from '@/api/partyMember'
import {setLocalStorageInfo,getLocalStorageInfo} from '@/utils/localStorageInfo'
import QfImageCropper from '@/uni_modules/qf-image-cropper/components/qf-image-cropper/qf-image-cropper.vue'
import util from '@/utils/util'
import { mapGetters, createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('user')
import {upload} from "@/api/jcxfUpload";

export default {
	name: 'personalData',
	components: {
		QfImageCropper
	},
	data() {
		return {
			base: util.jcxfUrl,
			images: [],
			cropper: false,
			cropperPath: '',
			changePhoneShow: false,
			labelStyle: {
				'fontSize': '26rpx',
				'fontWeight': 500
			},
			changeInfo: {
				newPhone: ''
			}
		}
	},
	created() {
		/*try {
			xm.setNavigationBarTitle({title: "个人资料管理"});
		} catch (error) {
			document.title = "个人资料管理";
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
		this.setLoading(false);
	},
	onLoad(){
		this.setLoading(true);
	},
	methods: {
		...mapMutations(['setLoading']),
		handleCrop(e) {
			/* uni.previewImage({
				urls: [e.tempFilePath],
				current: 0
			}) */
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
			let lists = [].concat(event.file)
			this.cropperPath = lists[0].url
			this.cropper = true
		},
		async afterRead(event) {
			this.cropper = false

			let lists = [].concat(event.tempFilePath)
			let fileListLen = this.images.length

			lists.map((item) => {
				this.images.push({
					url: '',
					status: 'uploading',
					//message: '上传中'
				})
			})

			for (let i = 0; i < lists.length; i++) {
				const result = await this.uploadFilePromise(lists[i])
				let item = this.images[fileListLen]
				this.images.splice(fileListLen, 1, Object.assign(item, {
					status: 'success',
					message: '',
					url: this.base + result
				}))
				fileListLen++
			}
		},
		async uploadFilePromise(baseFile) {
			let file = this.dataURLtoBlob(baseFile, 'image')
			return new Promise((resolve, reject) => {
					let data = {
						file: file,
						name: "image."+name
					}
					upload(file).then((res) => {
						if (res.code == '200') {
							let data = {
								id: this.userInfo.id + '',
								avatar: res.data.result.fileRealPath
							}
							updatePartyMemberAvatar(data).then(res2 => {
								if (res2.code == '00000') {
									// this.images = []
									this.refreshPartyMemberInfo()
								}
							})
							resolve(res.data.result.fileRealPath)
						}
					})
			})
		},
		dataURLtoBlob(base64, name) {//base64转file
			let arr = base64.split(','),
				type = arr[0].match(/:(.*?);/)[1],
				suffix = type.split('/')[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n)
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n)
			}
			return new File([u8arr], `${name}.${suffix}`, {
				type: type,
			})
		},
		refreshPartyMemberInfo() {
			getPartyInfo(this.userInfo.id).then(res => {
				if (res.code == '00000') {
					setLocalStorageInfo('userInfo', res.data)
					this.$store.dispatch('user/setUserInfo', res.data)
				}
			})
		},
		savePhone() {
			if (this.userInfo.phone&&this.userInfo.phone.length > 0) {
				// 手机号正则表达式
				const phoneRegex = /^1[3456789]\d{9}$/;

				if (!phoneRegex.test(this.userInfo.phone)) {
					uni.showToast({
					duration:1000,
					icon:'none',
					title:'电话格式不正确'
					})
					return false
				}
				uni.hideKeyboard()

				let data = {
					id: this.userInfo.id + '',
					phone: this.changeInfo.newPhone + '',
				}
				changePhone(data).then(res=>{
					if (res.code == '00000') {
						uni.showToast({
							icon: 'success',
							title: '保存成功！',
							duration: 2000
						})
						this.changePhoneShow = false
						this.userInfo.phone = data.phone
						setLocalStorageInfo('userInfo', this.userInfo)
						this.$store.dispatch('user/setUserInfo', this.userInfo)
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
}
</script>

<style lang="scss" scoped>
	.phone-text {
		margin-top: 30rpx;
		padding: 0 25rpx;
		font-size: 28rpx;
		font-weight: 500;
	}

	.form-box {
		padding: 0 25rpx;

		.input {
			font-size: 30rpx;
			font-weight: 900;
			margin-left: 15rpx;
		}
	}

	.next-button-false {
		margin: auto;
		height: 70rpx;
		width: 306rpx;
		border-radius: 10rpx;
		background: rgba(240, 154, 140, 1);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		font-weight: 700;
		margin-top: 81rpx;
		cursor: pointer;
		user-select: none;
	}

	.top {
		height: 20rpx;
		background-color: rgba(247, 247, 247, 1);
	}

	.nav-box {
		padding: 0rpx 25rpx;

		.nav {
			display: flex;
			align-items: center;
			margin-top: 30rpx;

			.icon {
				width: 28rpx;
				height: 28rpx;
			}

			.name {
				margin-left: 10rpx;
				font-size: 30rpx;
				font-weight: 700;
			}
			.right {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: flex-end;

				.avatar-img {
					height: 80rpx;
					width: 80rpx;
					border-radius: 50%;
					overflow: hidden;
					border: 1px solid rgba(232, 232, 232, 1);
					margin-right: 10rpx;
				}

				.phone {
					font-size: 30rpx;
					font-weight: 400;
				}

				.right-icon {
					display: flex;
					color: rgba(225, 53, 27, 1);
				}

				.real-name {
					font-size: 30rpx;
				}

				.authentication {
					font-size: 22rpx;
					margin-left: 15rpx;
					border-radius: 4rpx;
					border: 1px solid rgba(225, 53, 27, 1);
					color: rgba(225, 53, 27, 1);
					width: 90rpx;
					text-align: center;
				}
			}
		}
	}

</style>
