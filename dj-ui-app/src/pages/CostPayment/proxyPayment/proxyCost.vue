<template>
	<view style="display: flex; flex-direction: column;">
        <view style="display: flex;padding-top: 30rpx;">
            <view class="top-text" @click="showTree">{{ selectDeptName }}</view>
            <u-icon name="arrow-down" color="rgb(225, 53, 27)" size="28" style="margin-left: 6rpx;"></u-icon>
        </view>

		<view style="margin-top: 25rpx; flex: 1 0 auto; height: 0; overflow: auto;">
			<view class="box" v-for="(item, index) in dataList" :key="index">

				<view style="display: flex; align-items: center;">
						<radio @click="checkedChange(item.constList, index)" color="rgb(225, 53, 27)" :checked="getCheckedAllStatus(item.partyMemberId)"></radio>
						<text @click="radioShow(item)" style="font-weight: 700; padding: 0 10rpx; margin-top: 5rpx;">{{ item.name }}</text>
						<u-icon @click="radioShow(item)" size="16rpx" name="play-right-fill" :class="item.show?'icon':'icon2'" style="margin-top: 5rpx;"></u-icon>
				</view>

				<view :class="item.show?'content-show':'content-hide' ">
					<view :class="item.show?'content-title-show':'content-title-hide'">
						<view class="content-title-name">月份</view>
						<view class="content-title-name">金额</view>
					</view>

					<view class="list-box" v-for="(cost, index2) in item.constList" :key="index2">
						<view class="list-left" style="display: flex; align-items: center;" @click="checkedChange([cost], index)">
								<radio color="rgb(225, 53, 27)" :checked="getCheckedStatus(cost)"></radio>
								<view style="padding-left: 10rpx;margin-top: 5rpx;" @click="getCheckedStatus(cost)">{{ formartDate(cost.time, 'yyyy-MM') }}</view>
						</view>
						<view class="list-right" @click="getCheckedStatus(cost)" style="margin-top: 5rpx;">
							{{ cost.cost }}元
						</view>
					</view>
				</view>

			</view>
			<view v-if="dataList.length == 0" style="text-align: center; font-size: 26rpx; color: rgb(206, 209, 216);">
				暂无党费交纳
			</view>
		</view>


		<view class="bottom-box" v-if="dataList.length > 0">
			<view class="bottom-left" @click="checkedAll()">
					<radio color="rgb(225, 53, 27)" :checked="checkedAllFlag"></radio>
					<text style="font-size: 30rpx; padding-left: 10rpx; margin-top: 5rpx;">全选</text>
			</view>
			<view class="bottom-right">
				合计：<text style="color: rgb(225, 53, 27);">￥{{ Number(payFeeTotal).toFixed(2) }}元</text>
			</view>
			<view>
				<view class="pay-button" @click="payIt">支付</view>
			</view>
		</view>

        <qian-tree ref="tkitree" @confirm="treeConfirm" @cancel="treeCancel" :treeData="deptRange" numKey="noDoneNum"
                   :foldAll="false" :selectParent="false" valueKey="id" labelKey="name" :multiple="false" confirmColor="#4e8af7" />
	</view>
</template>

<script>
import DaTreeVue2 from '@/components/da-tree-vue2/index.vue'
import {getPayFeeDetailListByDept, payForOther} from '@/api/payFeeDetail'
import { mapGetters } from 'vuex'
import {getDeptTree} from "@/api/tzSysDept";
import qianTree from "@/components/qian-tree/qian-tree.vue"
import Wechat from "@/utils/wechat";

export default {
	name:"replaceCost",
	components: {
		DaTreeVue2,
        qianTree
	},
    props:{
        deptId: {
            type: String,
            default: ""
        },
    },
	data() {
		return {
			baseList:[],
			dataList: [],
			checkedAllList: [],
			checkedList: [],
			payFeeTotal: 0.00,
			checkedAllFlag: false,
            deptRange:[],
            manageDeptId:this.deptId,
            selectDeptId:'',
            selectDeptName:'',
		}
	},
	computed: {
		...mapGetters([
			'userInfo'
		])
	},
	mounted() {
		this.dataList = []
        this.selectDeptId = this.userInfo.deptId
        this.selectDeptName = this.userInfo.deptName
        this.getSysDeptList(this.manageDeptId)
		this.getPayFeeDetailList()
	},
	methods: {
        getSysDeptList(deptId){
            getDeptTree({deptId:deptId+""}).then(res =>{
                this.deptRange = res
            })
        },
        // 显示树形选择器
        showTree() {
            this.$refs.tkitree._show();
        },
        // 确定回调事件
        treeConfirm(e) {
            if(e.id[0]){
                this.selectDeptId = e.id[0]
                this.dataList = []
                this.getPayFeeDetailList()
            }
            if(e.name[0]){
                this.selectDeptName = e.name[0]
            }
        },
        // 取消回调事件
        treeCancel(e) {

        },
		payIt(){
			if(!this.checkedList||this.checkedList.length==0){
				uni.showToast({
					title:'请选择缴费',
					icon:'none'
				})
				return false
			}
			if(this.payFeeTotal <= 0){
                uni.showToast({
                    title:'支付金额为0 ，无法支付',
                    icon:'none'
                })
                return false
            }
			this.baseList = this.baseList.filter(item => this.checkedList.some(checkedItem => checkedItem.id === item.id))

            uni.showLoading({
                title: '正在加载..'
            })
            let data ={
                payFeeTotal: this.payFeeTotal,
                payFeeDetails: this.baseList,
                insteadPayPartyMemberId: this.userInfo.id + ''
            }
            let appType = uni.getStorageSync("appType");
            if(appType === "weixin"){
                data.payType = "wx_jsapi"
            }

            payForOther({data:data}).then(res=>{
                uni.hideLoading()
                if(res.code=='00000'){
                    let url = window.location.href
                    let data = res.data.split('<script type="text/javascript">')
                    let code = 'window.history.pushState(null, null, document.URL);'+
                        'window.addEventListener("popstate", function() { location.reload() });'+
                        'function djCancelPay() { location.reload() }'

                    let data1 = data[0]+'<script type="text/javascript">'+code+data[1]
                    let split1 = '<div class="bottom">'
                    let data1List = data1.split(split1)
                    let code1 = '<div class="bottom" style="margin-bottom: 0px !important;">'+
                        '<button type="button" onclick="djCancelPay()" class="layui-btn layui-btn-lg" '+
                        'style="width: 80%; height: 50px !important; font-size: 20px !important; border-radius: 10px !important; background-color: #fe0b4c !important; margin-bottom: 0px;">'+
                        '取消支付</button></div>'

                    let result = data1List[0] + code1 + split1 + data1List[1]
                    document.write(result)
                    document.close()
                } else if(res.code=='666666') {
                    Wechat.callWexinPay(res.data, () => {
                        // 支付成功
                        uni.navigateTo({
                            url:"/pages/Home/Home"
                        })
                    }, () => {
                        // 支付失败
                        uni.showToast({
                            icon: "error",
                            title: "支付失败",
                            duration: 2000
                        })
                    })
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: res.msg,
                        duration: 2000
                    })
                }
            })
		},
		checkedAll() {
			this.payFeeTotal = 0
			this.checkedList = []
			this.checkedAllList = []
			if (!this.checkedAllFlag) {
				for (let i = 0; i < this.dataList.length; i++) {
					this.checkedChange(this.dataList[i].constList, i)
				}
			}else{
        this.checkedAllFlag = false
      }

		},
		checkedChange(item, index) {
			for (let i = 0; i < item.length; i++) {
				let val = item[i]
				let num = this.checkedList.indexOf(val)
				if (item.length == 1) {
					if (num > -1) {
						this.payFeeTotal = this.accAdd(this.payFeeTotal, -Number(val.cost))
						this.checkedList.splice(num, 1)
					} else {
						this.payFeeTotal = this.accAdd(this.payFeeTotal, val.cost)
						this.checkedList.push(val)
					}
				} else {
					let partyMemberId = this.dataList[index].partyMemberId
					let num2 = this.checkedAllList.indexOf(partyMemberId)
					if (num2 > -1 && num > -1) {
						this.payFeeTotal = this.accAdd(this.payFeeTotal, -Number(val.cost))
						this.checkedList.splice(num, 1)
					} else if (num2 < 0 && num < 0){
						this.payFeeTotal = this.accAdd(this.payFeeTotal, val.cost)
						this.checkedList.push(val)
					}
				}
			}
			this.setCheckedAllList(item, index)
		},
		setCheckedAllList(item, index) {
			let num = this.checkedList.indexOf(item)
			let partyMemberId = this.dataList[index].partyMemberId
			let num2 = this.checkedAllList.indexOf(partyMemberId)
			if (num > -1 || num2 > -1) {
				this.checkedAllList.splice(num2, 1)
			} else {
				let costList = this.dataList[index].constList
				let flag = true
				for (let i = 0; i < costList.length; i++) {
					if (this.checkedList.indexOf(costList[i]) < 0) {
						flag = false
						break
					}
				}
				if (flag) {
					this.checkedAllList.push(partyMemberId)
				} else {
					if (num2 > -1) {
						this.checkedAllList.splice(num2, 1)
					}
				}
			}

			if (this.checkedAllList.length == this.dataList.length) {
				this.checkedAllFlag = true
			} else {
				this.checkedAllFlag = false
			}

		},
		getCheckedAllStatus(partyMemberId) {
			if (this.checkedAllList.indexOf(partyMemberId) > -1) {
				return true
			} else {
				return false
			}
		},
		getCheckedStatus(item) {
			if (this.checkedList.indexOf(item) > -1) {
				return true
			} else {
				return false
			}
		},
		accAdd(arg1,arg2){
				let r1,r2,m;
				try {
						r1 = arg1.toString().split(".")[1].length
				} catch(e) {
						r1 = 0
				}
				try{
						r2 = arg2.toString().split(".")[1].length
				} catch (e) {
						r2 = 0
				}
				m = Math.pow(10, Math.max(r1,r2))
				let val = (arg1 * m + arg2 * m) / Number(m)
				return val.toFixed(2)
		},
		getPayFeeDetailList() {
			let data = {
				deptId: this.selectDeptId + '',
				partyMemberId: this.userInfo.id + ''
			}
			getPayFeeDetailListByDept(data).then(res => {
				if (res.code == '00000') {
					this.baseList = res.data
					let list = {}
					for (let i = 0; i < res.data.length; i++) {
						let data = res.data[i]
						if (!list[data.partyMemberId+'_index']) {
							let va = {
								partyMemberId: data.partyMemberId,
								name: data.name,
								show: false,
								constList: [
									{
										id: data.id,
										cost: Number(data.shouldPay).toFixed(2),
										time: data.payMonth
									}
								]
							}
							list[data.partyMemberId+'_index'] = va
						} else {
							let va = {
								id: data.id,
								cost: Number(data.shouldPay).toFixed(2),
								time: data.payMonth
							}
							list[data.partyMemberId+'_index'].constList.push(va)
						}

					}
					for (let key in list) {
						if (list.hasOwnProperty(key)) {
							this.dataList.push(list[key])
						}
					}
				}
			})
		},
		radioShow(item) {
			let num = this.dataList.indexOf(item)
			if (num > -1) {
				this.dataList[num].show = !this.dataList[num].show
			}
		},
		formartDate(date, fmt) {
				if (date == undefined || date == null || date.toString().trim().length <= 0) {
						return ''
				}
				if (typeof date === 'string') {
						date = new Date(date)
				}
				date = date == undefined ? new Date() : date
				date = typeof date == 'number' ? new Date(date) : date
				fmt = fmt || 'yyyy-MM-dd HH:mm:ss'
				let obj = {
						'y': date.getFullYear(), // 年份，注意必须用getFullYear
						'M': date.getMonth() + 1, // 月份，注意是从0-11
						'd': date.getDate(), // 日期
						'q': Math.floor((date.getMonth() + 3) / 3), // 季度
						'w': date.getDay(), // 星期，注意是0-6
						'H': date.getHours(), // 24小时制
						'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
						'm': date.getMinutes(), // 分钟
						's': date.getSeconds(), // 秒
						'S': date.getMilliseconds() // 毫秒
				}
				let week = ['天', '一', '二', '三', '四', '五', '六']
				for (var i in obj) {
						fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
								var val = obj[i] + ''
								if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val]
								for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
								return m.length == 1 ? val : val.substring(val.length - m.length)
						})
				}

				return fmt
		}
	}
}
</script>

<style lang="scss" scoped>
	::v-deep uni-radio .uni-radio-wrapper {
		margin-top: -2rpx;
		width: 30rpx;
		height: 30rpx;
	}
	::v-deep uni-radio .uni-radio-input {
		margin: 0;
		border-radius: 5rpx;
		width: 30rpx;
		height: 30rpx;
	}
	::v-deep uni-radio .uni-radio-input.uni-radio-input-checked:before {
		font-size: 16rpx;
	}

	.top-text {
		color: rgb(225, 53, 27);
		font-weight: 700;
		font-size: 28rpx;
	}

	.box {
		margin-top: 20rpx;
		font-size: 30rpx;

		.icon {
			transform: rotate(90deg);
			transition: all 0.2s;
		}

		.icon2 {
			transform: rotate(0deg);
			transition: all 0.2s;
		}

		.content-show {
			opacity: 1;
			height: auto;
			overflow: hidden;
			transition: all 0.2s;
			padding: 10rpx 25rpx;
			color: rgb(73, 72, 70);
		}

		.content-hide {
			opacity: 0;
			height: 0;
			overflow: hidden;
			transition: all 0.2s;
			padding: 10rpx 25rpx;
			color: rgb(73, 72, 70);
		}

		.content-title-show {
			height: 45rpx; line-height: 45rpx; display: flex; background: rgb(254, 240, 240);
		}

		.content-title-hide {
			height: 0; line-height: 45rpx; display: flex; background: rgb(254, 240, 240);
		}

		.content-title-name {
			width: 50%; text-align: center;
		}

		.list-box {
			display: flex;
			margin: 20rpx 0;
			padding: 0 15rpx;
			align-items: center;

			.list-left {
				width: 50%;
			}

			.list-right {
				width: 50%; text-align: center;
			}
		}

	}

	.bottom-box {
		padding-top: 10rpx;
		display: flex; align-items: center;

		.bottom-left {
			display: flex;
			align-items: center;
			flex: 1;
		}

		.bottom-right {
			font-size: 30rpx; margin: 15rpx; font-weight: 700;
		}

		.pay-button {
			color: white;
			font-size: 30rpx;
			font-weight: 700;
			text-align: center;
			height: 60rpx;
			width: 140rpx;
			background: rgb(225, 53, 27);;
			border-radius: 10rpx;
			line-height: 60rpx;
		}
	}
    ::v-deep .u-icon__icon {
        font-weight: bold !important;
    }

</style>
