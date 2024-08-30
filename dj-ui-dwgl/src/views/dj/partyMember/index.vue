<template>
    <div>
        <tree-and-table>
            <template v-slot:tree>
                <organization-tree @selectByTree="selectByTree" @getDeptId="getDeptId"
                                   :loading="dataListLoading"></organization-tree>
            </template>
            <template v-slot:search>
                <el-form id="formInfo" ref="searchForm" :model="whereMap" label-width="110px" inline size="medium" style="text-align: left;">
                    <el-form-item prop="realName" label="姓名：">
                        <el-input clearable v-model="whereMap.realName" placeholder="请输入姓名" size="small"
                                  style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item prop="idcard" label="身份证号：">
                        <el-input clearable v-model="whereMap.idcard" placeholder="请输入身份证号" size="small"
                                  style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item prop="sex" label="性别：" v-if="drop">
                        <el-select v-model="whereMap.sex" placeholder="请选择" clearable size="small"
                                   style="width: 180px;">
                            <el-option label="男" value=1></el-option>
                            <el-option label="女" value=2></el-option>
                            <el-option label="其他" value=0></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="national" label="民族：" v-if="drop">
                        <el-select v-model="whereMap.national" clearable placeholder="请选择" filterable size="small"
                                   style="width: 180px;">
                            <el-option v-for="(item,index) in nationList" :key="index" :label="item.label"
                                       :value="item.itemValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="education" label="学历：" v-if="drop">
                        <el-select v-model="whereMap.education" clearable placeholder="请选择" size="small"
                                   style="width: 180px;">
                            <el-option v-for="(item,index) in educationList" :key="index" :label="item.label"
                                       :value="item.itemValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="phone" label="手机号码：" v-if="drop">
                        <el-input clearable v-model="whereMap.phone" placeholder="请输入手机号码" size="small"
                                  style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item prop="personType" label="人员类别：" v-if="drop">
                        <el-select v-model="whereMap.personType" clearable placeholder="请选择"
                                   style="width: 180px;"
                                   size="small">
                            <el-option v-for="(item,index) in personTypeList" :key="index" :label="item.label"
                                       :value="item.itemValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="isSuffer" label="是否贫困党员：" v-if="drop">
                        <el-select v-model="whereMap.isSuffer" clearable placeholder="请选择" size="small"
                                   style="width: 180px;">
                            <el-option label="是" value=1></el-option>
                            <el-option label="否" value=0></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="isLost" label="是否失联党员：" v-if="drop">
                        <el-select v-model="whereMap.isLost" clearable placeholder="请选择" size="small"
                                   style="width: 180px;">
                            <el-option label="是" value=1></el-option>
                            <el-option label="否" value=0></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="partyState" label="党籍状态：" v-if="drop">
                        <el-select v-model="whereMap.partyState" clearable placeholder="请选择" size="small"
                                   style="width: 180px;">
                            <el-option v-for="item in partyStateList" :key="item.id" :value="item.itemValue"
                                       :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="position" label="职务：" v-if="drop">
                        <el-select v-model="whereMap.position" clearable placeholder="请选择" size="small"
                                   style="width: 180px;">
                            <el-option v-for="(item,index) in positionList" :key="index" :label="item.label"
                                       :value="item.itemValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="buttonRole" label="看板权限：" v-permission-button-role="['phone_billboard']" v-if="drop">
                        <el-select v-model="whereMap.buttonRole" clearable placeholder="请选择" size="small"
                                   style="width: 180px;">
                            <el-option label="是"
                                       value="sjkb_role"></el-option>
                            <el-option label="否"
                                       value="cancel_role"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="buttonRole" label="是否激活：" v-if="drop">
                        <el-select v-model="whereMap.isActive" clearable placeholder="请选择" size="small" style="width: 180px;">
                            <el-option label="是" :value="1"></el-option>
                            <el-option label="否" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <a class="drop-down" @click="dropDown">
                            {{ dropDownContent }}
                            <i :class="dropDownIcon"></i>
                        </a>
                        <el-button size="small" @click="ok" icon="el-icon-search"
                                   style="background:  rgba(228, 53, 43, 1);;color:#ffffff;border-color: rgb(228, 53, 43);">搜索
                        </el-button>
                        <el-button size="small" @click="reset()">重置</el-button>
                        <el-button v-permission-leaf-zb="selectDeptInfo" size="small" icon="el-icon-plus"
                                   @click="addInfo()" type="danger" plain>新增
                        </el-button>
                        <el-button size="small" icon="el-icon-refresh" @click="refresh" type="danger" plain>刷新
                        </el-button>
                        <el-button size="small" icon="el-icon-download" @click="downloadExcel" type="danger" plain>
                            导出勾选
                        </el-button>
                        <el-button size="small" icon="el-icon-close" @click="deleteAll()" type="danger" plain>批量删除
                        </el-button>
                        <el-button size="small" class="topBtn" icon="el-icon-arrow-left" @click="backPath()" plain>返回
                        </el-button>
                    </el-form-item>
                </el-form>
            </template>

            <template v-slot:table>
                <div class="head" id="headInfo">
                    <span class="amount"><span class="red-text">{{ total ? total : 0 }}</span><br><span
                        class="black-text">党员总数</span><span class="line"></span></span>
<!--                    <span class="amount"><span class="red-text">{{ active ? active : 0 }}</span><br><span-->
<!--                        class="black-text">已激活党员数</span><span class="line"></span></span>-->
<!--                    <span class="amount"><span class="red-text">{{ inactive ? inactive : 0 }}</span><br><span-->
<!--                        class="black-text">未激活党员数</span><span class="line"></span></span>-->
                    <span class="amount"><span class="red-text">{{ newAdd ? newAdd : 0 }}</span><br><span
                        class="black-text">今日添加的党员数</span></span>
                </div>
                <el-table
                    :row-class-name="tableRowClassName" @row-click="onRowClick"
                    v-loading="loading"
                    ref="multipleTable"
                    :data="tableDataNow"
                    border
                    :max-height="tabelHeight"
                    :cell-style="{'text-align':'center'}"
                    :header-cell-style="{'text-align':'center',background : '#eef1f6', color: '#333'}"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column fixed="left" type="selection" width="60"></el-table-column>
                    <el-table-column prop="realName" label="姓名" width="100"></el-table-column>
                    <el-table-column prop="sex" label="性别" width="90">
                        <template slot-scope="scope">
                            {{ scope.row.sex == 2 ? '女' : '男' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="nation" label="民族" width="90">
                        <template slot-scope="scope">
                            {{
                                convertFiled(scope.row.national, 'nation') ? convertFiled(scope.row.national, 'nation') : '汉'
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="partyAge" label="党龄" width="70"></el-table-column>
                    <el-table-column prop="partyTime" label="加入党组织日期" width="150"></el-table-column>
                    <el-table-column prop="deptName" label="归属部门" show-overflow-tooltip
                                     width="360"></el-table-column>
                    <el-table-column prop="personType" label="人员类别" width="100">
                        <template slot-scope="scope">
                            {{
                                convertFiled(scope.row.personType, 'personType') ? convertFiled(scope.row.personType, 'personType') : '--'
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="study" label="学历" width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{
                                convertFiled(scope.row.education, 'education') ? convertFiled(scope.row.education, 'education') : '--'
                            }}
                        </template>
                    </el-table-column>
<!--                    <el-table-column prop="phone" label="手机号码" width="120">-->
<!--                        <template slot-scope="scope">-->
<!--                            {{ hidePhoneNumber(scope.row.phone) }}-->
<!--                        </template>-->
<!--                    </el-table-column>-->
<!--                    <el-table-column prop="appModifyLoginDate" label="是否激活" width="100">-->
<!--                        <template slot-scope="scope">-->
<!--                            {{ scope.row.appModifyLoginDate ? '是' : '否' }}-->
<!--                        </template>-->
<!--                    </el-table-column>-->
                    <el-table-column label="操作" fixed="right" width="380">
                        <template slot-scope="scope">
                            <el-button size="mini" type="danger" @click="handPortrait(scope.$index, scope.row.id)">画像</el-button>
                            <el-button size="mini" @click="handDetail(scope.$index, scope.row.id)">详情</el-button>
                            <el-button size="mini" class="button-success"
                                       @click="handleEdit(scope.$index, scope.row.id)">编辑
                            </el-button>
                            <el-button size="mini" class="button-delete"
                                       @click.native.prevent="handleDelete(scope.row.id)">删除
                            </el-button>
                            <el-button size="mini" @click="resetPassword(scope.row.id)">重置密码
                            </el-button>
<!--                            <el-button v-permission-button-role="['phone_billboard']" size="mini" class="button-success" icon="el-icon-plus"-->
<!--                                       v-if="!scope.row.buttonRole||scope.row.buttonRole==''"-->
<!--                                       @click="kbqx(scope.$index, scope.row,'sjkb_role')">手机看板-->
<!--                            </el-button>-->
<!--                            <el-button v-permission-button-role="['phone_billboard']" size="mini" style="margin-top: 10px" icon="el-icon-minus"-->
<!--                                       v-else @click="kbqx(scope.$index, scope.row,'sjkb_role')">取消看板-->
<!--                            </el-button>-->
                        </template>
                    </el-table-column>
                </el-table>
            </template>

            <template v-slot:pagination>
                <el-pagination v-if="tableDataNow.length"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="pageNum"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
                </el-pagination>
            </template>
        </tree-and-table>


        <updatePerson ref="updatePersonRef"></updatePerson>
    </div>
</template>
<script>
import {formartDate} from '@/utils/tool.js'
import organizationTree from '@/views/dj/components/organizationTree'
import {setRole} from "@/api/jcxfPartyMember";
import {
    delPartyMember,
    queryCountActive,
    queryPartyMemberList,
    resetPassword,
    resetDeptTreePartyMemberPassword
} from "@/api/jcxfPartyMember";
import {getDictByType, getDictByType2} from "@/api/tDictData";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import TreeAndTable from "@/components/TreeAndTable.vue";
import topPng from '@/assets/partyMember/top.png';
import downPng from '@/assets/partyMember/down.png';
import {getTzSysDept} from "@/api/jcxfSysDept";
import {getPartyMemberCount} from "@/api/homePage";

import updatePerson from "./updatePerson";

export default {
    components: {
        TreeAndTable,
        organizationTree,
        updatePerson
    },
    data() {
        return {
            drop: false,
            dropDownContent: "展开",
            dropDownIcon: "el-icon-arrow-down",
            idFromOrganization: '',
            excelData: [],
            partyMemberIds: '',
            partyStateList: [],
            educationList: [],
            newAdd: '',
            active: '',
            inactive: '',
            personTypeList: [],
            positionList: [],
            nationList: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            whereMap: {
                deptId: '',
                realName: '',
                idcard: '',
                sex: '',
                national: '',
                education: '',
                phone: '',
                personType: '',
                isSuffer: '',
                isLost: '',
                partyState: '',
                position: '',
                isActivation: ''
            },
            selectDeptInfo: {},
            dataListLoading: false,
            tableDataNow: [],  // 显示的数据
            // 树状结构
            data: [],
            multipleSelection: [],
            // 新增按钮的表单
            dialogTableVisible: false,
            dialogFormVisible: false,
            formLabelWidth: '100px',
            // 加载状态
            loading: false,
            //删除项
            deleteItmes: [],
            topPng,
            downPng,
            partyWorkerList: [],
            tabelHeight:550
        }
    },
    created() {
        this.getDict(1, 'nation')
        this.getDict(2, 'position')
        this.getDict(3, 'personType')
        this.getDict(4, 'education')
        this.getDict(5, 'partyState')
        this.getDict2(6, 'partyWorker')
        this.initTreeData();
        this.getnewPerson();
        this.beforeLoad()
        this.getTabelHeight()
    },
    methods: {
        //展开 收起
        dropDown() {
            if (this.drop) {
                this.dropDownContent = "展开";
                this.dropDownIcon = "el-icon-arrow-down";
            } else {
                this.dropDownContent = "收起";
                this.dropDownIcon = "el-icon-arrow-up";
            }
            this.drop = !this.drop;
            this.$nextTick(()=>{
                this.getTabelHeight()
            })
        },
        //获取表格高度
        getTabelHeight(){
            let screenHeight = window.innerHeight;
            this.$nextTick(()=>{
                let formInfoHeight = document.getElementById('formInfo').offsetHeight;
                let headInfoHeight = document.getElementById('headInfo').offsetHeight;
                this.tabelHeight = screenHeight - formInfoHeight - headInfoHeight - 120
                if(this.drop){
                    this.tabelHeight = this.tabelHeight - 100
                }
                if(this.pageSize >= 20) {
                    this.tabelHeight = this.tabelHeight - 150
                }
            })
        },
        beforeLoad() {
            if (this.$route.query != null) {
                this.deptId = this.$route.query.deptId;
                this.idFromOrganization = this.$route.query.deptId;
                this.whereMap.deptId = this.$route.query.deptId;
                this.getactive()
            }
        },
        backPath() {
            this.$router.push({
                path: '/dwgl/dwgl',
                query: {
                    deptId: this.whereMap.deptId
                }
            })
        },
        // 列表下载
        downloadExcel() {
            this.$confirm('确定下载列表文件?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.excelData = this.multipleSelection; // multipleSelection是一个数组，存储表格中选择的行的数据。
                this.export2Excel();
            }).catch(() => {

            });
        },
        // 数据写入excel
        export2Excel() {
            var that = this;
            require.ensure([], () => {
                const {export_json_to_excel} = require('@/excel/export2Excel'); // 这里必须使用绝对路径，使用@/+存放export2Excel的路径
                const tHeader = ['姓名', '性别', '出生日期', '民族', '党龄', '加入党组织日期', '所在党支部职务', '归属部门', '人员类别', '学历', '手机号码', '是否激活']; // 导出的表头名信息
                const filterVal = ['realName', 'sex', 'birthday', 'national', 'partyAge', 'partyTime', 'position', 'deptName', 'personType', 'education', 'phone', 'appModifyLoginDate']; // 导出的表头字段名，需要导出表格字段名
                const list = that.excelData;
                const data = that.formatJson(filterVal, list);
                for (var i = 0; i < data.length; i++) {
                    if (data[i][1] == 1) {
                        data[i][1] = '男';
                    } else {
                        data[i][1] = '女';
                    }
                    data[i][3] = this.convertFiled(data[i][3], 'nation')
                    data[i][6] = this.convertFiled(data[i][6], 'position')
                    data[i][8] = this.convertFiled(data[i][8], 'personType')
                    data[i][9] = this.convertFiled(data[i][9], 'education');
                    if (data[i][11]) {
                        data[i][11] = '是';
                    } else {
                        data[i][11] = '否';
                    }
                }


                export_json_to_excel(tHeader, data, '导出党员信息表' + new Date().getTime().toString());// 导出的表格名称，根据需要自己命名
            });
        },
        // 格式转换
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]));
        },
        getDeptId(data) {
            this.whereMap.deptId = data.deptId
            this.selectDeptInfo.type = data.type
            this.selectDeptInfo.isLeaf = data.isLeaf
            this.getDataById(0)
        },
        selectByTree(data) {
            this.whereMap.deptId = data.whereMap.deptId
            this.selectDeptInfo = data.whereMap
            this.pageSize = data.pageSize
            this.pageNum = data.pageNum
            this.getDataById()

            this.getactive()
            this.getnewPerson()
        },
        //赋予手机看板权限
        kbqx(index, row, various) {
            let id = row.id.toString()
            let buttonRole = row.buttonRole
            if (!buttonRole || buttonRole == '') {
                buttonRole = various
            } else {
                buttonRole = ""
            }
            setRole({id: id, role: buttonRole}).then(res => {
                if (res.data.code == '00000') {
                    this.$message.success('操作成功')
                    this.getDataById()
                }
            })
        },
        //  重置密码
        resetPassword(id) {
            this.$confirm('重置密码为身份证后6位!', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                type: 'warning'
            }).then(() => {
                this.restPasswordOk(id + '')
            }).catch(() => {

            });
        },
        // 确认重置密码
        restPasswordOk(id) {
            let data = {}
            data.id = id
            resetPassword(id).then((res) => {
                if (res.code = "000000") {
                    this.$message.success("密码重置成功")
                } else {
                    this.$message.error("密码重置失败")
                }
            }).catch(e => {
                this.$message.error("密码重置失败")
            })
        },
        reset() {
            this.whereMap.realName = ''
            this.whereMap.idcard = ''
            this.whereMap.sex = ''
            this.whereMap.national = ''
            this.whereMap.education = ''
            this.whereMap.phone = ''
            this.whereMap.personType = ''
            this.whereMap.isSuffer = ''
            this.whereMap.isLost = ''
            this.whereMap.partyState = ''
            this.whereMap.position = ''

            this.pageNum = 1
            this.pageSize = 10

            this.getDataById()
        },
        ok() {
            this.pageNum = 1
            this.getDataById()
        },
        search() {
            this.reset()
        },
        //详情
        handDetail(type, id) {
            this.dialogFormVisible = true
            //this.$router.push({path: '/dwgl/updatePerson', query: {id: id, type: 1}})
            this.$router.push({
                path: '/dwgl/personDetails',
                query: {
                    id: id,
                    type: 1,
                    deptId: this.whereMap.deptId
                }
            })
        },
        //党员画像
        handPortrait(type, id){
            this.dialogFormVisible = true
            this.$router.push({
                path: '/dwgl/personPortrait',
                query: {
                    id: id,
                    type: 1,
                    deptId: this.whereMap.deptId
                }
            })
        },
        handleEdit(type, id) {
            this.dialogFormVisible = true
            // this.$router.push({
            //     path: '/dwgl/updatePerson',
            //     query: {
            //         id: id,
            //         type: 0,
            //         deptId: this.whereMap.deptId
            //     }
            // })
            this.$refs.updatePersonRef.openDialog(String(id), 0, this.whereMap.deptId)
        },
        // 表格部分数据字段显示转换
        convertFiled(row, type) {
            var tmp = ''
            if (type == 'nation') {
                this.nationList.forEach(i => {
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
            } else if (type == 'personType') {
                this.personTypeList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type == 'education') {
                this.educationList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            }
            return tmp
        },
        initTreeData() {
            this.dataListLoading = true
        },
        //查询当日新增党员数
        getnewPerson() {
            var date = new Date()
            this.createDate = this.formartDate(date, 'yyyy-MM-dd')
            let data = {}
            data.deptId = this.whereMap.deptId
            data.startDate = this.createDate
            data.today = this.createDate.toString()
            // data = JSON.stringify(data)
            queryPartyMemberList({data: data}).then((res) => {
                const data = res.data
                if (data.code == '00000') {
                    this.newAdd = data.data.total
                } else {
                    this.newAdd = 0
                    this.$message.error('获取今日添加的党员数量失败')
                }
            }).catch(e => {
                this.dataListLoading = false
            })
        },
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        // 查询激活和未激活数量
        getactive() {
            let data = {}

            if (this.idFromOrganization != null && this.idFromOrganization.length > 0 && this.idFromOrganization != '') {
                this.whereMap.deptId = this.idFromOrganization
                this.idFromOrganization = ''
            }
            data.deptId = this.whereMap.deptId
            queryCountActive(data).then((res) => {
                const data = res.data
                if (data.code == '00000') {
                    this.active = data.data.active
                    this.inactive = data.data.unActive
                } else {
                    this.active = 0
                    this.inactive = 0
                }

            }).catch(e => {
                this.dataListLoading = false
            })
        },
        // 获取分页信息
        getDataById() {
            this.loading = true;
            if (this.whereMap.buttonRole == '') {
                delete this.whereMap.buttonRole
            }
            let data = {}
            data = this.whereMap
            data.pageSize = this.pageSize
            // data.deptId = this.whereMap.deptId
            data.pageNumber = this.pageNum

            queryPartyMemberList({data: data}).then((res) => {
                this.loading = false;
                const data = res.data
                if (data.code == '00000') {
                    this.tableDataNow = data.data.records
                    this.total = data.data.total
                    if (this.tableDataNow) {
                        for (var i = 0; i < this.tableDataNow.length; i++) {
                            this.tableDataNow[i].birthday = this.formartDate(this.tableDataNow[i].birthday, 'yyyy-MM-dd')
                            this.tableDataNow[i].partyTime = formartDate(this.tableDataNow[i].partyTime, 'yyyy-MM-dd')
                            this.tableDataNow[i].collectiveIncome = this.tableDataNow[i].collectiveIncome ? this.tableDataNow[i].collectiveIncome : 0.0
                        }
                    }
                } else {
                    this.$message.error('获取党员数据出错')
                }


            }).catch(e => {
                this.loading = false;
            })
        },
        tableRowClassName({row, rowIndex}) {
            row.row_index = rowIndex
        },
        onRowClick(row) {
            this.deleteItmes.push(row.row_index)
        },
        // 分页
        sizeChange(data) {
            let num = data * 9 - 9
            this.tableDataNow = this.tableData.slice(num, num + 9)
        },
        handleSelectionChange(val, a, b) {
            this.multipleSelection = val
            var tmp = []
            val.forEach(i => {
                tmp.push(i.id)
            })
            this.partyMemberIds = tmp
        },
        getDict(ret, type) {
            let tmp = []
            getDictByCode(type).then((res) => {
                let data = res.data.data
                if (ret === 1) {
                    this.nationList = data
                } else if (ret === 2) {
                    this.positionList = data
                } else if (ret === 3) {
                    this.personTypeList = data
                } else if (ret === 4) {
                    this.educationList = data
                } else if (ret === 5) {
                    this.partyStateList = data
                } else if (ret === 6) {
                    this.partyWorkerList = data
                }
            })
            return tmp
        },
        getDict2(ret, type) {
            let tmp = []
            getDictByType2(type).then((res) => {
                let data = res.data
                if (ret === 6) {
                    this.partyWorkerList = data
                }
            })
            return tmp
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getTabelHeight()
            this.getDataById()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getDataById()
        },
        handleDelete(row) {
            this.$confirm('您确认要删除所点击选的数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var ids = []
                if (row != null || row != undefined) {
                    ids.push(row)
                } else {
                    ids = this.partyMemberIds
                }
                this.deleteOk(ids)
            }).catch(() => {

            });
        },
        deleteOk(ids) {
            if (ids == undefined || ids == null || ids.length == 0) {
                this.$message.error('没有选择的数据')
                return
            }
            delPartyMember(ids).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        //duration: 1500,
                    })

                    this.getDataById()
                    this.getnewPerson()
                    this.getactive()
                } else {
                    this.$message.error('删除失败')
                }
            })
        },
        refresh() {
            this.pageNum = 1
            this.pageSize = 10

            this.getDataById()
            this.getactive()
            this.getnewPerson()
        },

        addInfo() {
            //this.$router.push({path: '/dwgl/updatePerson', query: {deptId: this.whereMap.deptId, type: 3}})
            this.$refs.updatePersonRef.openDialog('', 3, this.whereMap.deptId)
        },
        deleteAll(index, rows) {
            if (this.partyMemberIds == undefined || this.partyMemberIds == null || this.partyMemberIds.length == 0) {
                this.$message.error('没有选择的数据')
                return
            }
            this.handleDelete()
            this.deleteItmes = []
        },
        restPasswordAll() {
            if (!this.whereMap.deptId || this.whereMap.deptId == null || this.whereMap.deptId.toString() == '') {
                this.$message.info('请选择需要重置的部门')
            }

            getTzSysDept(this.whereMap.deptId).then(res => {
                if (res.data.code == '00000') {
                    let deptName = res.data.data.name
                    getPartyMemberCount(this.whereMap.deptId).then(res2 => {
                        if (res2.data.code == '00000') {
                            let count = res2.data.data

                            this.$confirm('将重置 ' + deptName + ' 及其所有下级共 ' + count + ' 名党员的密码为身份证后六位，确定吗?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                showClose:false,
                                type: 'warning'
                            }).then(() => {
                                resetDeptTreePartyMemberPassword(this.whereMap.deptId).then(res3 => {
                                    const data = res3.data
                                    if (data.code == '00000') {
                                        this.$message.success('重置成功')
                                    } else {
                                        this.$message.error(data.msg)
                                    }
                                    this.$Modal.remove()
                                })
                            }).catch(() => {

                            });
                        } else {
                            this.$message.error('获取党员信息失败')
                        }
                    })
                } else {
                    this.$message.error('获取部门信息出错')
                }
            })


        },
        formartDate(date, fmt) {
            if (date == undefined || date == null || date.toString().trim().length <= 0) {
                return ''
            }
            if (typeof date === 'string') {
                date = new Date(date)
            }
            date = date == undefined ? new Date() : date
            date = typeof date == 'number' ? new Date(date) : date
            fmt = fmt || 'yyyy-MM-dd HH:mm:ss'
            let obj = {
                'y': date.getFullYear(), // 年份，注意必须用getFullYear
                'M': date.getMonth() + 1, // 月份，注意是从0-11
                'd': date.getDate(), // 日期
                'q': Math.floor((date.getMonth() + 3) / 3), // 季度
                'w': date.getDay(), // 星期，注意是0-6
                'H': date.getHours(), // 24小时制
                'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
                'm': date.getMinutes(), // 分钟
                's': date.getSeconds(), // 秒
                'S': date.getMilliseconds() // 毫秒
            }
            let week = ['天', '一', '二', '三', '四', '五', '六']
            for (let i in obj) {
                fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
                    let val = obj[i] + ''
                    if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val]
                    for (let j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
                    return m.length == 1 ? val : val.substring(val.length - m.length)
                })
            }
            return fmt
        },
        getPartyLabel(partyWorkerTips) {
            if (partyWorkerTips) {
                let list = [];
                let labelList = [];
                list = partyWorkerTips.split(',');
                this.partyWorkerList.map(item => {
                    list.map(subItem => {
                        if (subItem == item.itemValue) {
                            labelList.push(item.label);
                        }
                    })
                })
                return labelList
            }
        }
    }
}
</script>

<style scoped lang="scss">
.amount {
    font-size: 15px;
    width: 25%;
    word-break: break-all;
    text-align: center;
    padding: 10px;
    position: relative;

    .red-text {
        color: rgba(228, 53, 43, 1);
        font-size: 24px;
        font-weight: 700;
    }

    .black-text {
        color: rgba(51, 51, 51, 1);
        font-size: 14px;
        font-weight: 400;
    }

    .line {
        position: absolute;
        top: 20px;
        right: 0;
        width: 1px;
        height: 40px;
        background: rgba(242, 228, 228, 1);
    }
}

.partyMember {
}

.el-dialog el-dialog--center {
}

::v-deep.el-dialog__body {
    padding: 25px 25px 11px
}

.search-div {
    padding: 0 10px 10px 0;
    box-sizing: border-box;
    width: 260px;
    display: inline-flex;
    align-items: center;

    .input-box {
        width: 150px;
    }

    .label {
        flex: 1;
        text-align: right;
    }
}

.button-success {
    border: 1px solid rgb(103, 194, 58) !important;
    color: rgb(103, 194, 58) !important;
}

.button-delete {
    border: 1px solid rgb(58, 144, 232) !important;
    color: rgb(58, 144, 232) !important;
}

.head {
    display: flex;
    flex-direction: row;
    padding: 3px 10px;
    width: 100%;
    margin-top: 5px;
    border-radius: 5px;
    background-color: rgba(255, 248, 247, 1);;
    margin-bottom: 10px;
}

.flex-box {
    display: flex;
    justify-content: space-between;
}

.text-eclipse {
    overflow: hidden;
    max-width: 300px;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
