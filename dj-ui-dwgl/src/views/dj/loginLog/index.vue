<template>
    <div style="padding: 15px; background: white;">
        <div class="flex-box">
            <div class="search-div">
                姓名：
                <el-input clearable v-model="search.realName" placeholder="请输入姓名" size="small"
                          style="width: 200px;"></el-input>
            </div>
            <div class="search-div">
                电话：
                <el-input clearable v-model="search.phone" placeholder="请输入电话" size="small"
                          style="width: 200px;"></el-input>
            </div>
            <div class="search-div">
                身份证号：
                <el-input clearable v-model="search.idCard" placeholder="请输身份证号" size="small"
                          style="width: 200px;"></el-input>
            </div>
            <div class="search-div">
                时间范围：
                <el-date-picker
                    size="small"
                    v-model="search.startTime"
                    type="date"
                    placeholder="开始时间">
                </el-date-picker>
                &nbsp;&nbsp;至&nbsp;&nbsp;
                <el-date-picker
                    size="small"
                    v-model="search.endTime"
                    type="date"
                    placeholder="结束时间">
                </el-date-picker>
            </div>
<!--            <div class="search-div">
                类型：
                <el-select size="small" clearable v-model="search.type" placeholder="请选择" class="input-row">
                    <el-option v-for="item in typeList" :key="item.itemValue" :label="item.label"
                               :value="item.itemValue"></el-option>
                </el-select>
            </div>-->

            <el-button size="small" @click="reset()" icon="el-icon-refresh-left" style="background: #ffffff;color: rgba(228, 53, 43, 1);border: 1px solid rgba(228, 53, 43, 1);">重置</el-button>

            <el-button size="small" icon="el-icon-search" style="background:  rgba(228, 53, 43, 1);;color:#ffffff"
                       @click="searchPage">搜索
            </el-button>
        </div>

        <div>
            <el-table
                v-loading="dataListLoading"
                ref="multipleTable"
                :data="tableDataNow"
                border
                :cell-style="{'text-align':'center'}"
                :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                tooltip-effect="dark"
                style="width: 100%">
                <el-table-column prop="realName" label="姓名"></el-table-column>
                <el-table-column prop="phone" label="电话"></el-table-column>
                <el-table-column prop="idCard" label="身份证"></el-table-column>
                <el-table-column prop="type" label="类型" width="180">
                    <template slot-scope="scope">
                        {{ findLabelByValue(scope.row.type, typeList) }}
                    </template>
                </el-table-column>
                <el-table-column prop="result" label="结果" width="100">
                    <template slot-scope="scope">
                        {{ findLabelByValue(scope.row.result, resultList) }}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="时间" width="200"></el-table-column>
            </el-table>
        </div>

        <div style="margin: 10px;">
            <el-pagination
                v-if="tableDataNow!=null&&tableDataNow.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNumber"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>

    </div>
</template>

<script>
import {queryLoginLogByPage} from "@/api/tzLoginLog";
export default {
    name: "index",
    data() {
        return {
            search: {
                realName: '',
                phone: '',
                result: '',
                type: '',
                startTime: null,
                endTime: null,
                idCard: ''
            },
            typeList: [
                /*{itemValue: '1', label: '密码登录'},
                {itemValue: '2', label: '短信验证码登录'},*/
                {itemValue: '3', label: '统一认证登录'}
            ],
            resultList: [
                {itemValue: '1', label: '成功'},
                {itemValue: '2', label: '失败'},
            ],
            dataListLoading: false,
            tableDataNow: [],
            pageNumber: 1,
            pageSize: 10,
            total: 0,
        }
    },
    mounted() {
        this.getPage()
    },
    methods: {
        reset() {
            this.search.realName = ''
            this.search.phone = ''
            this.search.result = ''
            this.search.type = ''
            this.search.startTime = null
            this.search.endTime = null
            this.search.idCard = ''
        },
        searchPage() {
            if (this.search.startTime == null && this.search.endTime != null) {
                this.$message.info('请选择开始时间')
                return
            }
            if (this.search.startTime != null && this.search.endTime == null) {
                this.$message.info('请选择结束时间')
                return
            }
            if (this.search.startTime != null && this.search.endTime != null) {
                if (this.search.startTime.getTime() > this.search.endTime.getTime()) {
                    this.$message.info('开始时间应小于结束时间')
                    return
                }
            }
            this.pageNumber = 1
            this.getPage()
        },
        getPage() {
            this.dataListLoading = true

            let data = {
                tzLoginLog: {
                    realName: this.search.realName,
                    startTime: this.search.startTime,
                    endTime: this.search.endTime,
                    idCard: this.search.idCard,
                    phone: this.search.phone,
                    // type: this.search.type
                },
                pageVo: {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize
                },
                startTime: this.search.startTime,
                endTime: this.search.endTime,
            }
            queryLoginLogByPage({data: data}).then(res => {
                this.dataListLoading = false
                const data = res.data
                if (data.code == '00000') {
                    this.tableDataNow = data.data.records
                    this.total = data.data.total
                }
            })
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getPage()
        },
        handleCurrentChange(val) {
            this.pageNumber = val
            this.getPage()
        },
        findLabelByValue(value, dic) {
            for (let i = 0; i < dic.length; i++) {
                if (value == dic[i].itemValue) {
                    return dic[i].label
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
.search-div {
    display: inline-block;
    padding: 0 10px 10px 0;
}
</style>
