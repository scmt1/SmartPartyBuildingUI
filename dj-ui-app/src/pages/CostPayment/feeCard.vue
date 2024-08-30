<template>
    <view class="feeCard">
        <view class="img" v-if="show">
            <image @click="recordClick" src="../../static/partyFee/feeCard.png"></image>
        </view>
        <view class="record" v-if="!show">
            <view v-if="dataList.length > 0">
                <view class="top">
                    <view @click="up" v-if="selectRecord.payMonth != dataList[dataList.length-1].payMonth" style="display: flex;color: #353535;font-size: 30rpx;">
                        <u-icon name="arrow-left" color="#353535" size="30"></u-icon>
                        上月
                    </view>
                    <view class="topTitle">{{payMonth}}</view>
                    <view @click="next" v-if="selectRecord.payMonth != dataList[0].payMonth" style="display: flex;color: #353535;font-size: 30rpx;">
                        下月
                        <u-icon name="arrow-right" color="#353535" size="30"></u-icon>
                    </view>
                </view>
                <view class="tabContent">
                    <view class="paramBox">
                        <view class="param-title">交纳党费记录</view>
                        <view class="param-item">
                            <label>姓名</label>
                            <text class="text">{{selectRecord.name}}</text>
                        </view>
                        <view class="param-item">
                            <label>所属支部</label>
                            <text class="text">{{selectRecord.deptName}}</text>
                        </view>
                        <view class="param-item">
                            <label>所在单位</label>
                            <text class="text">{{userInfo.workUnit}}</text>
                        </view>
                        <view class="param-item">
                            <label>入党时间</label>
                            <text class="text">{{$formatTime(userInfo.partyTime, 'yyyy年MM月DD日')}}</text>
                        </view>
                        <view class="param-item">
                            <label>交纳月份</label>
                            <text class="text">{{selectRecord.payMonth}}</text>
                        </view>
                        <view class="param-item">
                            <label>党费标准</label>
                            <text class="text">{{selectRecord.shouldPay}}元</text>
                        </view>
                        <view class="param-item">
                            <label>本月已交</label>
                            <text class="text">{{selectRecord.shouldPay}}元</text>
                        </view>
                        <view class="param-item">
                            <label>是否代交</label>
                            <text class="text">{{selectRecord.isInsteadPay == 0 ? '否' : '是'}}</text>
                        </view>
                        <view class="param-item" v-if="selectRecord.isInsteadPay == 1">
                            <label>代交人</label>
                            <text class="text">{{selectRecord.insteadPayPartyMemberName}}</text>
                        </view>
                    </view>
                    <view style="height: 30rpx;"></view>
                </view>
            </view>
            <view v-else style="color: #fff;text-align: center;padding: 80rpx 0;">
                暂无交纳记录
            </view>
        </view>
        <view class="btn">
            <view @click="$handlerNavigate({ url: '/pages/CostPayment/replaceCost/replaceCostIndex' })">代人交费</view>
            <view class="line"></view>
            <view @click="$handlerNavigate({ url: '/pages/CostPayment/index?type=2' })">交费记录</view>
<!--            <view class="line" v-if="!show && dataList.length > 0"></view>-->
<!--            <view v-if="!show && dataList.length > 0">生成图片</view>-->
        </view>
    </view>
</template>

<script>
import {getPayFeeDetailListByPartyMember} from "@/api/payFeeDetail";
import {getLocalStorageInfo} from "@/utils/localStorageInfo";
export default {
    name: "feeCard",
    data(){
        return{
            show:true,
            userInfo:{},
            dataList:[],
            selectRecord:{},
            payMonth:"",
            selectIndex:0
        }
    },
    onLoad(){
        this.userInfo = getLocalStorageInfo('userInfo')
        this.getPayFeeDetailList()
    },
    methods:{
        recordClick(){
            if(this.dataList.length === 0){
                uni.showModal({
                    title: '提示',
                    content: '您暂无交纳记录',
                    showCancel:false,
                    success: function (res) {
                        if (res.confirm) {

                        }
                    }
                });
            }else{
                this.show = false
            }
        },
        //上月
        up(){
            this.selectIndex += 1
            this.selectRecord = this.dataList[this.selectIndex]
            this.payMonth = this.selectRecord.payMonth.replace("-", "年") + "月";
        },
        //下月
        next(){
            this.selectIndex -= 1
            this.selectRecord = this.dataList[this.selectIndex]
            this.payMonth = this.selectRecord.payMonth.replace("-", "年") + "月";
        },
        getPayFeeDetailList() {
            let data = {
                partyMemberId: this.userInfo.id + '',
                status: '1'
            }
            getPayFeeDetailListByPartyMember({data: data}).then(res => {
                if (res.code == '00000') {
                    this.dataList = res.data
                    if(this.dataList.length > 0){
                        this.selectRecord = this.dataList[0]
                        this.payMonth = this.selectRecord.payMonth.replace("-", "年") + "月";
                    }
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
    page{
        background: #363D50;
    }
    .feeCard{
        .img{
            width: 100%;
            height: 1100rpx;
            padding-top: 140rpx;
        }
        .btn{
            color: #fff;
            font-size: 28rpx;
            display: flex;
            justify-content: center;
            padding-top: 30rpx;
            .line{
                height: 30rpx;
                color: #fff;
                border-left: 4rpx solid #fff;
                position: relative;
                top: 6rpx;
                margin: 0 20rpx;
            }
        }
        .record{
            padding-top: 120rpx;
            .top{
                display: flex;
                justify-content: center;
                height: 100rpx;
                line-height: 100rpx;
                background-color: #f8f8f8;
                border-top-left-radius: 20rpx;
                border-top-right-radius: 20rpx;
                .topTitle{
                    font-size: 30rpx;
                    font-weight: bold;
                    padding: 0 170rpx;
                }
            }
            .tabContent {
                background: #fff;
                overflow: hidden;
            }

            .param-title {
                height: 100rpx;
                line-height: 80rpx;
                margin: 20rpx 30rpx 0;
                font-size: 36rpx;
                font-weight: bold;
                text-indent: 30rpx;
                text-align: center;
                border-bottom: 1rpx solid #303133;
            }

            .param-item {
                height: 80rpx;
                line-height: 80rpx;
                font-size: 30rpx;
                border-bottom: 1rpx solid #303133;
                margin: 0 30rpx;
                border-left: 1rpx solid #303133;
                border-right: 1rpx solid #303133;
                display: flex;
            }

            .param-item label {
                width: 160rpx;
                color: #333;
                text-align: center;
                border-right: 1rpx solid #303133;
            }
            .param-item .text{
                color: #333;
                padding-left: 20rpx;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                width: 500rpx;
            }
        }
    }
</style>
