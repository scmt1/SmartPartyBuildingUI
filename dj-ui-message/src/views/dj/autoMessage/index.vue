<template>
    <div>
        <div style="background: white;padding: 10px 50px 50px;">
            <div style="display:flex;margin-top: 29px;margin-left: 60px;">
                <img src="../../../assets/message/customMessage.png">
                <div
                    style="font-size: 24px;font-family: Microsoft YaHei, Microsoft YaHei-Bold;font-weight: normal;text-align: LEFT;color: #E1351B;margin-left:14px">
                        发送任务
                </div>
            </div>
            <div style="margin-top: 15px; margin-left: 60px; font-size: 14px;color: #7f7f7f; text-align: left;">
                *任务的开启和关闭将会影响本部门及本部门所有下级
            </div>
            <div class="body">
                <el-table
                    v-loading="tableLoading"
                    :data="tableDataNow"
                    :cell-style="{'text-align':'center'}"
                    :header-cell-style="{'text-align':'center',background : '#f8f8f9'}"
                    border
                    tooltip-effect="dark"
                    style="width: 100%"
                    :key="Math.random()">
                    <el-table-column label="序号" type="index" width="80"/>
                    <el-table-column prop="missionName" width="200" label="任务名称" show-overflow-tooltip/>
                    <el-table-column prop="temName" width="300" label="模板名称" show-overflow-tooltip/>
                    <el-table-column label="模板内容" prop="temContent" show-overflow-tooltip></el-table-column>
                    <el-table-column label="类型" width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.missionType == '1'">自动任务</span>
                            <span v-else-if="scope.row.missionType == '2'">手动任务</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="100">
                        <template slot-scope="scope">
                            {{scope.row.isOpen==1?'开启':'关闭'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="remark" width="180" show-overflow-tooltip/>
                    <el-table-column label="操作" width="170">
                        <template slot-scope="scope">
                            <span v-if="deptInfoData.deptId == scope.row.role?.deptId" style="margin-right: 10px;">
                                <el-button v-if="scope.row.isOpen==1" plain type="danger" size="small" @click="updateStatus(scope.row.id, '2')">关闭</el-button>
                                <el-button v-else-if="scope.row.isOpen==2" plain type="primary" size="small" @click="updateStatus(scope.row.id, '1')">开启</el-button>
                            </span>
<!--                            <el-button v-if="deptInfo.isZb" size="small" @click="edit(scope.row.id)">编辑</el-button>-->
                            <el-button size="small" @click="edit(scope.row.id)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="margin-top: 10px;text-align:right">
                    <el-pagination
                        v-if="tableDataNow!=null&&tableDataNow.length"
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
        <update :value="selectShow" :modal-title="title" :id="id+''" @close="selectShow = false" @refresh="closeSelectShow()"/>
    </div>
</template>

<script>
import {getDictByType2} from "@/api/tDictData";
import {queryMessageAuto} from "@/api/tzAutoMessage";
import {updateAutoMessageRoleStatus} from "@/api/tzMessageAutoRole";
import {getTzSysDept} from "@/api/jcxfSysDept";
import Update from "./update";
import {mapGetters} from "vuex";

export default {
    name: 'Index',
    components: {Update},
    data() {
        return {
            id: '',
            sendTime: [],
            total: 0,
            formLabelWidth: '0px',
            form: {
                columnId: '',
                content: ''
            },
            sendTypes: [
                {id: 1, name: '自定义发送'}, {id: 2, name: '模板发送'}
            ],
            sendTimeTypes: [
                {id: 1, name: '立即发送'}, {id: 2, name: '定时发送'}
            ],
            tableDataNow: [],
            pageSize: 10,
            pageNum: 0,
            messageTemplateTypeList: [],
            title: '',
            selectShow: false,
            tableLoading: false,
            deptInfoData: {
                deptId: '',
                isZb: false
            }
        }
    },
    created() {
        document.title = "自动发送";
    },
    computed: {
        ...mapGetters({ vuexDeptInfo: 'deptInfo' }),
    },
    mounted() {
        console.log(this.vuexDeptInfo)
        this.deptInfoData.deptId = this.vuexDeptInfo.id + ''
        // this.getDept()
        this.queryMessage()
        this.getDict('messageTemplateType')
    },
    methods: {
        /*getDept() {
            getTzSysDept(this.deptInfoData.deptId+ '').then(res => {
                const data = res.data
                if (data.code == '00000') {
                    const typeList = [631, 632, 931, 932]
                    const type = data.data.type
                    const isLeaf = data.data.isLeaf
                    if (isLeaf && typeList.indexOf(type) > -1) {
                        this.deptInfoData.isZb = true
                    }
                }
            })
        },*/
        updateStatus(autoId, status) {
            let data = {
                autoId: autoId + '',
                deptId: this.deptInfoData.deptId + '',
                status: status + '',
            }
            updateAutoMessageRoleStatus({data: data}).then(res =>{
                const data = res.data
                if (data.code == '00000') {
                    this.$message.success('保存成功')
                    this.queryMessage()
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        edit(id) {
            this.title = '编辑'
            this.id = id
            this.selectShow = true
        },
        closeSelectShow() {
            this.selectShow = false
            this.queryMessage()
        },
        getDict(type) {
            getDictByType2(type).then((res) => {
                let data = res.data
                if (type === 'messageTemplateType') {
                    this.messageTemplateTypeList = data
                }
                this.queryMessage()
            })
        },
        reset() {
            this.form = {}
        },
        select(e) {
            console.log(456, e)
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.queryMessage()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.queryMessage()
        },
        search() {
            this.pageSize = 10
            this.pageNum = 1
            this.queryMessage()
        },
        queryMessage() {
            this.tableLoading = true
            let data = {
                tzMessageAuto: this.form,
                pageVo: {
                    pageSize: this.pageSize,
                    pageNumber: this.pageNum
                },
                deptId: this.deptInfoData.deptId + ''
            }
            queryMessageAuto({data: data}).then(res => {
                this.tableLoading = false
                if (res.data.code == '00000') {
                    this.tableDataNow = res.data.data.records
                    this.total = res.data.data.total
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.search-div {
    margin-left: 60px;
    display: inline-block;
}

.input-row {
    width: 200px;
    margin-left: 10px
}

.body {
    margin-top: 20px;
    margin-left: 60px;
}

.button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 147px;
    height: 30px;
    background: #01a7f0;
    border-radius: 3px;
    font-size: 16px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: normal;
    text-align: CENTER;
    color: #ffffff;

    line-height: 22px;

    .button-font {
        text-align: CENTER;
        color: #ffffff;
        line-height: 22px;
    }
}
/deep/.el-table__empty-block{
    height: 0 !important;
}
</style>
