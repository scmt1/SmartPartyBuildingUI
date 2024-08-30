<template>
    <div class="tree-box">
        <div class="search">
            <el-select style="width: 100%;" v-model="input" clearable @change="optionSelect($event)" filterable
                       :filter-method="filterHandler" placeholder="请输入机构名称搜索">
                <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item"></el-option>
            </el-select>
            <!--            <el-input v-model="input" placeholder="请输入机构名称搜索"></el-input>-->
        </div>
        <!--      左侧树状图-->
        <div class="tree">
            <el-tree :data="dataList"
                     :load="treeLoadNode"
                     lazy
                     :filter-node-method="filterNode"
                     :props="props"
                     ref="tree"
                     node-key="id"
                     highlight-current
                     @node-click="selectId"
                     :default-expanded-keys="defaultExpandedKeys"
                     :default-checked-keys="defaultCheckedKeys"
                     :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>
                        <div style="display: flex; flex-direction: row;">
                            <div v-if="node.data.id == whereMap.id"
                                 class="icon"></div>
                            <div>{{ node.label }}</div>
                        </div>
                    </span>
                </span>
                <img :src="treeImg">
            </el-tree>
        </div>
    </div>
</template>

<script>
import {getParentDept, getUnitedDeptList, determineNode, getUnitedDeptByName, getParentDeptByDeptId, getParentDeptById} from "@/api/tzUnitedDept.js";
import _ from 'lodash'
import tree from "@/assets/tree.png"
import {mapGetters} from "vuex";
import store from "@/store";

export default {
    name: 'unitedDeptTree',
    data() {
        return {
            treeImg: tree,
            deptId: null,
            input: '',
            dataList: [],
            props: {
                id: 'id',
                label: 'name',
                children: 'children',
                isLeaf: 'isLeaf'
            },
            whereMap: {
                id: null,
                parentId: null,
                name: null,
                deptId: null
            },
            defaultExpandedKeys: [],
            defaultCheckedKeys: [],
            selectDept: null,
            options: []
        }
    },
    props: {
        refreshInit: {
            type: Boolean,
            default: false
        },
        refreshTradeId: {
            type: String,
            default: null
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    created() {
        this.deptId = this.deptInfo.id
        this.initTreeData()
    },
    watch: {
        async refreshInit(val) {
            if (val) {
                await this.getDataList()
                this.getDeptForExpanded(this.refreshTradeId)
            }
        },
    },
    methods: {
        filterHandler(value, row, column) {
            this.input = value
            this.throttledMethod(this)
        },
        throttledMethod: _.throttle(_this => {
            _this.getDeptList()
        }, 1500),
        getDeptList() {
            if (this.input.length < 1) {
                this.options = []
                return
            }
            let data = {
                deptId: this.deptId + '',
                name: this.input
            }
            getUnitedDeptByName(data).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.options = data.data
                }
            })
        },
        optionSelect(event) {
            if (event == null || !event) {
                return
            }
            // 关闭其他节点
            let nodes = this.$refs.tree.store.nodesMap
            for (let i in nodes) {
                nodes[i].expanded = false
            }
            this.$nextTick(() => {
                this.getDeptForExpanded(event.id)
                this.selectId(event)
            })
        },
        getDeptForExpanded(id) {
            if(!id) return
            this.defaultExpandedKeys = []
            this.defaultCheckedKeys = []
            getParentDeptById(id).then(res => {
                const reslut = res.data
                if (reslut.code = '00000' && reslut.data) {
                    let parentIds = reslut.data.parentIds.split(',')
                    for (let i = 0; i < parentIds.length; i++) {
                        if (parentIds[i].length > 0) {
                            this.defaultExpandedKeys.push(Number(parentIds[i]))
                        }
                    }
                    this.defaultExpandedKeys.push(Number(id))
                    this.defaultCheckedKeys.push(Number(id))

                    this.whereMap.id = reslut.data.id
                    this.whereMap.name = reslut.data.name

                    let value = {
                        id: reslut.data.id,
                        parentId: reslut.data.parentId,
                        name: reslut.data.name,
                        deptId: reslut.data.deptId,
                        deptParentId: reslut.data.jcxfSysDept && reslut.data.jcxfSysDept != null ?reslut.data.jcxfSysDept.parentId: null
                    }
                    this.$emit('getUnionDeptInfo', value)
                }else {
                    this.$emit('getUnionDeptInfo', null)
                }
                this.$emit('refreshInit')
            })
        },
        initTreeData() {
            this.getDataList()
        },
        // 获取左侧树形数据
        getDataList() {
            this.dataList = [];

            return new Promise((resolve, reject) => {
                this.dataList = []
                getParentDeptByDeptId(this.deptId + '').then(res => {
                    const reslut = res.data
                    if (reslut.code = '00000') {
                        if (reslut.data == null) {
                            store.dispatch('setUnitedDeptRole', false)
                            resolve()
                        } else {
                            this.dataList = [reslut.data]

                            this.whereMap.id = reslut.data.id
                            this.whereMap.name = reslut.data.name

                            this.defaultExpandedKeys.push(Number(reslut.data.id))
                            this.defaultCheckedKeys.push(Number(reslut.data.id))

                            let value = {
                                id: reslut.data.id,
                                parentId: reslut.data.parentId,
                                name: reslut.data.name,
                                deptId: reslut.data.deptId,
                                deptParentId: reslut.data.jcxfSysDept && reslut.data.jcxfSysDept != null ?reslut.data.jcxfSysDept.parentId: null
                            }
                            this.$emit('getUnionDeptInfo', value)
                            store.dispatch('setUnitedDeptRole', true)
                        }
                    } else {
                        store.dispatch('setUnitedDeptRole', false)
                        resolve()
                    }
                    resolve()
                }).finally((e) => {

                })
            })
        },
        treeLoadNode(node, resolve) {
            if (node.data.id) {
                let data = {
                    id: node.data.id + '',
                    deptId: this.deptId + ''
                }
                getUnitedDeptList(data).then(res => {
                    const result = res.data
                    if (result.code == "00000" && result.data.length > 0) {
                        resolve(result.data)
                    } else {
                        resolve([])
                    }
                }).finally((e) => {
                })
            }
        },
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        selectId(event) {
            this.whereMap.id = event.id
            this.whereMap.parentId = event.parentId
            this.whereMap.name = event.name
            this.whereMap.deptId = event.deptId
            this.whereMap.deptParentId = event.jcxfSysDept && event.jcxfSysDept != null ?event.jcxfSysDept.parentId: null

            this.$emit('selectByTree', this.whereMap)
        }
    }
}
</script>

<style lang="less" scoped>
.tree-box {
    position: absolute;
    height: 100%;
    width: 100%;
    background-image: url('../../../assets/tree.png');
    background-repeat: no-repeat;
    background-position: center bottom 0px;
    background-color: rgba(255, 255, 255, 0);
}

.search {
    border-bottom: 1px solid #DCDFE6;
    width: 100%;
}

.tree {
    height: calc(100% - 45px);
    width: 100%;
    overflow: auto;
}

.el-tree {
    min-width: 100%;
    display: inline-block !important;
    background-color: rgba(255, 255, 255, 0);
}

::v-deep.el-tree-node__content {
    &:hover {
        background-color: rgba(255, 255, 255, 0);
    }
}

.icon {
    width: 10px;
    background: red;
    margin-right: 3px;
}

::v-deep .el-input__inner {
    border: 0;
}
</style>
