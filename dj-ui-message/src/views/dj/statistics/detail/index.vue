<template>
    <div>
        <div style="background: white;padding: 10px 50px 50px;">
            <div style="display:flex;margin-top: 29px;margin-bottom: 20px;">
                <img src="../../../../assets/message/statistics.png">
                <div
                    style="font-size: 24px;font-family: Microsoft YaHei, Microsoft YaHei-Bold;font-weight: normal;text-align: LEFT;color: #E1351B;margin-left:14px">
                    发送详情统计
                </div>
            </div>
            <el-form ref="searchForm" :model="form" label-width="90px" inline size="medium" style="text-align: left;">
                <el-form-item prop="phone" label="手机号码：">
                    <el-input style="width: 230px;" maxlength="150" v-model="form.phone" placeholder="手机号码" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="sendStatus" label="发送状态：">
                    <el-select v-model="form.sendStatus" clearable placeholder="请选择">
                        <el-option class="input-row"
                                   v-for="item in sendStatusList"
                                   :key="item.itemValue"
                                   :label="item.label"
                                   :value="item.itemValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
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
                    <el-table-column label="手机号码" prop="phone" width="200"/>
                    <el-table-column label="短信内容" prop="sendContent" min-width="300"/>
                    <el-table-column label="计费条数" prop="feeCount" width="140"/>
                    <el-table-column label="状态上报时间" prop="postTime" width="200"/>
                    <el-table-column label="发送状态" prop="sendStatus">
                        <template slot-scope="scope">
                            {{ convert(scope.row.sendStatus, sendStatusList) }}
                            <template v-if="scope.row.sendStatus == '2' && scope.row.resultCode !=null && scope.row.resultCode.length > 0 && scope.row.resultCode !='200'">
                                <br>{errorCode: {{ scope.row.resultCode }}, errorMsg: {{ scope.row.resultMsg }}}
                            </template>
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
    </div>
</template>

<script>
import {queryMessageDetail} from "@/api/tzMessage";
import {getDictByType2} from "@/api/tDictData";

export default {
    name: 'Index',
    data() {
        return {
            formLabelWidth: '0px',
            form: {
                messageId: null,
                columnId: '',
                content: '',
                sendStatus: ''
            },
            sendTypes: [
                {id: 1, name: '自定义发送'}, {id: 2, name: '模板发送'}, {id: 3, name: '全部'}
            ],
            sendModes: [
                {id: 3, name: '全部'}, {id: 2, name: '立即发送'}, {id: 1, name: '定时发送'}
            ],
            tableDataNow: [{}],
            pageSize: 10,
            pageNum: 0,
            total: 0,
            tableLoading: false,
            sendStatusList: []
        }
    },
    created() {
        document.title = "发送详情统计";
    },
    async mounted() {
        await this.getDict('messageStatus')
        this.queryMessage()
    },
    methods: {
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
        reset(formName) {
            this.$refs[formName].resetFields()
        },
        convert(value, dic) {
            for (let i = 0; i < dic.length; i++) {
                if (dic[i].itemValue == value) {
                    return dic[i].label
                }
            }
            return '--'
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
                tzMessageDetail: this.form,
                pageVo: {
                    pageSize: this.pageSize,
                    pageNumber: this.pageNum
                }
            }
            queryMessageDetail(data).then(res => {
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
