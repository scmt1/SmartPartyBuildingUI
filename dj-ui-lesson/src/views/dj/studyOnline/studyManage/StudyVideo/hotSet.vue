<template>
    <Modal v-model="hotSetShow" :mask-closable="false" :closable="false" width="400px">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">{{ title }}</h4>
            </div>
        </div>
        <el-form ref="form" :model="form" :rules="rules">
            <el-form-item label="是否置顶:" :label-width="formLabelWidth" class="input-row" prop="top">
                <el-switch v-model="form.top" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item label="置顶顺序:" :label-width="formLabelWidth" class="input-row" prop="top">
                <el-input v-model="form.topSort" min="0" :step="1" placeholder="请输入顺序" size="small" class="input-row" type="number"></el-input>
            </el-form-item>
            <el-form-item label="是否首页展示:" :label-width="formLabelWidth" class="input-row" prop="top">
                <el-switch v-model="form.top" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item label="首页展示顺序:" :label-width="formLabelWidth" class="input-row" prop="top">
                <el-input v-model="form.topSort" min="0" :step="1" placeholder="请输入顺序" size="small" class="input-row" type="number"></el-input>
            </el-form-item>
        </el-form>
    </Modal>
</template>

<script>
import hotSet from "@/views/dj/studyOnline/studyManage/StudyVideo/hotSet.vue";

export default {
    name: "hotSet",
    props: {
        show: {
            type: Boolean,
            required: true
        },
        id: {
            required: true
        },
        title: {
            required: true
        }
    },
    data() {
        return {
            hotSetShow: false,
            form: {
                id: '',
                top: false,
                topSort: '',
                showHome: false,
                showHomeSort: ''
            },
            formLabelWidth: '90px',
            rules: {

            }
        }
    },
    watch: {
        show(val) {
            this.hotSetShow = val
        }
    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
.modal-content {
    //margin-top: -28px;
    width: 100%;

    .modal-header {
        padding: 15px 10px;
        text-align: center;

        .modal-title {
            font-size: 24px;
        }
    }

    .body {
        padding: 20px 30px 30px 30px;
        background: #f8fafb;
        width: auto;
    }
}
@import url("//unpkg.com/element-ui@2.15.7/lib/theme-chalk/index.css");

</style>
