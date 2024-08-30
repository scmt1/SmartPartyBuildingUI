<template>
    <view v-loading="loading">
        <view style="padding: 0 25rpx;">

            <view class="news-box middle">
                <view v-for="(item,index) in videoList" :key="index">
                    <view class="news-list-image"  @click="toVideo(item.filePath)">
                        <view class="content">
                            <view class="left-image">
                                <video :src="item.filePath" style="width: 240rpx;height: 154rpx;"></video>
                            </view>
                            <view class="right-text">
                                <view>
                                    <u--text :lines="2" size="30rpx" lineHeight="40rpx" :text="item.title"></u--text>
                                </view>
                                <view class="list-bottom">
                                    <view class="time">{{item.created}}</view>
                                </view>
                            </view>
                        </view>
                        <view class="interval"></view>
                    </view>
                </view>
            </view>

        </view>

        <view style="margin-top: 20rpx;" v-if="moreFlag">
            <loadingIcon></loadingIcon>
        </view>
        <loadMore v-else style="margin: 20rpx 0;" :status="loadmoreStatus" @loadmore="loadmore()"></loadMore>

    </view>
</template>

<script>
import {queryVideos} from '@/api/news'
import loadMore from '@/components/loadMore/index'
import loadingIcon from '@/components/loadingIcon/index.vue'
import { createNamespacedHelpers } from 'vuex'
import {distinctData, getLoadmoreStatus2} from '@/utils/pageUtil'
import util from "@/utils/util"
const { mapState, mapMutations } = createNamespacedHelpers('user')

export default {
    name:"index",
    components: {
        loadMore,
        loadingIcon
    },
    data() {
        return{
            videoList: [],
            pageNumber: 1,
            pageSize: 10,
            loadmoreStatus: 'loadmore',
            moreFlag: false,
            pageInfoIds: []
        }
    },
    computed: {
        ...mapState([
            'loading'
        ])
    },
    onReady() {
        this.setLoading(false);
    },
    onLoad(){
        this.setLoading(true);
        this.queryVideosByPage()
    },
    methods: {
        ...mapMutations(['setLoading']),
        loadmore() {
            if (this.moreFlag) {
                return
            }
            this.moreFlag = true
            this.pageNumber++
            this.queryVideosByPage()
        },
        toVideo(url){
            window.open(url,"_blank")
        },
        queryVideosByPage(){
            let data = "?pageNum="+this.pageNumber+"&pageSize="+this.pageSize
            queryVideos(data).then(res => {
                if (res.code == 200) {
                    let {ids, resultData} = distinctData(this.pageInfoIds, res.data.records)
                    let list = resultData;
                    for (let i = 0; i < list.length; i++) {
                        list[i].filePath = list[i].filePath.replace("http://10.4.117.31:7000", util.minionUrl);
                    }
                    this.pageInfoIds = ids
                    this.videoList = this.videoList.concat(list)
                    this.loadmoreStatus = getLoadmoreStatus2(this.videoList, res.data.records.length, res.data.total)
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: res.msg,
                        duration: 2000
                    })
                }
                this.moreFlag = false
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.top-text {
    padding: 20rpx;
    line-height: 50rpx;
    font-size: 28rpx;
    font-weight: 700;
    background: rgba(242, 242, 242, 1);
}

.news-box {
    display: flex;
    flex-direction: column;

    .news-list {
        padding: 20rpx 0;
        display: flex;
        flex-direction: column;

        .list-bottom {
            margin-top: 10rpx;
            display: flex;
            color: rgb(134, 134, 134);
            .time {
                margin-left: 25rpx;
                flex: 1;
            }
        }
        .interval {
            margin-top: 20rpx;
            width: 100%;
            height: 1px;
            transform: scale(1, 0.4);
            background: rgb(208, 208, 208);
        }
    }

    .news-list-image {
        padding: 20rpx 0;
        display: flex;
        flex-direction: column;

        .content {
            display: flex;
            align-items: center;

            .right-image {
                width: 225rpx;
            }

            .right-text {
                flex: 1;
                display: flex;
                flex-direction: column;
                margin-left: 20rpx;

                .list-bottom {
                    margin-top: 10rpx;
                    display: flex;
                    color: rgb(134, 134, 134);
                    .time {
                        flex: 1;
                    }
                }
            }

            .left-image {
                width: $news-image-width;
                height: $news-image-height;
                border-radius: 10rpx;
                overflow: hidden;
            }
        }

        .interval {
            margin-top: 20rpx;
            width: 100%;
            height: 1px;
            transform: scale(1, 0.4);
            background: rgb(208, 208, 208);
        }
    }

    .public-list {
        padding: 20rpx 0;
        display: flex;
        flex-direction: column;

        .list-title {
            overflow: hidden;
            height: 67rpx;
            text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
            -ms-text-overflow: ellipsis;
            line-clamp: 2;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            box-orient: vertical;
            display: -webkit-box;
            flex: 1;
            padding-right: 30rpx;
        }
        .interval {
            margin-top: 20rpx;
            width: 100%;
            height: 1px;
            transform: scale(1, 0.4);
            background: rgb(208, 208, 208);
        }
    }

}
.middle {
    margin-bottom: 0;
}
</style>
