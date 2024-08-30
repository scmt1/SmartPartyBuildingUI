<template>
	<view v-loading="loading">
		<view class="content-box">
			<view>
				<image mode="widthFix" src="@/static/images/politicalBirthday/topImg.png"></image>
			</view>
			<swiper indicator-dots style="min-height: 70vh; overflow: auto;">
				<swiper-item v-for="(item, index) in swiperItem" :key="index">
					<view class="row">
						<view class="content" v-for="(va, idx) in item" :key="idx">
							<view class="img">
								<image mode="widthFix" src="@/static/images/politicalBirthday/icon.png"></image>
								<view class="number">{{ va.politicsAge }}</view>
							</view>
							<view class="name">{{ va.realName }}</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
import {getPoliticalBirthdayByDeptId} from '@/api/partyMember'
import { mapGetters, createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('user')

export default {
	name:"Home",
	data() {
		return {
			defaultIndex: 0,
			swiperItem: [],
			list: []
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
	created() {
		/*try {
			xm.setNavigationBarTitle({title: "政治生日"});
		} catch (error) {
			document.title = "政治生日";
		}*/
		this.getPoliticalBirthday()
	},
	onReady() {
		this.setLoading(false);
	},
	onLoad(){
		this.setLoading(true);
	},
	methods: {
		...mapMutations(['setLoading']),
		getPoliticalBirthday() {
			let data = {
				deptId: this.userInfo.deptId + '',
				type: 'all'
			}
			getPoliticalBirthdayByDeptId(data).then(res => {
				if (res.code == '00000') {
					this.list = res.data
					this.setSwiperItem()
				}
			})
		},
		setSwiperItem() {
			let va = []
			for (let i = 0; i < this.list.length; i++) {
					va.push(this.list[i])
					if (va.length > 0 && va.length % 9 == 0) {
							this.swiperItem.push(va)
							va = []
					} else if ((this.swiperItem.length + 1)* 9 > this.list.length && i == this.list.length -1) {
						this.swiperItem.push(va)
					}
			}
		}
	}
}
</script>

<style lang="scss" scoped>

	::v-deep .uni-swiper-dot {
		background-color: white;
	}
	::v-deep .uni-swiper-dot-active {
		transition: all 0.1s;
		background-color: white;
		height: 10px !important;
		width: 10px !important;
	}

	.content-box {
		min-height: 100vh;
		width: 100%;
		background-image: url('@/static/images/politicalBirthday/bgImg.png');
		background-size: cover;
		background-repeat: no-repeat;
		display: flex;
		flex-direction: column;

		.row {
			overflow-y: auto;
			height: calc(100% - 50rpx);
			margin-top: 20rpx;
			margin-bottom: 30rpx;

			.content {
				margin-top: 60rpx;
				width: 32%;
				display: inline-block;

				.img {
					margin: auto;
					width: 130rpx;
					position: relative;
					.number {
						position: absolute;
						font-size: 48rpx;
						top: 72rpx;
						left: 50%;
						transform: translateX(-50%);
						color: rgba(214, 131, 36, 1);
						font-weight: bold;
					}
				}

				.name {
					text-align: center;
					color: white;
					font-size: 35rpx;
				}

			}

			.right {
				margin-left: 2%;
			}

		}


	}
</style>
