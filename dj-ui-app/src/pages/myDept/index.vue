<template>
    <view class="myDept">
        <view class="content-box">
            <view class="menu-box">
                <view class="content">
                    <view class="menu" style="background-image: url('../../static/png/zbgk.png')" @click="$handlerNavigate({ url: '/pages/BranchOverview/index' })">
                        <view class="name">支部概况</view>
                    </view>
                    <view class="menu" style="background-image: url('../../static/png/zzgx.png')" @click="$handlerNavigate({ url: '/pages/PartyMemberDeptTransfer/index' })">
                        <view class="name">组织关系</view>
                    </view>
                    <view class="menu" style="background-image: url('../../static/png/dylc.png')" @click="$handlerNavigate({ url: '/pages/PartyMemberOutflow/index' })">
                        <view class="name">党员流出</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: "myDept"
}
</script>

<style lang="scss">
.myDept{
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