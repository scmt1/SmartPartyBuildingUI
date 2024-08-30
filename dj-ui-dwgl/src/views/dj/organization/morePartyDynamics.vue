<template>
    <div class="organization" style="border-radius:20px" v-loading="loading">
        <div style="text-align: right;">
            <el-button size="small" class="topBtn" icon="el-icon-arrow-left" @click="backPath()">返回</el-button>
        </div>
        <div class="bg-box" :style="`height: 100%; width: 100%; padding: 10px;`">
            <div class="content-row">
                <div class="content-col" v-for="item in list" :key="item.id">
                    <div style="cursor: pointer;" v-show="item.id != 999999999"
                         @click="redirectToExternalLink(item.url)">
                        <div class="img-box" style="max-width: 25%;">
                            <img v-if="item.thumbnailUrl && item.thumbnail" class="img"
                                 :src="item.thumbnail"/>
                            <img v-else class="img" :src="defaultImg"/>
                        </div>
                        <div
                            style="word-break: break-word; width: 75%; flex: 1; padding: 5px 10px; display: flex; flex-direction: column; justify-content: space-between;">
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
            </div>
            <div class="page-box">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="pageNumber"
                    :page-size="pageSize"
                    layout="prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import organizationTree from '@/views/dj/components/organizationTree'
import TreeAndContent from "@/components/TreeAndContent.vue";
import {queryIsLeafById} from "@/api/jcxfSysDept.js";
import defaultImg from "@/assets/defaultImg.png";
import eyePng from '@/assets/organization/eye.png';
import {queryNews} from '@/api/news';

export default {
    name: 'morePartyDynamics',
    components: {
        TreeAndContent,
        organizationTree,
    },
    data() {
        return {
            showLeaf: false,
            whereMap: {
                deptId: ''
            },
            dataListLoading: false,
            defaultImg:defaultImg,
            eyePng,
            pageNumber: 1,
            pageSize: 10,
            total: 0,
            deptId: 0,
            list: [],
            loading:false
        }
    },
    methods: {
        init(deptId) {
            this.deptId = deptId
            this.queryNewsPage()
        },
        backPath() {
            this.$emit('back')
        },
        redirectToExternalLink(url) {
            window.open(url, '_blank');
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.queryNewsPage()
        },
        handleCurrentChange(val) {
            this.pageNumber = val;
            this.queryNewsPage()
        },
        toOrganization() {
            this.$router.push({path: '/dwgl/organization/organization', query: {deptId: this.whereMap.deptId}})
        },
        queryNewsPage() {
            this.loading = true;
            let data = "?&pageNum=" + this.pageNumber + "&pageSize=" + this.pageSize + "&deptId=" + this.deptId;
            queryNews(data).then(res => {
                this.loading = false;
                if (res.code == 200) {
                    let list = res.data.records
                    let url = window.location.protocol + "//" + window.location.host
                    //新版
                    for (let i = 0; i < list.length; i++) {
                        if(url == 'http://10.46.19.198:8000'){
                            list[i].url = list[i].url.replace("http://10.4.117.31", "http://10.46.19.198");
                            if(list[i].thumbnail) {
                                list[i].thumbnail = list[i].thumbnail.replace("http://10.4.117.31", "http://10.46.19.198");
                            }
                        }
                    }
                    this.list = list;
                    this.total = res.data.total;
                } else {
                    this.$message.error("查询异常")
                }
            })
        },
        beforeLoad() {
            if (this.$route.query != null) {
                this.whereMap.deptId = this.$route.query.deptId
                //this.$refs.DataViewIsNotLeaf.setPartMemberBoxHeight()
            }
        },
        selectByTree(data) {
            this.whereMap.deptId = data.whereMap.deptId
            let isLeaf = data.whereMap.isLeaf
            if (isLeaf) {
                this.showLeaf = true
                this.$nextTick(() => {
                    this.$refs.DataViewLeaf.init(this.whereMap.deptId)
                })
            } else {
                this.showLeaf = false
                this.$nextTick(() => {
                    this.$refs.DataViewIsNotLeaf.init(this.whereMap.deptId)
                })
            }
        },
        getDeptId(data) {
            let isLeaf;
            queryIsLeafById(data.deptId).then(res => {
                if (res.data.data) {
                    isLeaf = true
                } else {
                    isLeaf = false
                }
                this.whereMap.deptId = data.deptId
                let type = data.type
                const typeList = [631, 632, 931, 932]
                if (isLeaf && typeList.indexOf(type) > -1) {
                    this.showLeaf = true
                    this.$nextTick(() => {
                        this.$refs.DataViewLeaf.init(this.whereMap.deptId)
                    })
                } else {
                    this.showLeaf = false
                    this.$nextTick(() => {
                        this.$refs.DataViewIsNotLeaf.init(this.whereMap.deptId)
                    })
                }
            })

        },
        initTreeData() {
            this.dataListLoading = true
        },
    }
}
</script>
<style lang="scss" scoped>
// ::v-deep .el-input__inner {
//     background-color: transparent !important;
// }

.el-tree {
    background: rgba(0, 0, 0, 0); // 整体背景透明
    ::v-deep .el-checkbox__inner {
        background: rgba(0, 0, 0, 0); // checkbox 背景透明
    }

    ::v-deep .el-tree-node__content:hover {
        background: rgba(104, 147, 215, 0.4); // hover 节点背景色，否则是白色
    }

    ::v-deep .el-tree-node:focus > .el-tree-node__content {
        background-color: rgba(0, 0, 0, 0); // focus 节点背景透明，否则是白色
    }
}

.bg-box {
    background-size: 100% 817px;
    background-repeat: no-repeat;
    background-position: center;
    background-attachment: fixed;
}


.content-row {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    .content-col {
        margin-top: 20px;
        flex: 1 50%;
        width: 50%;

        & > div {
            display: flex;
            flex-direction: row;
        }

        .img-box {
            width: 180px;

            .img {
                width: 100%;
                height: 110px;
            }
        }

        .sub-title {
            font-size: 16px;
            font-weight: 700;
            color: rgba(51, 51, 51, 1);
        }

        .sub-content {
            font-size: 14px;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
            // width: 520px;
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

.page-box {
    margin-top: 10px;
    text-align: center;
}

</style>
