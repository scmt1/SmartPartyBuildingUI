<template>
    <el-dialog
        title=""
        :visible.sync="dialogVisible"
        width="800px"
        @close="handleClose">
        <div style="text-align: left;">
            <div style="font-size: 16px; font-weight: bold;">学习情况查看</div>
            <div style="margin-top: 15px;">课程名称：{{ studyVideoInfo.title }}</div>
            <div style="margin-top: 15px; display: flex; align-items: center;">
                <div>学习情况：<span style="color: rgb(54, 171, 96);">已完成{{ total }}人</span></div>
<!--                <div class="mms-button">短信提醒</div>-->
            </div>

        </div>
        <div style="margin-top: 15px;">
            <el-table :data="tableData" border style="width: 100%" v-loading="tableLoading"
                      :cell-style="{'text-align':'center'}"
                      :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                      tooltip-effect="dark">
                <el-table-column label="党员头像" width="90">
                    <template slot-scope="scope">
                        <el-image style="height: 50px" v-if="scope.row.partyMember.avatar && scope.row.partyMember.avatar.length > 0" :src="scope.row.partyMember.avatar"></el-image>
                        <el-image style="height: 50px" v-else :src="defaultHeader"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="党员姓名" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.partyMember.realName }}
                    </template>
                </el-table-column>
                <el-table-column label="所属党组织">
                    <template slot-scope="scope">
                        {{ scope.row.partyMember.deptName }}
                    </template>
                </el-table-column>
                <el-table-column label="联系电话" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.partyMember.phone }}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="margin-top: 10px;">
            <el-pagination
                v-if="tableData!=null&&tableData.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="search.pageVo.pageNumber"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="search.pageVo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose()">关闭</el-button>
        </span>
    </el-dialog>

</template>

<script>
import {getTzStudyUserListByPage} from "@/api/tzStudyUser";
import {getTzStudyVideo} from "@/api/tzStudyVideo";
import util from "@/libs/util";
import defaultHeader from "@/assets/default-header.png";

export default {
    name: "studyLog",
    props: {
        show: {
          type: Boolean,
          default: false
        },
        id: {
            type: String,
            default: null
        }
    },
    watch: {
        show() {
            this.dialogVisible = this.show
            if (this.dialogVisible) {
                this.getTzStudyVideoInfo()
                this.getTzStudyUserList()
            }
        }
    },
    data() {
        return {
            defaultHeader: defaultHeader,
            base: util.jcxfUrl,
            dialogVisible: false,
            tableData: [],
            total: 0,
            search: {
                tzStudyUser: {
                    studyId: null
                },
                pageVo: {
                    pageNumber: 1,
                    pageSize: 10
                }
            },
            tableLoading: false,
            studyVideoInfo: {}
        }
    },
    methods: {
        handleSizeChange(event) {
            this.getTzStudyUserList()
        },
        handleCurrentChange(event) {
            this.getTzStudyUserList()
        },
        handleClose() {
          this.$emit('close')
        },
        getTzStudyVideoInfo() {
            getTzStudyVideo(this.id).then(res => {
                if (res.data.code == '00000') {
                    this.studyVideoInfo = res.data.data.studyVideo
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        getTzStudyUserList() {
            this.tableLoading = true
            this.search.tzStudyUser.studyId = this.id
            getTzStudyUserListByPage({data: this.search}).then(res => {
                this.tableLoading = false
                if (res.data.code == '00000') {
                    this.tableData = res.data.data.records
                    this.total = res.data.data.total
                }
            })
        }
    }
}
</script>

<style scoped>
.mms-button {
    margin-left: 20px;
    background: rgb(226, 66, 64);
    color: white;
    padding: 5px 20px;
    font-size: 15px;
    border-radius: 5px;
    display: inline-block;
    cursor: pointer;
}
/deep/.el-table__empty-block{
    height: 0 !important;
}
</style>
