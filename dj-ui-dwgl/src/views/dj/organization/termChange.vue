<template>
    <Modal v-model="show" :title="modalTitle" :mask-closable="false" :closable="false" width="1300px" @on-visible-change="visibleChange">
        <div class="modal-content">
            <div style="height:40px;background-color: #fff;border-bottom: 2px solid #e7eaec">
                <el-button v-permission-contrast-update="deptId" type="danger" plain icon="el-icon-plus" size="small" @click="addInfo">新增</el-button>
            </div>
            <div class="body">
                <el-table
                    v-loading="loading"
                    ref="multipleTable"
                    :data="tableDataNow"
                    border
                    :cell-style="{'text-align':'center'}"
                    :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                    tooltip-effect="dark"
                    style="width: 100%;font-size: 14px;"
                    :key="Math.random()">
<!--                    <el-table-column fixed="left" type="selection" width="40"></el-table-column>-->
                    <el-table-column prop="teamSession" label="班子届次" width="80"></el-table-column>
                    <el-table-column prop="lastSessionFinishTime" label="上届换届时间" width="110"></el-table-column>
                    <el-table-column prop="thisSessionStartTime" label="本届起始时间" width="110"></el-table-column>
                    <el-table-column prop="thisSessionFinishTime" label="本届届满时间" width="110"></el-table-column>
                    <el-table-column prop="voteType" label="选举方式" >
                        <template slot-scope="scope">
                            {{
                                convertFiled(scope.row.voteType, 'voteType') ? convertFiled(scope.row.voteType, 'voteType') : '--'
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="secretary" label="书记" width="90">
                        <template slot-scope="scope">
                            {{ scope.row.secretary ? partyMemberList.find(item => item.id == scope.row.secretary).realName : '暂无' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="deputySecretary" label="副书记" width="90">
                        <template slot-scope="scope">
                            {{ scope.row.deputySecretary ? partyMemberList.find(item => item.id == scope.row.deputySecretary).realName : '暂无' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="committeeMember" label="组织委员" width="90">
                        <template slot-scope="scope">
                            {{ scope.row.committeeMember ? partyMemberList.find(item => item.id == scope.row.committeeMember).realName : '暂无' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="diCommitteeMember" label="纪检委员" width="90">
                        <template slot-scope="scope">
                            {{ scope.row.diCommitteeMember ? partyMemberList.find(item => item.id == scope.row.diCommitteeMember).realName : '暂无' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="publicityCommitteeMember" label="宣传委员" width="90">
                        <template slot-scope="scope">
                            {{ scope.row.publicityCommitteeMember ? partyMemberList.find(item => item.id == scope.row.publicityCommitteeMember).realName : '暂无' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="otherMembers" label="其他委员" width="100" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div v-if="scope.row.otherMembers">
                                <span v-for="(id,index) in scope.row.otherMembers.split(',')" :key="index">
                                    {{ partyMemberList.find(item => item.id == id).realName }}
                                </span>
                            </div>
                            <div v-else>暂无</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handDetail(scope.row.id)">详情</el-button>
                            <span v-permission-contrast="deptId">
                                <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
                                <el-button size="mini" @click.native.prevent="handleDelete(scope.row.id)">删除</el-button>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="text-align: center;">
                    <el-pagination
                        style="margin-top: 10px;"
                        v-if="tableDataNow.length"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageNum"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>
            </div>

        </div>
        <update-change v-model="updateShow" :modal-title="modalTitle2" :parentId="form.deptId" :partyId="termId+''"
                       @close="closeUpdate()"></update-change>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close('close')">关 闭</el-button>
        </div>
    </Modal>
</template>

<script>
import {formartDate} from '@/utils/tool.js'
import util from '@/libs/util'
import {deleteTzTermDept, queryTzTermDeptList} from "@/api/jcxfTermDept";
import { getTzSysDept } from "@/api/jcxfSysDept";
import { getDictByType, getDictByType2 } from "@/api/tDictData";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import updateChange from '@/views/dj/windowOfBranch/changeTermDept/updateChange'
import {getPartMemberListByDeptId} from "@/api/jcxfPartyMember";

export default {
    name: 'updateDevelop',
    components: {
        updateChange
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        deptId: {
            type: String,
            default: ''
        },
        partyId: {
            type: String,
            default: ''
        },
        modalTitle: {
            type: String
        }
    },
    data() {
        return {
            modalTitle2: '',
            termId: '',
            updateShow: false,
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
            tableDataNow: [],
            id: '',
            show: this.value,
            ids: [],
            tmp: [],
            base: util.nginxUrl,
            type: '',
            modal1: false,
            electTypeList: [],
            form: {
                deptId: '',
                isFirst: 0,
                teamSession: null,
                lastSessionFinishTime: '',
                thisSessionStartTime: '',
                thisSessionFinishTime: '',
                voteType: ''
            },
            partyMemberList: []
        }
    },
    methods: {
        handDetail(id) {
            this.modalTitle2 = '详情'
            this.updateShow = true
            this.termId = id
        },
        visibleChange(event) {
            if (!event) {
                this.close()
            }
        },
        handleDelete(row) {
            this.$confirm('您确认要删除所点击选的数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
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

            deleteTzTermDept(ids).then(res =>{
                const data = res.data
                if (data.code == '00000') {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        //duration: 1500,
                    })
                    this.getDataById(this.form.deptId)
                }
            })
        },
        closeUpdate() {
            this.updateShow = false
            this.getDataById(this.form.deptId)
        },
        addInfo() {
            this.modalTitle2 = '新增'
            this.updateShow = true
        },
        handleEdit(id) {
            this.modalTitle2 = '编辑'
            this.updateShow = true
            this.termId = id
        },
        convertFiled(row, type) {
            let tmp = ''
            if (type === 'voteType') {
                this.electTypeList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            }
            return tmp
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getDataById(this.form.deptId)
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getDataById(this.form.deptId)
        },
        getDeptName(deptId) {
            getTzSysDept(deptId).then(res => {
                const data = res.data.data
                this.form.deptName = data.name
            })
        },
        close() {
            this.reset()
            this.show = false
            this.$emit('close')
        },
        reset() {
            this.tableData = []
            this.form = {
                deptId: '',
                isFirst: 0,
                teamSession: null,
                lastSessionFinishTime: '',
                thisSessionStartTime: '',
                thisSessionFinishTime: '',
                voteType: ''
            }
        },
        init() {
            this.getdict('voteType')
        },
        getPartMemberList(){
            getPartMemberListByDeptId(this.form.deptId).then(res => {
                const result = res.data
                if (result.code == '00000') {
                    this.partyMemberList = result.data
                    this.$forceUpdate()
                }
            })
        },
        closeModal(val) {
            // this.$emit('close')
            this.$emit('input', false)
        },
        getdict(type) {
            let tmp = []
            getDictByCode(type).then(res =>{
                const data = res.data.data
                if (type === 'voteType') {
                    this.electTypeList = data
                }
            })
            return tmp
        },
        getDataById(id) {
            this.loading = true
            let data = {
                tzTermDept: {
                    deptId: id
                },
                pageVo: {
                    pageNumber: this.pageNum,
                    pageSize: this.pageSize
                },
                type: '1'
            }

            queryTzTermDeptList({ data: data }).then(res =>{
                const data = res.data.data
                this.tableDataNow = data.result.records
                this.total = data.result.total
                if (this.tableDataNow) {
                    for (let i = 0; i < this.tableDataNow.length; i++) {
                        this.tableDataNow[i].thisSessionFinishTime = this.tableDataNow[i].thisSessionFinishTime ? formartDate(this.tableDataNow[i].thisSessionFinishTime, 'yyyy-MM-dd') : ''
                        this.tableDataNow[i].thisSessionStartTime = this.tableDataNow[i].thisSessionStartTime ? formartDate(this.tableDataNow[i].thisSessionStartTime, 'yyyy-MM-dd') : ''
                        this.tableDataNow[i].lastSessionFinishTime = this.tableDataNow[i].lastSessionFinishTime ? formartDate(this.tableDataNow[i].lastSessionFinishTime, 'yyyy-MM-dd') : ''
                    }
                }
                this.loading = false
            }).catch((e) => {
                this.loading = false
            })
        },
    },
    watch: {
        value(val) {
            if (val) {
                this.show = val
                this.form.deptId = this.deptId
                this.getPartMemberList()
                if (this.modalTitle === '新增') {
                    this.getDeptName(this.form.deptId)
                } else {
                    this.id = this.partyId
                    this.getDataById(this.form.deptId)
                }
            }
        },
        show(val) {
            if (val) {
                this.init()
            } else {
                this.closeModal(val)
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.modal-content {
    //margin-top: -28px;
    width: 100%;

    .modal-header {
        padding: 15px 10px;
        text-align: center;

        .modal-title {
            font-size: 24px;
        }
    }

    .body {
        padding: 20px 30px 30px 30px;
        background: #f8fafb;
        width: auto;

        .row {
            //margin-right: -15px;
            //margin-left: -15px;

            .col-sm-6 {
                /*width: 50%;*/
                margin-left: 35px;

                &:hover {
                    .demo-upload-list-cover {
                        display: block;
                    }
                }

                .demo-upload-list-cover {
                    display: none;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    width: 100%;
                    /*height: 60px;*/
                    line-height: 60px;
                    background: rgba(0, 0, 0, .6);
                    text-align: center;

                    &:hover {
                        display: block;
                        background: rgba(0, 0, 0, .6);
                    }
                }

                .ivu-modal {
                    width: 660px !important;
                }

                .demo-upload-list {
                    display: inline-block;
                    width: 60px;
                    height: 60px;
                    text-align: center;
                    line-height: 60px;
                    border: 1px solid transparent;
                    border-radius: 4px;
                    overflow: hidden;
                    background: #fff;
                    position: relative;
                    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
                    margin-right: 4px;
                }

                .demo-upload-list img {
                    width: 100%;
                    height: 100%;
                }

                .demo-upload-list-cover {
                    display: none;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: rgba(0, 0, 0, .6);
                }

                .demo-upload-list:hover .demo-upload-list-cover {
                    display: block;
                }

                .demo-upload-list-cover i {
                    color: #fff;
                    font-size: 20px;
                    cursor: pointer;
                    margin: 0 2px;
                    margin-top: 30px;
                }

                .label {
                    ::v-deep.el-form-item__label {
                        line-height: 18px;
                    }
                }


                .el-form-item {
                    line-height: 20px;

                    .input-row {
                        width: 80%;
                        margin-right: 10px
                    }

                    padding-left: 10px !important;
                    margin-right: -12px;
                    margin-left: -15px;
                    margin-bottom: 15px;
                }
            }
        }
    }

    .modal-footer {
        padding: 15px;
        text-align: right;
        border-top: 1px solid #e5e5e5;

        .btn-white {
            border-radius: 3px;
            letter-spacing: 1px;
            color: inherit;
            background: white;
            border: 1px solid #e7eaec;

            display: inline-block;
            padding: 6px 12px;
            margin-bottom: 0;
            font-size: 14px;
            font-weight: normal;
            line-height: 1.42857143;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            -ms-touch-action: manipulation;
            touch-action: manipulation;
            cursor: pointer;
        }

        .btn-blue {
            border-radius: 3px;
            letter-spacing: 1px;

            color: #FFFFFF;
            margin-left: 5px;
            display: inline-block;
            padding: 6px 12px;
            margin-bottom: 0;
            font-size: 14px;
            font-weight: normal;
            line-height: 1.42857143;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            -ms-touch-action: manipulation;
            touch-action: manipulation;
            cursor: pointer;
            background-color: #3d86e7 !important;
            border-color: #3d86e7 !important;
        }
    }
    /deep/.el-table__empty-block{
        height: 0 !important;
    }
}
/deep/.el-table__header{
    font-size: 14px !important;
}
/deep/.el-table__body{
    font-size: 14px !important;
}
</style>
