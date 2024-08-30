<template>
	<view class="newList">
		<view class="content-box">
			<view class="newsweek" style="margin-bottom: 20rpx;">
                <view class="type">
                    <view class="top-title">
                        <view class="name">机关动态</view>
                    </view>
                    <view class="more" @click="$handlerNavigate({ url: '/pages/NewsBulletin/index?categoryId=21' })">
                        <view class="text">更多</view>
                        <view>
                            <image class="img" src="@/static/images/home/more.png"></image>
                        </view>
                    </view>
                </view>
                <view class="news-box middle">
                    <view class="news-list-image" v-for="(item,index) in jgdtList" :key="index" @click="$handlerNavigate({ url: '/pages/NewsBulletin/details?id='+item.id })">
                        <view class="content">
                            <view class="right-text">
                                <view>
                                    <u--text :lines="2" size="30rpx" lineHeight="36rpx" :text="item.title"
                                    ></u--text>
                                </view>
                                <view class="list-bottom">
                                    <view class="time">{{item.created}}</view>
                                </view>
                            </view>
                        </view>
                        <view class="interval"></view>
                    </view>
                    <u-empty v-if="!jgdtList||!jgdtList.length>0" text="暂无数据" mode="data"></u-empty>
                </view>
			</view>
            <view class="newsweek" style="margin-bottom: 20rpx;">
                <view class="type">
                    <view class="top-title">
                        <view class="name">专题专栏</view>
                    </view>
                    <view class="more" @click="$handlerNavigate({ url: '/pages/NewsBulletin/index?categoryId=2' })">
                        <view class="text">更多</view>
                        <view>
                            <image class="img" src="@/static/images/home/more.png"></image>
                        </view>
                    </view>
                </view>
                <view class="news-box middle">
                    <view class="news-list-image" v-for="(item,index) in ztzlList" :key="index" @click="$handlerNavigate({ url: '/pages/NewsBulletin/details?id='+item.id })">
                        <view class="content">
                            <view class="right-text">
                                <view>
                                    <u--text :lines="2" size="30rpx" lineHeight="36rpx" :text="item.title"
                                    ></u--text>
                                </view>
                                <view class="list-bottom">
                                    <view class="time">{{item.created}}</view>
                                </view>
                            </view>
                        </view>
                        <view class="interval"></view>
                    </view>
                    <u-empty v-if="!ztzlList||!ztzlList.length>0" text="暂无数据" mode="data"></u-empty>
                </view>
            </view>
            <view class="newsweek" style="margin-bottom: 20rpx;">
                <view class="type">
                    <view class="top-title">
                        <view class="name">党建信息</view>
                    </view>
                    <view class="more" @click="$handlerNavigate({ url: '/pages/NewsBulletin/index?categoryId=11' })">
                        <view class="text">更多</view>
                        <view>
                            <image class="img" src="@/static/images/home/more.png"></image>
                        </view>
                    </view>
                </view>
                <view class="news-box middle">
                    <view class="news-list-image" v-for="(item,index) in djxxList" :key="index" @click="$handlerNavigate({ url: '/pages/NewsBulletin/details?id='+item.id })">
                        <view class="content">
                            <view class="right-text">
                                <view>
                                    <u--text :lines="2" size="30rpx" lineHeight="36rpx" :text="item.title"
                                    ></u--text>
                                </view>
                                <view class="list-bottom">
                                    <view class="time">{{item.created}}</view>
                                </view>
                            </view>
                        </view>
                        <view class="interval"></view>
                    </view>
                    <u-empty v-if="!djxxList||!djxxList.length>0" text="暂无数据" mode="data"></u-empty>
                </view>
            </view>
            <view class="newsweek" style="margin-bottom: 20rpx;">
                <view class="type">
                    <view class="top-title">
                        <view class="name">先锋典型</view>
                    </view>
                    <view class="more" @click="$handlerNavigate({ url: '/pages/NewsBulletin/index?categoryId=31' })">
                        <view class="text">更多</view>
                        <view>
                            <image class="img" src="@/static/images/home/more.png"></image>
                        </view>
                    </view>
                </view>
                <view class="news-box middle">
                    <view class="news-list-image" v-for="(item,index) in xfdxList" :key="index" @click="$handlerNavigate({ url: '/pages/NewsBulletin/details?id='+item.id })">
                        <view class="content">
                            <view class="right-text">
                                <view>
                                    <u--text :lines="2" size="30rpx" lineHeight="36rpx" :text="item.title"
                                    ></u--text>
                                </view>
                                <view class="list-bottom">
                                    <view class="time">{{item.created}}</view>
                                </view>
                            </view>
                        </view>
                        <view class="interval"></view>
                    </view>
                    <u-empty v-if="!xfdxList||!xfdxList.length>0" text="暂无数据" mode="data"></u-empty>
                </view>
            </view>
            <view class="newsweek" style="margin-bottom: 20rpx;">
                <view class="type">
                    <view class="top-title">
                        <view class="name">党建微视</view>
                    </view>
                    <view class="more" @click="$handlerNavigate({ url: '/pages/NewsBulletin/index?categoryId=41' })">
                        <view class="text">更多</view>
                        <view>
                            <image class="img" src="@/static/images/home/more.png"></image>
                        </view>
                    </view>
                </view>
                <view class="news-box middle">
                    <view class="news-list-image" v-for="(item,index) in djwsList" :key="index" @click="$handlerNavigate({ url: '/pages/NewsBulletin/details?id='+item.id })">
                        <view class="content">
                            <view class="right-text">
                                <view>
                                    <u--text :lines="2" size="30rpx" lineHeight="36rpx" :text="item.title"
                                    ></u--text>
                                </view>
                                <view class="list-bottom">
                                    <view class="time">{{item.created}}</view>
                                </view>
                            </view>
                        </view>
                        <view class="interval"></view>
                    </view>
                    <u-empty v-if="!djwsList||!djwsList.length>0" text="暂无数据" mode="data"></u-empty>
                </view>
            </view>
		</view>
        <!-- 回到顶部 -->
        <back-top-btn v-if="showBacktop" />
	</view>
</template>

<script>
import util from "@/utils/util"
import nav1 from "@/components/nav/nav1.vue"
import { mapGetters, createNamespacedHelpers } from 'vuex'
import {getLocalStorageInfo, setLocalStorageInfo} from '@/utils/localStorageInfo'
import {queryNews} from '@/api/news'
import {jcetlogin} from '@/api/jcetLogin.js'
import empty from '@/components/empty/index.vue'
import setting from "@/utils/setting"
import backTopBtn from '@/components/back-top-btn/index.vue';
import {getPartyMemberManagepower} from "@/api/partyMember";
const { mapState, mapMutations } = createNamespacedHelpers('user')

export default {
	name:"Home",
	components: {
		nav1,
		empty,
        backTopBtn
	},
	data() {
		return {
			base: util.jcxfUrl,
			defaultIndex: 0,
			noticeShow: true,
			login: false,
			jgdtList:[],
			ztzlList:[],
            xfdxList:[],
            djwsList:[],
            djxxList:[],
            scrollTop: 0,
            showBacktop: false,
            newsTitle:"",
            manageShow:false
		}
	},
	computed: {
		...mapGetters([
			'userInfo'
		]),
		...mapState([
			'loading'
		]),
	},
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
        if (this.scrollTop > 400) {
            this.showBacktop = true;
        } else if (this.scrollTop < 400) {
            this.showBacktop = false;
        }
    },
	onReady() {
		this.setLoading(false);
	},
	onShow() {
        this.queryjgdt()
        this.queryztzl()
        this.queryxfdx()
        this.querydjws()
        this.querydjxx()
	},
	methods: {
		...mapMutations(['setLoading']),
        //搜索
        searchClick(){
		    if(!this.newsTitle){
		        uni.showToast({
                    icon: 'none',
                    title: '请输入关键字搜索',
                    duration: 2000
                })
                return
            }
            let data = "?title=" + this.newsTitle + "&pageNum=1&pageSize=10"
            queryNews(data).then(res => {
                if (res.code == 200) {
                    let list = res.data.records;
                    if(list.length > 0){
                        uni.navigateTo({
                            url:"/pages/NewsBulletin/list?title=" + this.newsTitle
                        })
                    }
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: res.msg,
                        duration: 2000
                    })
                }
            })
        },
        queryjgdt(){
            let data = "?categoryId=21&pageNum=1&pageSize=4"
			queryNews(data).then(res => {
				if (res.code == 200) {
                    let list = res.data.records;
                    for (let i = 0; i < list.length; i++) {
                        list[i].url = list[i].url.replace("http://10.4.117.31:7380", util.newsUrl);
                        if(list[i].thumbnail){
                            list[i].thumbnail = list[i].thumbnail.replace("http://10.4.117.31:7000", util.minionUrl);
                        }
                    }
                    this.jgdtList = list
				} else {
					uni.showToast({
						icon: 'none',
						title: res.msg,
						duration: 2000
					})
				}
			})
		},
        queryztzl(){
            let data = "?categoryId=2&pageNum=1&pageSize=4"
            queryNews(data).then(res => {
                if (res.code == 200) {
                    let list = res.data.records;
                    for (let i = 0; i < list.length; i++) {
                        list[i].url = list[i].url.replace("http://10.4.117.31:7380", util.newsUrl);
                        if(list[i].thumbnail){
                            list[i].thumbnail = list[i].thumbnail.replace("http://10.4.117.31:7000", util.minionUrl);
                        }
                    }
                    this.ztzlList = list
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: res.msg,
                        duration: 2000
                    })
                }
            })
        },
        queryxfdx(){
            let data = "?categoryId=31&pageNum=1&pageSize=4"
            queryNews(data).then(res => {
                if (res.code == 200) {
                    let list = res.data.records;
                    for (let i = 0; i < list.length; i++) {
                        list[i].url = list[i].url.replace("http://10.4.117.31:7380", util.newsUrl);
                        if(list[i].thumbnail){
                            list[i].thumbnail = list[i].thumbnail.replace("http://10.4.117.31:7000", util.minionUrl);
                        }
                    }
                    this.xfdxList = list
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: res.msg,
                        duration: 2000
                    })
                }
            })
        },
        querydjws(){
            let data = "?categoryId=41&pageNum=1&pageSize=4"
            queryNews(data).then(res => {
                if (res.code == 200) {
                    let list = res.data.records;
                    for (let i = 0; i < list.length; i++) {
                        list[i].url = list[i].url.replace("http://10.4.117.31:7380", util.newsUrl);
                        if(list[i].thumbnail){
                            list[i].thumbnail = list[i].thumbnail.replace("http://10.4.117.31:7000", util.minionUrl);
                        }
                    }
                    this.djwsList = list
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: res.msg,
                        duration: 2000
                    })
                }
            })
        },
        querydjxx(){
            let data = "?categoryId=11&pageNum=1&pageSize=4"
            queryNews(data).then(res => {
                if (res.code == 200) {
                    let list = res.data.records;
                    for (let i = 0; i < list.length; i++) {
                        list[i].url = list[i].url.replace("http://10.4.117.31:7380", util.newsUrl);
                        if(list[i].thumbnail){
                            list[i].thumbnail = list[i].thumbnail.replace("http://10.4.117.31:7000", util.minionUrl);
                        }
                    }
                    this.djxxList = list
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: res.msg,
                        duration: 2000
                    })
                }
            })
        },
	}
}
</script>

<style lang="scss" scoped>
page{
    background: #fff;
}

.newList {
    height: 100vh;
    display: flex;
    flex-direction: column;

    .nav-bar {
        width: 100%;
        height: 88rpx;
        display: flex;
        position: relative;
        .title {
            flex: 1;
            font-size: $medium-font;
            font-weight: $font-weight;
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
    }
	.content-box {
		padding: $content-box-padding;
		z-index: 2;

		.menu-box {
			background-color: white;
		  padding: 20rpx 20rpx 45rpx 20rpx;
			border-radius: 10rpx;
			box-shadow: 0rpx 5rpx 5rpx 2rpx #dcdcdc;
			display: flex;
			flex-direction: column;
			margin-bottom: 30rpx;

			.content {
				display: flex;
				margin-top: 30rpx;

				.menu {
					text-align: center;
					width: 25%;
					.image {
						width: 100rpx;
						margin: auto;
					}
					.name {
						font-size: 28rpx;
						margin-top: 10rpx;
					}
				}
			}
		}

		.birthday-box {
			display: flex;
			flex-direction: column;

			.more {
				margin-top: -30rpx;
				margin-bottom: 10rpx;
				display: flex;
				align-items: flex-end;

				.text {
					font-weight: bold;
					flex: 1;
					text-align: right;
				}
				.img {
					margin-left: 10rpx;
					margin-bottom: 7rpx;
					width: 20rpx;
					height: 20rpx;
				}
			}

			.birthday-img {
				width: 210rpx;
			}
			.birthday-text {
				width: 119rpx;
				margin-top: -50rpx;
				margin-left: 80rpx;
			}
			.birthday-content {
				display: flex;
				background: rgba(253, 248, 244, 1);
				padding: 30rpx 10rpx;
				border-radius: 5rpx;
				margin-top: -5rpx;

				.content1 {
					text-align: center;
					width: 32%;
					.text1 {
						font-size: 28rpx;
						font-weight: 700;
					}
					.text2 {
						font-size: 28rpx;
						margin-left: 10rpx;
					}
				}
				.content2 {
					text-align: center;
					width: 32%;
					margin-left: 2%;
					.text1 {
						font-size: 28rpx;
						font-weight: 700;
					}
					.text2 {
						font-size: 28rpx;
						margin-left: 10rpx;
					}
				}
			}
		}

		.newsweek {
			margin-top: 30rpx;
            border-radius: 5px;
            box-shadow: 0 4rpx 4rpx 2rpx #dcdcdc;
            background-color: #fff;
			.type {
				display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: #f8f8f8;
                .top-title{
                    display: flex;
                    align-items: center;
                    .line{
                        width: 8rpx;
                        height: 36rpx;
                        background-color: #E1351B;
                        margin-right: 8rpx;
                    }
                }
				.name {
                    font-family: jtBlod;
					font-size: 30rpx;
					flex: 1;
                    background-image: url('@/static/icon/title-icon.png');
                    background-size: 100% 100%;
                    width: 200rpx;
                    color: #fff;
                    padding-left: 16rpx;
				}
				.more {
					display: flex;
					align-items: center;
                    margin-right: 10rpx;

					.text {
                        font-family: jtMedium;
					}
					.img {
						margin-left: 10rpx;
						width: 20rpx;
						height: 20rpx;
					}
				}
			}
			.ztbd-img {
				margin-top: 20rpx;
				border-radius: 10rpx;
				overflow: hidden;
				height: 170rpx;
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
					padding: 20rpx 0 0;
					display: flex;
					flex-direction: column;

					.content {
						display: flex;
						align-items: center;
                        position: relative;
						.left-text {
							flex: 1;
							display: flex;
							flex-direction: column;
							margin-right: 40rpx;

							.list-bottom {
								margin-top: 10rpx;
								display: flex;
								color: rgb(134, 134, 134);
								.time {
									flex: 1;
								}
							}
						}

						.right-image {
							width: 225rpx;
						}
						.right-text {
							flex: 1;
							display: flex;
							flex-direction: column;

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
                padding: 0 30rpx;
			}
		}

		.notice {
			position: relative;
			margin-top: 30rpx;
			background-color: rgb(251, 241, 240);
			border-radius: 15rpx;
			padding: 10rpx 30rpx 20rpx 20rpx;

			.close-icon {
				position: absolute;
				right: -5rpx;
				top: -10rpx;
				padding: 5rpx;
				background: white;
				border-radius: 50%;
			}

			.notice-title {
				display: flex;

				.notice-left {
					display: flex; align-items: center;

					.imgIcon {
						width: 57rpx;
						height: 61rpx;
					}
					.imgText {
						width: 129rpx;
						height: 26rpx;
					}
				}

				.notice-right {
					display: flex;
					flex-direction: column;
					flex: 1;
					position: relative;

					.star-img-box {
						margin-top: 20rpx;
						.star-img {
							margin-left: 5rpx;
							float: right;
							width: 18rpx;
							height: 18rpx;
						}
					}

					.interval {
						margin-top: 5rpx;
						height: 1px;
						margin: 5rpx 5rpx 0 10rpx;
						background-color: rgb(202, 83, 26);
						transform: scale(1, 0.5);
					}

				}
			}

			.notice-list {
				display: flex;
				align-items: center;
				padding: 8rpx 0;

				.icon {
					margin-left: 35rpx;
					width: 10rpx;
					height: 10rpx;
					background: rgba(225, 53, 27, 1);
					border-radius: 50%;
				}
				.title {
					flex: 1;
					font-size: 28rpx;
					padding: 0 10rpx;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
				}
				.time {
					font-size: 28rpx;
					display: flex;
					color: rgba(166, 166, 166, 1);
					align-items: center;

					.img {
						margin-left: 10rpx;
						width: 18rpx;
						height: 18rpx;
					}
				}

			}

		}

	}
    .u-empty{
        margin-bottom: 30rpx !important;
    }
    ::v-deep .u-empty__text{
        font-size: 30rpx !important;
    }
}

</style>
