<template>
    <el-dialog :visible.sync="showDialog" :title="title" width="900px" @close="close()" :close-on-click-modal="false" :close-on-press-escape="false" @opened="init">
        <el-form ref="form" :model="form" :rules="rules" :disabled="disabled" label-width="120px">
            <div class="body">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="floatingType==='1' ? '流入的党支部：' : '流出的党支部：'" prop="deptName" class="input-row">
                            <el-popover @mouseleave="yichu" placement="top-start" width="350" v-if="!disabled2" trigger="hover">
                                <el-select @mouseover.native="focus" slot="reference" :disabled="disabled2" class="input-row"
                                           v-model="input" clearable @change="optionSelect($event)" filterable
                                           :filter-method="filterHandler" placeholder="请输入机构名称搜索">
                                    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item"></el-option>
                                </el-select>
                                <div style="overflow: scroll ;height:300px;  background: #e5e5e5">
                                    <el-tree
                                            :data="dataList"
                                            @node-click="selectId"
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
                            <el-input v-else v-model="input" :disabled="true" clearable
                                      :placeholder="floatingType =='1' ? '流入的党支部' : '流出的党支部'"
                                      class="input-row"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="姓名：" prop="realName" class="input-row">
                            <el-select v-model="form.realName"  placeholder="请选择" class="input-row" v-if="!disabled2" filterable>
                                <el-option v-for="(item, index) in nameList" :label=item.realName :key="index" :value="item.realName" @click.native="changeName(item)"></el-option>
                            </el-select>
                            <el-input v-if="disabled2"  :disabled="disabled2" v-model="form.realName"  clearable placeholder="姓名" class="input-row"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="性别：" prop="sex" class="input-row">
                            <el-select v-model="form.sex"  placeholder="请选择" class="input-row">
                                <el-option v-for="(item, index) in sexList" :label=item.name :key="index" :value="Number(item.value)"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="民族：" prop="national" class="input-row">
                            <el-select v-model="form.national"  placeholder="请选择民族" class="input-row">
                                <el-option v-for="(item,index) in nationList" :key="index" :label="item.label" :value="item.itemValue"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="身份证号：" prop="idcard" class="input-row">
                            <el-input  :disabled="true" v-model="form.idcard"  placeholder="请先选择机构" autocomplete="off" maxlength="80" class="input-row"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系方式：" prop="phone" class="input-row">
                            <el-input  :disabled="true" v-model="form.phone"  placeholder="请先选择机构" autocomplete="off" maxlength="80" class="input-row"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="流动状态：" prop="floatingStatus" class="input-row">
                            <el-select v-model="form.floatingStatus"  placeholder="请选择流动状态" class="input-row">
                                <el-option v-for="(item,index) in floatingStatusList" :key="index" :label="item.label" :value="item.itemValue"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="流动到部门：" prop="flowTargetDept" class="input-row">
                            <el-input v-model="form.flowTargetDept"  placeholder="请输入部门名称" autocomplete="off" maxlength="50"  class="input-row"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="流出日期：" prop="floatingDate" class="label">
                            <el-date-picker

                                    v-model="form.floatingDate"
                                    type="date"
                                    placeholder="请选择日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    class="input-row">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="流动类型：" prop="outType" class="input-row">
                            <el-select v-model="form.outType"  placeholder="请选择流动类型" class="input-row">
                                <el-option v-for="(item,index) in floatingOutTypeList" :key="index" :label="item.label" :value="item.itemValue"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="流动到地址：" prop="floatingPlace" class="label">
                        <el-input v-model="form.floatingPlace" placeholder="请输入地址" autocomplete="off"  class="input-row" :disabled="true"></el-input>
                        <select-area ref="selectAreaRef" v-if="showDialog" @selected="regionSelected" :values="form.regionIds" style="margin-top: 5px;"></select-area>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="流动说明：" prop="flowReason">
                        <el-input type="textarea" :rows="4" maxlength="100" show-word-limit placeholder="请输入流动说明"
                                  v-model="form.flowReason"></el-input>
                    </el-form-item>
                </el-row>
<!--                <el-form-item label="从事职业：" prop="working" class="input-row">-->
<!--                    <el-select v-model="form.working" class="input-row"  placeholder="请选择从事职业">-->
<!--                        <el-option v-for="(item,index) in flowTypeList" :key="index" :label="item.label" :value="item.itemValue"></el-option>-->
<!--                    </el-select>-->
<!--                </el-form-item>-->


<!--                <el-form-item v-if="type==='isFloatIn'" label="流入地：" prop="floatInPlace" label-width="100px" class="input-row">
                    <el-input v-model="form.floatInPlace" placeholder="工作单位区域" autocomplete="off"  class="input-row" :disabled="true"></el-input>
                    <v-region-selects v-if="!disabled" clearable :town="true" @change="regionChange"/>
                </el-form-item>-->

<!--                <el-form-item label="流入日期：" v-if="type==='isFloatIn'" :label-width="formLabelWidth" prop="floatDate" class="label">
                    <el-date-picker

                        v-model="form.floatDate"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        class="input-row">
                    </el-date-picker>
                </el-form-item>-->


            </div>
        </el-form>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close">关闭</el-button>
            <el-button size="small" type="primary" @click="submitForm('form')" v-if="!disabled">保存</el-button>
<!--            <el-button type="primary" size="small" class="btn-blue" @click="preview" v-if="disabled">预览</el-button>-->
        </div>
    </el-dialog>
</template>

<script>
import Vodal from 'vodal'
import {addFlowOutPartyMember, getPartyInfo, queryOneselfPartyMemberList} from "@/api/jcxfPartyMember";
import {getChildrenDeptListByName, getTzSysDept, getTzSysDeptList, getTzSysDeptNameList} from "@/api/jcxfSysDept";
import {getDictByType, getDictByType2} from "@/api/tDictData";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import _ from "lodash";
import {getPartyFloatingById, addFloatingMember, updateFloatingMember} from "@/api/jcxfPartyFloatingMember";
import SelectArea from "@/components/selectArea.vue";
import {mapGetters} from "vuex";

export default {
    name: 'updatePartyFlowOut',
    components: {
        SelectArea,
        Vodal
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        id: {
            type: String
        },
        modalTitle: {
            type: String
        },
        floatingType: {
            type: String
        }
    },
    data() {
        return {
            floatingStatusList: [],
            floatingOutTypeList: [],
            nameList: [],
            whereMap: {},
            nationList: [],
            flowTypeList: [],
            sexList: [{'name': '男', 'value': 1}, {'name': '女', 'value': 2}],
            disabled: false,
            disabled2: false,
            form: {
                deptName: '',
                areaId: '',
                id: '',
                floatingType: '2', // 类型(1:流入,2:流出)
                partyId: '',
                realName: '',
                sex: '',
                national: '',
                idcard: '',
                phone: '',
                outType: '',
                floatingStatus: '',
                deptId: '',
                floatingPlace: '',
                floatingDate: '',
                working: '',
                createBy: '',
                updateBy: '',
                flowTargetDept: '',
                flowReason: '',
                regionIds: '',
            },
            showTree: false,
            showDialog: false,
            title: '',
            dataList: [],
            input: '',
            props: {
                id: 'id',
                label: 'name',
                children: 'children'
            },
            rules: {
                realName: [
                    {required: true, message: '请输入姓名', trigger: 'blur'},
                    {min: 2, max: 10, message: '长度在 2 到 10 个汉字', trigger: 'blur'}
                ],
                idcard: [
                    {required: true, message: '请输入身份证号', trigger: 'blur'}
                ],
                sex: [
                    {required: true, message: '请选择性别', trigger: 'blur'}
                ],
                deptName: [
                    {required: true, message: '请选择流出党支部', trigger: 'change'}
                ],
                national: [
                    {required: true, message: '请选择民族', trigger: 'blur'}
                ],
                // working: [
                //     {required: true, message: '从事职业', trigger: 'blur'}
                // ],
                floatingStatus: [
                    {required: true, message: '流动状态', trigger: 'blur'}
                ],
                floatingPlace: [
                    {required: true, message: '流出地不能为空', trigger: 'blur'}
                ],
                floatInPlace: [
                    {required: true, message: '流入地不能为空', trigger: 'blur'}
                ],
                floatingDate: [
                    {required: true, message: '流出日期不能为空', trigger: 'blur'}
                ],
                outType: [
                    {required: true, message: '流动类型不能为空', trigger: 'blur'}
                ],
                flowTargetDept: [
                    {required: true, message: '流动到部门不能为空', trigger: 'blur'}
                ],
                phone: [
                    {required: true, message: '请输入手机号', trigger: 'blur'}
                ],

            },
            options: [],
            defaultExpandedKeys: [],
            defaultCheckedKeys: []
        }
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
                //this.getTzSysDeptForExpanded(event.id)
                this.selectId(event)
            })
        },
        /*getTzSysDeptForExpanded(deptId) {
            this.defaultExpandedKeys = []
            this.defaultCheckedKeys = []
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
                    this.defaultCheckedKeys.push(Number(deptId))
                }
            })
        },*/
        treeLoadNode(node, resolve){
            if(node.data.id){
                getTzSysDeptList(node.data.id+'').then(res => {
                    if (res.code == "000000" && res.data.length > 0) {
                        resolve(res.data)
                    }else{
                        resolve([])
                    }
                }).finally((e) => {
                })
            }
        },
        reset() {
            this.dataList = []
            this.input = ''
            this.title = ''
            this.form = {
                deptName: '',
                areaId: '',
                id: '',
                floatingType: '2', // 类型(1:流入,2:流出)
                partyId: '',
                realName: '',
                sex: '',
                national: '',
                idcard: '',
                phone: '',
                outType: '',
                floatingStatus: '',
                deptId: '',
                floatingPlace: '',
                floatingDate: '',
                working: '',
                createBy: '',
                updateBy: '',
                flowTargetDept: '',
                flowReason: '',
                regionIds: '',
            }

            this.$refs.form.resetFields()
        },
        close() {
            /*this.$nextTick(() => {
                this.$refs.form.resetFields()
            })*/
            // this.show = false
            this.reset()
            this.$emit('close', false)
        },
        refresh() {
            // this.show = false
            this.reset()
            this.$emit('refresh', false)
        },
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    return
                }
                if (this.type === 'isFloatIn') {
                    this.form.isFloatIn = '1'
                } else if (this.type === 'isFlow') {
                    this.form.isFlow = '1'
                }
                this.form.deptName = this.input
                let data = this.form

                let userInformation = JSON.parse(window.localStorage.getItem("userInformation"))
                if (this.form.id && this.form.id != null && this.form.id!= undefined) {
                    data.updateBy = userInformation.userId
                    updateFloatingMember({data: data}).then(res => {
                        const data = res.data
                        if (data.code == '00000') {
                            this.$message({
                                message: '保存成功',
                                type: 'success',
                                //duration: 1000
                            })
                            this.refresh()
                        } else {
                            this.$message({
                                message: data.msg,
                                type: 'error',
                                //duration: 1000
                            })
                        }
                    })
                } else {
                    data.createBy = userInformation.userId
                    addFloatingMember({data: data}).then(res =>{
                        const data = res.data
                        if (data.code == '00000') {
                            this.$message({
                                message: '保存成功',
                                type: 'success',
                                //duration: 1000
                            })
                            this.refresh()
                        } else {
                            this.$message({
                                message: data.msg,
                                type: 'error',
                                //duration: 1000
                            })
                        }
                    })
                }
            })
        },
        changeName(e) {
            this.form.partyId = e.id
            this.form.sex = e.sex
            this.form.national = e.national.toString()
            this.form.idcard = e.idcard
            this.form.phone = e.phone
        },
        regionSelected(event) {
            this.form.areaId = event.areaId
            this.form.floatingPlace = event.areaName
            this.form.regionIds = event.deptRegionIds
        },
        regionChange(e) {
            let values = ''
            let areaId = ''
            if (e) {
                if (e.province) {
                    values = e.province.value
                    areaId = e.province.key
                }
                if (e.city) {
                    values += ',' + e.city.value
                    areaId += ',' + e.city.key
                }
                if (e.area) {
                    values += ',' + e.area.value
                    areaId += ',' + e.area.key
                }
                if (e.town) {
                    values += ',' + e.town.value
                    areaId += ',' + e.town.key
                }
            }
            this.areaId = areaId
            this.form.floatingPlace = values
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
        init() {
            this.getDict('nation')
            this.getDict('flowType')
            this.getDict('floatingOutType')
            this.getDict('floatingStatus')

            this.title = this.modalTitle

            if (this.title === '编辑') {
                this.disabled = false
                this.disabled2 = true // 用于控制树形控件是否禁用
                this.getDataInfo()
            } else if (this.title === '详情') {
                this.disabled = true
                this.disabled2 = true // 用于控制树形控件是否禁用
                this.getDataInfo()
            } else if (this.title === '新增') {
                this.disabled = false
                this.disabled2 = false // 用于控制树形控件是否禁用
                this.form = {
                    id: '',
                    partyId: '',
                    deptId: '',
                    deptName: '',
                    realName: '',
                    sex: '',
                    national: '',
                    idcard: '',
                    phone: '',
                    floatingStatus: '',
                    floatingPlace: '',
                    floatInPlace: '',
                    floatingDate: '',
                    floatingBack: '0',
                    working: '',
                    outType: '',
                    flowTargetDept: '',
                    flowReason: '',
                    floatingType: '2' // 类型(1:流入,2:流出)
                }
            }
            this.getDataList()
        },
        getDataList() {
            this.dataList = []

            getTzSysDept(this.deptInfo.id+'').then(res =>{
                const reslut = res.data
                if (reslut.code = '00000') {
                    this.dataList = [reslut.data]
                    this.dataListLoading = false
                }
            }).finally((e) => {
                this.dataListLoading = false
            })
        },
        getDataInfo() {
            getPartyFloatingById(this.id).then(res =>{
                this.form = res.data.data
                this.form.sex = Number(this.form.sex)
                this.input = this.form.deptName
                this.$nextTick(() => {
                    this.$refs.selectAreaRef.setData(this.form.regionIds)
                })
            })
        },
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        selectId(event) {
            this.whereMap.deptId = event.id
            this.input = event.name

            this.form.deptId = event.id
            this.form.deptName = event.name
            this.showTree = false
            this.nameList = []
            this.getDataById()
        },
        // 获取分页信息
        getDataById() {
            let that = this
            let data = this.whereMap

            queryOneselfPartyMemberList({ data: data }).then(res =>{
                that.nameList = res.data.data
            }).catch(e => {
                this.dataListLoading = false
            })
        },
        getDict(type) {
            getDictByCode(type).then(res =>{
                let data = res.data.data
                if (type === 'nation') {
                    this.nationList = data
                } else if (type === 'flowType') {
                    this.flowTypeList = data
                } else if (type === 'floatingOutType') {
                    this.floatingOutTypeList = data
                } else if (type === 'floatingStatus') {
                    this.floatingStatusList = data
                }
            })
        },
        deptNameChange(val) {
            this.$refs.tree.filter(val)
        }
    },
    watch: {
        show() {
            this.showDialog = this.show
            if (this.showDialog) {
                this.title = this.modalTitle
                this.form.floatingType = this.floatingType
            }
        }
    }
}
</script>

<style lang="less" scoped>
::v-deep .el-input.is-disabled .el-input__inner{
    background: white;
}

.modal-header {
    padding: 5px 10px;
    text-align: center;

    .modal-title {
        font-size: 16px;
    }
}

.body {
    padding: 20px 30px 30px 50px;
    background: #fff;
    width: auto;

    .input-row {

    }

    &:hover {
        .demo-upload-list-cover {
            display: block;
        }
    }


    .ivu-modal {
        width: 660px !important;
    }


    .label {
        ::v-deep.el-form-item__label {
            margin-top: 10px;
            line-height: 18px;
        }
    }


    .el-form-item {
        .input-row {
            width: 100%;
        }
    }

}
</style>
