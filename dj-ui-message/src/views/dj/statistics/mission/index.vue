<template>
    <div>
        <div style="background: white;padding: 10px 50px 50px;">
            <div style="display:flex;margin-top: 29px;margin-bottom: 20px;">
                <img src="../../../../assets/message/statistics.png">
                <div
                    style="font-size: 24px;font-family: Microsoft YaHei, Microsoft YaHei-Bold;font-weight: normal;text-align: LEFT;color: #E1351B;margin-left:14px">
                    任务发送统计
                </div>
            </div>
            <el-form ref="searchForm" :model="form" label-width="90px" inline size="medium" style="text-align: left;">
                <el-form-item prop="missionName" label="任务名称：">
                    <el-input style="width: 230px;" maxlength="150" v-model="form.missionName" placeholder="任务名称" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="sendType" label="发送类型：">
                    <el-select v-model="form.sendType" clearable placeholder="请选择" class="input-row">
                        <el-option v-for="item in sendTypes" :key="item.id" :label="item.name" :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="sendTimeType" label="发送模式：">
                    <el-select v-model="form.sendTimeType" clearable placeholder="请选择"
                               class="input-row">
                        <el-option v-for="item in sendTimeTypes" :key="item.id" :label="item.name" :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="发送时间：" v-if="drop">
                    <el-date-picker v-model="dateRange" type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <a class="drop-down" @click="dropDown">
                        {{dropDownContent}}
                        <i :class="dropDownIcon"></i>
                    </a>
                    <el-button size="small" icon="el-icon-search" @click="search()" style="background: rgba(228, 53, 43, 1);color:#ffffff;border-color: rgb(228, 53, 43);">搜索</el-button>
                    <el-button size="small" @click="reset('searchForm')">重置</el-button>
                </el-form-item>
            </el-form>
            <div class="body">
                <el-table
                    v-loading="tableLoading"
                    :data="tableDataNow"
                    :cell-style="{'text-align':'center'}"
                    :header-cell-style="{'text-align':'center',background : '#f8f8f9'}"
                    border
                    tooltip-effect="dark"
                    style="width: 100%">
                    <el-table-column label="ID" prop="id" width="80" fixed="left"/>
                    <el-table-column prop="missionName" width="180" show-overflow-tooltip label="任务名称"/>
                    <el-table-column label="发送类型" prop="sendType" width="150">
                        <template slot-scope="scope">
                            {{ scope.row.sendType == 1 ? '自定义发送' : '模板发送' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="提交时间" prop="createTime" width="160"/>
                    <el-table-column label="发送内容" prop="content" min-width="220" show-overflow-tooltip/>
<!--                    <el-table-column label="发送对象信息" prop="sendObject" width="180" >-->
<!--                        <template slot-scope="scope">-->
<!--                            <div style="text-overflow: ellipsis; overflow: hidden; word-break: break-all; white-space: nowrap;">{{ scope.row.sendObject }}</div>-->
<!--                        </template>-->
<!--                    </el-table-column>-->
                    <el-table-column label="发送时间" prop="sendTime" width="180"/>
                    <el-table-column label="发送模式" prop="sendTimeType" width="150">
                        <template slot-scope="scope">
                            {{ scope.row.sendTimeType == 1 ? '立即发送' : '定时发送' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="任务状态" prop="status" width="100">
                        <template slot-scope="scope">
                            {{ convert(scope.row.status, sendStatusList) }}
                        </template>
                    </el-table-column>
<!--                    <el-table-column label="提交号码数（总行数）" width="100">-->
<!--                        <template slot-scope="scope">-->
<!--                            {{ scope.row.successCount + scope.row.errorCount }}-->
<!--                        </template>-->
<!--                    </el-table-column>-->
                    <el-table-column label="发送成功" prop="successCount" width="100"/>
                    <el-table-column label="发送失败" prop="errorCount" width="100"/>
                    <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" plain type="primary" @click="showDetail(scope.row.id)">详情</el-button>
                            <el-button size="mini" v-if="shouldShowButton(scope.row)" @click="recallSend(scope.row.id)">
                                撤回发送
                            </el-button>
<!--                            <div v-else>
                                &#45;&#45;
                            </div>-->
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
        <detail :messageId="dialogId+''" :show="dialogVisible" @close="close()"></detail>
    </div>
</template>

<script>
import {
    queryMessage, recallSend
} from "@/api/tzMessage";
import detail from "./detail.vue";
import {getDictByType2} from "@/api/tDictData";

export default {
    name: 'Index',
    components: {
        detail
    },
    data() {
        return {
            drop: false,
            dropDownContent: "展开",
            dropDownIcon: "el-icon-arrow-down",
            sendTime: [],
            total: 0,
            formLabelWidth: '0px',
            form: {
                missionName: null,
                sendType: null,
                sendTimeType: null,
                startDate: null,
                endDate: null,
                sendStartTime: null,
                sendEndTime: null,
            },
            sendTypes: [
                {id: 1, name: '自定义发送'}, {id: 2, name: '模板发送'}
            ],
            sendTimeTypes: [
                {id: 1, name: '立即发送'}, {id: 2, name: '定时发送'}
            ],
            tableDataNow: [{}],
            pageSize: 10,
            pageNum: 0,
            tableLoading: false,
            dialogId: null,
            dialogVisible: false,
            sendStatusList: [],
            dateRange:[]
        }
    },
    created() {
        document.title = "任务发送统计";
    },
    async mounted() {
        await this.getDict('messageStatus')
        this.queryMessage()
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
        },
        getDict(type) {
            return new Promise((resolve, reject) => {
                getDictByType2(type).then((res) => {
                    let data = res.data
                    if (type === 'messageStatus') {
                        this.sendStatusList = data
                    }
                    resolve()
                })
            })
        },
        convert(value, dic) {
            for (let i = 0; i < dic.length; i++) {
                if (dic[i].itemValue == value) {
                    return dic[i].label
                }
            }
        },
        close() {
            this.dialogVisible = false
        },
        showDetail(id) {
            this.dialogId = id
            this.dialogVisible = true
        },
        recallSend(id) {
            this.$confirm('您确认要取消发送吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                type: 'warning'
            }).then(() => {
                recallSend(id + '').then(res => {
                    if (res.data.code == '00000') {
                        this.$message.success("撤销成功")
                    } else {
                        this.$message.info(res.data.msg)
                    }
                })
            }).catch(() => {
                this.$message.info('取消了当前的操作行为！')
            });
        },
        shouldShowButton(row) {
            const currentTime = new Date().getTime();
            const sendTime = new Date(row.sendTime).getTime();
            return currentTime < sendTime && row.sendTimeType === 2 && row.status == '3';
        },
        reset(formName) {
            this.$refs[formName].resetFields()
            this.dateRange = []
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
            this.form.sendStartTime = this.dateRange === null ? null : this.dateRange[0]
            this.form.sendEndTime = this.dateRange === null ? null : this.dateRange[1]
            let data = {
                tzMessage: this.form,
                pageVo: {
                    pageSize: this.pageSize,
                    pageNumber: this.pageNum
                }
            }
            queryMessage(data).then(res => {
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
    margin-right: 10px;
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
    width: 75px;
    height: 30px;
    border-radius: 3px;
    font-size: 16px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: normal;
    text-align: CENTER;
    color: #ffffff;
    background: #E4352B;
    margin-bottom: 10px;
    line-height: 22px;
    cursor: pointer;

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
