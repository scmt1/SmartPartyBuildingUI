<template>
    <view>
        <view class="content-box">
            <nav2 :config="config" :defaultIndex="meetingType" @changeType="changeType"></nav2>
            <u-search @search="seek" @custom="seek" class="search" searchIconSize="45" placeholder="请输入关键词"
                      v-model="search.keyword"></u-search>

            <!-- <view class="interval"></view> -->

            <view :class="search.type == 1?'change-box change-box-left':'change-box change-box-right'">
                <view :class="search.type == 1?'change left active':'change left'" @click="changeSearchType(1)">
                    {{ typeLabel }}
                    <image mode="widthFix" class="icon" src="@/static/images/organizationLife/jiantou.png"></image>
                </view>
                <view :class="search.type == 2?'change right active':'change right'" @click="changeSearchType(2)">我发布的
                </view>
            </view>

            <view class="list-box">

                <view class="list" @click="$handlerNavigate({ url: '/pages/OrganizationLife/details?id=' + item.id })"
                      v-for="(item, index) in lifeList" :key="index">
                    <view class="img-box">
                        <view v-if="item.imgUrl && item.imgUrl.indexOf('upload') > -1">
                            <image class="img" mode="aspectFill" :src="base + item.imgUrl"></image>
                        </view>
                        <view v-else>
                            <image v-if="item.imgUrl && item.imgUrl.length > 0" class="img" mode="aspectFill"
                                   :src="item.imgUrl"></image>
                            <image v-else class="img" mode="aspectFill"
                                   src="@/static/images/organizationLife/fm.png"></image>
                        </view>
                        <view class="tag">

                            <template v-if="item.meetingStatus == '1'">
                                <image class="tag-bg" mode="heightFix"
                                       src="@/static/images/organizationLife/unplayed.png"></image>
                                <view class="tag-text">未开始</view>
                            </template>
                            <template v-if="item.meetingStatus == '2'">
                                <image class="tag-bg" mode="heightFix"
                                       src="@/static/images/organizationLife/underway.png"></image>
                                <view class="tag-text">进行中</view>
                            </template>
                            <template v-if="item.meetingStatus == '3'">
                                <image class="tag-bg" mode="heightFix"
                                       src="@/static/images/organizationLife/over.png"></image>
                                <view class="tag-text">已结束</view>
                            </template>
                            <template v-if="item.meetingStatus == '4'">
                                <image class="tag-bg" mode="heightFix"
                                       src="@/static/images/organizationLife/over.png"></image>
                                <view class="tag-text">已取消</view>
                            </template>

                        </view>
                    </view>

                    <view class="introduce-box">
                        <view class="name">
                            <u--text size="28rpx" bold lines="1" :text="item.meetingTopic"></u--text>
                        </view>
                        <view class="introduce">
                            <text class="title">开始时间：</text>
                            <u--text size="24rpx" lines="1" :text="item.startTime"></u--text>
                        </view>
                        <view class="introduce">
                            <text class="title">开始时间：</text>
                            <u--text size="24rpx" lines="1" :text="item.endTime"></u--text>
                        </view>
                        <view class="introduce">
                            <text class="title">会议地址：</text>
                            <u--text size="24rpx" lines="1" :text="item.meetingAddress"></u--text>
                        </view>
                    </view>
                </view>

            </view>

            <view class="initiateMeeting-box">
                <view class="initiateMeeting" @click="$handlerNavigate({ url: '/pages/OrganizationLife/initiate' })">
                    发起会议
                </view>
            </view>

            <view v-if="moreFlag" style="margin: 20rpx 0;">
                <loadingIcon></loadingIcon>
            </view>
            <loadMore v-else style="margin: 20rpx 0;" :status="loadmoreStatus" @loadmore="loadmore()"></loadMore>

        </view>

        <u-picker :show="pickerShow" :itemHeight="70" :columns="columns" :defaultIndex="defaultIndex" keyName="label"
                  closeOnClickOverlay @close="closePicker" @cancel="closePicker" @confirm="confirmPicker"></u-picker>
        <back-top-btn v-if="showBackTop"/>
    </view>
</template>

<script>
import nav2 from '@/components/nav/nav2.vue'
import {queryTzOrganizationLifeList, appQueryTzOrganizationLifeList} from '@/api/tzOrganizationLife'
import util from '@/utils/util'
import {getDictByType} from "@/api/tDictData"
import {getDictByCode} from "@/api/jcxfSysDictionary"
import loadMore from '@/components/loadMore/index'
import loadingIcon from '@/components/loadingIcon/index.vue'
import {mapGetters, createNamespacedHelpers} from 'vuex'
import {distinctData, getLoadmoreStatus} from '@/utils/pageUtil'
import backTopBtn from '@/components/back-top-btn/index.vue'

const {mapState, mapMutations} = createNamespacedHelpers('user')

export default {
    name: 'introduce',
    components: {
        nav2,
        loadMore,
        loadingIcon,
        backTopBtn
    },
    data() {
        return {
            showBackTop: false,
            scrollTop: '',
            base: util.jcxfUrl,
            meetingType: 1,
            config: [],
            search: {
                keyword: '',
                type: 1,
                meetingStatus: '',
                createName: 'partyMember'
            },
            pickerShow: false,
            columns: [],
            pageNum: 1,
            pageSize: 30,
            lifeList: [],
            loadmoreStatus: 'loadmore',
            moreFlag: false,
            defaultIndex: [0],
            typeLabel: '会议状态',
            pageInfoIds: []
        }
    },
    created() {
        /*try {
            xm.setNavigationBarTitle({title: "组织生活"});
        } catch (error) {
            document.title = "组织生活";
        }*/
    },
    computed: {
        ...mapGetters([
            'userInfo'
        ]),
        ...mapState([
            'loading'
        ])
    },
    mounted() {
        // this.init()
    },
    onReady() {
        this.setLoading(false);
    },
    onShow() {
        // this.setLoading(true);
        this.init()
    },
    onLoad() {
        // this.setLoading(true);
    },
    // 页面滚动到指定位置指定元素固定在顶部
    onPageScroll(e) {
        this.scrollTop = e.scrollTop
        if (this.scrollTop > 200) {
            this.showBackTop = true
        } else if (this.scrollTop < 200) {
            this.showBackTop = false
        }
    },
    methods: {
        ...mapMutations(['setLoading']),
        async init() {
            await this.getDict('meetingType')
            await this.getDict2('meetingStatus')
            this.rest()
            this.getTzOrganizationLifeList()
        },
        getDict(type) {
            return new Promise((resolve, reject) => {
                getDictByType(type).then(res => {
                    if (type === 'meetingType') {
                        this.config = []
                        for (let i = 0; i < res.length; i++) {
                            let va = {
                                value: Number(res[i].itemValue),
                                name: res[i].label
                            }
                            this.config.push(va)
                        }
                    }
                    resolve(res)
                })
            })
        },
        getDict2(type) {
            return new Promise((resolve, reject) => {
                getDictByCode(type).then(res => {
                    if (type === 'meetingStatus') {
                        let all = [
                            {
                                label: '全部',
                                itemValue: null
                            }
                        ]
                        if (res.code == '00000') {
                            all = all.concat(res.data)
                        }
                        this.columns = [all]
                    }
                    resolve(res)
                })
            })
        },
        rest() {
            this.pageInfoIds = []
            this.lifeList = []
            this.pageNum = 1
            this.pageSize = 30
        },
        changeType(type) {
            uni.showLoading({
                title: "正在加载...",
                mask: true
            })
            if (type == '3') {
                this.typeLabel = '活动状态'
            } else {
                this.typeLabel = '会议状态'
            }
            this.meetingType = type
            this.rest()
            this.getTzOrganizationLifeList()
        },
        changeSearchType(type) {
            if (this.search.type != type) {
                uni.showLoading({
                    title: "正在加载...",
                    mask: true
                })

                this.rest()

                this.search.type = type
                this.getTzOrganizationLifeList()
            } else if (this.search.type == 1 && type == 1) {
                this.pickerShow = true
            }
        },
        seek(event) {
            uni.showLoading({
                title: "正在加载...",
                mask: true
            })
            this.rest()
            this.getTzOrganizationLifeList()
        },
        closePicker() {
            this.defaultIndex = [0]
            this.pickerShow = false
        },
        confirmPicker(event) {
            this.pickerShow = false
            this.search.meetingStatus = event.value[0].itemValue
            this.rest()
            this.getTzOrganizationLifeList()
        },
        loadmore() {
            if (this.moreFlag) {
                return
            }
            this.moreFlag = true
            this.pageNum++
            this.getTzOrganizationLifeList()
        },
        getTzOrganizationLifeList() {
            let data = {
                tzOrganizationLife: {
                    meetingType: this.meetingType,
                    meetingTopic: this.search.keyword,
                    meetingStatus: this.search.meetingStatus,
                    deptId: this.userInfo.deptId
                    // deptId: 25595
                },
                pageVo: {
                    pageNumber: this.pageNum,
                    pageSize: this.pageSize
                }
            }

            // 我的发布
            if (this.search.type == 2) {
                data.tzOrganizationLife.createBy = this.userInfo.id
                // data.tzOrganizationLife.createdName = this.search.createName
            }

            appQueryTzOrganizationLifeList({data: data}).then(res => {
                if (res.code == '00000') {
                    let {ids, resultData} = distinctData(this.pageInfoIds, res.data.records)
                    this.pageInfoIds = ids
                    let list = resultData;
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].imgUrl) {
                            list[i].imgUrl = list[i].imgUrl.replace("http://10.4.117.31:7000", util.minionUrl);
                        }
                    }
                    this.lifeList = this.lifeList.concat(list)
                    this.loadmoreStatus = getLoadmoreStatus(this.lifeList, res.data)
                }
                this.moreFlag = false
            })
        },
        getDirectLabelByValue(value, direct) {
            if (!value) {
                return
            }
            for (let i = 0; i < direct.length; i++) {
                if (value == direct[i].itemValue) {
                    return direct[i].label
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.empty {
    text-align: center;
    background: rgba(245, 245, 245, 1);
    font-size: 26rpx;
    color: rgb(206, 209, 216);
}

.content-box {
    width: 100%;
    display: inline-block;
    margin-top: 110rpx;
    margin-bottom: 140rpx;
    padding: $content-box-padding;

    .search {
        background: rgba(242, 242, 242, 1);
        border-radius: 40px;
        height: 80rpx;
        font-size: 28rpx;

        ::v-deep .u-search__content__input--placeholder {
            font-size: 28rpx;
        }

        ::v-deep .u-search__action--active {
            background-color: rgba(225, 53, 27, 1);
            border-radius: 40px;
            height: 70rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            width: 140rpx;
            margin-right: 8rpx;
            font-size: 28rpx;
        }
    }

    .interval {
        width: 100%;
        height: 1px;
        background: rgb(208, 208, 208);
        margin: 30rpx 0;
        transform: scale(1, 0.5);
    }

    .change-box {
        margin-top: 30rpx;
        display: flex;
        font-weight: bold;
        border: 1px solid rgba(225, 53, 27, 1);
        height: 70rpx;

        .change {
            line-height: calc(70rpx - 1px);
            text-align: center;
            flex: 1;
            height: calc(70rpx - 1px);
            color: rgba(225, 53, 27, 1);
            position: relative;
            font-size: 32rpx;
        }

        .active {
            background: rgba(225, 53, 27, 1);
            color: white;
        }

        .left {
        }

        .right {
            margin-right: -1px;
        }

        .icon {
            position: absolute;
            right: 80rpx;
            top: 50%;
            bottom: 30rpx;
            width: 15rpx;
        }
    }

    .list-box {
        margin-top: 30rpx;

        .list {
            display: flex;
            margin-top: 20rpx;

            .img-box {
                position: relative;

                .img {
                    border-radius: 10rpx;
                    width: $life-image-width;
                    height: $life-image-height;
                }

                .tag {
                    position: absolute;
                    top: 0rpx;

                    .tag-bg {
                        position: absolute;
                        height: 45rpx;
                        border-top-left-radius: 10rpx;
                    }

                    .tag-text {
                        white-space: nowrap;
                        position: absolute;
                        color: white;
                        left: 15rpx;
                        height: 45rpx;
                        line-height: 45rpx;
                        font-size: 24rpx;
                        font-weight: bold;
                    }
                }
            }


            .introduce-box {
                padding-left: 15rpx;
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex: 1;

                .name {
                    font-weight: bold;
                    font-size: 28rpx;
                }

                .introduce {
                    // margin-top: 8rpx;
                    display: flex;

                    .title {
                        line-height: 43rpx;
                        font-size: 24rpx;
                        color: rgb(134, 134, 134);
                    }

                    .text {
                        line-height: 43rpx;
                    }
                }
            }

        }
    }

    .initiateMeeting-box {
        // background: white;
        position: fixed;
        bottom: 0;
        width: calc(100% - 50rpx);
        padding: 20rpx 80rpx 30rpx 80rpx;

        .initiateMeeting {
            width: 100%;
            border-radius: 10rpx;
            padding: 20rpx;
            text-align: center;
            color: #fff;
            font-weight: bold;
            font-size: 30rpx;
            background: rgb(225, 53, 27);
        }
    }


}

</style>
