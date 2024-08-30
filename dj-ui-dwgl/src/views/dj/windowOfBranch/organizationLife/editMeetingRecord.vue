<template>
    <Modal v-model="recordShow" :title="label.title" :mask-closable="false" :closable="false" width="700px" @on-visible-change="visibleChange">
<!--        <div>-->
<!--            <el-input v-model="lifeInfo.situationRecord" :placeholder="'请输入'+ label.title + '(最多1000字)'"-->
<!--              rows="7"-->
<!--              type="textarea"-->
<!--              maxlength="1000"-->
<!--              show-word-limit size="mini"-->
<!--              class="input-row"></el-input>-->
<!--        </div>-->
        <tiny-mce
            v-model="lifeInfo.situationRecord"
            ref="content"
            style="width: 95%"
        ></tiny-mce>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close">关闭</el-button>
            <el-button size="small" type="primary" @click="update('form')">保存</el-button>
        </div>
    </Modal>
</template>
<script>
import {getTzOrganizationLife, updateTzOrganizationLife, updateTzOrganizationLifeRecord} from "@/api/jcxfOrganizationLife";
import TinyMce from '@/components/tiny-mce'
export default {
    components:{
        TinyMce
    },
    name: "editMeetingRecord",
    props: {
        show: {
            type: Boolean,
            default: false
        },
        deptId: {
            required: true,
            default: null
        },
        id: {
            required: true,
            default: null
        }
    },
    watch: {
        show() {
            this.recordShow = this.show
            if (this.show) {
                this.getLife()
            }
        }
    },
    data() {
        return {
            recordShow: false,
            lifeInfo: {},
            label: {
                title: '',
            },
            tinymceFlag:1
        }
    },
    methods: {
        getLife() {
            getTzOrganizationLife(this.deptId, this.id).then((res) => {
                if (res.data.code == '00000') {
                    this.lifeInfo = res.data.data.main
                    if (this.lifeInfo.meetingType == '3') {
                        this.label.title = '备注'
                    } else {
                        this.label.title = '会议记录'
                    }
                }
            })
        },
        update() {
            let data = {
                id: this.id,
                situationRecord: this.lifeInfo.situationRecord
            }
            updateTzOrganizationLifeRecord({data: data}).then(res => {
                if (res.data.code == '00000') {
                    this.$message.success('保存成功')
                    this.visibleChange()
                } else {
                    this.$message.error('保存失败')
                }
            })
        },
        close(){
          this.visibleChange()
        },
        visibleChange(event) {
            if (!event) {
                this.$emit('close')
            }
        }
    }
}
</script>

<style scoped>

</style>
