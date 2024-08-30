<template>
    <div>
        <el-tabs type="border-card"  v-model="activeName" @tab-click="tabClick" style="box-shadow: 3px 3px 10px #888888;width: 80%;margin: auto">
            <el-tab-pane label="团组织信息管理" name="group">
                <div style="padding: 50px 80px 30px 50px">
                    <el-form ref="form" :rules="rules" :model="form">
                        <el-form-item label=" 团组织名称:" :label-width="labelWidth" prop="name">
                            <el-input v-model="form.name" size="medium" class="input-row"></el-input>
                        </el-form-item>
                        <el-form-item label=" 团组织书记:" :label-width="labelWidth">
                            <el-input v-model="form.master" size="medium" class="input-row"></el-input>
                        </el-form-item>
                        <el-form-item label=" 联系电话:" :label-width="labelWidth" prop="phone">
                            <el-input v-model="form.phone" size="medium" class="input-row"></el-input>
                        </el-form-item>
                        <el-form-item label=" 团组织联系人:" :label-width="labelWidth">
                            <el-input v-model="form.contacts" size="medium" class="input-row"></el-input>
                        </el-form-item>
                        <el-form-item label=" 联系人电话:" :label-width="labelWidth" prop="contactsPhone">
                            <el-input v-model="form.contactsPhone" size="medium" class="input-row"></el-input>
                        </el-form-item>
                        <el-form-item label=" 团组织地址:" :label-width="labelWidth">
                            <el-input v-model="form.addr" size="medium" class="input-row"></el-input>
                        </el-form-item>
                        <el-form-item label=" 团组织人数:" :label-width="labelWidth">
                            <el-input-number v-model="form.personCount" size="medium" :min="0"
                                             class="input-row"></el-input-number>
                        </el-form-item>
                    </el-form>
                    <el-button plain size="medium" @click="save"
                               style="background: #E4352B;color:#ffffff;margin-top:10px">保存信息
                    </el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane label="团员学习与培训" name="study">
                <div style="padding: 10px;">
                    <div style="padding-top: 10px;padding-bottom: 10px;text-align: left">
                        <el-button plain size="small" @click="addActive"
                                   style="background: #E4352B;color:#ffffff;">新增团员培训活动
                        </el-button>
                    </div>
                    <el-table
                        ref="tableDate"
                        :data="tableDate"
                        strip
                        row-class-name="table-row"
                        :header-cell-style="{ 'text-align': 'center' ,  color : '#fffff' , background : '#eef1f6'}"
                        :row-style="{height: '10px'}"
                        :cell-style="{ 'text-align': 'center' , 'padding' : '5px 0px'}"
                        border
                        style="width: 100%">
                        <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column prop="name" label="团员培训活动名称">
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间" width="160">
                            <template slot-scope="scope">
                                {{ scope.row.createTime ? formartDate(scope.row.createTime, 'yyyy-MM-dd') : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column width="200" align="center" label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="updateActive(scope.row.id)">查看详情/编辑</el-button>
                                <el-button class="button-delete" size="mini" @click="deleteById(scope.row.id)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        v-if="tableDate.length"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageNum"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>

                </div>
            </el-tab-pane>
        </el-tabs>
        <teamActive v-model="show" :modeTitle="title" :teamId="form.id" @close="close" :id="teamActiveId"></teamActive>
    </div>
</template>

<script>
import {treeDataTranslate} from '@/utils'
import treeAndTable from "@/components/TreeAndTable.vue";
// import organizationTree from '@/views/dj/components/organizationTree'
import tradeUnionTree from '@/views/dj/components/tradeUnionTree'
import {getDictByType, getDictByType2} from "@/api/tDictData";
import {getTradeUnion, deleteTrade, determineNode} from "@/api/tzTradeUnion.js";
import {addTeam, queryTeamByDeptId} from '@/api/tzTeamDept'
import {queryTeamActiveList, deleteTeamActive} from '@/api/tzTeamActive'

import teamActive from "./teamActive";
import {
    deleteTzSysDept,
    queryTzSysDeptList
} from "@/api/jcxfSysDept";
import {queryPartyMemberList} from "@/api/jcxfPartyMember";
import {mapGetters} from "vuex";

export default {
    name: 'index',
    components: {
        teamActive
    },
    data() {
        return {
            labelWidth: '150px',
            form: {
                name: '',
                master: '',
                phone: '',
                contacts: '',
                contactsPhone: '',
                addr: '',
                personCount: 0
            },
            tableDate: [],
            pageSize: 10,
            pageNum: 1,
            total: 0,
            rules: {
                name: [
                    {required: true, message: '字段不能为空', trigger: 'blur'}
                ],
                phone: [
                    {
                        type: 'string',
                        message: '联系电话有误！',
                        trigger: 'blur',
                        pattern: /^(((\d{3,4}-)?[0-9]{7,8})|(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8})$/
                    }
                ],
                contactsPhone: [
                    {
                        type: 'string',
                        message: '联系电话有误！',
                        trigger: 'blur',
                        pattern: /^(((\d{3,4}-)?[0-9]{7,8})|(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8})$/
                    }
                ],
            },
            show: false,
            deptId: '',
            title: '',
            dataListLoading: false,
            teamActiveId: null,
            activeName:"group"
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    created() {
        document.title = "团组织管理";
        this.deptId = this.deptInfo.id
        // this.getDict('tradeType')
        this.queryTeamByDeptId()
    },
    methods: {
        //tab切换
        tabClick(e){
            if(e.name == "group"){
                this.queryTeamByDeptId()
            }else if(e.name == "study"){
                this.queryTeamActiveList()
            }
        },
        deleteById(id) {
            this.$confirm('您确认要删除所点击选的数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                type: 'warning'
            }).then(() => {
                let ids = []
                ids.push(id)
                this.deleteOk(ids)
            }).catch(() => {
                this.$message.info('取消了当前的操作行为！')
            });
        },
        deleteOk(ids) {
            if (ids == undefined || ids == null || ids.length == 0) {
                this.$message.error('没有选择的数据')
                return
            }
            deleteTeamActive(ids).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        duration: 1500,
                    })
                    this.queryTeamActiveList()
                }
            })
        },
        updateActive(id) {
            this.title = '编辑'
            this.teamActiveId = id
            this.show = true
        },
        close() {
            this.show = false
            this.queryTeamActiveList()
        },
        queryTeamActiveList() {
            this.dataListLoading = true
            let data = {
                active: {
                    teamId: this.form.id
                },
                pageVo: {
                    pageSize: this.pageSize,
                    pageNumber: this.pageNum
                }
            }
            queryTeamActiveList({data: data}).then(res => {
                const data = res.data.data
                this.tableDate = data.records
                this.total = data.total
            }).catch(e => {
                this.dataListLoading = false
            })
        },
        queryTeamByDeptId() {
            queryTeamByDeptId(this.deptId + '').then(res => {
                if (res.data.data) {
                    this.form = res.data.data
                } else {
                    this.form = {
                        name: '',
                        master: '',
                        phone: '',
                        contacts: '',
                        contactsPhone: '',
                        addr: '',
                        personCount: ''
                    }
                }
            })
        },
        addActive() {
            if (!this.form || !this.form.id) {
                this.$message.info("请先创建团组织，方可创建相关活动")
                return false
            }
            this.title = '新增';
            this.show = true
        },
        save() {
            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    return false
                }
                this.form.deptId = this.deptInfo.id
                let team = this.form
                addTeam({team: team}).then(res => {
                    if (res.data.code == '00000') {
                        this.form.id = res.data.data.id
                        this.$message.success("保存成功")
                    } else {
                        this.$message.error("保存失败")
                    }
                })

            })
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.queryTradeActiveList()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.queryTradeActiveList()
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
        }
    }
}
</script>
<style lang="scss" scoped>
@import url("//unpkg.com/element-ui@2.15.7/lib/theme-chalk/index.css");

.el-tabs .el-tabs__item.is-active {
    background-color: yellow; /* 设置tab点击时的背景颜色 */
}

.el-button.is-plain:focus, .el-button.is-plain:hover {
    border-color: red;
}

.button-success {
    border: 1px solid rgb(103, 194, 58);
    color: rgb(103, 194, 58);
}

.button-delete {
    border: 1px solid rgb(58, 144, 232);
    color: rgb(58, 144, 232);
}
/deep/.el-icon-minus {
    line-height: 34px;
}
/deep/.el-icon-plus {
    line-height: 34px;
}
/deep/.el-table__empty-block{
    height: 0 !important;
}
</style>
