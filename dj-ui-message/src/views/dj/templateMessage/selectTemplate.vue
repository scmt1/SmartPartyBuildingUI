<template>
    <el-dialog :title="title" :visible.sync="show" width="1200px" @close="close()" top="5vh">
        <div class="modal-content">
            <div class="body">
                <el-table
                        v-loading="tableLoading"
                        :data="tableDataNow"
                        :cell-style="{'text-align':'center'}"
                        :header-cell-style="{'text-align':'center',background : '#f8f8f9'}"
                        border
                        tooltip-effect="dark"
                        style="width: 100%">
                    <el-table-column prop="temName" width="250" label="模板名称" show-overflow-tooltip/>
                    <el-table-column label="模板内容" prop="temContent" show-overflow-tooltip></el-table-column>
                    <el-table-column label="字数" prop="temContent" width="150">
                        <template slot-scope="scope">
                            {{ fontCount(scope.row.temContent) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="remark" width="180" show-overflow-tooltip/>
                    <el-table-column width="180" label="操作">
                        <template slot-scope="scope">
                            <span style="color: #4ca4ff; cursor: pointer;" @click="selectRow(scope.row)">选择</span>
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
        <!--   <Modal v-model="modalShow" :mask-closable="false" :closable="false" width="700px"  footer-hide closable  @on-cancel="closeModal">
             <div class="modal-header" style="text-align: center;font-size: 20px">
               <h4 class="modal-title">添加模板</h4>
             </div>
             <div style="width: 60%;margin: auto;margin-top:10px">
             <el-form ref="form" :model="form" :rules="rules" >
               <el-form-item :label="'模板名称:'" prop="name" :label-width="labelWidth">
                 <el-input v-model="form.name" size="small" style="width:300px"></el-input>
               </el-form-item>
               <el-form-item label="选择签名:" prop="sign" :label-width="labelWidth">
                 <el-select v-model="form.sign" placeholder="请选择" style="width:300px">
                   <el-option v-for="item in sign" :key="item.id" :label="item.name" :value="item.name"/>
                 </el-select>
               </el-form-item>
               <el-form-item :label="'内容:'" prop="name" :label-width="labelWidth">
                 <el-input v-model="form.content" size="small" type="textarea" style="width:300px"></el-input>
               </el-form-item>
             </el-form>
               <div class="button">
                 <div class="button-font" @click="save">保存</div>
               </div>
             </div>
           </Modal>-->
    </el-dialog>
</template>

<script>
import {getMessageAutoPageByAdmin} from "@/api/tzAutoMessage";
import {getDictByType2} from "@/api/tDictData";

export default {
    name: 'SelectTemplate',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        // eslint-disable-next-line vue/require-default-prop
        modalTitle: {
            type: String
        }
    },
    data() {
        return {
            templateTypeList: [],
            sign: [{name: '【酒城机关党建】', id: 1}, {name: '【泸州青年人才公寓】', id: 2}],
            form: {},
            labelWidth: '100px',
            rules: {
                /* title: [
                    {required: true, message: '请输入标题', trigger: 'blur'}
                  ]*/
            },
            modalShow: false,
            show: this.value,
            pageSize: 10,
            pageNum: 1,
            total: 0,
            title: '',
            tableDataNow: [],
            tableLoading: false
        }
    },
    watch: {
        value(val) {
            if (val) {
                this.show = val
                this.title = this.modalTitle
                this.getDict('templateType')
            }
        }
    },
    methods: {
        //计算字数
        fontCount(content) {
            let count = 0;
            if (content && content != '') {
                count = content.replace(/<span[^>]*>[^<]*<\/span>/gi, '').length
            }
            return count
        },
        getDict(type) {
            getDictByType2(type).then((res) => {
                let data = res.data
                if (type === 'templateType') {
                    this.templateTypeList = data
                } else if (type === 'meetingType') {
                    this.meetingTypeList = data
                }
                this.queryMessageTemplate()
            })
        },
        convertFiled(value, dic) {
            for (let i = 0; i < dic.length; i++) {
                if (value == dic[i].itemValue) {
                    return dic[i].label
                }
            }
            return '--'
        },
        queryMessageTemplate() {
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
        },

        selectRow(row) {
            this.$emit('selectRow', row)
            this.close()
        },
        closeModal() {
            this.modalShow = false
        },
        close() {
            this.show = false
            this.$emit('close')
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.queryMessageTemplate()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.queryMessageTemplate()
        }
    }
}
</script>

<style lang="scss" scoped>
.button {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 147px;
    height: 40px;
    background: #01a7f0;
    border-radius: 3px;
    font-size: 16px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: normal;
    text-align: CENTER;
    color: #ffffff;
    line-height: 22px;
    margin-top: 28px;
    margin-left: 151px;

    .button-font {
        font-size: 16px;
        font-family: Microsoft YaHei, Microsoft YaHei-Bold;
        font-weight: normal;
        text-align: CENTER;
        color: #ffffff;
        line-height: 22px;
    }
}

.body {
    margin-top: 10px;
}

.modal-content {
    //margin-top: -28px;
    width: 100%;

    .modal-header {
        padding: 15px 10px;
        text-align: center;

        .modal-title {
            font-size: 26px;
        }
    }
}
</style>
