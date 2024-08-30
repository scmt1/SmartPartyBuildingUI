<template>
    <view class="PartyWork">
        <view style="display: flex;padding: 30rpx;">
            <view class="name" @click="showTree">{{selectDeptName}}</view>
            <u-icon name="arrow-down" color="#333" size="28" style="font-weight: bold;margin-left: 6rpx;"></u-icon>
        </view>
        <view>
            <view class="time">
                <picker style="height: 80rpx" mode="date" :value="payMonth" :end="endDate" fields="month" @change="bindDateChange">
                    <view style="display: flex;align-items: baseline;">
                        <view style="padding-right: 4rpx;">{{selectPayMonth}}</view>
                        <u-icon name="arrow-down" color="#2979ff" size="28" style="font-weight: bold;"></u-icon>
                    </view>
                </picker>
            </view>
            <view class="content" v-if="isActive == 1">
                <view class="flex" style="padding-bottom: 0">
                    <image class="image" mode="widthFix" src="@/static/icon/df.png"></image>
                    <view style="text-align: end;">
                        <view style="color: #E93A3A;text-align: end;">
                            <span style="font-size: 50rpx;font-weight: bold;">{{payFeeDetailStatistics.alreadyPartyMoney}}</span>
                            <span style="font-size: 26rpx;padding-left: 8rpx;">元</span>
                        </view>
                        <view>已交纳党费</view>
                    </view>
                </view>
                <view class="flex">
                    <image class="image" mode="widthFix" src="@/static/icon/people.png"></image>
                    <view style="text-align: end;">
                        <view style="color: #ED8A22;text-align: end;">
                            <span style="font-size: 50rpx;font-weight: bold;">{{payFeeDetailStatistics.alreadyPartyNum}}</span>
                            <span style="font-size: 26rpx;padding-left: 8rpx;">人</span>
                        </view>
                        <view>已交纳人数</view>
                    </view>
                </view>
                <view class="line"></view>
                <view style="padding: 40rpx 70rpx;">
                    <view style="display: flex; justify-content: space-between;padding-bottom: 40rpx;">
                        <view>
                            <view class="title">应收党费(元)</view>
                            <view class="value">{{payFeeDetailStatistics.allPartyMoney}}</view>
                        </view>
                        <view>
                            <view class="title">应交人数(人)</view>
                            <view class="value">{{payFeeDetailStatistics.allPartyNum}}</view>
                        </view>
                    </view>
                    <view style="display: flex; justify-content: space-between;">
                        <view>
                            <view class="title">未交党费(元)</view>
                            <view class="value" style="color: #E93A3A;">{{payFeeDetailStatistics.notPartyMoney}}</view>
                        </view>
                        <view>
                            <view class="title">未交人数(人)</view>
                            <view class="value">{{payFeeDetailStatistics.notPartyNum}}</view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="noDone" v-if="isActive == 2">
                <view style="font-size: 15px;font-weight: bold;">未交党费名单</view>
                <scroll-view scroll-y="true" v-if="partyInfoList.length > 0">
                    <view class="content-list">
                        <view class="pserson-box" v-for="(item, index) in partyInfoList" :key="index">
                            <view class="avatar-box">
                                <image v-if="item.avatar && item.avatar.length > 0" mode="aspectFit" :src="item.avatar"></image>
                                <image v-else mode="aspectFit" src="@/static/images/user/default-avatar.png"></image>
                            </view>
                            <view class="name">{{ item.realName }}</view>
                        </view>
                    </view>
                </scroll-view>
                <view v-if="partyInfoList.length == 0">
                    <u-empty text="暂无未交党员" mode="data"></u-empty>
                </view>
            </view>
        </view>
        <view style="display: flex;justify-content: center;padding: 60rpx 0;">
            <view class="left" @click="tabChange(1)" :class="isActive == 1 ? 'active' : ''">缴纳概况</view>
            <view class="right" @click="tabChange(2)" :class="isActive == 2 ? 'active' : ''">未交齐</view>
        </view>
        <qian-tree ref="tkitree" @confirm="treeConfirm" @cancel="treeCancel" :treeData="deptRange" numKey="noDoneNum" :foldAll="false" :selectParent="true" valueKey="id" labelKey="name" :multiple="false" confirmColor="#4e8af7" />
    </view>
</template>

<script>
import qianTree from "@/components/qian-tree/qian-tree.vue"
import {getPayFeeDetailStatistics,getNoDonePartyMember} from '@/api/payFeeDetail'
import {getDeptTree,getNoDoneDeptTree} from '@/api/tzSysDept'
export default {
    name: "PartyWork",
    components:{qianTree},
    data(){
        return{
            manageDeptName:"",
            manageDeptId:"",
            payFeeDetailStatistics:{
                allPartyMoney:0.00,
                alreadyPartyMoney:0.00,
                allPartyNum:0,
                alreadyPartyNum:0,
                notPartyMoney:0.00,
                notPartyNum:0
            },
            endDate:'',
            selectPayMonth:"",
            payMonth:"",
            isActive:1,
            deptRange:[],
            selectDeptName:'',
            selectDeptId:'',
            partyInfoList:[]
        }
    },
    onLoad(option){
        this.isActive = 1;
        this.payMonth = this.getDate();
        if(option.manageDeptId){
            this.manageDeptId = option.manageDeptId
            this.selectDeptId = option.manageDeptId
            this.getPartyFeeStatistics()
            this.getSysDeptList(this.manageDeptId)
        }
        if(option.deptName){
            this.manageDeptName = option.deptName
            this.selectDeptName = option.deptName
        }
    },
    methods:{
        tabChange(index){
            this.isActive = index
            this.selectDeptId = this.manageDeptId
            if(index == 1){
                this.getPartyFeeStatistics()
                this.getSysDeptList(this.manageDeptId)
            }else{
                this.getNoDoneSysDeptList(this.manageDeptId)
                this.getNoDonePartyMember()
            }
        },
        // 确定回调事件
        treeConfirm(e) {
            if(e.id[0]){
                this.selectDeptId = e.id[0]
                if(this.isActive == 1){
                    this.getPartyFeeStatistics()
                }else{
                    this.getNoDonePartyMember()
                }
            }
            if(e.name[0]){
                this.selectDeptName = e.name[0]
            }
        },
        //未交党费人员
        getNoDonePartyMember(){
            getNoDonePartyMember({deptId:this.selectDeptId,payMonth:this.payMonth}).then(res =>{
                if(res.code == "00000"){
                    this.partyInfoList = res.data
                }
            })
        },
        // 取消回调事件
        treeCancel(e) {

        },
        // 显示树形选择器
        showTree() {
            this.$refs.tkitree._show();
        },
        getNoDoneSysDeptList(deptId){
            getNoDoneDeptTree({deptId:deptId+"",payMonth:this.payMonth}).then(res =>{
                this.deptRange = res
                this.manageDeptName = this.deptRange[0].name
                this.selectDeptName = this.deptRange[0].name
            })
        },
        getSysDeptList(deptId){
            getDeptTree({deptId:deptId+""}).then(res =>{
                this.deptRange = res
                this.manageDeptName = this.deptRange[0].name
                this.selectDeptName = this.deptRange[0].name
            })
        },
        getPartyFeeStatistics(){
            getPayFeeDetailStatistics({deptId:this.selectDeptId,payMonth:this.payMonth}).then(res =>{
                if(res.code == "00000"){
                    this.payFeeDetailStatistics = res.data
                }
            })
        },
        bindDateChange: function(e) {
            this.payMonth = e.detail.value
            this.selectPayMonth = this.payMonth.split("-")[0] + "年" + this.payMonth.split("-")[1] + "月";
            if(this.isActive == 1){
                this.getPartyFeeStatistics()
            }else{
                this.getNoDoneSysDeptList(this.selectDeptId)
                this.getNoDonePartyMember()
            }
        },
        getDate() {
            const date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            month = month > 9 ? month : '0' + month;
            this.selectPayMonth = year + "年" + month + "月"
            this.endDate = `${year}-${month}`;
            return `${year}-${month}`;
        }
    }
}
</script>

<style lang="scss">
page{
    background-color: #f8f8f8;
}
.PartyWork{
    .name{
        font-size: 34rpx;
        font-weight: bold;
        color: #333;
    }
    .time{
        padding: 0 30rpx 0;
        font-size: 30rpx;
        color: #1e84f3;
        font-weight: bold;
    }
    .content{
        background-color: white;
        border-radius: 10rpx;
        box-shadow: 0 0 0 8rpx #e5e5e530;
        display: flex;
        flex-direction: column;
        width: 700rpx;
        margin: 0 auto;
        .flex{
            display: flex;
            justify-content: space-between;
            padding: 40rpx 80rpx;
        }
        .image{
            width: 80rpx;
            height: 80rpx;
        }
        .line{
            width: 600rpx;
            height: 8rpx;
            background-color: #f8f8f8;
            margin: 0 auto;
        }
        .title{
            font-size: 28rpx;
            color: #adadad;
            padding-bottom: 6rpx;
        }
        .value{
            font-size: 38rpx;
        }
    }
    .left{
        padding: 6px 15px;
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
        width: 120px;
        color: #007aff;
        text-align: center;
        border: 1px solid #007aff;
    }
    .right{
        padding: 6px 15px;
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;
        width: 120px;
        color: #007aff;
        text-align: center;
        border: 1px solid #007aff;
    }
    .active{
        background-color: #007aff;
        color: #fff;
    }
    ::v-deep .u-icon__icon{
        font-weight: bold !important;
    }
    .noDone{
        background-color: #fff;
        margin: 30rpx;
        padding: 30rpx;
        border-radius: 20rpx;
        .content-list {
            margin-top: 30rpx;
            display: flex;
            flex-wrap: wrap;
            height: 700rpx;

            .pserson-box {
                display: flex;
                flex-direction: column;
                text-align: center;
                width: 156rpx;
                align-items: center;
                margin-bottom: 16rpx;

                .avatar-box {
                    width: 120rpx;
                    height: 120rpx;
                    border-radius: 10rpx;
                    overflow: hidden;
                }
                .name {
                    font-size: 28rpx;
                    margin-top: 10rpx;
                }
            }
        }
    }
}
</style>