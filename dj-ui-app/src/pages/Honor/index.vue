<template>
	<view v-loading="loading">
		<view class="content-box">
			<view class="top-img">
				<image mode="widthFix" src="@/static/images/honor/top.png"></image>
			</view>

			<view class="honor-type">
				<view style="margin: auto; display: flex;">
					<view :class="honorType == 1?'type2':'type'" @click="honorTypeChange(1)">
						<image v-if="honorType == 1" class="img" mode="widthFix" src="@/static/images/honor/selected.png"></image>
						<image v-else class="img" mode="widthFix" src="@/static/images/honor/not-selected.png"></image>
						<view :class="honorType == 1 ? 'name selected' :'name' ">组织荣誉</view>
					</view>
					<view :class="honorType == 2?'type2':'type'" @click="honorTypeChange(2)">
						<image v-if="honorType == 2" class="img" mode="widthFix" src="@/static/images/honor/selected.png"></image>
						<image v-else class="img" mode="widthFix" src="@/static/images/honor/not-selected.png"></image>
						<view :class="honorType == 2 ? 'name selected' :'name' ">个人荣誉</view>
					</view>
				</view>

			</view>

			<view class="sort-box">
				<view class="content">

					<view class="sort-change">
						<view class="sort-type" @click="sortTypeChange('time')">
							<image v-if="sortType == 'time'" mode="widthFix" src="@/static/images/honor/sort-left-selected.png"></image>
							<image v-else mode="widthFix" src="@/static/images/honor/sort-left.png"></image>
							<view :class="sortType == 'time' ? 'sort-name selected': 'sort-name not-selected' ">按年份排序</view>
						</view>
						<view class="sort-icon">
							<image mode="widthFix" src="@/static/images/honor/sort-change.png"></image>
						</view>
						<view class="sort-type" @click="sortTypeChange('class')">
							<image v-if="sortType == 'class'" mode="widthFix" src="@/static/images/honor/sort-right-selected.png"></image>
							<image v-else mode="widthFix" src="@/static/images/honor/sort-right.png"></image>
							<view :class="sortType == 'class' ? 'sort-name selected': 'sort-name not-selected'">按等级排序</view>
						</view>
					</view>

					<view style="margin-top: 20rpx; flex: 1; overflow: auto;">

						<view class="honor-list" v-for="(item, index) in honorList" :key="index">
							<view class="honor-class-box">
								<image class="honor-class-img" mode="heightFix" src="@/static/images/honor/class-bg-img.png"></image>
								<view class="honor-class-text">{{ getDirectLabelByValue(item.honorClass, honorClass) }}</view>
							</view>

							<view class="honor-content-box">
								<view class="honor-img-box">
									<!-- <image mode="widthFix" src="@/static/images/honor/honor-img.png"></image> -->
                                    <image v-if="item.imagePath && item.imagePath('upload') > -1" @click="previewImage(base + item.imagePath)" class="honor-img" mode="widthFix" :src="base + item.imagePath"></image>
									<image v-else @click="previewImage(item.imagePath)" class="honor-img" mode="widthFix" :src="item.imagePath"></image>
									<view style="margin-top: 10rpx;">
										<u--text :lines="1" size="24rpx" align="center" :bold="true" :text="new Date(item.getYear).getFullYear() + '年度'"></u--text>
									</view>
								</view>
								<view class="honor-text">
									<view>
										<u--text size="28rpx" :bold="true" :text="item.honorName"></u--text>
									</view>
									<view class="title">
										<text v-if="honorType == 1">获奖单位：</text>
										<text v-else-if="honorType == 2">获奖人员：</text>
									</view>
									<view>
										<u--text v-if="honorType == 1" :bold="true" size="24rpx" :text="item.tzSysDept.name"></u--text>
										<u--text v-else-if="honorType == 2" :bold="true" size="24rpx" :text="item.partyMember?item.partyMember.realName:''"></u--text>
									</view>
									<view class="title">
										颁发单位：
									</view>
									<view>
										<u--text :bold="true" size="24rpx" :text="item.awardName"></u--text>
									</view>
								</view>
							</view>

						</view>

						<view style="margin-top: 20rpx;" v-if="moreFlag">
							<loadingIcon></loadingIcon>
						</view>
						<loadMore v-else :status="loadmoreStatus" @loadmore="loadmore()"></loadMore>

					</view>

				</view>
			</view>

		</view>



	</view>
</template>

<script>
import {getDictByType} from "@/api/tDictData"
import {queryTzPartyHonorListOneselfDept} from '@/api/tzPartyHonor'
import {partyMemberLogin} from '@/api/login'
import loadMore from '@/components/loadMore/index'
import loadingIcon from '@/components/loadingIcon/index.vue'
import util from '@/utils/util'
import {distinctData, getLoadmoreStatus} from '@/utils/pageUtil'
import { mapGetters, createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('user')

export default {
	name:"index",
	components: {
		loadMore,
		loadingIcon
	},
	data() {
		return {
			base: util.nginxUrl,
			honorType: 1,
			sortType: 'time',
			honorList: [],
			pageNum: 1,
			pageSize: 10,
			honorClass: [],
			moreFlag: false,
			loadmoreStatus: 'loadmore',
			pageInfoIds: []
		}
	},
	created() {
		/*try {
			xm.setNavigationBarTitle({title: "党内荣誉"});
		} catch (error) {
			document.title = "党内荣誉";
		}*/
		this.init()
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
		async init() {
			await this.getDict('honorClass')
			this.getHonor()
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
						this.honorClass = res
					}
					resolve(res)
				})
			})
		},
    rest() {
			this.pageInfoIds = []
			this.honorList = []
			this.pageNum = 1
    },
		// 荣誉类型切换
		honorTypeChange(type) {
			this.honorType = type
			this.rest()
			this.getHonor()
		},
		// 排序类型切换
		sortTypeChange(type) {
			this.sortType = type
			this.rest()
			this.getHonor()
		},
		loadmore() {
			if (this.moreFlag) {
				return
			}
			this.moreFlag = true
			this.pageNum++
			this.getHonor()
		},
		getHonor() {
			/*uni.showLoading({
				title: '加载中...'
			});*/

			const data = {
				tzPartyHonor: {
						deptId: this.userInfo.deptId,
						honorType: this.honorType,
						status: 2
				},
				pageVo: {
						pageNumber: this.pageNum,
						pageSize: this.pageSize
				},
				sortType: this.sortType
			}
			queryTzPartyHonorListOneselfDept({data: data}).then(res =>{
				// uni.hideLoading()
				if (res.code == '00000') {
					let {ids, resultData} = distinctData(this.pageInfoIds, res.data.records)
					this.pageInfoIds = ids
                    let list = resultData;
                    for (let i = 0; i < list.length; i++) {
                        if(list[i].imagePath){
                            list[i].imagePath = list[i].imagePath.replace("http://10.4.117.31:7000", util.minionUrl);
                        }
                    }
					this.honorList = this.honorList.concat(list)
					this.loadmoreStatus = getLoadmoreStatus(this.honorList, res.data)
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
.content-box {
	min-height: 100vh;
	width: 100%;
	background-image: url('@/static/images/honor/bgImg.png');
	background-size: cover;
	display: flex;
	flex-direction: column;

	.top-img {
		margin-top: 20rpx;
		padding: 0 113rpx 0 195rpx;
	}

	.honor-type {
		margin-top: 50rpx;
		display: flex;
		font-size: 30rpx;

		.type {
			width: 242rpx;
			text-align: center;
			color: white;
			height: 100%;
			position: relative;
			margin: 0 20rpx;

			.name {
				position: relative;
				bottom: 10rpx;
				font-size: 30rpx;
			}
			.img {
				position: absolute;
				bottom: 0;
			}

			.selected {
				font-weight: bold
			}

		}

		.type2 {
			width: 249rpx;
			text-align: center;
			color: white;
			height: 100%;
			position: relative;
			margin: 0 20rpx;

			.name {
				position: relative;
				bottom: 10rpx;
				font-size: 30rpx;
			}
			.img {
				position: absolute;
				bottom: 0;
			}

			.selected {
				font-weight: bold
			}

		}
	}

	.sort-box {
		padding: 30rpx 25rpx 25rpx 25rpx;
		overflow: hidden;
		flex: 1;

		.content {
			display: flex;
			flex-direction: column;
			background-color: white;
			padding: 30rpx 10rpx;
			border-radius: 20rpx;
			height: 100%;
			overflow: hidden;

			.sort-change {
				display: flex;
				align-items: center;
				padding: 0 15rpx;

				.sort-type {
					width: 240rpx;
					position: relative;
					margin: auto;

					.sort-name {
						position: absolute;
						top: 10rpx;
						left: 50rpx;
						font-size: 30rpx;
					}
				}

				.selected {
					color: white;
				}

				.not-selected {
					color: rgba(153, 153, 153, 1);
				}

				.sort-icon {
					width: 28rpx;
				}

			}

			.honor-list {
				margin-top: 20rpx;
				position: relative;
				display: flex;
				flex-direction: column;

				.honor-class-box {
					margin-bottom: -10rpx;
					position: relative;

					.honor-class-img {
						float: right;
						margin-right: 20rpx;
						height: 46rpx;
					}

					.honor-class-text {
						position: absolute;
						right: 50rpx;
						line-height: 46rpx;
						color: white;
						font-size: 26rpx;
					}
				}

				.honor-content-box {
					background-image: url(@/static/images/honor/honor-bg-img.png);
					background-size: 100% 100%;
					display: flex;
					padding: 30rpx 40rpx;

					.honor-img-box {
						width: 204rpx;
						margin-top: 10rpx;

						.honor-img {
							width: $honor-image-width;
							height: $honor-image-height;
						}
					}

					.honor-text {
						padding: 0 25rpx;
						display: flex;
						flex-direction: column;
						line-height: 48rpx;

						.title {
							margin-top: 10rpx;
							margin-bottom: -10rpx;
							font-size: 24prx;
							color: rgba(102, 102, 102, 1);
						}
					}
				}
			}

		}
	}

}
</style>
