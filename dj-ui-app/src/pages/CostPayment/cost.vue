<template>
	<view >
		<view class="shell">

			<u-row>
				<u-col span="6">
					<view class="title">月份</view>
				</u-col>
				<u-col span="6">
					<view class="title">交纳金额</view>
				</u-col>
			</u-row>

			<view class="list">
				<view v-for="(item, index) in dataList" :key="index">
					<label style="display: flex; align-items: center;" @click="checkedChange(item)">
						<view class="row" style="width: 50%; display: flex;">
								<radio :checked="getCheckedStatus(item)" color="rgb(225, 53, 27)"></radio>
								<text style="font-size: 30rpx; padding-left: 10rpx;">{{ formartDate(item.payMonth, 'yyyy年MM月') }}</text>
						</view>
						<view style="width: 50%;">
							<view style="text-align: center; font-size: 30rpx;">{{ item.shouldPay?item.shouldPay.toFixed(2):'0.00' }}元</view>
						</view>
					</label>
				</view>
                <view style="margin-top: 20rpx;" v-if="moreFlag">
                    <loadingIcon></loadingIcon>
                </view>
                <loadMore v-else :status="loadmoreStatus" @loadmore="loadmore()"></loadMore>
            </view>
		<view class="bottom-box" v-if="dataList.length > 0">
			<view class="bottom-left" style="display: flex; align-items: center;" @click="checkedAll()">
					<radio color="rgb(225, 53, 27)" :checked="checkedAllFlag"></radio>
					<text style="font-size: 30rpx; padding-left: 10rpx; margin-top: 5rpx;">全选</text>
			</view>
			<view class="bottom-right">
				合计：<text style="color: rgb(225, 53, 27);">￥{{ payFeeTotal }}元</text>
			</view>
			<view>
				<view class="pay-button" @click="toPay">支付</view>
			</view>
		</view>
	</view>
    <u-popup :show="payShow" mode="center" :round="20" @close="close" :safeAreaInsetBottom="false">
        <view class="bg-img">
            <view class="content">
                <view class="name">{{userInfo.realName}}</view>
                <view class="deptName">所在支部:{{userInfo.deptName}}</view>
                <view class="time">入党时间:{{$formatTime(userInfo.partyTime, 'yyyy年MM月DD日')}}</view>
                <view class="tip">今天是您加入中国共产党</view>
                <view style="display: flex;justify-content: center;align-items: end;padding: 20rpx 0 40rpx;">
                    <view>第</view>
                    <view class="year">{{ yearAndDay.years }}</view>
                    <view>年</view>
                    <view class="day">{{ yearAndDay.days }}</view>
                    <view>天</view>
                </view>
                <view class="money">党费标准:￥<span style="font-size: 40rpx;color: red;">{{payFeeTotal}}</span>元</view>
                <view @click="payIt" class="btn">点击交纳</view>
            </view>
        </view>
    </u-popup>
</view>
</template>

<script>
import {getPayFeeDetailPageByPartyMember,payByOneself} from '@/api/payFeeDetail'
import loadMore from '@/components/loadMore/index'
import loadingIcon from '@/components/loadingIcon/index.vue'
import {distinctData, getLoadmoreStatus} from '@/utils/pageUtil'
import { mapGetters } from 'vuex'
import {getLocalStorageInfo} from "@/utils/localStorageInfo";
import { dateDiffInYearsDays } from '@/utils/moment'
import Wechat from '@/utils/wechat.js'

export default {
	name:"cost",
	components: {
		loadMore,
		loadingIcon
	},
	data() {
		return {
            payShow:false,
			pageSize: 10,
			pageNum: 1,
			dataList: [],
			checkedList: [],
			checkedAllFlag: false,
			payFeeTotal: 0.00,
			moreFlag: false,
            loadmoreStatus: 'loadmore',
            pageInfoIds: [],
            user:{},
            yearAndDay:{}
		}
	},
	computed: {
		...mapGetters([
			'userInfo'
		])
	},
	mounted() {
	    this.user = getLocalStorageInfo('userInfo')
        this.yearAndDay = (dateDiffInYearsDays(this.$formatTime(this.user.partyTime, 'yyyy-MM-DD')))
		this.getPayFeeDetail()
	},
	methods: {
        toPay(){
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
            this.payShow = true
        },
        close(){
            this.payShow = false
        },
		checkedAll() {
			if (this.checkedList.length < this.dataList.length) {
				for (let i = 0; i < this.dataList.length; i++) {
					this.checkedList.push(this.dataList[i])
					this.payFeeTotal = this.accAdd(this.payFeeTotal, this.dataList[i].shouldPay)
				}
				this.checkedAllFlag = true
			} else {
				this.checkedList = []
				this.payFeeTotal = 0.00
				this.checkedAllFlag = false
			}
		},
		checkedChange(event) {
			let num = this.checkedList.indexOf(event)
			if (num < 0) {
				this.checkedList.push(event)
				this.payFeeTotal = this.accAdd(this.payFeeTotal, event.shouldPay)
				if (this.checkedList.length == this.dataList.length) {
					this.checkedAllFlag = true
				}
			} else {
				this.checkedList.splice(num, 1)
				this.payFeeTotal = this.accAdd(this.payFeeTotal, -event.shouldPay)
				this.checkedAllFlag = false
			}
		},
		getCheckedStatus(item) {
			if (this.checkedList.indexOf(item) > -1) {
				return true
			} else {
				return false
			}
		},
		payIt(){
			if(!this.checkedList||this.checkedList.length==0){
				uni.showToast({
					title:'请选择缴费',
					icon:'none'
				})
				return false
			}

			uni.showLoading({
				title: '正在加载..'
			})

            let data ={
                payFeeTotal:this.payFeeTotal,
                payFeeDetails:this.checkedList,
                partyMemberId: this.userInfo.id + ''
            }
            let appType = uni.getStorageSync("appType");
			if(appType === "weixin"){
                data.payType = "wx_jsapi"
            }
            payByOneself({data:data}).then(res=>{
                uni.hideLoading()
                if(res.code=='00000'){
                    console.log(123123)
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
                }else {
                    uni.showToast({
                        icon: 'none',
                        title: res.msg,
                        duration: 2000
                    })
                }
            })
		},
		loadmore() {
			if (this.moreFlag) {
				return
			}
			this.moreFlag = true
			this.pageNum++
			this.getPayFeeDetail()
		},
		getPayFeeDetail() {
			let data = {
				partyMemberId: this.userInfo.id + '',
				status: '0',
				isInsteadPay: '0',
				pageVo: {
					pageNumber: this.pageNum,
					pageSize: this.pageSize
				},
				orderBy: 'pay_month'
			}
			getPayFeeDetailPageByPartyMember({data: data}).then(res => {
				this.moreFlag = false
				if (res.code == '00000') {
					let {ids, resultData} = distinctData(this.pageInfoIds, res.data.records)
					this.pageInfoIds = ids
					this.dataList = this.dataList.concat(resultData)
					this.loadmoreStatus = getLoadmoreStatus(this.dataList, res.data)

					/*this.dataList = this.dataList.concat(res.data.records)
					if (this.dataList.length < res.data.total && res.data.total > 0) {
						this.status = 'loadmore'
					} else {
						this.status = 'nomore'
					}*/
				}
			})
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
				let val = (arg1 * m + arg2 * m) / m
				return val.toFixed(2)
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

				let nowTime = new Date()

				if (date.getFullYear() < nowTime.getFullYear() || date.getMonth() + 1 < nowTime.getMonth() + 1) {
					fmt += '(补缴)'
				}

				return fmt
		}
	}
}
</script>

<style lang="scss" scoped>
	::v-deep uni-radio .uni-radio-wrapper {
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

	.shell {
		padding-top: 25rpx;
		display: flex;
		flex-direction: column;
		height: 100%;

		.title {
			text-align: center;
			font-weight: 700;
			font-size: 30rpx;
		}

		.list {
			color: rgb(70, 68, 69);
			margin-top: 20rpx;
			padding-left: 25rpx;
			padding-right: 25rpx;
			flex: 1 0 auto;
			overflow: auto;
			height: 0;

			.row {
				margin-top: 10rpx;
				margin-bottom: 15rpx;
			}
		}
	}

	.bottom-box {
		padding-top: 10rpx;
		display: flex; align-items: center;

		.bottom-left {
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
			background: rgb(225, 53, 27);
			border-radius: 10rpx;
			line-height: 60rpx;
		}
	}
    .bg-img{
        width: 600rpx;
        height: 900rpx;
        background-image: url("../../static/partyFee/bg.png");
        background-size: cover;
        border-radius: 20rpx;
        .content{
            height: 680rpx;
            background-image: url("../../static/partyFee/bg-content.png");
            background-size: cover;
            margin: 100rpx 40rpx 0;
            background-color: rgba(255,255,255,0.9);
            border-radius: 10px;
            text-align: center;
            color: #000000;
            font-weight: bold;
            padding: 0 30rpx;
            .name{
                font-size: 50rpx;
                padding: 60rpx 0 30rpx;
            }
            .deptName{
                font-size: 28rpx;
            }
            .time{
                font-size: 26rpx;
                border-bottom: 2rpx solid #bdbaba;
                padding: 20rpx;
            }
            .tip{
                font-size: 24rpx;
                padding-top: 20rpx;
            }
            .year{
                height: 60rpx;
                width: 80rpx;
                background-image: url("../../static/partyFee/year.png");
                background-size: cover;
                color: #fff;
                font-size: 40rpx;
                margin: 0 10rpx;
            }
            .day{
                height: 60rpx;
                width: 100rpx;
                background-image: url("../../static/partyFee/day.png");
                background-size: cover;
                color: #fff;
                font-size: 40rpx;
                margin: 0 10rpx;
            }
            .money{
                font-size: 26rpx;
                padding-bottom: 30rpx;
            }
            .btn{
                width: 200rpx;
                height: 60rpx;
                border-radius: 40rpx;
                line-height: 60rpx;
                margin: auto;
                background: #f62020ed;
                color: #fff;
                font-size: 15px;
            }
        }
    }

</style>
