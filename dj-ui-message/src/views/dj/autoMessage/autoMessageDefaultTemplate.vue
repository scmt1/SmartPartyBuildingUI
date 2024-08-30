<template>
    <div>
        <div style="background: white;padding: 10px 50px 50px;">
            <div style="display:flex;margin-top: 29px;">
                <img src="../../../assets/message/customMessage.png">
                <div
                    style="font-size: 24px;font-family: Microsoft YaHei, Microsoft YaHei-Bold;font-weight: normal;text-align: LEFT;color: #E1351B;margin-left:14px">
                    自定义模板管理
                </div>
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
                    <el-table-column prop="temName" width="250" label="模板名称" show-overflow-tooltip/>
                    <el-table-column label="模板内容" prop="temContent" show-overflow-tooltip></el-table-column>
                    <el-table-column label="类型" width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.missionType == '1'">自动任务</span>
                            <span v-else-if="scope.row.missionType == '2'">手动任务</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.isOpen == 1 ? '启用' : '停用' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="remark" width="180" show-overflow-tooltip/>
                    <el-table-column label="操作" width="170">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.isOpen==0" plain type="primary" size="small"
                                       @click="updateOpen(scope.row.id, '1')">启用
                            </el-button>
                            <el-button v-else-if="scope.row.isOpen==1" plain type="danger" size="small"
                                       @click="updateOpen(scope.row.id, '0')">停用
                            </el-button>
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
        <update :value="selectShow" :modal-title="title" :id="id+''" @close="selectShow = false"
                @refresh="closeSelectShow()"/>
    </div>
</template>

<script>
import {getMessageAutoPageByAdmin, updateAutoMessageOpenStatus} from "@/api/tzAutoMessage";
import Update from "@/views/dj/autoMessage/autoMessageDefaultTemplateUpdate.vue";

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
            tableDataNow: [],
            pageSize: 10,
            pageNum: 0,
            title: '',
            selectShow: false,
            tableLoading: false,
            deptInfo: {
                deptId: '',
                isZb: false
            }
        }
    },
    created() {
        document.title = "自定义基础模板管理";
    },
    mounted() {
        this.queryMessage()
    },
    methods: {
        updateOpen(autoId, status) {
            let data = {
                id: autoId + '',
                openStatus: status + '',
            }
            updateAutoMessageOpenStatus(data).then(res => {
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
        reset() {
            this.form = {}
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
                pageVo: {
                    pageSize: this.pageSize,
                    pageNumber: this.pageNum
                }
            }
            getMessageAutoPageByAdmin({data: data}).then(res => {
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
</style>
