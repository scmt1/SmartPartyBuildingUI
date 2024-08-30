<template>
    <el-dialog title="党费标准补交/删除配置" :visible.sync="dialogVisible" width="560px" @close="dialogVisible = false" class="repayModal" append-to-body>
        <el-tabs v-model="activeName">
            <el-tab-pane label="党费补交配置" name="first">
                <el-form ref="form" :model="form" :rules="formRules" label-width="120px" v-loading="saveLoading" v-if="activeName === 'first'">
                    <el-form-item prop="partyMemberId" label="党员姓名：">
                        <el-select style="width: 100%" v-model="form.partyMemberId" clearable @change="optionSelect($event)"
                                   filterable placeholder="请输入党员姓名并选择">
                            <el-option v-for="item in partyMemberOptions" :key="item.id"
                                       :label="item.realName+'：'+ item.idcard" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="startMonth" label="补交起始月份：">
                        <el-date-picker v-model="form.startMonth" type="month" placeholder="选择月" style="width: 100%"
                                        @change="onStartMonthChange" value-format="yyyy-MM">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="设置党费标准：" class="card">
                        <div style="display:flex;flex-wrap: wrap;">
                            <el-card v-for="(item,index) in repayList" :key="index"
                                     style="width: 120px;text-align: center; margin: 0 5px 5px;">
                                <div>{{ item.payMonth }}</div>
                                <div style="color: #3d86e7;cursor: pointer;" @click="showPayFeeStandardModal(item)"
                                     v-if="item.shouldPay == 0 ">未设置
                                </div>
                                <div v-else>{{ item.shouldPay }}</div>
                            </el-card>
                        </div>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="删除标准" name="second">
                <el-form ref="deleteForm" :model="deleteForm" :rules="deleteFormRules" label-width="138px" v-loading="saveLoading" v-if="activeName === 'second'">
                    <el-form-item prop="partyMemberId" label="党员姓名：">
                        <el-select style="width: 100%" v-model="deleteForm.partyMemberId" clearable @change="optionDeleteSelect($event)"
                                   filterable placeholder="请输入党员姓名并选择">
                            <el-option v-for="item in partyMemberOptions" :key="item.id"
                                       :label="item.realName+'：'+ item.idcard" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="startMonth" label="需删除的月份：">
                        <el-date-picker v-model="deleteForm.deleteMonth" type="month" placeholder="选择月" style="width: 100%" @change="onDeleteMonthChange" value-format="yyyy-MM">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="可删除的党费标准：" v-if="showDeleteItem">
                        <span style="color: red;">{{deleteForm.deleteMonth}}</span> 可删除
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="footer">
            <el-button size="small" @click="dialogVisible=false">关闭</el-button>
            <el-button size="small" type="primary" @click="submitForm()" v-loading="saveLoading">保存</el-button>
        </div>
        <payFeeStandardModal ref="payFeeStandardModalRef" @refresh="updateList"></payFeeStandardModal>
    </el-dialog>
</template>

<script>
import {getPartMemberListByDeptIds} from "@/api/jcxfPartyMember";
import {queryPartMemberDeleteData, queryPartMemberRePayData, updateRePayFeeDetail} from "../../../api/jcxfPayFeeDetail";
import payFeeStandardModal from "./payFeeStandardModal";

export default {
    name: "repayModal",
    components: {payFeeStandardModal},
    data() {
        return {
            dialogVisible: false,
            saveLoading: false,
            form: {
                partyMemberId: '',
                startMonth: ''
            },
            formRules: {
                partyMemberId: [
                    {required: true, message: '党员姓名不能为空', trigger: 'blur'},
                ],
                startMonth: [
                    {required: true, message: '补交起始月份不能为空', trigger: 'blur', pattern: /.+/},
                ],
            },
            partyMemberOptions: [],
            deptId: '',
            repayList: [],
            activeName: 'first',


            deleteForm: {
                partyMemberId: '',
                deleteMonth: ''
            },
            deleteFormRules: {
                partyMemberId: [
                    {required: true, message: '党员姓名不能为空', trigger: 'blur'},
                ],
                deleteMonth: [
                    {required: true, message: '删除月份不能为空', trigger: 'blur', pattern: /.+/},
                ],
            },
            showDeleteItem: false,
            deleteData: {},
        }
    },
    methods: {
        initOpen(deptId) {
            this.form = {}
            this.deleteForm = {}
            this.dialogVisible = true
            this.saveLoading = false
            this.deptId = deptId
            this.repayList = []
            this.deleteData = {}
            this.getPartMemberList()
        },
        submitForm() {
            this.saveLoading = true
            if(this.activeName === 'first') {
                this.$refs['form'].validate((valid) => {
                    if (!valid) {
                        this.saveLoading = false
                        return false
                    }
                    updateRePayFeeDetail({repayObj: {repayList: this.repayList}}).then(res => {
                        const result = res.data
                        if (result.code = '00000') {
                            this.$message.success("保存成功！")
                            this.dialogVisible = false
                            this.$emit('refresh')
                        }
                    })
                })
            }else {
                this.$refs['deleteForm'].validate((valid) => {
                    if (!valid) {
                        this.saveLoading = false
                        return false
                    }
                    let reqData = {
                        id: this.deleteData.id,
                        shouldPay: 0,
                        actuallyPay: 0,
                        paymentType: '',
                        paymentBase: 0,
                        paymentRatio: '',
                        paymentReason: '',
                        reasonOther: '',
                        confirmMaterial: ''
                    }
                    updateRePayFeeDetail({repayObj: {repayList: [reqData]}}).then(res => {
                        const result = res.data
                        if (result.code = '00000') {
                            this.$message.success("保存成功！")
                            this.dialogVisible = false
                            this.$emit('refresh')
                        }
                    })
                })
            }
        },
        optionSelect(event) {
            this.queryRepayData()
        },
        optionDeleteSelect(event) {
            this.queryDeleteMonthData();
        },
        getPartMemberList() {
            getPartMemberListByDeptIds(this.deptId + '').then(res => {
                const result = res.data
                if (result.code = '00000') {
                    this.partyMemberOptions = result.data
                }
            })
        },
        onStartMonthChange(e) {
            this.queryRepayData()
        },
        queryRepayData() {
            if (!this.form.partyMemberId || !this.form.startMonth) {
                return
            }
            this.repayList = []
            queryPartMemberRePayData({
                partyMemberId: String(this.form.partyMemberId),
                startMonth: this.form.startMonth
            }).then(res => {
                const result = res.data
                if (result.code = '00000') {
                    this.repayList = result.data
                }
            })
        },
        showPayFeeStandardModal(row) {
            this.$refs.payFeeStandardModalRef.repayOpen(row)
        },
        updateList(form) {
            let find = this.repayList.find(item => item.id === form.id);
            for (var key in form) {
                find[key] = form[key]
            }
        },
        onDeleteMonthChange(e) {
            this.queryDeleteMonthData();
        },
        queryDeleteMonthData() {
            if (!this.deleteForm.partyMemberId || !this.deleteForm.deleteMonth) {
                return
            }
            this.deleteData = {}
            queryPartMemberDeleteData({
                partyMemberId: String(this.deleteForm.partyMemberId),
                deleteMonth: this.deleteForm.deleteMonth
            }).then(res => {
                const result = res.data
                if (result.code = '00000') {
                    this.deleteData = result.data
                    this.showDeleteItem = true
                }
            })

        }
    }
}
</script>

<style lang="less">
.card {
    .el-form-item__content {
        line-height: normal !important;
    }

    .el-card__body {
        padding: 10px;

    }
}
</style>
