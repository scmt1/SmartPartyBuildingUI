<template>
    <el-dialog title="详情" :visible.sync="dialogVisible" width="600px" >
        <el-form ref="form" :model="form" label-width="110px" style="text-align: left; padding: 0 20px 0 20px;" v-loading="loading">

            <p class="title">1.转移党员</p>
            <div class="content">
                <div class="label">姓名：</div>
                <div>{{ form.partyMember?.realName }}</div>
            </div>
            <div class="content">
                <div class="label">身份证号：</div>
                <div>{{ hideIdCardNumber(form.partyMember?.idcard) }}</div>
            </div>
            <div class="content">
                <div class="label">党员所属：</div>
                <div>{{ form.oldTzSysDept?.name }}</div>
            </div>

            <p class="title" style="margin-top: 10px;">2.目标支部</p>
            <div class="content">
                <div class="label">目标范围：</div>
                <div>
                    {{ getDirectLabelByValue(form.transferType, changeType) }}
                </div>
            </div>
            <div class="content" v-if="form.transferType == 1">
                <div class="label">目标支部：</div>
                <div>
                    {{ form.newTzSysDept.name }}
                </div>
            </div>

            <template v-if="form.transferType == 2">
                <div class="content">
                    <div class="label">转出区域：</div>
                    <div>
                        {{ form.areaName?.replaceAll(',','') }}
                    </div>
                </div>
                <div class="content">
                    <div class="label">转到部门：</div>
                    <div>
                        {{ form.inBranchName }}
                    </div>
                </div>
            </template>

            <p class="title" style="margin-top: 10px;">3.申请情况</p>
            <div class="content">
                <div class="label">状态：</div>
                <div>
                    {{ getDirectLabelByValue(form.acceptStatus, transferStatus) }}
                </div>
            </div>

            <div class="content">
                <div class="label">申请时间：</div>
                <div>
                    {{ form.transferTime }}
                </div>
            </div>

            <template v-if="form.acceptStatus != 0">
                <div class="content">
                    <div class="label">审核时间：</div>
                    <div>
                        {{ form.createDate }}
                    </div>
                </div>

                <div class="content">
                    <div class="label">留言：</div>
                    <div class="value">
                        {{ form.rejectReason && form.rejectReason.length > 0?form.rejectReason:'无' }}
                    </div>
                </div>
            </template>

        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="dialogVisible = false">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {getPartyMemberDeptTransferById} from "@/api/jcxfPartyMemberTransfer";
import {getDictByType2} from "@/api/tDictData";
import {getDictByCode} from "@/api/jcxfSysDictionary";

export default {
    name: "viewLog",
    data() {
        return {
            dialogVisible: false,
            form: {
                partyMember: {},
                oldTzSysDept: {},
                newTzSysDept: {}
            },
            transferStatus: [],
            changeType: [],
            loading: false
        }
    },
    methods: {
        async init(id) {
            this.form = {
                partyMember: {},
                oldTzSysDept: {},
                newTzSysDept: {}
            }
            this.loading = true
            await this.getDict('partyTransferAcceptStatus')
            await this.getDict('partyTransferType')
            this.dialogVisible = true
            this.getLogById(id)
        },
        getDict(type) {
            return new Promise((resolve, reject) => {
                getDictByCode(type).then(res => {
                    let data = res.data.data
                    if (type === 'partyTransferAcceptStatus') {
                        this.transferStatus = data
                    } else if (type === 'partyTransferType') {
                        this.changeType = data
                    }
                    resolve()
                })
            })
        },
        getLogById(id) {
            getPartyMemberDeptTransferById(id).then(res => {
                this.loading = false
                const result = res.data
                if (result.code == '00000') {
                    this.form = result.data
                } else {
                    this.$message.error(result.msg)
                }
            })
        },
        getDirectLabelByValue(value, direct) {
            for (let i = 0; i < direct.length; i++) {
                if (value == direct[i].itemValue) {
                    return direct[i].label
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
.title {
    font-weight: bold;
}
.content {
    display: flex;
    padding: 5px 15px;

    .label {
        text-align: right;
        width: 70px;
    }
    .value {
        flex: 1;
        word-break: normal;
    }
}
</style>
