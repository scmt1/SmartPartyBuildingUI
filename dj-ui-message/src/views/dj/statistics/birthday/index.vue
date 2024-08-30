<template>
    <div>
        <div style="background: white;padding: 25px 40px 35px">
            <div style="display:flex;margin-bottom: 20px;">
                <img src="../../../../assets/message/statistics.png">
                <div
                    style="font-size: 24px;font-family: Microsoft YaHei, Microsoft YaHei-Bold;font-weight: normal;text-align: LEFT;color: #E1351B;margin-left:14px">
                    生日短信详情统计
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
                <el-form-item prop="templateId" label="短信类型：">
                    <el-select v-model="form.templateId" clearable placeholder="请选择">
                        <el-option
                            v-for="item in birthdayTemplateList"
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
                    <el-table-column prop="deptName" label="所属部门" width="300" show-overflow-tooltip></el-table-column>
                    <el-table-column label="短信类型" width="180">
                        <template slot-scope="scope">
                            {{ convert(scope.row.templateId, birthdayTemplateList) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="手机号码" prop="phone" width="180"/>
                    <el-table-column label="短信内容" prop="sendContent" min-width="300" show-overflow-tooltip/>
<!--                    <el-table-column label="计费条数" prop="feeCount" width="100">-->
<!--                        <template slot-scope="scope">-->
<!--                            {{ scope.row.feeCount ? scope.row.feeCount : '&#45;&#45;' }}-->
<!--                        </template>-->
<!--                    </el-table-column>-->
                    <el-table-column label="状态上报时间" prop="postTime" width="180"/>
                    <el-table-column label="发送状态" prop="sendStatus" width="120">
                        <template slot-scope="scope">
                            {{ convert(scope.row.sendStatus, sendStatusList) }}
                        </template>
                    </el-table-column>
<!--                    <el-table-column label="备注" prop="bak" width="180" show-overflow-tooltip>-->
<!--                        <template slot-scope="scope">-->
<!--                            {{ scope.row.bak ? scope.row.bak : '&#45;&#45;' }}-->
<!--                        </template>-->
<!--                    </el-table-column>-->
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
import {getDictByType2} from "@/api/tDictData";
import {queryBirthdayMessageDetail} from "@/api/tzMessage";
import {mapGetters} from "vuex";
import {queryBirthdayTemplate} from "@/api/tzAutoMessage";

export default {
    name: 'index',
    data() {
        return {
            formLabelWidth: '0px',
            form: {
                messageId: null,
                columnId: '',
                content: '',
                sendStatus: '',
                deptId: '',
                sendType: '',
                templateId: '',
            },
            tableDataNow: [],
            pageSize: 10,
            pageNum: 0,
            total: 0,
            tableLoading: false,
            sendStatusList: [],
            birthdayTemplateList: [],
            templateIdsStr: ''
        }
    },
    created() {
        document.title = "生日短信统计";
    },
    async mounted() {
        await this.getDict('messageStatus')
        await this.getBirthdayTemplate()
        this.queryMessage()
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    methods: {
        getBirthdayTemplate() {
            return new Promise((resolve, reject) => {
                queryBirthdayTemplate().then(res => {
                    const data = res.data
                    if (data.code == '00000') {
                        for (let i = 0; i < data.data.length; i++) {
                            let val = {
                                label: data.data[i].missionName,
                                itemValue: data.data[i].id
                            }
                            this.birthdayTemplateList.push(val)
                            this.templateIdsStr += data.data[i].id +','
                        }
                        if (this.templateIdsStr.length > 0) {
                            this.templateIdsStr = this.templateIdsStr.substring(0, this.templateIdsStr.length -1)
                        }
                    }
                    resolve()
                })
            })
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
            this.form.deptId = this.deptInfo.id

            let data = {
                tzMessageDetail: this.form,
                pageVo: {
                    pageSize: this.pageSize,
                    pageNumber: this.pageNum
                },
                templateIdsStr: this.templateIdsStr
            }
            queryBirthdayMessageDetail(data).then(res => {
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
    display: inline-block;
    margin-right: 10px;
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
