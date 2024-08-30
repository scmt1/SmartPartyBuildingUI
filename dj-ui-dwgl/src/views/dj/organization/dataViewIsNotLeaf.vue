<template>
    <div style="height: calc(100% - 32px); display: flex; flex-direction: column;">
        <el-row :gutter="20">
            <el-col :span="6">
                <el-image class="big-title-img" style="width: 100%;" :src="deptPic?deptPic:partyCount"
                          fit="contain"></el-image>
            </el-col>
            <el-col :span="8">
                <div style="padding: 15px 0 15px 15px;margin-top: 10px;">
                    <div ref="deptTop">
                        <div class="deptName">
                            {{ deptInfo.name }}
                        </div>
                        <div class="deptWords">
                            {{ deptWords && deptWords.length > 0 ? deptWords : "暂无简介" }}
                        </div>
                    </div>
                    <div :style="'float: left; overflow: auto; margin-top: 10px; min-height: 85px; height:' + partMemberBoxHeight">
                        <div v-if="bossList.length > 0" style="float: left;">
                            <div style="display: flex; flex-direction: row;">
                                <div>
                                    <el-avatar style="cursor: pointer;"
                                               @click="toBossDetail(bossList[0].id,bossList[0].deptId)" :size="60"
                                               :src="bossList[0].avatar?bossList[0].avatar:defaultHeader"></el-avatar>
                                </div>
                                <div style="margin-left: 10px; font-size: 15px;margin-top: 15px;">
                                    <div class="realName">{{ bossList[0].realName }}</div>
                                    <div class="position">
                                        {{
                                            convertFiled(bossList[0].position, 'position') ? convertFiled(bossList[0].position, 'position') : '--'
                                        }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else style="float: left;">
                            <div style="display: flex; flex-direction: row;">
                                <div>
                                    <el-avatar @click="toBossDetail()" style="cursor: pointer;" :size="60"
                                               :src="defaultHeader"></el-avatar>
                                </div>
                                <div style="margin-left: 10px; font-size: 15px;margin-top: 15px;">
                                    <div class="realName">{{ deptInfo.partyOrgManager }}</div>
                                    <div class="position">
                                        书记
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                            :style="'float: left; overflow: auto; margin-top: 10px; min-height: 85px; height:' + partMemberBoxHeight">
                        <div v-if="deputyBossList.length > 0" style="float: left;">
                            <div style="display: flex; flex-direction: row;" v-for="(item,index) in deputyBossList"
                                 :key="index">
                                <div>
                                    <el-avatar style="cursor: pointer;" @click="toBossDetail(item.id,item.deptId)"
                                               :size="60" :src="item.avatar?item.avatar:defaultHeader"></el-avatar>
                                </div>
                                <div style="margin-left: 10px; font-size: 15px;">
                                    <div class="realName">{{ item.realName }}</div>
                                    <div class="position">
                                        {{
                                            convertFiled(item.position, 'position') ? convertFiled(item.position, 'position') : '--'
                                        }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else style="float: left;">
                            <div style="display: flex; flex-direction: row;">
                                <div>
                                    <el-avatar style="cursor: pointer;" @click="toBossDetail()" :size="60"
                                               :src="defaultHeader"></el-avatar>
                                </div>
                                <div style="margin-left: 10px; font-size: 15px;margin-top: 15px;">
                                    <div class="realName">{{ deptInfo.partyOrgContact }}</div>
                                    <div class="position">
                                        联系人
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="10">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div class="content-box">
                            <div class="content">
                                <div class="content-img">
                                    <img :src="dangyuan"/>
                                </div>
                                <div>
                                    <div class="content-title">党员总数</div>
                                    <div class="content-num">
                                        {{ totalPartyMember }}人
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="content-box">
                            <div class="content">
                                <div class="content-img">
                                    <img :src="sanhui"/>
                                </div>
                                <div>
                                    <div class="content-title">三会一课</div>
                                    <div class="content-num">
                                        {{ totalClass }}次
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div class="content-box">
                            <div class="content">
                                <div class="content-img">
                                    <img :src="zuzhi"/>
                                </div>
                                <div>
                                    <div class="content-title">下级组织</div>
                                    <div class="content-num">
                                        {{ totalChildren }}个
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="content-box">
                            <div class="content">
                                <div class="content-img">
                                    <img :src="dangfei"/>
                                </div>
                                <div>
                                    <div class="content-title">党费缴纳</div>
                                    <div class="content-num">
                                        {{ totalYearFei }}元
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>


        <div class="content-box2" :style="`background-image: url(${ccPng}); background-size:cover`">
            <div class="title-box">
                <div class="icon"></div>
                <div class="text" style="flex: 1;">下级党组织概况</div>
                <div class="more" @click="goToZzMore" v-if="fourChildren!=null&&fourChildren.length>5">更多></div>
            </div>
            <div class="org-parent-parent-box" v-if="fourChildren.length!=0">
                <div class="org-parent-box" v-for="(item, index) in fourChildren" :key="index">
                    <div v-if="item.name" class="org-box">
                        <div class="org-content">
                            <div class="name">{{ item.name }}</div>
                            <div class="shuJi">
                                <img class="img" :src="xrPng"/>
                                党组织书记：{{
                                    item.partyOrgManager && item.partyOrgManager.length > 0 ? item.partyOrgManager : '暂无'
                                }}
                            </div>
                            <div class="type">
                                <img class="img" :src="sfPng"/>
                                组织类型：{{
                                    convertFiled(item.organizationType, 'organizationType') ? convertFiled(item.organizationType, 'organizationType') : '&#45;&#45;'
                                }}
                            </div>
                        </div>
                    </div>
                    <div class="org-box" v-else></div>
                    <div v-if="index%2==1" style="float: left; width: 100%;height: 1px;"></div>
                </div>

            </div>
            <div v-else
                 style="margin-top: 30px; margin-bottom: 30px; color: lightgrey; font-size: 14px; text-align: center;">
                暂无下级组织
            </div>
        </div>

        <div class="content-box3">
            <div class="title-box">
                <div class="icon"></div>
                <div class="text">党内动态</div>
                <div class="more" @click="goToMore" v-if="newList!=null&&newList.length>0">更多></div>
            </div>
            <div class="content-row" v-if="newList!=null&&newList.length>0">
                <div style="cursor: pointer;" class="content-col" v-for="(item,index) in newList" :index="index"
                     @click="redirectToExternalLink(item.url)">
                    <div class="img-box" style="width: 120px;height: 75px;">
                        <img v-if="item.thumbnailUrl && item.thumbnail" class="img" :src="item.thumbnail"/>
                        <img v-else class="img" style="width: 100%;" :src="defaultImg"/>
                    </div>
                    <div
                            style="word-break: break-word; width: 75%; padding: 5px 10px; display: flex; flex-direction: column; justify-content: space-between;">
                        <div class="sub-title">{{ item.title }}</div>
                        <div class="sub-time">
                            {{ item.created }}
                        </div>
                        <div class="sub-eye">
                            <img class="eye-img" :src="eyePng" alt=""> {{ item.viewCount }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="content-row" v-else>
                <div style="font-size: 15px;text-align:center;margin: auto">
                    暂无动态
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import dangyuan from "@/assets/organization/dangyuan.png"
import sanhui from "@/assets/organization/sanhui.png"
import zuzhi from "@/assets/organization/zuzhi.png"
import dangfei from "@/assets/organization/dangfei.png"
import defaultHeader from "@/assets/default-header.png"
import hongqi from "@/assets/organization/hongqi.png"
import {queryBoss, queryPartyMemberList} from "@/api/jcxfPartyMember";
import {countMyTotalClassNum} from "@/api/jcxfOrganizationLife";
import {getDeptIntroduceById, getTzSysDept, getTzSysDeptByParentId} from "@/api/jcxfSysDept";
import {queryFeeTotalByYear} from "@/api/jcxfPayFee";
import util from "@/libs/util";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import ccPng from '@/assets/organization/cc.png'
import xrPng from '@/assets/organization/xr.png'
import sfPng from '@/assets/organization/sf.png'
import eyePng from '@/assets/organization/eye.png'
import {queryNews} from '@/api/news'
import partyCount from "@/assets/defaultImg.png"
import newBg from "@/assets/defaultImg.png"
import {getPayFeeTotal} from "@/api/homePage";

export default {
    name: "dataViewIsNotLeaf",
    data() {
        return {
            partyCount: partyCount,
            defaultHeader: defaultHeader,
            defaultImg: newBg,
            dangyuan: dangyuan,
            zuzhi: zuzhi,
            dangfei: dangfei,
            sanhui: sanhui,
            hongqi: hongqi,
            totalPartyMember: 0,
            totalClass: 0,
            totalChildren: 0,
            totalYearFei: 0,
            deptPic: '',
            deptName: '',
            deptWords: '',
            bossList: [],
            deputyBossList: [],
            partMemberBoxHeight: 'auto',
            fourChildren: [],
            organizationTypeList: [],
            positionList: [],
            ccPng,
            xrPng,
            sfPng,
            eyePng,
            newList: [],
            deptId: null,
            deptInfo: {}
        }
    },
    created() {
        this.getDict('organizationType')
        this.getDict('position')
    },
    mounted() {
        let _this = this
        window.addEventListener('resize', function () {
            _this.setPartMemberBoxHeight()
        })
    },
    methods: {
        redirectToExternalLink(url) {
            window.open(url, '_blank');
        },
        queryNews() {
            let data = "?deptId=" + this.deptId + "&pageNum=1&pageSize=6"
            queryNews(data).then(res => {
                if (res.code == 200) {
                    let list = res.data.records
                    let url = window.location.protocol + "//" + window.location.host
                    //新版
                    for (let i = 0; i < list.length; i++) {
                        if(url == 'http://10.46.19.198:8000'){
                            list[i].url = list[i].url.replace("http://10.4.117.31", "http://10.46.19.198");
                            if(list[i].thumbnail){
                                list[i].thumbnail = list[i].thumbnail.replace("http://10.4.117.31", "http://10.46.19.198");
                            }
                        }
                    }
                    this.newList = list
                } else {
                    this.$message.error("查询异常")
                }
            })
        },
        init(deptId) {
            this.deptId = deptId
            this.countTotalPartyMember(deptId)
            this.countTotalClass(deptId)
            this.countTotalFei(deptId)
            this.Boss(deptId, 1)
            this.Boss(deptId, 2)
            this.getCover(deptId)
            this.getTzSysDeptList(deptId)
            this.getSysDept(deptId)
            this.queryNews()
        },
        setPartMemberBoxHeight() {
            this.$nextTick(() => {
                if (this.$refs.deptTop) {
                    this.partMemberBoxHeight = 170 - this.$refs.deptTop.offsetHeight - 10 + 'px'
                }
            })
        },
        //查询总党员数
        countTotalPartyMember(id) {
            let data = {
                deptId: id
            }
            queryPartyMemberList({data: data}).then((res) => {
                this.totalPartyMember = res.data.data.total
            })
        },
        countTotalClass(deptId) {
            countMyTotalClassNum(deptId).then(res => {
                this.totalClass = res.data.data.countOur
            })
        },
        //获取组织信息
        getSysDept(deptId) {
            getTzSysDept(deptId).then(res2 => {
                const result = res2.data
                if (result.code == '00000') {
                    this.deptInfo = result.data
                }
            })
        },
        getTzSysDeptList(deptId) {
            let data = {
                tzSysDept: {
                    id: deptId,
                    parentId: deptId
                }
            }
            getTzSysDeptByParentId({data: data}).then(res => {
                this.totalChildren = res.data.data.length
                this.fourChildren = res.data.data.filter((element, index) => index < 6);
                // /*子机构的信息*/
                // this.fourChildren = []
                //
                // for (let i = 1; i < dataRes.records.length; i++) {
                //     let Chindrendata = {}
                //     Chindrendata.organizationType = dataRes.records[i].organizationType
                //     Chindrendata.name = dataRes.records[i].name
                //     Chindrendata.id = dataRes.records[i].id
                //     Chindrendata.partyOrgManager = dataRes.records[i].partyOrgManager
                //     this.fourChildren[i - 1] = Chindrendata
                // }
                //
                // //判断fourChildren长度，如果不是3的倍数，则自动加上空格
                // if (this.fourChildren.length % 3 == 1) {
                //     let Chindrendata = {}
                //     Chindrendata.organizationType = ""
                //     Chindrendata.name = ""
                //     Chindrendata.id = ""
                //     this.fourChildren.push(Chindrendata, Chindrendata);
                // } else if (this.fourChildren.length % 3 == 2) {
                //     let Chindrendata = {}
                //     Chindrendata.organizationType = ""
                //     Chindrendata.name = ""
                //     Chindrendata.id = ""
                //     this.fourChildren.push(Chindrendata);
                // }
            })
        },
        //查询党费缴纳总额
        countTotalFei(deptId) {
            getPayFeeTotal(deptId + '').then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.totalYearFei = data.data
                }
            })
        },
        getCover(deptId) {
            getDeptIntroduceById(deptId).then(res => {
                const data = res.data.data
                this.deptWords = data.deptIntroduction
                this.deptPic = data.deptInfo.deptPhoto
                this.setPartMemberBoxHeight()
            });
        },
        Boss(deptId, positionType) {
            queryBoss(deptId + '', positionType + '').then(res => {
                this.setPartMemberBoxHeight()
                if (positionType == 1) {
                    this.bossList = res.data.data
                } else {
                    this.deputyBossList = res.data.data
                }
            })
        },
        getDict(type) {
            getDictByCode(type).then(res => {
                let data = res.data.data
                if (type === 'organizationType') {
                    this.organizationTypeList = data
                } else if (type === 'position') {
                    this.positionList = data
                }
            })
        },
        convertFiled(row, type) {
            let tmp = ''
            if (type == 'organizationType') {
                this.organizationTypeList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type == 'position') {
                this.positionList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            }
            return tmp
        },
        toBossDetail(id, deptid) {
            if (id && deptid) {
                this.$router.push({
                    path: '/dwgl/personDetails',
                    query: {id: id, deptId: deptid, page: "OrganizationLife"}
                })
            } else {
                this.$message.info('暂无数据')
            }
        },
        goToMore() {
            this.$emit('morePartyDynamics')
            // this.$router.push({path: '/dwgl/dept/morePartyDynamics', query: {deptId: this.deptId}})
        },
        goToZzMore() {
            this.$emit('moreOrganization')
        }
    }
}
</script>

<style lang="scss" scoped>
.deptName {
    min-height: 27px;
    font-size: 20px;
    margin-bottom: 15px;
    font-weight: 700;
    max-height: 78px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.deptWords {
    font-size: 14px;
    color: rgba(51, 51, 51, 1);
    max-height: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
}

.realName {
    width: 80px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.position {
    width: 80px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: red;
}


.content-box {
    margin-top: 30px;
    padding: 5px 15px;
    border-radius: 3px;
    background: rgba(255, 248, 247, 1);
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: row;
    align-items: center;
    word-break: break-all;

    .content {
        display: flex;
        flex-direction: row;
        width: 100%;
        padding: 0 10px;
        align-items: center;
        position: relative;

        .content-img {
            min-width: 43px;
            width: 40%;

            img {
                float: right;
                height: 43px;
                width: 43px;
            }
        }

        .content-title {
            margin-left: 10px;
            color: rgba(102, 102, 102, 1);
            font-size: 0.18rem;
            font-weight: 400;
        }

        .content-num {
            margin-left: 10px;
            color: rgba(240, 54, 57, 1);
            font-size: 0.20rem;
            font-weight: 700;
        }

        .line {
            position: absolute;
            top: 10px;
            right: 0;
            width: 1px;
            height: 40px;
            background: rgba(242, 228, 228, 1);
        }
    }
}

.content-box2 {
    padding: 15px;
    width: 100%;
    // border-top: 2px rgb(180, 180, 180) dashed;
    background-size: 100% 332px;
    background-repeat: no-repeat;
    background-position: center;

    .title-box {
        display: flex;
        flex-direction: row;
        align-items: center;

        .icon {
            background: red;
            width: 8px;
            height: 8px;
        }

        .text {
            padding-left: 10px;
            font-size: 18px;
            font-weight: 700;
            color: rgba(228, 53, 43, 1);
        }
        .more {
            font-size: 14px;
            font-weight: 400;
            cursor: pointer;
            color: rgba(153, 153, 153, 1);
        }
    }

    .org-parent-parent-box {
        display: flex;
        // justify-content: space-between;
        flex-wrap: wrap;
    }

    .org-parent-box {
        flex: 1 33.33%;
        width: 33.33%;
    }

    .org-box {
        display: flex;
        flex-direction: row;
        width: 100%;
        padding: 10px;

        .img-box {

            .img {
                width: 100%;
            }
        }

        .org-content {
            flex: 1;
            padding-left: 10px;

            .name {
                font-weight: 400;
                font-size: 16px;
                color: rgba(51, 51, 51, 1);
            }

            .shuJi {
                font-size: 14px;
                font-weight: 400;
                color: rgba(102, 102, 102, 1);
                margin-top: 5px;
            }

            .type {
                font-size: 14px;
                font-weight: 400;
                color: rgba(102, 102, 102, 1);
            }

            .img {
                position: relative;
                top: -2px;
                width: 12px;
                height: 12px;
            }
        }
    }
}


.content-box3 {
    margin-top: 10px;
    padding: 15px;
    width: 100%;
    // border-top: 2px rgb(180, 180, 180) dashed;
    background-color: #fff;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);

    .title-box {
        display: flex;
        flex-direction: row;
        align-items: center;

        .icon {
            background: red;
            width: 8px;
            height: 8px;
        }

        .text {
            padding-left: 10px;
            flex: 1;
            font-size: 18px;
            font-weight: 700;
            color: rgba(228, 53, 43, 1);
        }

        .more {
            font-size: 14px;
            font-weight: 400;
            cursor: pointer;
            color: rgba(153, 153, 153, 1);
        }
    }

    .content-row {
        // margin-top: 10px;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        // flex-direction: row;

        .content-col {
            margin-top: 10px;
            flex: 1 50%;
            width: 50%;
            display: flex;
            flex-direction: row;

            .img-box {
                width: 180px;

                .img {
                    width: 100%;
                    height: 100%;
                }
            }

            .sub-title {
                font-size: 0.16rem;
                font-weight: 700;
                color: rgba(51, 51, 51, 1);
            }

            .sub-content {
                font-size: 14px;
                font-weight: 400;
                color: rgba(102, 102, 102, 1);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .sub-time {
                font-size: 12px;
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
            }

            .sub-eye {
                font-size: 12px;
                font-weight: 400;
                color: rgba(153, 153, 153, 1);

                img {
                    width: 20px;
                    height: 20px;
                }
            }

            .content-right {
                flex: 1;
                display: flex;
                flex-direction: column;
                padding: 10px;

                .title {
                    font-size: 16px;
                    font-weight: 700;
                    color: rgba(51, 51, 51, 1);
                }

                .introduce {
                    flex: 1;
                    color: rgb(189, 189, 189);
                    margin-top: 30px;
                }

                .sub-text {
                    td {
                        font-size: 14px;
                        font-weight: 400;
                        color: rgba(102, 102, 102, 1);
                    }
                }
            }
        }
    }
}

.big-title-img {
    ::v-deep img {
        border-radius: 8px;
    }
}

</style>
