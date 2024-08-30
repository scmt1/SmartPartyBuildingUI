<template>
    <el-dialog title="新增" :visible.sync="dialogVisible" width="600px" @close="close()">
        <el-form ref="form" :model="form" label-width="110px" style="text-align: left; padding: 0 20px 0 20px;">
            <p>1.转移党员</p>
            <el-form-item label="党员：">
<!--                :filter-method="filterHandler"-->
                <el-select style="width: 100%;" v-model="idCardInput" clearable @change="optionSelect($event)" filterable placeholder="请输入姓名搜索">
                    <el-option v-for="item in partyMemberOptions" :key="item.id" :label="item.realName+'：'+ item.idcard" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="姓名：" v-if="realName && realName.length > 0">
                {{ realName }}
            </el-form-item>
            <el-form-item label="党员所属：" v-if="oldDeptInfo.name && oldDeptInfo.name.length > 0">
                {{ oldDeptInfo.name }}
            </el-form-item>
            <p>2.目标支部</p>
            <el-form-item>
                <el-radio v-for="(item, index) in changeType" :key="index" v-model="form.transferType" :label="Number(item.itemValue)">
                    {{ item.label }}
                </el-radio>
            </el-form-item>
            <el-form-item label="目标支部选择" v-if="form.transferType == 1">
                <el-popover @mouseleave="yichu" placement="bottom" v-if="!disabled2" trigger="hover">
                    <el-select @mouseover.native="focus" slot="reference" :disabled="disabled2"
                               style="width: 100%;"
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
            </el-form-item>
            <template v-if="form.transferType == 2">
                <el-form-item label="转出区域选择：">
                    <el-input v-model="form.areaName" disabled placeholder="转出区域" autocomplete="off"></el-input>
<!--                    <v-region-selects
                        clearable
                        v-model="areaId"
                        :town="true"
                        @change="regionChange"
                    />-->
                    <select-area :level="3" @selected="regionSelected"></select-area>
                </el-form-item >
                <el-form-item label="转出到部门：">
                    <el-input v-model="form.inBranchName" placeholder="转出到部门" autocomplete="off"></el-input>
                </el-form-item>
            </template>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="close()">取消</el-button>
            <el-button size="small" type="primary" @click="save">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import _ from "lodash";
import {getPartMemberListByIdCard,getPartMemberListByDeptIds} from "@/api/jcxfPartyMember";
import {getAllDeptListByName, getTzSysDept, getTzSysDeptList} from "@/api/jcxfSysDept";
import {addPartyMemberDeptTransfer} from "@/api/jcxfPartyMemberTransfer";
import {getDictByType2} from "@/api/tDictData";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import SelectArea from "@/components/selectArea.vue";
import {mapGetters} from "vuex";

export default {
    name: "add",
    components: {SelectArea},
    props:{
        treeSelectDeptId: {
            type: Number,
            default: ''
        },
    },
    data() {
        return {
            dialogVisible: false,
            form: {
                partyId: '',
                outBranchId: '',
                inBranchId: '',
                transferType: 1,
                areaId: '',
                areaName: '',
                inBranchName: ''
            },
            idCardInput: '',
            treeInput: '',
            realName: '',
            oldDeptInfo: {},
            partyMemberOptions: [],
            disabled2: false,
            showTree: false,
            treeOptions: [],
            props: {
                id: 'id',
                label: 'name',
                children: 'children',
                isLeaf: 'isLeaf'
            },
            treeDataList: [],
            areaId: {
                province: '',
                city: '',
                area: '',
                town: ''
            },
            changeType: []
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    methods: {
        close() {
            this.rest()
            this.$refs.form.resetFields()
            this.dialogVisible = false
        },
        async init() {
            await this.getDict('partyTransferType')
            this.dialogVisible = true
            this.getDataList()
            this.getPartMemberList()
        },
        getDict(type) {
            return new Promise((resolve, reject) => {
                getDictByCode(type).then(res =>{
                    let data = res.data.data
                    if (type === 'partyTransferType') {
                        this.changeType = data
                    }
                    resolve()
                })
            })
        },
        optionSelect(event){
            if (event == null || !event) {
                return
            }
            this.$nextTick(() =>{
                let find = this.partyMemberOptions.find(item => item.id == event);
                this.form.partyId = find.id
                this.idCardInput = find.idcard
                this.realName = find.realName
                this.getDeptInfo(find.deptId)
            })
        },
        getDeptInfo(deptId) {
            getTzSysDept(deptId).then(res => {
                const result = res.data
                if (result.code == '00000') {
                    this.oldDeptInfo = result.data
                    this.form.outBranchId = this.oldDeptInfo.id

                    if (this.form.outBranchId == this.form.inBranchId) {
                        this.form.inBranchId = ''
                    }
                }
            })
        },
        // filterHandler(value, row, column) {
        //     this.idCardInput = value
        //     this.throttledMethod(this)
        // },
        throttledMethod: _.throttle(_this => {
            // _this.getPartMemberList()
        }, 1500),
        getPartMemberList() {

            if(this.treeSelectDeptId){
                this.deptInfo.id = this.treeSelectDeptId
            }
            const data = {
                deptId: this.deptInfo.id+'',
                // idcard: this.idCardInput
            }
            // getPartMemberListByIdCard(data).then(res => {
            //     const result = res.data
            //     if (result.code = '00000') {
            //         this.partyMemberOptions = result.data
            //     }
            // })
            getPartMemberListByDeptIds(this.deptInfo.id+'').then(res => {
                const result = res.data
                if (result.code = '00000') {
                    this.partyMemberOptions = result.data
                }
            })
        },
        yichu() {
            if (this.disabled2) {
                return false
            }
            this.showTree = false
        },
        focus() {
            if (this.disabled2) {
                return false
            }
            this.showTree = true
        },
        treeSelectId(event) {
            const typeList = [631, 632, 931, 932]
            if (!event.isLeaf && typeList.indexOf(event.type) < 0) {
                this.$message.info('请选择支部')
                return
            }
            if (event.id == this.form.outBranchId) {
                this.$message.info('请勿选择与现在所属相同的部门或单位')
                return
            }
            this.treeInput = event.name
            this.form.inBranchId = event.id
        },
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        treeLoadNode(node, resolve){
            if(node.data.id){
                getTzSysDeptList(node.data.id+'').then(res => {
                    if (res.code == "000000" && res.data.length > 0) {
                        resolve(res.data)
                    }else{
                        resolve([])
                    }
                })
            }
        },
        getDataList() {
            this.treeDataList = []
            getTzSysDept('1').then(res =>{
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
                deptId: this.deptInfo.id + '',
                deptName: this.treeInput + ''
            }
            getAllDeptListByName(data).then(res =>{
                const data = res.data
                if (data.code == '00000') {
                    this.treeOptions = data.data
                }
            })
        },
        regionSelected(event) {
            this.form.areaName = event.areaName
            this.form.areaId = event.areaId
        },
        save() {
            if (this.form.partyId == '') {
                this.$message.error('请选择需要转出的党员')
                return
            }

            if (this.form.transferType == 1) {
                if (this.form.inBranchId == '') {
                    this.$message.error('请选择转移到的部门或单位')
                    return
                }
                this.form.inBranchName = ''
                this.form.areaId = ''
                this.form.areaName = ''
            } else if (this.form.transferType == 2) {
                if (this.form.areaId == '') {
                    this.$message.error('请选择转出到的区域')
                    return
                }

                if (this.form.inBranchName == '') {
                    this.$message.error('请输入到部门')
                    return
                }
                this.form.inBranchId = ''
            }

            let data = {
                partyMemberDeptTransferLog: this.form,
                deptId: this.deptInfo.id + ''
            }
            let userInformation = JSON.parse(window.localStorage.getItem("userInformation"))
            data.partyMemberDeptTransferLog.createBy = userInformation.userId
            addPartyMemberDeptTransfer({ data: data }).then(res =>{
                const result = res.data
                if (result.code == '00000') {
                    this.$message.success('保存成功')
                    this.dialogVisible = false
                    this.$emit('getDataById')
                } else {
                    this.$message.error(result.msg)
                }
            })

        },
        rest() {
            this.form =  {
                partyId: '',
                outBranchId: '',
                inBranchId: '',
                transferType: 1,
                areaId: '',
                areaName: '',
                inBranchName: ''
            },
            this.idCardInput = ''
            this.treeInput = ''
            this.realName =  ''
            this.oldDeptInfo =  {}
            this.partyMemberOptions =  []

            this.treeOptions = []
            this.treeDataList = []
        }
    }
}
</script>

<style scoped>

</style>
