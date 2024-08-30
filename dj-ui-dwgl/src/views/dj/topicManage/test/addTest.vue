<template>
    <Modal v-model="show" :mask-closable="false" :closable="false" width="1200px">
        <div>
            <div class="modal-header">
                <h1 class="modal-title">{{ title }}</h1>
            </div>
            <div class="body">
                <el-form ref="form" :model="form" :rules="rules" :disabled="disabled"
                >
                    <el-form-item label="题型选择:" :label-width="formLabelWidth" class="input-row" prop="radio1">
                        <el-radio-group v-model="radio1" @input="changeType">
                            <el-radio label="1">单选题</el-radio>
                            <el-radio label="2">多选题</el-radio>
                            <el-radio label="3">判断题</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="所属题库：" :label-width="formLabelWidth" prop="testType">
                        <el-select v-model="form.questionId" size="small" placeholder="请选择所属题库">
                            <el-option v-for="(item,index) in questionList" :key="index" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="试题题目：" :label-width="formLabelWidth" prop="title" class="input-row">
                        <el-input v-model="form.title" placeholder="请输入简介（不超过500字符）" type="textarea" rows="5"
                                  show-word-limit size="small"
                                  class="input-row" maxlength="500"></el-input>
                    </el-form-item>
                    <div v-if="show1" style="padding-left: 100px;margin-bottom: 15px;">
                        <el-table
                            :data="item"
                            border
                            :cell-style="{'text-align':'center'}"
                            :header-cell-style="{'text-align':'center',background : '#ed8265',color:'#ffffff'}"
                            style="width: 100%"
                        >
                            <el-table-column
                                prop="topicName"
                                width="600px"
                                label="选项内容">
                                <template slot-scope="scope">
                                    <el-input v-model="item[scope.$index].content">
                                    </el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="item"
                                width=""
                                label="答案">
                                <template slot-scope="scope">
                                    <el-radio :label="order[scope.$index]" v-model="radio"
                                              @input="(e)=>handleAnswerClick(e,scope.$index)">
                                    </el-radio>
                                </template>
                            </el-table-column>

                            <el-table-column label="操作" fixed="right" width="360">
                                <template slot-scope="scope">
                                    <div style="display: flex;padding:0 100px">
                                        <div style="color:red;margin: auto;cursor: pointer;"
                                             @click="deleteItem(scope.$index)">
                                            删除选项
                                        </div>
                                        <div style="color:red;margin: auto;cursor: pointer;" @click="addItem">
                                            添加选项
                                        </div>
                                    </div>

                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div v-if="show2" style="padding-left: 100px;margin-bottom: 15px;">
                        <el-table
                            :data="items"
                            border
                            :cell-style="{'text-align':'center'}"
                            :header-cell-style="{'text-align':'center',background : '#ed8265',color:'#ffffff'}"
                            style="width: 100%"
                        >
                            <el-table-column
                                prop="content"
                                width="600px"
                                label="选项内容">
                                <template slot-scope="scope">
                                    <el-input v-model="items[scope.$index].content">
                                    </el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="item"
                                width=""
                                label="答案">
                                <template slot-scope="scope">
                                    <el-checkbox :label="orderItems[scope.$index].name"
                                                 v-model="items[scope.$index].checked"
                                                 @change="(e)=>selectAnswer(e,scope.$index)"></el-checkbox>
                                </template>
                            </el-table-column>

                            <el-table-column label="操作" fixed="right" width="360">
                                <template slot-scope="scope">
                                    <div style="display: flex;padding:0 100px">
                                        <div style="color:red;margin: auto;cursor: pointer;"
                                             @click="deleteItem2(scope.$index)">
                                            删除选项
                                        </div>
                                        <div style="color:red;margin: auto;cursor: pointer;" @click="addItem2">
                                            添加选项
                                        </div>
                                    </div>

                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div v-if="show3">
                        <el-form-item label="答案:" :label-width="formLabelWidth" class="input-row" prop="questionType">
                            <el-radio-group v-model="radio2">
                                <el-radio label="1">正确</el-radio>
                                <el-radio label="0">错误</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                    <el-form-item label="来源：" :label-width="formLabelWidth">
                        <el-input v-model="form.source" placeholder="来源" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="关键字：" :label-width="formLabelWidth">
                        <el-input v-model="form.keyWord" placeholder="关键字" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="考点：" :label-width="formLabelWidth">
                        <el-input v-model="form.point" placeholder="请输入考点（不超过500字符）" type="textarea" rows="5"
                                  show-word-limit size="small"
                                  maxlength="500"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close">关闭</el-button>
            <el-button size="small" type="primary" @click="submitForm('form')">保存</el-button>
        </div>
    </Modal>
</template>

<script>
import Vue from 'vue'
import {addTest, findTestById} from '@/api/tzTest.js'
import {findAllBankBy} from '@/api/tzQuestionBank.js'
import {mapGetters} from "vuex";

export default {
    name: "addTest",
    props: {
        value: {
            type: Boolean,
            default: false
        },
        modalTitle: {
            type: String
        },
        testId: {
            type: String
        }
    },
    data() {
        return {
            title: '',
            test: true,
            deptId: '',
            questionList: [],
            // itemIndex: 0,
            item: [{content: '', isCorrect: 0}, {content: '', isCorrect: 0}, {content: '', isCorrect: 0}],
            items: [{content: '', checked: false, isCorrect: 0}, {
                content: '',
                checked: false,
                isCorrect: 0
            }, {content: '', checked: false, isCorrect: 0}],
            show1: true,
            show2: false,
            show3: false,
            radio1: '1',
            radio2: '',
            order: ['A', 'B', 'C', 'D', 'E', 'F'],
            orderItems: [{name: 'A', checked: false}, {name: 'B', checked: false}, {name: 'C', checked: false}, {
                name: 'D',
                checked: false
            }, {name: 'E', checked: false}, {name: 'F', checked: false},],
            radio: '',
            selectLabelWidth: '90px',
            testType: [{value: 1, title: '单选'}, {value: 2, title: '多选'}, {value: 3, title: '判断'}],
            formLabelWidth: '100px',
            disabled: false,
            show: this.value,
            form: {},
            rules: {
                title: [
                    {required: true, message: '请输入试题题目', trigger: 'blur'},
                ],
                testType: [
                    {required: true, message: '请选择所属题库', trigger: 'blur'},
                ]
            }
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    created() {
        this.deptId = this.deptInfo.id.toString()

        this.$nextTick(i => {
            this.findAllBankBy(this.deptId)
        })
    },
    methods: {
        findTestById() {
            findTestById({testId: this.testId}).then(res => {
                if (res.data.code == '00000') {
                    let test = res.data.data.test
                    let testDetails = res.data.data.testDetails
                    this.radio1 = test.testType
                    this.form = test
                    if (this.radio1 == '1') {
                        this.show1 = true
                        this.show2 = false
                        this.show3 = false
                        this.radio = this.form.answer
                        this.item = testDetails

                        // debugger
                    } else if (this.radio1 == '2') {
                        this.show1 = false
                        this.show2 = true
                        this.show3 = false
                        this.items = testDetails
                        // this.items = [{content: '', checked: true, isCorrect: 0}, {content: '', checked: false, isCorrect: 0}, {content: '', checked: false, isCorrect: 0}]
                        for (let i = 0; i < this.items.length; i++) {
                            if (this.items[i].isCorrect == 0) {
                                this.orderItems[i].checked = false
                                // this.items[i].checked = false 这种方法设置有问题
                                Vue.set(this.items[i], 'checked', false)
                            } else {
                                this.orderItems[i].checked = true
                                Vue.set(this.items[i], 'checked', true)
                            }
                        }
                    } else {
                        this.show1 = false
                        this.show2 = false
                        this.show3 = true
                        this.radio2 = ''
                        if (testDetails[0].isCorrect == 0) {
                            this.radio2 = '0'
                        } else {
                            this.radio2 = '1'
                        }
                    }
                }
            })
        },
        findAllBankBy(deptId) {
            findAllBankBy({deptId: deptId}).then(res => {
                if (res.data.code = '00000') {
                    this.questionList = res.data.data
                }
            })
        },
        selectAnswer(e, index) {
            if (e) {
                this.orderItems[index].checked = true
            } else {
                this.orderItems[index].checked = false
            }
        },
        handleAnswerClick(event, index) {
            //让当前选择的项的isCorrect为1，即为正确答案，其他为0
            this.item.forEach((item, i) => {
                item.isCorrect = i === index ? 1 : 0
            })
            // this.itemIndex = index
            this.form.answer = event
        },
        changeType(e) {
            if (e == 1) {
                debugger
                this.show1 = true
                this.show2 = false
                this.show3 = false
                this.radio = '' //切换时让选项答案置为空，重新选
                this.item = [{content: '', isCorrect: 0}, {content: '', isCorrect: 0}, {content: '', isCorrect: 0}]
            } else if (e == 2) {
                this.show1 = false
                this.show2 = true
                this.show3 = false
                this.items = [{content: '', checked: false, isCorrect: 0}, {
                    content: '',
                    checked: false,
                    isCorrect: 0
                }, {
                    content: '',
                    checked: false,
                    isCorrect: 0
                }]
            } else if (e == 3) {
                this.show1 = false
                this.show2 = false
                this.show3 = true
                this.radio2 = ''
            }
        },
        deleteItem(index) {
            if (this.item && (this.item.length <= 2)) {
                this.$message.info("选项不能少于2个")
                return false
            }
            if (this.item[index].isCorrect == 1) {
                this.radio = ''
            }
            this.item.splice(index, 1)
        },
        addItem() {
            if (this.item && (this.item.length >= 6)) {
                this.$message.info("选项不能超过6个")
                return false
            }

            this.item.push(
                {content: '', isCorrect: 0}
            )
        },
        addItem2() {
            if (this.items && (this.items.length >= 6)) {
                this.$message.info("选项不能超过6个")
                return false
            }

            this.items.push(
                {content: '', checked: false, isCorrect: 0}
            )
        },
        deleteItem2(index) {
            if (this.items && (this.items.length <= 2)) {
                this.$message.info("选项不能少于2个")
                return false
            }
            this.items.splice(index, 1)
        },
        submitForm() {
            let deptId = this.deptInfo.id
            this.form.deptId = deptId
            let that = this
            let data = {test: {}, testDetail: {}}
            this.form.testType = this.radio1
            //如果是单选
            if (this.radio1 == '1') {
                // 判断选项是否为空
                if (this.radio == '') {
                    this.$message({
                        message: '请选择一个正确答案',
                        type: 'error',
                        //duration: 1000
                    })
                    return false
                }
                for (let i = 0; i < this.item.length; i++) {
                    if (!this.item[i].content) {
                        this.$message({
                            message: '选项内容不能为空',
                            type: 'error',
                            //duration: 1000
                        })
                        return false  // 终止整个方法的运行
                    }
                }
                // this.item[this.itemIndex].isCorrect = 1  // 选定正确答案
                data.testDetail = this.item
                data.test = this.form
            } else if (this.radio1 == '2') {
                for (let i = 0; i < this.items.length; i++) {
                    if (!this.items[i].content) {
                        this.$message({
                            message: '选项内容不能为空',
                            type: 'error',
                            //duration: 1000
                        })
                        return false  // 终止整个方法的运行
                    }
                }
                if (this.items.every(item => !item.checked)) {
                    this.$message({
                        message: '请至少选择一个正确答案',
                        type: 'error',
                        //duration: 1000
                    })
                    return false
                }
                // 设置多选的正确答案
                this.items.forEach(i => {
                    if (i.checked) {
                        i.isCorrect = 1
                    }
                })
                //根据checked判断改题是否被选中，选中的题把它的选项赋值给this.form.answer
                this.form.answer = ''
                this.orderItems.forEach(i => {
                    if (i.checked) {
                        if (!this.form.answer) {
                            this.form.answer = i.name
                        } else {
                            this.form.answer = this.form.answer + ',' + i.name
                        }
                    }
                })
                data.testDetail = this.items
                data.test = this.form
            } else {
                this.form.answer = ''
                if (!this.radio2) {
                    this.$message({
                        message: '请判断该题对错',
                        type: 'error',
                        //duration: 1000
                    })
                    return false
                }
                let tmp = {}
                if (this.radio2 == '1') {
                    tmp = {content: this.form.content, isCorrect: 1}
                } else {
                    tmp = {content: this.form.content, isCorrect: 0}
                }
                this.form.answer = this.radio2
                data.testDetail = [tmp]
                data.test = this.form
            }

            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    return
                }
                addTest(data).then(res => {
                    if (res.data.code = '00000') {
                        this.$message({
                            message: '保存成功',
                            type: 'success',
                            //duration: 1000
                        })
                    } else {
                        this.$message({
                            message: '保存失败',
                            type: 'error',
                            //duration: 1000
                        })
                    }
                    that.close()
                }).catch((e) => {

                })
            })
        },
        reset() {

            this.show1 = true
            this.show2 = false
            this.show3 = false
            this.item = [{content: '', isCorrect: 0}, {content: '', isCorrect: 0}, {content: '', isCorrect: 0}]
            this.items = [{content: '', checked: false, isCorrect: 0}, {
                content: '',
                checked: false,
                isCorrect: 0
            }, {content: '', checked: false, isCorrect: 0}]
            this.radio1 = '1'
            this.radio2 = ''
            this.radio = ''
            this.orderItems = [{name: 'A', checked: false}, {name: 'B', checked: false}, {
                name: 'C',
                checked: false
            }, {name: 'D', checked: false}, {name: 'E', checked: false}, {name: 'F', checked: false}]
            this.disabled = false
            this.title = ''
            this.form = {}
        },
        close() {
            this.reset()
            this.show = false
            this.$emit('input', false)
            this.$emit('close')
        },
    },
    watch: {
        value(val) {
            if (val) {
                this.show = val
                this.title = this.modalTitle
                if (this.modalTitle === '新增') {

                } else {
                    this.$nextTick(i => {
                        this.findTestById()
                    })
                }
                if (this.modalTitle === '详情') {
                    this.disabled = true
                }
            }
        }
    }
}
</script>

<style scoped lang="less">
.modal-header {
    text-align: center;
}
</style>
