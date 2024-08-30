<template>
    <div class="tree-box">
        <div class="search">
            <el-select style="width: 100%;" v-model="input" clearable @change="optionSelect($event)" filterable :filter-method="filterHandler" placeholder="请输入机构名称搜索">
                <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item"></el-option>
            </el-select>
<!--            <el-input v-model="input" placeholder="请输入机构名称搜索"></el-input>-->
        </div>
        <!--      左侧树状图-->
        <div class="tree">
            <el-tree :data="dataList"
                     :load="treeLoadNode"
                     lazy
                     v-loading.fullscreen.lock="dataListLoading"
                     :filter-node-method="filterNode"
                     :props="props"
                     ref="tree"
                     node-key="id"
                     highlight-current
                     @node-click="selectId"
                     :show-checkbox="showCheckboxFlag"
                     check-strictly
                     @check="checkedKeysChange"
                     :default-expanded-keys="defaultExpandedKeys"
                     :default-checked-keys="defaultCheckedKeys"
                     :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>
                        <div style="display: flex; flex-direction: row;">
<!--                            <div v-if="defaultCheckedKeys.length > 0 && node.data.id == defaultCheckedKeys[0]" class="icon"></div>-->
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
// import {treeDataTranslate} from '@/utils/index'
import {getTzSysDeptList, getTzSysDept, getChildrenDeptListByName} from "@/api/jcxfSysDept";
import _ from 'lodash'
import tree from "@/assets/tree.png"
import {mapGetters} from "vuex";
export default {
    name: 'organizationTreeSelect',
    data() {
        return {
            treeImg:tree,
            deptListLoaded:false,
            deptId: '',
            input: '',
            dataListLoading: false,
            dataList: [],
            props: {
                id: 'id',
                label: 'name',
                children: 'children',
                isLeaf: 'isLeaf'
            },
            whereMap: {},
            tenantId:'',
            defaultExpandedKeys: [],
            defaultCheckedKeys: [],
            selectDept: null,
            options: [],
            showCheckboxFlag: true
        }
    },
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        isLoading: {
            type: Boolean,
            default: true
        },
        isTrue: {
            type: Boolean,
            default: false
        },
        checkedKeys: {
            type: Array,
            default: null
        },
        showCheckbox: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        checkedKeys() {
            this.defaultExpandedKeys = []
            for (let i = 0; i < this.checkedKeys.length; i++) {
                this.getTzSysDeptForExpanded(this.checkedKeys[i])
                this.defaultCheckedKeys.push(Number(this.checkedKeys[i]))
            }
        },
        showCheckbox() {
            this.showCheckboxFlag = this.showCheckbox
        }
    },
    created() {
        this.initTreeData()
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    methods: {
        filterHandler(value, row, column) {
            this.input = value
            this.throttledMethod(this)
        },
        throttledMethod: _.throttle(_this => {
            _this.getDeptList()
        }, 1500),
        checkedKeysChange(checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys ) {
            this.$emit('checkedKeysChange', this.$refs.tree.getCheckedKeys())
            this.$emit('checkedNodesChange', this.$refs.tree.getCheckedNodes())
        },
        getDeptList() {
            if (this.input.length < 1) {
                this.options = []
                return
            }
            let data = {
                deptId: this.deptInfo.id + '',
                deptName: this.input + ''
            }
            getChildrenDeptListByName(data).then(res =>{
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
            this.$nextTick(() =>{
                this.getTzSysDeptForExpanded(event.id)
                this.selectId(event)
            })
        },
        getTzSysDeptForExpanded(deptId) {
            getTzSysDept(deptId).then(res =>{
                const reslut = res.data
                if (reslut.code = '00000') {
                    let parentIds = reslut.data.parentIds.split(',')
                    for (let i = 0; i < parentIds.length; i++) {
                        const id = parentIds[i]
                        if (id.length > 0) {
                            this.defaultExpandedKeys.push(Number(id))
                        }
                    }
                    this.defaultExpandedKeys.push(Number(deptId))
                }
            })
        },
        initTreeData() {
            if (this.isLoading) {
                this.dataListLoading = true
            }
            this.getDataList()
        },
        // 获取左侧树形数据
        getDataList() {
            this.dataList = [];

            getTzSysDept(this.deptInfo.id+'').then(res =>{
                const reslut = res.data
                if (reslut.code = '00000') {
                    this.dataList = [reslut.data]
                    this.dataListLoading = false

                    this.defaultExpandedKeys.push(Number(this.deptInfo.id))
                    if (this.deptId !=null &&  this.deptId &&  this.deptId.length > 0) {
                        if (this.deptId != this.deptInfo.deptId) {
                            getTzSysDept(this.deptId +'').then(res2 => {
                                const result = res2.data
                                if (result.code == '00000') {
                                    let value = {
                                        deptId: this.deptId,
                                        type: result.data.type
                                    }
                                    this.$emit('getDeptId', value)
                                    this.$emit('getDeptName',  reslut.data.name)
                                }
                            })
                        } else {
                            let value = {
                                deptId: this.deptId,
                                type: this.dataList[0].type
                            }
                            this.$emit('getDeptId', value)
                            this.$emit('getDeptName',  reslut.data.name)
                        }
                    } else {
                        // this.defaultCheckedKeys = []
                        // this.defaultCheckedKeys.push(Number(userInformation.deptId))
                        let value = {
                            deptId: this.dataList[0].id,
                            type: this.dataList[0].type
                        }
                        this.$emit('getDeptId', value)
                    }
                }
            }).finally((e) => {
                this.dataListLoading = false
            })

        },
        treeLoadNode(node, resolve){
            if(node.data.id){
                getTzSysDeptList(node.data.id+'').then(res => {
                    if (res.code == "000000" && res.data.length > 0) {
                        /*for (let i = 0; i < res.data.length; i++) {
                            res.data[i].isLeaf = false;
                        }*/
                        resolve(res.data)
                        // this.dataList = treeDataTranslate(data.data, 'id', 'parentId')
                        // this.$emit('getDeptId', this.dataList[0].id)
                    }else{
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
            // this.whereMap.parentIdChild = event.id
            // this.whereMap.dept_id_child = event.id
            this.whereMap.deptId = event.id
            this.whereMap.deptName = event.name
            this.whereMap.children = event.children
            this.whereMap.isLeaf = event.isLeaf
            this.whereMap.type = event.type

            this.pageSize = 10
            this.pageNum = 1

            // this.defaultCheckedKeys = [event.id]

            let data = {
                whereMap: this.whereMap,
                pageSize: this.pageSize,
                pageNum: this.pageNum
            }
            this.$emit('selectByTree', data)
        }
    }
}
</script>

<style lang="less" scoped>
.tree-box {
    position: absolute;
    height: 100%;
    width: 100%;
    /*background-image: url('../../../assets/tree.png');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center bottom 0px;
    background-color: rgba(255, 255, 255,0);*/
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

::v-deep.el-tree-node__content{
    &:hover{
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
