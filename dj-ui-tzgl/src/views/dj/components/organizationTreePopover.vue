<template>
    <div>
        <el-popover @mouseleave="yichu" placement="bottom" v-if="!deptSelectDisabled" trigger="hover">
            <el-select @mouseover.native="focus" slot="reference" :disabled="deptSelectDisabled"
                       style="width: 100%;" size="small"
                       v-model="treeInput" clearable @change="treeOptionSelect($event)" filterable
                       :filter-method="treeFilterHandler" placeholder="请输入机构名称搜索">
                <el-option v-for="item in treeOptions" :key="item.id" :label="item.name" :value="item"></el-option>
            </el-select>
            <div style="overflow: scroll ;height:300px; min-width: 300px">
                <el-tree
                    :data="treeDataList"
                    @node-click="treeSelectId"
                    :load="treeLoadNode"
                    :filter-node-method="filterNode"
                    lazy
                    :props="props"
                    ref="tree"
                    node-key="id"
                    highlight-current
                    :check-strictly="true"
                    :expand-on-click-node="false">
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                                <i class="el-icon-folder" style="color: #DFBA49; margin-right: 5px;"></i>
                                <span>{{ node.label }}</span>
                            </span>
                </el-tree>
            </div>
        </el-popover>
    </div>
</template>

<script>
import _ from "lodash";
import {mapGetters} from "vuex";
import {getTzSysDept, getTzSysDeptList, getChildrenDeptListByName} from "@/api/jcxfSysDept";

export default {
    name: "organizationTreePopover",
    props: {
        parentDeptId: {
            default: null
        }
    },
    data() {
        return {
            dataListLoading: false,
            deptSelectDisabled: false,
            showTree: false,
            treeInput: '',
            treeOptions: [],
            props: {
                id: 'id',
                label: 'name',
                children: 'children',
                isLeaf: 'isLeaf'
            },
            treeDataList: [],
            selectId: null
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    mounted() {
        this.selectId = this.deptInfo.id
        this.getDataList()
    },
    watch: {
        /*parentDeptId() {
            console.log('this.parentDeptId')
            console.log(this.parentDeptId)
            if (this.parentDeptId && this.parentDeptId != null && this.parentDeptId != '') {
                this.selectId = this.parentDeptId
            } else {
                this.selectId = this.deptInfo.id
            }
            this.getDataList()
        }*/
    },
    methods: {
        getDataList() {
            this.treeDataList = []
            getTzSysDept(this.selectId).then(res => {
                const result = res.data
                if (result.code = '00000') {
                    this.treeDataList = [result.data]
                    this.dataListLoading = false
                    this.$forceUpdate()
                }
            }).finally((e) => {
                this.dataListLoading = false
            })
        },
        treeOptionSelect(event) {
            this.treeSelectId(event)
        },
        treeSelectId(event) {
            if (event.id == this.parentDeptId) {
                this.$message.info('请勿选择所属上级相同的部门或单位')
                return
            }
            this.treeInput = event.name
            this.$emit('chooseDept', event)
        },
        yichu() {
            if (this.deptSelectDisabled) {
                return false
            }
            this.showTree = false
        },
        focus() {
            if (this.deptSelectDisabled) {
                return false
            }
            this.showTree = true
        },
        treeFilterHandler(value, row, column) {
            this.treeInput = value
            this.throttledMethod2(this)
        },
        throttledMethod2: _.throttle(_this => {
            _this.getDeptList()
        }, 1500),
        getDeptList() {
            if (this.treeInput.length < 1) {
                this.treeOptions = []
                return
            }
            let data = {
                deptId: this.selectId + '',
                deptName: this.treeInput + ''
            }
            getChildrenDeptListByName(data).then(res =>{
                const data = res.data
                if (data.code == '00000') {
                    this.treeOptions = data.data
                }
            })
        },
        treeLoadNode(node, resolve) {
            if (node.data.id) {
                getTzSysDeptList(node.data.id + '').then(res => {
                    if (res.code == "000000" && res.data.length > 0) {
                        resolve(res.data)
                    } else {
                        resolve([])
                    }
                })
            }
        },
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        }
    }
}
</script>

<style scoped lang="scss">
@import url("//unpkg.com/element-ui@2.15.7/lib/theme-chalk/index.css");

</style>
