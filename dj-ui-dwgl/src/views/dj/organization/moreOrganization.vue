<template>
    <div class="organization" style="border-radius:20px" v-loading="loading">
        <div style="text-align: right;">
            <el-button size="small" class="topBtn" icon="el-icon-arrow-left" @click="backPath()">返回</el-button>
        </div>
        <div class="bg-box" :style="`height: 100%; width: 100%; padding: 10px;`">
            <div class="content-box2">
                <div class="title-box">
                    <div class="icon"></div>
                    <div class="text">下级党组织</div>
                </div>
                <div class="org-parent-parent-box" v-if="list.length!=0">
                    <div class="org-parent-box" v-for="(item, index) in list" :key="index">
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
import {queryIsLeafById,queryTzSysDeptLowerLevelList} from "@/api/jcxfSysDept";
import xrPng from '@/assets/organization/xr.png'
import sfPng from '@/assets/organization/sf.png'
import {getDictByCode} from "@/api/jcxfSysDictionary";

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
            xrPng,
            sfPng,
            pageNumber: 1,
            pageSize: 18,
            total: 0,
            deptId: 0,
            list: [],
            loading:false,
            organizationTypeList: [],
        }
    },
    methods: {
        init(deptId) {
            this.getDict('organizationType')
            this.deptId = deptId
            this.getTzSysDeptList()
        },
        backPath() {
            this.$emit('back')
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getTzSysDeptList()
        },
        handleCurrentChange(val) {
            this.pageNumber = val;
            this.getTzSysDeptList()
        },
        toOrganization() {
            this.$router.push({path: '/dwgl/organization/organization', query: {deptId: this.whereMap.deptId}})
        },
        getDict(type) {
            getDictByCode(type).then(res => {
                let data = res.data.data
                if (type === 'organizationType') {
                    this.organizationTypeList = data
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
        getTzSysDeptList() {
            let data = {
                tzSysDept: {
                    id:this.deptId,
                    parentId:this.deptId
                },
                pageVo: {
                    pageSize: this.pageSize,
                    pageNumber: this.pageNumber
                }
            }
            queryTzSysDeptLowerLevelList({data: data}).then(res => {
                const data = res.data.data
                this.total = data.total
                this.list = data.records;
            })
        },
        beforeLoad() {
            if (this.$route.query != null) {
                this.whereMap.deptId = this.$route.query.deptId
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

.content-box2 {
    padding: 15px;
    width: 100%;
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

.page-box {
    margin-top: 10px;
    text-align: center;
}

</style>
