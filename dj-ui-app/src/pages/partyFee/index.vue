<template>
    <view class="partyFee">
        <view class="content-box">
            <view class="menu-box">
                <view class="content">
                    <view class="menu" style="background-image: url('../../static/png/dfjn.png')"
                          @click="$handlerNavigate({ url: '/pages/CostPayment/index?manageType=' + manageType + '&manageDeptId=' + manageDeptId })">
                        <view class="name">党费缴纳</view>
                    </view>
                    <view v-if="manageType == '2'" class="menu" style="background-image: url('../../static/png/dwgl.png')"
                          @click="$handlerNavigate({ url: '/pages/PartyWork/index?manageDeptId=' + manageDeptId + '&deptName=' + manageDeptName })">
                        <view class="name">党务管理</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import {getLocalStorageInfo} from "@/utils/localStorageInfo";
import {getPartyMemberManagepower} from "@/api/partyMember";

export default {
    name: "partyFee",
    data(){
        return{
            manageType:"1",//1为本部门代缴，2为管理员代缴
            manageDeptId:"",
            manageDeptName:"",
        }
    },
    onLoad(){
        let userInfo = getLocalStorageInfo('userInfo')
        if(userInfo && userInfo.id){
            this.getManagePower(userInfo.id)
        }
    },
    methods:{
        getManagePower(id){
            uni.showLoading({
                mask:true
            })
            this.manageType = "1";
            getPartyMemberManagepower({partyMemberId:id+""}).then(res =>{
                uni.hideLoading()
                if(res.code == "00000" && res.data){
                    this.manageType = "2";
                    this.manageDeptId = res.data.id
                    this.manageDeptName = res.data.name
                }
            })
        },
    }
}
</script>

<style lang="scss">
.partyFee{
    background-image: url("../../static/png/bg.png");
    height: 100vh;
    background-size: 100% 100%;
    .content-box {
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        padding: 0 30rpx;
        .menu-box {
            .content {
                .menu {
                    height: 170rpx;
                    background-size: 100% 100%;
                    margin-bottom: 30rpx;
                    .name {
                        color: #fff;
                        font-size: 34rpx;
                        font-weight: bold;
                        line-height: 170rpx;
                        margin-left: 180rpx;
                    }
                }
            }
        }

    }
}
</style>