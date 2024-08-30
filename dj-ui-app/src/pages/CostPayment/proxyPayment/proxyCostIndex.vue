<template>
	<view v-loading="loading" class="content-box">
		<view class="top-box">
			<image mode="widthFix" src="@/static/images/CostPayment/top-bg-img.png"></image>
			<view class="top-text-box">
				<view class="left-text">
					<view class="text1">欢迎您，{{ userInfo.realName }}</view>
					<view class="text2">{{ userInfo.deptName }}</view>
				</view>
			</view>
		</view>

		<view class="list-box">
			<view :class="search.type == 1?'change-box change-box-left':'change-box change-box-right'">
				<view :class="search.type == 1?'change left active':'change left'" @click="changeSearchType(1)">
					党费代缴
				</view>
				<view :class="search.type == 2?'change right active':'change right'" @click="changeSearchType(2)">
					代缴记录
				</view>
			</view>

			<cost style="flex: 1;" v-if="search.type == 1" :deptId="manageDeptId"></cost>
			<costLog style="flex: 1;" v-if="search.type == 2"></costLog>
		</view>

	</view>
</template>

<script>
	import cost from './proxyCost.vue'
	import costLog from './proxyCostLog.vue'
	import {
		mapGetters
	} from 'vuex'
	import {
		createNamespacedHelpers
	} from 'vuex'
	const {
		mapState,
		mapMutations
	} = createNamespacedHelpers('user')
	export default {
		name: "replaceCostIndex",
		components: {
			cost,
			costLog
		},
		computed: {
			...mapGetters([
				'userInfo'
			]),
			...mapState([
				'loading'
			])
		},
		data() {
			return {
				search: {
					type: 1
				},
                manageDeptId:''
			}
		},
		created() {
			/*try {
				xm.setNavigationBarTitle({
					title: "党费代缴"
				});
			} catch (error) {
				document.title = "党费代缴";
			}*/
		},
		onReady() {
			this.setLoading(false);
		},
		onLoad(option) {
			this.setLoading(true);
			if(option.manageDeptId){
			    this.manageDeptId = option.manageDeptId
            }
		},
		methods: {
			...mapMutations(['setLoading']),
			changeSearchType(type) {
				this.search.type = type
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content-box {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.list-box {
		padding: 25rpx;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.top-box {
		position: relative;

		.top-text-box {
			width: 100%;
			padding: 0 25rpx;
			display: flex;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);

			.left-text {
				color: white;
				flex: 1;

				.text1 {
					font-size: 32rpx;
					font-weight: 900;
					line-height: 40rpx;
				}

				.text2 {
					margin-top: 10rpx;
					font-size: 26rpx;
					font-weight: 700;
					line-height: 40rpx;
				}

			}

			.right-button {
				text-align: center;
				background: white;
				width: 140rpx;
				height: 57rpx;
				line-height: 57rpx;
				border-radius: 10rpx;
				color: rgba(225, 53, 27, 1);
			}

		}
	}

	.change-box {
		display: flex;
		font-weight: bold;
		border: 1px solid red;

		.change {
			text-align: center;
			flex: 1;
			padding: 15rpx;
			color: rgba(225, 53, 27, 1);
			position: relative;
			font-size: 32rpx;
		}

		.active {
			background: rgba(225, 53, 27, 1);
			color: white;
			height: calc(100% + 1px);
		}



		.right {
			margin-right: -1px;
		}
	}


</style>
