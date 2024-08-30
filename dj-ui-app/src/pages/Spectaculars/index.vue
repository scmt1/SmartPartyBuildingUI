<template>
	<view class="content">
		<!-- <uni-row>
			<view style="width: 710rpx;height: 440rpx;">
				<image class="logo" src="/static/title.png"></image>
			</view>
		</uni-row> -->
		<view style="width: 100%;">
		<view style="padding: 20rpx;">

			<view class="title-box">
				<image class="img_tag" src="@/static/images/spectaculars/eye.png"></image>
				<view class="font1">数据一览</view>
			</view>

			<view style="display: flex; margin-bottom: 20rpx;">

				<view style="width: 50%; padding-right: 10rpx;" @click="showPartyDetail(null)">
					<view class="is-not-retire red" style="height: 100%; display: flex; flex-direction: column; justify-content: center;">
						<view>党员总人数</view>
						<view>
							<text>{{ partyMemberCount }}</text>
							<text class="unit">人</text>
						</view>
						<image mode="widthFix" class="bg-img" src="@/static/images/spectaculars/red_person.png"></image>
					</view>
				</view>

				<view style="width: 50%; padding-left: 10rpx; display: flex; flex-direction: column;">

					<view class="is-not-retire yellow" style="margin-bottom: 20rpx;" @click="showPartyDetail('0')">
						<view>在职党员人数</view>
						<view>
							<text>{{ partyMemberCount - partyMemberRetireCount }}</text>
							<text class="unit">人</text>
						</view>
						<image mode="widthFix" class="bg-img2" src="@/static/images/spectaculars/yellow_person.png"></image>
					</view>

					<view class="is-not-retire blue" @click="showPartyDetail('1')">
						<view>退休党员人数</view>
						<view>
							<text>{{ partyMemberRetireCount }}</text>
							<text class="unit">人</text>
						</view>
						<image mode="widthFix" class="bg-img2" src="@/static/images/spectaculars/blue_person.png"></image>
					</view>

				</view>
			</view>

			<view class="bottom-num">
				<view class="img-box">
					<image class="img" mode="heightFix" src="@/static/images/spectaculars/bg-num.png"></image>
				</view>
				<view class="right-box">
					<view class="right-content">

						<view class="right-top">
							<view class="text">党委</view>
							<view class="text">支部总数</view>
							<view class="text">党小组</view>
						</view>
						<view class="right-bottom">
							<view class="text">
								{{ partyCommitteeCount.dw }}
								<text class="unit">个</text>
							</view>
							<view class="text">
								{{ partyCommitteeCount.basic }}
								<text class="unit">个</text>
							</view>
							<view class="text">
								{{ partyCommitteeCount.dxz }}
								<text class="unit">个</text>
							</view>
						</view>

					</view>
				</view>
			</view>


			<view class="title-box">
				<image class="img_tag_party" src="@/static/images/spectaculars/lddy.png"></image>
				<view class="font1">三会一课（固定党日）开展情况</view>
			</view>

			<uni-list :border="false" style="width: 100%;" >
				<uni-list-item class="img_bak1" title="区县排行榜" :showArrow="false" ></uni-list-item>
			</uni-list>
			<v-tabs v-model="partyTab"
				:activeColor="''"
				:lineColor="'#DD524D'"
				:lineHeight="'4rpx'"
				@change="partyChange"
				:tabs="['本月','近三月', '本年']">
			</v-tabs>
			<uni-row style="margin-bottom: 30rpx; margin-top: 10rpx;">
				<wyb-table ref="table" :headers="headers" :contents="qxRankList"
					height="400rpx" textAlign="center" :loading="t_load" :fontSize="[26]" :padding="[10, 10]"
					headerBgColor="#FFEEEC" contentBgColor="#FFF8F7" firstColBgColor="#FFF8F7"
					loaderBgColor="#FFF8F7" @onCellClick="viewDetailSHYK($event, qxRankList, partyTab)"
				/>
			</uni-row>

			<uni-list :border="false" style="width: 100%;" >
				<uni-list-item class="img_bak2"  title="其他党组织排行" ></uni-list-item>
			</uni-list>
			<v-tabs v-model="partyTab_other"
				:activeColor="''"
				:lineColor="'#DD524D'"
				:lineHeight="'4rpx'"
				@change="partyChange_other"
				:tabs="['本月','近三月', '本年']">
			</v-tabs>
			<uni-row style="margin-bottom: 30rpx; margin-top: 10rpx;">
				<wyb-table ref="table" :headers="headers" :contents="otherRankList"
					height="400rpx" textAlign="center" :loading="t_load2" :fontSize="[26]" :padding="[10, 10]"
					headerBgColor="#FFEBCB" contentBgColor="#FFFCEC" firstColBgColor="#FFFCEC"
					loaderBgColor="#FFFCEC" @onCellClick="viewDetailSHYK($event, otherRankList, partyTab_other)"
				/>
			</uni-row>

			<view class="title-box">
				<image class="img_tag_party" src="@/static/images/spectaculars/party.png"></image>
				<view class="font1">组织生活会开展情况</view>
			</view>

			<uni-list :border="false" style="width: 100%;" >
				<uni-list-item class="img_bak1"  title="区县党组织开展率" ></uni-list-item>
			</uni-list>
			<v-tabs v-model="activeTab"
				:activeColor="''"
				:lineColor="'#DD524D'"
				:lineHeight="'4rpx'"
				:tabs="['本年']"
				@change="changeTab" >
			</v-tabs>
			<uni-row>
				<view class="charts-box">
					<qiun-data-charts type="column" :chartData="qxRankChart" :opts="opts" @tap="chartsTap"/>
				</view>
			</uni-row>

			<uni-list :border="false" style="width:100%;margin:40rpx,0rpx,0rpx,0rpx;" >
				<uni-list-item class="img_bak2"  title="其他党组织开展率(前5名)" ></uni-list-item>
			</uni-list>
			<v-tabs v-model="activeTab_other"
				@change="changeTabOther"
				:activeColor="''"
				:lineColor="'#DD524D'"
				:lineHeight="'4rpx'"
				:tabs="['本年']">
			</v-tabs>
			<uni-row>
				<view class="charts-box">
					<qiun-data-charts type="column" :chartData="otherRankChart" :opts="opts" @tap="chartsTap"/>
				</view>
			</uni-row>

			<view class="title-box">
				<image class="img_tag_party" src="@/static/images/spectaculars/lddy.png"></image>
				<view class="font1">党员流动情况</view>
			</view>
			<view class="">
				<uni-row >
					<uni-col :span="24">
						<view class="border_yj3 border_bg3"  @click="showFloatingTable">
							<view style="padding: 60rpx 0rpx 60rpx 0rpx;
								text-align: left; margin:0rpx 0rpx 0rpx 80rpx;">
								<uni-row style="margin-top: 40rpx;margin-bottom: 10rpx;">
									党员流出总人数
								</uni-row>
								<uni-row style="color:#fc3836;font-size: 39rpx;">
									{{ partyMemberFlowCount.flow }}人
								</uni-row>
							</view>
						</view>
					</uni-col>

					<!-- <uni-col :span="12">
						<view class="border_yj3 border_bg4" @click="showFloatingTable">
							<view style="padding: 60rpx 0rpx 60rpx 0rpx;
								text-align: left; margin:0rpx 0rpx 0rpx 80rpx;">
								<uni-row style="margin-top: 40rpx;margin-bottom: 10rpx;">
									党员流入<br>党员总数
								</uni-row>
								<uni-row style="color:#ff9713;font-size: 39rpx;">
									{{ partyMemberFlowCount.flowIn }}人
								</uni-row>
							</view>
						</view>
					</uni-col> -->
				</uni-row>
			</view>

		</view>
		</view>
		<!-- 加载页 -->
		<!-- <view>
			<ourLoading isFullScreen :active="this.active" text="加载中请稍后..." >
				<image class="img" src="../../static/gif3.gif" mode="aspectFit" />
			</ourLoading>
		</view> -->
		<!-- 党员明细弹窗 -->
		<uni-popup ref="popup" type="center" :animation="true" @change="popupChange" class="topSolid">
			<view style="overflow: hidden; background: white; border-radius: 10rpx;">
					<wyb-table ref="table" :headers="detailHeader" :contents="partyDetailList" :scrollToTop="scrollToTop"
						height="60vh" textAlign="center" :fontSize="[26]" :padding="[10, 10]"
						headerBgColor="#FFEEEC" contentBgColor="#FFF8F7" firstColBgColor="#FFF8F7"
						loaderBgColor="#FFF8F7"
					/>
			</view>
		</uni-popup>

		<!-- 排名明细弹窗 -->
		<uni-popup ref="rankDetailPopup" type="center" :animation="true" @change="popupChange" class="topSolid">
			<view style="overflow: hidden; background: white; border-radius: 10rpx;">
				<wyb-table ref="table" :headers="headersDetail" :contents="rankDetailList"
					height="50vh" textAlign="center" :fontSize="[26]" :padding="[10, 10]"
					headerBgColor="#FFEEEC" contentBgColor="#FFF8F7" firstColBgColor="#FFF8F7"
					loaderBgColor="#FFF8F7"
				/>
				<view style="padding: 20rpx 0; text-align: center; background-color: rgb(255, 248, 247);">
					<uni-pagination style="margin-left: 20rpx; margin-right: 20rpx;" :show-icon="true" :total="total" v-model="pageNumber" :pageSize="pageSize" @change="pageNumberChange" />
				</view>
			</view>
		</uni-popup>

		<!-- 党员流入流出弹窗 -->
		<uni-popup ref="floating" type="center" :animation="true"  @change="popupChange" class="topSolid">
			<view>
				<uni-row>
					<wyb-table ref="table" :headers="floatingHeader" :contents="partyMemberCountDetailList"
						height="60vh" textAlign="center" :fontSize="[26]" :padding="[10, 10]"
						headerBgColor="#FFEEEC" contentBgColor="#FFF8F7" firstColBgColor="#FFF8F7"
						loaderBgColor="#FFF8F7"
					/>
				</uni-row>
			</view>
		</uni-popup>
	</view>

</template>

<script>
//引入加载页
import ourLoading from '@/components/our-loading/our-loading.vue'
//引入表格插件
import wybTable from '@/components/wyb-table/wyb-table.vue'
import {getPartyMemberCounts} from '@/api/partyMember'
import {getPartyCommitteeCount} from '@/api/tzSysDept'
import {getPartyMemberFlowCount} from '@/api/partyMember'
import {getOrganizationLifeRanking, getOrganizationLifeRankingOther, getLifeDetailByDept} from '@/api/tzOrganizationLife'
import {getPartyMemberCountByDeptIdsAndVeteran, getPartyMemberCountFlowAndInFlow} from '@/api/partyMember'
import { mapGetters } from 'vuex'
import {partMeeting, qtpartMeeting, theoryMetting, qttheoryMetting} from '@/api/jcxfSJKB'

export default {
	components: {
		ourLoading,
		wybTable
	},
	data() {
		return {
			opts:{
			 xAxis: {
				rotateLabel: true,
				rotateAngle: 45
			 },
			},
			// 党员人数
			partyMemberCount: 0,
			// 退休党员人数
			partyMemberRetireCount: 0,
			// 党委相关数量
			partyCommitteeCount: {
				dw: 0,
				dxz: 0,
				basic: 0
			},
			partyMemberFlowCount: {
				flow: 0,
				flowIn: 0
			},
			qxRankList: [],
			otherRankList: [],
			qxRankChart: {},
			otherRankChart: {},
			//加载页是否显示
			active: false,
			//表格是否显示加载页
			t_load: false,
			t_load2: false,
			//表格表头格式
			headers:[
				{ label: '排名', key: 'ranking', width: 80 },
				{ label: '党组织名称', key: 'name', width: 390 },
				{ label: '支部数', key: 'zbcount', width: 110 },
				{ label: '开展率', key: 'centage', width: 110 }
			],
			headersDetail: [
				{ label: '序号', key: 'index', width: 80 },
				{ label: '党组织名称', key: 'name', width: 460 },
				{ label: '开展完成', key: 'count', width: 150 },
			],
			selectDeptId: null,
			selectType: null,
			total: 0,
			rankDetailList: [],
			pageNumber: 1,
			pageSize: 30,
			//党员表格表头
			detailHeader:[
				{ label: '序号', key: 'index', width: 80 },
				{ label: '党组织名称', key: 'name', width: 460 },
				{ label: '党员数', key: 'dycount', width: 150 }
			],
			//党员流入流出表格表头
			partyMemberCountDetailList: [],
			floatingHeader:[
				{ label: '序号', key: 'index', width: 80 },
				{ label: '党组织名称', key: 'name', width: 460 },
				//{ label: '流入数量', key: 'flowIn', width: 150 },
				{ label: '流出数量', key: 'flow', width: 150 }
			],
			//党员和支部数量明细
			partyDetailList: [],
			deptList: [],
			//党员流入流出明细
			floatingList: [],
			partyTab: 0,
			partyTab_other: 0,
			activeTab: 0,
			activeTab_other: 0,
			scrollTop: 0,
			deptId: '',
			veteran: null,
			scrollToTop: false,
		}
	},
	filters: {
		deptNameFilter: function (value) {
			return value
		}
	},
	computed: {
		...mapGetters([
			'userInfo'
		])
	},
	onLoad() {
		this.deptId = this.userInfo.deptId + ''
		// this.initdata();
		this.getPartyMemberCount()
		this.getPartyCommittee()
		this.getPartyMemberFlow()
		this.getLifeRanking(0)
		this.getLifeOtherRanking(0)
		this.getLifeCountToRank(2)
		this.getLifeOtherCountToRank(2)
	},
	methods: {
		//党员数
		getPartyMemberCount(){
			let data = {
				deptId: this.deptId
			}
			getPartyMemberCounts(data).then(res => {
				if (res.code == "00000") {
					this.partyMemberCount = res.data.all
					this.partyMemberRetireCount = res.data.retire
				}
			})
		},
		showPartyDetail(veteran) {
			uni.showLoading({
				title: "正在加载...",
				mask: true
			})

			this.pageNumber = 1
			this.veteran = veteran
			this.getPartyMemberCountDetail()
		},
		// 党员数量详细信息获取
		getPartyMemberCountDetail() {
			let data = {
				veteran: this.veteran,
				deptId: this.deptId,
			}
			getPartyMemberCountByDeptIdsAndVeteran(data).then(res => {
				if (res.code == '00000') {
					this.partyDetailList = res.data
					this.$refs.popup.open('center')
				}
			})
		},
		// 获取三会一课点击后详情数据
		viewDetailSHYK(event, dataList, index) {
			uni.showLoading({
				title: "正在加载...",
				mask: true
			})

			const data = dataList[event.contentIndex]

			let type = ''
			if (index == 0) {
				type = 'thisMonth'
			} else if (index == 1) {
				type = 'threeMonth'
			} else if (index == 2) {
				type = 'thisYear'
			}
			this.pageNumber = 1

			this.selectDeptId = data.id
			this.selectType = type
			this.getRankDetail()
		},
		pageNumberChange(event) {
			this.pageNumber = event.current
			this.getRankDetail()
		},
		getRankDetail() {
			let data = {
				deptId: this.selectDeptId + '',
				type: this.selectType,
				pageVo: {
					pageNumber: this.pageNumber,
					pageSize: this.pageSize
				}
			}

			getLifeDetailByDept(data).then(res => {
				if (res.code == '00000') {
					this.rankDetailList = res.data.data
					this.$refs.rankDetailPopup.open('center')
					this.total = res.data.total
				}
			})
		},
		// 党委数量
		getPartyCommittee() {
			let data = {
				deptId: this.deptId
			}
			getPartyCommitteeCount(data).then(res => {
				if (res.code == '00000') {
					this.partyCommitteeCount.dw = res.data.dw
					this.partyCommitteeCount.dxz = res.data.dxz
					this.partyCommitteeCount.basic = res.data.basic
				}
			})
		},
		// 流入流出人数
		getPartyMemberFlow() {
			let data = {
				deptId: this.deptId
			}
			getPartyMemberFlowCount(data).then(res => {
				if (res.code == '00000') {
					this.partyMemberFlowCount.flow = res.data.flow
					// this.partyMemberFlowCount.flowIn = res.data.flowIn
				}
			})
		},
		getLifeRanking(index) {
			this.t_load = true
			let type = ''
			if (index == 0) {
				type = 'thisMonth'
			} else if (index == 1) {
				type = 'threeMonth'
			} else if (index == 2) {
				type = 'thisYear'
			}

			let data = {
				type: type
			}

			getOrganizationLifeRanking(data).then(res => {
				this.t_load = false
				if (res.code == '00000') {

					let qxList = []
					let qxCentage = new Set()

					for (let i = 0; i < res.data.length; i++) {
						let data = res.data[i]
						if (Number(data.zbcount) > 0) {
							data.centage = ((data.overCount/data.zbcount).toFixed(4) * 100)
						} else {
							data.centage = 0
						}

						if (data.isQx) {
							qxCentage.add(data.centage)
							qxList.push(data)
						}
					}

					qxCentage = Array.from(qxCentage).sort((a,b) => {
							return b - a;
					})

					this.qxRankList = this.getRank(qxList, qxCentage)
				}
			})
		},
		getLifeOtherRanking(index) {
			this.t_load2 = true
			
			let type = ''
			if (index == 0) {
				type = 'thisMonth'
			} else if (index == 1) {
				type = 'threeMonth'
			} else if (index == 2) {
				type = 'thisYear'
			}

			let data = {
				type: type
			}

			getOrganizationLifeRankingOther(data).then(res => {
				this.t_load2 = false
				if (res.code == '00000') {

					let otherList = []
					let otherCentage = new Set()

					for (let i = 0; i < res.data.length; i++) {
						let data = res.data[i]
						if (Number(data.zbcount) > 0) {
							data.centage = ((data.overCount/data.zbcount).toFixed(4) * 100)
						} else {
							data.centage = 0
						}

						if (!data.isQx) {
							otherCentage.add(data.centage)
							otherList.push(data)
						}
					}

					otherCentage = Array.from(otherCentage).sort((a,b) => {
							return b - a;
					})

					this.otherRankList = this.getRank(otherList, otherCentage)
				}
			})
		},
		getRank(dataList, centageList) {
			for (let i = 0; i < dataList.length; i++) {
				for (let n = 0; n < centageList.length; n++) {
					if (dataList[i].centage == centageList[n]) {
						dataList[i].ranking = n + 1
						break
					}
				}
				dataList[i].centage = dataList[i].centage.toFixed(2) + '%'
			}

			dataList.sort((a,b) => {
				return a.ranking - b.ranking
			})

			return dataList
		},
		// 获取组织生活会完成情况
		getLifeCountToRank(status) {
			let data = {
				status: status
			}
			theoryMetting(data).then(res => {
				if (res.code == '00000') {
					this.qxRankChart = this.getRankChart(res.data, res.data.length)
				}
			})
		},
		getLifeOtherCountToRank(status) {
			let data = {
				status: status
			}
			qttheoryMetting(data).then(res => {
				if (res.code == '00000') {
					this.otherRankChart = this.getRankChart(res.data, 5)
				}
			})
		},
		// 组织生活会数据处理
		getRankChart(dataList, length) {
			dataList.sort((a,b) => {
				return Number(b.value.replace('%', '')) - Number(a.value.replace('%', ''))
			})
			let columdata={
				categories:[],
				series:[{
					name: "开展率(%)",
					data: [],
					color:"#ff9713",
			  }]
			}
			for (let i = 0; i < dataList.length && i < length; i++) {
				let item = dataList[i]
				let name = item.text.replace("中共","")
				name = name.replace("四川","")
				name = name.replace("省","")
				name = name.replace("泸州市","")

				if (name.length > 9) {
					name = name.replace("工作委员会","")
				}

				columdata.categories.push(name)
				columdata.series[0].data.push(Number(item.value.replace('%', '')))
			}

			return columdata
		},
		// 区县三会一课时间切换
		partyChange(index){
			uni.showLoading({
				title: "正在加载...",
				mask: true
			})

			this.partyTab = index
			this.t_load = true
			this.qxRankList = []
			this.getLifeRanking(index)
		},
		// 其他组织三会一课时间切换
		partyChange_other(index){
			uni.showLoading({
				title: "正在加载...",
				mask: true
			})

			this.partyTab_other = index
			this.otherRankList = []
			this.getLifeOtherRanking(index)
		},
		// 区县组织生活会时间切换
		changeTab(index) {
			this.qxRankChart = {}
		},
		// 其他组织生活会时间切换
		changeTabOther(index) {
			this.otherRankChart = {}
		},
		popupChange(e) {
			if (e.show) {
				this.scrollTop= window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
				document.body.style.top = (-1 * this.scrollTop) + 'px'
				document.body.style.position = 'fixed'
			} else{
				document.body.style.position = null
				document.body.style.top = ''
				window.scrollTo(0, this.scrollTop)
			}
		},
		chartsTap(event) {
			//console.log('图标点击')
			//console.log(event)
		},
		showFloatingTable() {
			this.getPartyMemberFloatingCount()
		},
		getPartyMemberFloatingCount() {
			let data = {
				deptId: this.deptId
			}
			getPartyMemberCountFlowAndInFlow(data).then(res => {
				if (res.code == '00000') {
					this.partyMemberCountDetailList = res.data
					this.$refs.floating.open('center')
				}
			})
		}
	}
}
</script>

<style scoped lang="scss">
	::v-deep .uni-pagination__total {
		font-size: 24rpx;
	}

	::v-deep .uni-pagination__num-tag {
		font-size: 24rpx;
	}

	.is-not-retire {
		font-size: 39rpx;
		border-radius: 15rpx;
		color: white;
		font-weight: bold;
		padding: 20rpx 25rpx;
		line-height: 60rpx;
		word-break: break-all;
		position: relative;
		overflow: hidden;
		z-index: 1;

		.unit {
			margin-left: 10rpx;
			line-height: 63rpx;
			font-size: 30rpx;
		}

		.bg-img {
			position: absolute;
			width: 200rpx;
			right: 0;
			bottom: 0;
			z-index: -1;
		}

		.bg-img2 {
			position: absolute;
			width: 120rpx;
			right: 0;
			bottom: 0;
			z-index: -1;
		}
	}
	.yellow {
		background: linear-gradient(to right, rgb(255, 163, 18), rgb(253, 195, 110));
	}

	.blue {
		background: linear-gradient(to right, rgb(72, 124, 255), rgb(124, 167, 255));
	}

	.red {
		background: linear-gradient(to right, rgb(252, 63, 63), rgb(255, 117, 92));
	}


	.bottom-num {
		margin-bottom: 20rpx;
		display: flex;
		background: linear-gradient(to right, rgb(236, 108, 63), rgb(250, 133, 97));
		color: white;
		border-radius: 15rpx;
		line-height: 40rpx;
		word-break: break-all;

		.img-box {
			display: flex;
			align-items: center;
			padding: 10rpx 0 10rpx 20rpx;

			.img {
				height: 120rpx;
			}
		}

		.right-box {
			flex: 1;
			text-align: center;
			display: flex;
			align-items: center;

			.right-content {
				width: 100%;
				padding: 20rpx 20rpx 20rpx 10rpx;
				font-size: 26rpx;

				.right-top {
					display: flex;
					align-items: center;
					.text {
						width: 33.33333%;
					}
				}

				.right-bottom {
					display: flex;

					.text {
						width: 33.33333%;
						color: rgb(253, 221, 127);

						.unit {
							font-size: 20rpx;
						}
					}
				}
			}
		}

	}

	.title-box {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.logo{
		width: 100%;
		height: 100%;
	}
	.img {
		max-width: 30vw;
		height: 100rpx;
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.charts-box{
		width: 100%;
	}
	::v-depp .uni-row {
	    margin-bottom: 20rpx;

	}
	.img_tag{
		width: 45rpx;
		height: 26rpx;
	}
	.img_tag_party{
		width: 39rpx;
		height: 39rpx;
	}
	.img_bak1{
		background-image: url(@/static/images/spectaculars/yjzx.png);
		background-size: 100% 100%;
	}
	.img_bak2{
		background-image: url(@/static/images/spectaculars/yjjx2.png);
		background-size: 100% 100%;
	}
	.border_yj{
		border-radius:10rpx;
		border:1rpx solid #E8E8E8;
		padding: 20rpx;
	}
	.border_yj2{
		border-radius:20rpx;
		border:1rpx solid #E8E8E8;
		font-size: 39rpx;
		color: white;
		font-weight:bold;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		word-break: break-all;
		padding: 25rpx 25rpx;
		flex: 1;
		min-height: 160rpx;
	}
	.border_yj3{
		border-radius:20rpx;
		font-size: 32rpx;
		color:#555555;
		font-weight:bold;
		text-align: center;
		width: 100%;
		height: 302rpx;
	}
	.border_bg1{
		background-image: url(@/static/images/spectaculars/bg1.png);
		background-size: 100% 100%;
	}
	.border_bg2{
		background-image: url(@/static/images/spectaculars/bg2.png);
		background-size: 100% 100%;
	}
	.border_bg3{
		background-image: url(@/static/images/spectaculars/lc.png);
		background-size: 100% 100%;
	}
	.border_bg4{
		background-image: url(@/static/images/spectaculars/nmg.png);
		background-size: 100% 100%;
	}
	.font1{
		font-weight:bold;
		font-size: 32rpx;
		margin-left: 20rpx;
	}
	::v-deep .uni-list-item__content-title {
		font-weight:bold;
		color: white;
		font-size: 30rpx;
	}
	.topSolid{
		border-top: 0px solid rgb(225, 225, 225);
	}

</style>
