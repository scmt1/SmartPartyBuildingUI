<template>
    <div class="organization" style="border-radius:20px">
        <tree-and-content>
            <template v-slot:tree>
                <div :style="'height: 100%; width: 100%;'">
                    <organization-tree ref="organization_tree"  @selectByTree="selectByTree" @getDeptId="getDeptId" :loading="dataListLoading"></organization-tree>
                </div>
            </template>
            <template v-slot:content>
                <div class="bg-box" :style="`background-image: url(${backgroundImgFixed});height: 100%; width: 100%;`">
                    <div style="width: 100%; height: 32px; margin-bottom: 10px;" v-if="showLeaf == 2 && ! dynamics && !moreZz">
                        <el-button size="small" @click="toOrganization()" style="background: rgba(228, 53, 43, 1); float: right; width: 90px; height: 30px;" type="danger" round>组织详情</el-button>
                    </div>
                    <data-view-is-not-leaf style="background-color: rgba(0,0,0,0)" ref="DataViewIsNotLeaf" v-if="showLeaf == 2 && !dynamics && !moreZz"
                                           @moreOrganization="moreOrganizationShow()" @morePartyDynamics="dynamicsShow()"></data-view-is-not-leaf>
                    <dataViewLeaf v-else-if="showLeaf == 1" ref="DataViewLeaf"></dataViewLeaf>
                    <more-party-dynamics v-if="showLeaf == 2 && dynamics" ref="morePartyDynamics" @back="dynamicsBack()"></more-party-dynamics>
                    <more-organization v-if="showLeaf == 2 && moreZz" ref="moreOrganization" @back="dynamicsBack()"></more-organization>
                </div>
            </template>
        </tree-and-content>
    </div>
</template>

<script>
import organizationTree from '@/views/dj/components/organizationTree'
import TreeAndContent from "@/components/TreeAndContent.vue";
import dataViewIsNotLeaf from "@/views/dj/organization/dataViewIsNotLeaf.vue";
import dataViewLeaf from "@/views/dj/organization/dataViewLeaf.vue";
import {queryIsLeafById} from "@/api/jcxfSysDept.js";
import backgroundImg from '@/assets/organization/indexBackgroud.png'
import backgroundImgTree from '@/assets/organization/backgroundImgTree.png'
import backgroundImgFixed from '@/assets/organization/dyzzxx.png'
import morePartyDynamics from "@/views/dj/organization/morePartyDynamics.vue";
import moreOrganization from "@/views/dj/organization/moreOrganization.vue";

export default {
    name: 'organization',
    components: {
        TreeAndContent,
        organizationTree,
        dataViewIsNotLeaf,
        dataViewLeaf,
        morePartyDynamics,
        moreOrganization
    },
    data() {
        return {
            backgroundImgTree: backgroundImgTree,
            backgroundImg: backgroundImg,
            showLeaf:null,
            whereMap: {
                deptId: ''
            },
            dataListLoading: false,
            backgroundImgFixed,
            dynamics: false,
            moreZz:false
        }
    },
    created() {
        this.initTreeData()
        this.beforeLoad()
    },
    methods: {
        dynamicsBack() {
            this.dynamics = false
            this.moreZz = false
            this.$nextTick(()=> {
                this.$refs.DataViewIsNotLeaf.init(this.whereMap.deptId)
            })
        },
        dynamicsShow() {
            this.dynamics = true
            this.$nextTick(() => {
                this.$refs.morePartyDynamics.init(this.whereMap.deptId)
            })
        },
        moreOrganizationShow() {
            this.moreZz = true
            this.$nextTick(() => {
                this.$refs.moreOrganization.init(this.whereMap.deptId)
            })
        },
        toOrganization() {
            this.$router.push({path: '/dwgl/organization/organization', query: {deptId: this.whereMap.deptId}})
        },
        beforeLoad() {
            if (this.$route.query != null) {
                this.whereMap.deptId = this.$route.query.deptId
            }
        },
        selectByTree(data) {
            this.whereMap.deptId = data.whereMap.deptId
            let isLeaf = data.whereMap.isLeaf
            let type = data.whereMap.type
            const typeList = [631, 632, 931, 932]

            this.dynamics = false
            this.moreZz = false

            if(isLeaf && typeList.indexOf(type) > -1){
                this.showLeaf = 1
                this.$nextTick(()=> {
                    this.$refs.DataViewLeaf.init(this.whereMap.deptId)
                })
            } else {
                this.showLeaf = 2
                this.$nextTick(()=> {
                    this.$refs.DataViewIsNotLeaf.init(this.whereMap.deptId)
                })
            }
        },
        getDeptId(data) {
            let isLeaf;
            queryIsLeafById(data.deptId).then(res=>{
                if(res.data.data){
                    isLeaf = true
                }else {
                    isLeaf = false
                }
                this.whereMap.deptId = data.deptId
                let type = data.type
                const typeList = [631, 632, 931, 932]
                if(isLeaf && typeList.indexOf(type) > -1){
                    this.showLeaf = 1
                    this.$nextTick(()=> {
                        this.$refs.DataViewLeaf.init(this.whereMap.deptId)
                    })
                }else {
                    this.showLeaf = 2
                    this.$nextTick(()=> {
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
::v-deep .el-input__inner {
    background-color: transparent !important;
}

.el-tree{
    background: rgba(0,0,0,0);// 整体背景透明
    ::v-deep .el-checkbox__inner{
        background:rgba(0,0,0,0);// checkbox 背景透明
    }
    ::v-deep .el-tree-node__content:hover {
        background: rgba(104,147,215,0.4);// hover 节点背景色，否则是白色
    }
    ::v-deep .el-tree-node:focus>.el-tree-node__content {
        background-color: rgba(0,0,0,0); // focus 节点背景透明，否则是白色
    }
}

.bg-box {
    background-size: 100% 817px;
    background-repeat: no-repeat;
    background-position: center;
    background-attachment: fixed;
}

</style>
