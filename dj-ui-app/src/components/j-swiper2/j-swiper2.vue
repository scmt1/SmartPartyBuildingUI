<template>
    <!-- <u-swiper :list="list3" indicator indicatorMode="line" circular></u-swiper> -->
    <view class="swiper-container">
        <view class="uni-margin-wrap">
            <swiper
                class="swiper"
                :class="{ margin: config.margin }"
                indicatorActiveColor="#ce1126"
                v-bind="config"
            >
                <swiper-item
                    v-for="(item, index) in data"
                    :key="index"
                    style="display: flex;"
                >
									<u-row justify="space-between" gutter="12" style="width: 100%; margin-left: 0 !important; justify-content: start;">
										<u-col span="4" style="height: 100%; " v-for="(item2, index2) in item" :key="index2" @click="handlerClick(item2)">
											<view style="width: 100%; height: 100%; position: relative; border-radius: 5px; overflow: hidden;">
												<image mode="aspectFill" :src="item2.image" alt=""></image>
												<view class="item-title" v-if="config.isTitleShow && item2.title">{{ item2.title }}</view>
											</view>
										</u-col>
										
									</u-row>
                    <!-- <view v-for="(item2, index2) in item" :key="index2" @click="handlerClick(item2)"
                          style="width: 33.3333333%; height: 100%; position: relative;">
												<view v-if="index%3 == 0" style="width: calc(100% - 10rpx); height: 100%; overflow: hidden; ">
													<image mode="aspectFill" :src="item2.image" alt=""></image>
													<view class="item-title" style="width: calc(100% - 10rpx)" v-if="config.isTitleShow && item2.title">{{ item2.title }}</view>
												</view>	
												<view v-if="index%3 == 1" style="padding-right: 5rpx; padding-left: 5rpx; width: 100%; height: 100%; overflow: hidden;">
													<image mode="aspectFill" :src="item2.image" alt=""></image>
													<view class="item-title" style="width: calc(100% - 10rpx)" v-if="config.isTitleShow && item2.title">{{ item2.title }}</view>
												</view>	
												<view v-if="index%3 == 2" style="padding-left: 10rpx; width: 100%; height: 100%; overflow: hidden;">
													<image mode="aspectFill" :src="item2.image" alt=""></image>
													<view class="item-title" style="width: calc(100% - 10rpx)" v-if="config.isTitleShow && item2.title">{{ item2.title }}</view>
												</view>	
                    </view> -->
                </swiper-item>
            </swiper>
        </view>
    </view>
</template>

<script>

export default {
    name: 'j-swiper',
    props: ['config', 'data'],
    data() {
        return {}
    },
    mounted() {
        // console.log('config', this.config)
    },
    methods: {
        handlerClick(data) {
            this.$emit('choose', data)
        }
    },
}
</script>

<style lang="scss" scoped>
.swiper-container {
    width: 100%;
    height: 100%;

    .swiper {
        width: 100%;
        height: 100%;

        &.margin {
            uni-swiper-item {
                padding: 0 10rpx;
                width: 100%;
                box-sizing: border-box;
                position: relative;

                .item-title {
                    width: 100%;
                    // width: calc(100% - 20rpx);
                    height: 50rpx;
                    line-height: 50rpx;
                    text-align: center;
                    color: #fff;
                    position: absolute;
                    z-index: 9999;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.37);
                    font-size: 26rpx;
                }

                &:last-child {
                    padding-left: 5rpx;
                    padding-right: 0;

                    .item-title {
                        //width: calc(100% - 5rpx);
                    }
                }

                &:first-child {
                    padding-left: 0;
                    padding-right: 5rpx;

                    .item-title {
                        //width: calc(100% - 5rpx);
                    }
                }
            }
        }
    }

    .uni-margin-wrap {
        height: 100%;
    }
}
</style>
