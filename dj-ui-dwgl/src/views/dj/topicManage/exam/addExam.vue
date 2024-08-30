<template>
    <el-dialog :visible.sync="show" :title="title" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false" top="30px" :mask-closable="false" :closable="false" width="1100px">
        <div class="modal-content" @click="OptionCardClose">
            <div class="body">
                <el-form ref="form" :model="form" :rules="rules" :disabled="disabled">
                    <div class="row">
                        <div class="col-sm-6">
                            <el-form-item label="考试名称：" :label-width="formLabelWidth" class="input-row" prop="name">
                                <el-input v-model="form.name" placeholder="请输入投票名称(不超过30字)" maxlength="30" size="small" class="input-row"></el-input>
                            </el-form-item>
                          <!--  <el-form-item label="投票时间：" :label-width="formLabelWidth" class="input-row" prop="daterange">
                                <el-date-picker
                                    size="small"
                                    v-model="form.daterange"
                                    type="datetimerange"
                                    placeholder="选择日期"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    @change="selectDate"
                                    class="input-row">
                                </el-date-picker>
                            </el-form-item>-->
                            <el-form-item label="考试封面：" :label-width="formLabelWidth">
                                <el-upload
                                        class="avatar-uploader"
                                        :action="'#'"
                                        :show-file-list="false"
                                        :headers="{Authorization: $cookie.get('Authorization_party_vp')}"
                                        :before-upload="beforeImageUpload">
                                    <img v-if="form.imagePath" :src="base+form.imagePath" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="考试时长：" :label-width="formLabelWidth" class="input-row" prop="startDept">
                                <el-input v-model="form.hours" placeholder=""  size="small" class="input-row" type="number" :disabled="true"></el-input>
                            </el-form-item>

                            <el-form-item label="关联题库：" :label-width="formLabelWidth" class="input-row" prop="isScore">
                                <el-select v-model="form.questionId" size="small" placeholder="请选择所属题库"  class="input-row" @change="changQuestion">
                                    <el-option v-for="(item,index) in questionList" :key="index" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="试卷总分：" :label-width="formLabelWidth" class="phone" prop="numberTimes">
                                <el-input-number v-model="form.scores" :min="1" :step="1" step-strictly type="number" size="small" class="input-row"></el-input-number>
                            </el-form-item>
                            <el-form-item label="及格分数：" :label-width="formLabelWidth" class="phone" prop="numberTimes">
                                <el-input-number v-model="form.passScores" :min="1" :step="1" step-strictly type="number" size="small" class="input-row"></el-input-number>
                            </el-form-item>
                            <el-form-item label="及格积分：" :label-width="formLabelWidth" class="phone" prop="numberTimes">
                                <el-input-number v-model="form.passIntegrate" :min="1" :step="1" step-strictly type="number" size="small" class="input-row"></el-input-number>
                            </el-form-item>
                            <el-form-item label="满分积分：" :label-width="formLabelWidth" class="phone" prop="numberTimes">
                                <el-input-number v-model="form.allIntegrate" :min="1" :step="1" step-strictly type="number" size="small" class="input-row"></el-input-number>
                            </el-form-item>
                        </div>
                        <div class="col-sm-6">
                            <div style="text-align: left;">
                                <div>请选择可参加考试的部门：</div>
                                <div>
                                    <el-select style="width: 100%;" v-model="input" clearable @change="optionSelect($event)" filterable :filter-method="filterHandler" placeholder="请输入机构名称搜索">
                                        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item"></el-option>
                                    </el-select>
                                </div>
                                <div class="tree" style="overflow: auto; margin-top: 10px; height: 530px; width: 100%;">
                                    <el-tree
                                        :data="dataList"
                                         show-checkbox
                                         @node-contextmenu="floderOption"
                                         :load="treeLoadNode"
                                         :filter-node-method="filterNode"
                                         lazy
                                         v-loading.fullscreen.lock="dataListLoading"
                                         :props="props"
                                         ref="tree"
                                         node-key="id"
                                         highlight-current
                                         :check-strictly="true"
                                         @node-click="selectId"
                                         @check="handleCheckChange"
                                         :default-expanded-keys="defaultExpandedKeys"
                                         :default-checked-keys="defaultCheckedKeys"
                                         :expand-on-click-node="false">
                                        <span class="custom-tree-node" slot-scope="{ node, data }">
                                            <i class="el-icon-folder" style="color: #DFBA49; margin-right: 5px;"></i>
                                            <span>{{ node.label }}</span>
                                        </span>
                                    </el-tree>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                            <el-tab-pane label="单选题" name="first">
                                <div style="margin-bottom: 15px;">
                                    <el-table
                                            :data="item"
                                            border
                                            :cell-style="{'text-align':'center'}"
                                            :header-cell-style="{'text-align':'center',background : '#ed8265',color:'#ffffff'}"
                                            style="width: 100%"
                                    >
                                        <el-table-column
                                                type="selection"
                                                label="">
                                        </el-table-column>
                                        <el-table-column
                                                prop="id"
                                                width="100px"
                                                label="试题编号">
                                        </el-table-column>
                                        <el-table-column
                                                prop="title"
                                                width=""
                                                label="试题名称">
                                        </el-table-column>
                                        <el-table-column
                                                prop="testType"
                                                width="110px"
                                                label="试题类型">
                                            <template slot-scope="scope">
                                                {{convertTestType(scope.row.testType)}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                                prop="name"
                                                width="160px"
                                                label="试题分数(默认分数5)">
                                            <template slot-scope="scope">
                                                <el-input v-model="item[scope.$index].score" type="number" :min="1" :step="1">
                                                </el-input>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="多选题" name="second">
                                <div style="margin-bottom: 15px;">
                                    <el-table
                                            :data="items"
                                            border
                                            :cell-style="{'text-align':'center'}"
                                            :header-cell-style="{'text-align':'center',background : '#ed8265',color:'#ffffff'}"
                                            style="width: 100%"
                                    >
                                        <el-table-column
                                                type="selection"
                                                label="">
                                        </el-table-column>
                                        <el-table-column
                                                prop="id"
                                                width="100px"
                                                label="试题编号">
                                        </el-table-column>
                                        <el-table-column
                                                prop="title"
                                                width=""
                                                label="试题名称">
                                        </el-table-column>
                                        <el-table-column
                                                prop="testType"
                                                width="110px"
                                                label="试题类型">
                                            <template slot-scope="scope">
                                                {{convertTestType(scope.row.testType)}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                                prop="name"
                                                width="160px"
                                                label="试题分数(默认分数5)"
                                                :header-render="renderHeader"
                                        ></el-table-column>
                                        <el-table-column
                                                prop="name"
                                                width="160px"
                                                label="试题分数(默认分数5)">
                                            <template slot-scope="scope">
                                                <el-input v-model="item[scope.$index].score" type="number" :min="1" :step="1">
                                                </el-input>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="判断题" name="third">
                                <div style="margin-bottom: 15px;">
                                    <el-table
                                            :data="judge"
                                            border
                                            :cell-style="{'text-align':'center'}"
                                            :header-cell-style="{'text-align':'center',background : '#ed8265',color:'#ffffff'}"
                                            style="width: 100%"
                                    >
                                        <el-table-column
                                                type="selection"
                                                label="">
                                        </el-table-column>
                                        <el-table-column
                                                prop="id"
                                                width="100px"
                                                label="试题编号">
                                        </el-table-column>
                                        <el-table-column
                                                prop="title"
                                                width=""
                                                label="试题名称">
                                        </el-table-column>
                                        <el-table-column
                                                prop="testType"
                                                width="110px"
                                                label="试题类型">
                                            <template slot-scope="scope">
                                                {{convertTestType(scope.row.testType)}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                                prop="testType"
                                                width="200px"
                                                label="试题分数(默认分数)分">
                                        <template slot="header" slot-scope="scope">
                                            试题分数(默认5分)
                                            <el-input
                                                    type="number"
                                                    style="width: 50px"
                                                    v-model="defaultScore"
                                                    size="mini"
                                                    placeholder="输入关键字搜索"/>
                                        </template>
                                        </el-table-column>
                                      <!--  <el-table-column
                                                prop="name"
                                                width="160px"
                                                label="试题分数(默认分数5)">
                                            <template slot-scope="scope">
                                                <el-input v-model="item[scope.$index].score" type="number" :min="1" :step="1">
                                                </el-input>
                                            </template>
                                        </el-table-column>-->
                                    </el-table>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-form>
            </div>
            <div :style="{'z-index': 9999, position: 'fixed',left: optionCardX + 'px',
				top: 80+optionCardY + 'px',  background: 'white','box-shadow': '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)','display':'flex','border-style':'solid','border-color':'white','border-radius':'10px'}"
                 v-show="optionCardShow" id="option-button-group">
                <el-button size="mini" @click="getParent" style="background: #af0000;color:white">本级
                </el-button>
                <el-button size="mini" style="margin-left: 0px;background: #af0000;color:white" @click="getChildren">下一级
                </el-button>
                <el-button size="mini" style="margin-left: 0px;background: #af0000;color:white" @click="getAllChildren">下级所有
                </el-button>
                <el-button size="mini" style="margin-left: 0px;background: #af0000;color:white" @click="cancelChildren">取消下级
                </el-button>
                <el-button size="mini" style="margin-left: 0px;background: #af0000;color:white" @click="cancelAllChildren">取消所有下级
                </el-button>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="close">关闭</el-button>
            <el-button size="small" type="primary" @click="submitForm('form')">保存</el-button>
        </span>

        <cropper ref="cropper" @cropperResult="uploadCropperImg"></cropper>
    </el-dialog>
</template>

<script>
    import {findTestByQuestionId} from '@/api/tzTest.js'
    import {findAllBankBy} from '@/api/tzQuestionBank.js'
import util from '@/libs/util'
import {uploadImages} from "@/api/attachFile";
import {addVote, updateVoteById} from "@/api/tzVote";
import {queryTzVoteById} from "@/api/tzVote";
import defaultHeader from "@/assets/default-header.png"
import {getChildrenDeptListByName, getTzSysDept, getTzSysDeptList} from "@/api/jcxfSysDept";
import _ from "lodash";
import cropper from "@/views/dj/components/cropper.vue";
    import {mapGetters} from "vuex";

export default {
    name: 'addVote',
    components: {
        cropper
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        modalTitle: {
            type: String
        },
        //父组件传来的id
        id1: {
            type: String
        },
        deptId: {
            type: String
        },
    },
    data() {
        return {
            defaultScore: 5,
            activeName:'first',
            defaultHeader: defaultHeader,
            base: util.nginxUrl,
            videoUrl: '',
            tmpData: {},
            nodeId: [],
            rightId: '',
            optionCardX: '',
            optionCardY: '',
            optionCardShow: false,
            optionData: [],
            node: null,
            tree: null,
            daterange: [],
            content: '',
            dataList: [],
            props: {
                id: 'id',
                label: 'name',
                children: 'children'
            },
            input: '',
            id: '',
            show: this.value,
            disabled: false,
            title: '',
            formLabelWidth: '110px',
            form: {
                name: '',
                hours: '',
                imgPath: '',
                sex: null,
                voteType: '',
                imagePath: '',
                cover: '',
                startDeptId: ''
            },
            isScoreList: [
                {title: '不记名', value: '0'},
                {title: '记名', value: '1'}
            ],
            voteTypeList: [
                {title: '知识问答', value: '1'},
                {title: '人物投票', value: '2'},
                {title: '问卷调查', value: '3'},
                {title: '视频投票', value: '4'}],
            voteResultList: [
                {title: '投票前可见', value: '1'},
                {title: '投票后可见', value: '2'},
                {title: '投票结束后可见', value: '3'},
                {title: '不可见', value: '4'}],
            rules: {
                name: [
                    {required: true, message: '此字段不能为空', trigger: 'blur'},
                ],
                startDept: [
                    {required: true, message: '此字段不能为空', trigger: 'blur'},
                ],
                daterange: [
                    {required: true, message: '此字段不能为空', trigger: 'blur'},
                ],
                endDate: [
                    {required: true, message: '此字段不能为空', trigger: 'blur'},
                ],
                isScore: [
                    {required: true, message: '此字段不能为空', trigger: 'blur'},
                ],
                numberTimes: [
                    {required: true, message: '此字段不能为空', trigger: 'blur'},
                    {
                        type: 'number',
                        message: '请输入正整数',
                        trigger: 'blur',
                        transform(value) {
                            if (value !== null && value !== '') {
                                if (String(value).trim() === '' || Number(value) <= 0) {
                                    return false
                                } else if (String(value).indexOf('.') !== -1 || String(value).indexOf('-') !== -1) {
                                    return false
                                } else {
                                    return Number(value)
                                }
                            } else {
                                return null
                            }
                        }
                    }
                ],
                voteResult: [
                    {required: true, message: '此字段不能为空', trigger: 'blur'},
                ],
                voteDescription: [
                    {required: true, message: '此字段不能为空', trigger: 'blur'},
                ]
            },
            defaultExpandedKeys: [],
            defaultCheckedKeys: [],
            dataListLoading: false,
            options: [],
            deptIdInit:'',
            questionList:[],
            item:[],//单选
            items:[],//多选
            judge:[],//判断
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    created() {
        this.deptIdInit = this.deptInfo.id.toString()
        this.$nextTick(i => {
            this.findAllBankBy(this.deptIdInit)
        })
    },
    methods: {
        renderHeader(h, { column }) {
            return h('div', [
                column.label,
                h('el-input', {
                    props: {
                        value: this.defaultScore,
                        size: 'small',
                        style: 'width: 60px;'
                    },
                    on: {
                        input: value => {
                            this.defaultScore = value
                        }
                    }
                })
            ])
        },
        convertTestType(type){
          if(type=='1'){
              return '单选题'
          }  else if(type=='2'){
              return '多选题'
          }else if(type=='3'){
              return '判断题'
          }
        },
        changQuestion(e){
            if(e){
             this.findTestByQuestionId(e.toString())
            }
        },
        findTestByQuestionId(questionId){
            findTestByQuestionId({questionId:questionId}).then(res=>{
                if(res.data.code=='00000'){
                    let data = res.data.data
                    data.forEach(i=>{
                        if(i.testType=='1'){
                            this.item.push(i)
                        }else if(i.testType=='2'){
                            this.items.push(i)
                        }else if(i.testType=='3'){
                            this.judge.push(i)
                        }
                    })
                }
            })
        },
        findAllBankBy(deptId) {
            findAllBankBy({deptId:deptId}).then(res => {
                if (res.data.code = '00000') {
                    this.questionList = res.data.data
                }
            })
        },
        handleClick(tab,event){

        },
        filterHandler(value, row, column) {
            this.input = value
            this.throttledMethod(this)
        },
        throttledMethod: _.throttle(_this => {
            _this.getDeptList()
        }, 1500),
        getDeptList() {
            if (this.input.length < 1) {
                this.options = []
                return
            }
            let data = {
                deptId: this.deptInfo.id + '',
                deptName: this.input + ''
            }
            getChildrenDeptListByName(data).then(res =>{
                const data = res.data
                if (data.code == '00000') {
                    this.options = data.data
                }
            })
        },
        optionSelect(event) {
            if (event == null || !event) {
                return
            }
            this.$nextTick(() =>{
                this.getTzSysDeptForExpanded('search',event.id, false)
                this.selectId(event)
            })
        },
        getTzSysDeptForExpanded(type, deptId, initTree) {
            getTzSysDept(deptId).then(res =>{
                const reslut = res.data
                if (reslut.code = '00000') {
                    let parentIds = reslut.data.parentIds.split(',')
                    for (let i = 0; i < parentIds.length; i++) {
                        const id = parentIds[i]
                        if (id.length > 0) {
                            this.defaultExpandedKeys.push(Number(id))
                        }
                    }
                    this.defaultExpandedKeys.push(Number(deptId))
                    if (type == 'init') {
                        this.defaultCheckedKeys.push(Number(deptId))
                    }
                    if (initTree) {
                        this.getDataList()
                    }
                }
            })
        },
        getDataList() {
            this.dataList = [];

            getTzSysDept(this.deptInfo.id+'').then(res =>{
                const reslut = res.data
                if (reslut.code = '00000') {
                    this.dataList = [reslut.data]
                    this.dataListLoading = false
                }
            }).finally((e) => {
                this.dataListLoading = false
            })
        },
        treeLoadNode(node, resolve){
            if(node.data.id){
                getTzSysDeptList(node.data.id+'').then(res => {
                    if (res.code == "000000" && res.data.length > 0) {
                        resolve(res.data)
                    }else{
                        resolve([])
                    }
                }).finally((e) => {
                })
            }
        },
        beforeImageUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
            const isLt5M = file.size / 1024 / 1024 < 5

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
            }
            if (!isLt5M) {
                this.$message.error('上传头像图片大小不能超过 5MB!')
            }

            this.$refs.cropper.init(file)

            /*let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                uploadImages({imgUrl: reader.result}).then(res => {
                    this.form.cover = res.data.data
                    this.form.imagePath = res.data.data
                })
            }*/
            return false
        },
        uploadCropperImg(file) {
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                uploadImages({imgUrl: reader.result}).then(res => {
                    this.form.cover = res.data.data
                    this.form.imagePath = res.data.data
                })
            }
        },
        newArr(oldData, newData) {
            //去重
            let arr1 = new Set(oldData) //原数组
            let arr2 = new Set(newData) //新数组
            let List = []
            //for of：循环数组的值
            for (let k of arr2) {
                //对比数组每一项，没有的就添加到空数组
                if (!arr1.has(k)) {
                    List.push(k)
                }
            }
            return List // 这里拿到了差值数据返回出去
        },
        // 取消下一级
        cancelChildren() {
            let tmpIds = []
            if (this.tmpData != null && this.tmpData != undefined) {
                if (this.tmpData.childNodes.length > 0) {
                    this.tmpData.childNodes.forEach(i => {
                        tmpIds.push(i.data.id)
                    })
                }
            }
            this.nodeId = this.newArr(tmpIds, this.nodeId)
            this.$refs.tree.setCheckedKeys(this.nodeId)
        },
        cancelAllChildren() {
            let tmpIds = []
            let tmpList = []
            tmpList = this.digui(this.tmpData, tmpList)
            tmpList.forEach(i => {
                tmpIds.push(i)
            })
            this.nodeId = this.newArr(tmpIds, this.nodeId)
            this.$refs.tree.setCheckedKeys(this.nodeId)
        },
        // 设置下一级节点
        getChildren() {
            let data = this.$refs.tree.getCheckedKeys()
            if (this.tmpData != null && this.tmpData != undefined) {
                if (this.tmpData.childNodes.length > 0) {
                    this.tmpData.childNodes.forEach(i => {
                        this.nodeId.push(i.data.id)
                    })
                }
            }
            this.nodeId = this.removalDuplicate(this.nodeId)
            this.$refs.tree.setCheckedKeys(this.nodeId)
        },
        getAllChildren() {
            let tmpList = []
            let tt = this.digui(this.tmpData, tmpList)
            tt.forEach(i => {
                this.nodeId.push(i)
            })
            this.nodeId = this.removalDuplicate(this.nodeId)
            this.$refs.tree.setCheckedKeys(this.nodeId)
        },
        digui(tmpData, tmpList) {
            if (tmpData != null && tmpData != undefined) {
                if (tmpData.childNodes != null && tmpData.childNodes.length > 0) {
                    tmpData.childNodes.forEach(i => {
                        tmpList.push(i.data.id)
                        this.digui(i, tmpList)
                    })
                }
            }
            return tmpList
        },
        // 设置本级节点
        getParent() {
            this.nodeId.push(this.rightId)
            this.nodeId = this.removalDuplicate(this.nodeId)
            this.$refs.tree.setCheckedKeys(this.nodeId)
        },
        // 点击其他区域隐藏按钮
        OptionCardClose(event) {
            let currentCli = document.getElementById('option-button-group')
            if (currentCli) {
                if (!currentCli.contains(event.target)) { //点击到了id为option-button-group以外的区域，就隐藏菜单
                    this.optionCardShow = false
                }
            }
        },

        // 右键触发的事件
        floderOption(e, data, n, t) {
            this.tmpData = n
            this.rightId = n.data.id

            this.nodeId = this.removalDuplicate(this.nodeId)
            this.optionCardShow = false
            this.optionCardX = e.x   // 让右键菜单出现在鼠标右键的位置
            this.optionCardY = e.y - 110
            this.optionData = data
            this.node = n // 将当前节点保存
            this.tree = t
            this.optionCardShow = true  // 展示右键菜单
        },
        // 去重操作
        removalDuplicate(dataList) {
            let result = []
            let tem = {}
            for (let i = 0; i < dataList.length; i++) {
                if (!tem[dataList[i]]) {
                    result.push(dataList[i])
                    tem[dataList[i]] = 1
                }
            }
            return result
        },
        selectDate(e) {
            this.form.startDate = e[0]
            this.form.endDate = e[1]
        },
        enter() {
            this.openShow = false
        },
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        selectId(event, data, node) {
            this.optionCardShow = false
            this.form.voteDeptIds = event.whereMap.deptId
        },
        handleCheckChange(data, checked) {
            this.nodeId = []
            checked.checkedKeys.forEach(i => {
                this.nodeId.push(i)
            })
            this.nodeId = this.removalDuplicate(this.nodeId)
            this.form.voteDeptIds = checked.checkedKeys
        },
        submitForm() {
            if (!this.form.imagePath || this.form.imagePath.length == 0) {
                this.$message.error('请上传封面图片')
                return false
            }

            this.form.voteDeptIds = this.nodeId
            if (this.form.voteDeptIds == null || this.form.voteDeptIds == undefined || this.form.voteDeptIds.length == 0) {
                this.$message.error('请至少选择一个可投票部门')
                return false
            }

            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    return false
                }
                this.saveFile()
            })
        },
        saveFile() {
            let data = {
                vote: this.form
            }
            this.form.startDeptId = this.deptId
            if (this.form.id && this.form.id !=null) {
                updateVoteById({data: data}).then(res => {
                    if (res.data.code = '00000') {
                        this.$message.success('保存成功')
                        this.close()
                    } else {
                        this.$message.error('保存失败')
                    }
                })
            } else {
                addVote({data: data}).then((res) => {
                    if (res.data.code = '00000') {
                        this.$message.success('保存成功')
                        this.close()
                    } else {
                        this.$message.error('保存失败')
                    }
                })
            }
        },
        close() {
            this.reset()
            this.$emit('close')
        },
        reset() {
            this.form = {
                name: '',
                hours: '',
                imgPath: '',
                sex: null,
                voteType: '',
                imagePath: '',
                startDeptId: ''
            }
            this.input = ''
            this.disabled = false
            this.title = ''
            this.optionCardShow = false
            this.tmpData = {}
            this.nodeId = []
            this.rightId = ''
        },
        closeModal() {
            this.$emit('close')
        },
        getDataById(id) {
            queryTzVoteById(id).then((res) => {
                if (res.data.code) {
                    this.form = res.data.data
                    this.form.daterange = [new Date(this.form.startDate), new Date(this.form.endDate)]

                    // 处理树结构
                    this.defaultCheckedKeys = []
                    this.defaultExpandedKeys = []
                    let flag = false
                    for (let i = 0; i < this.form.voteDeptIds.split(',').length; i++) {
                        this.nodeId.push(Number(this.form.voteDeptIds.split(',')[i]))
                        if (i == this.form.voteDeptIds.split(',').length - 1) {
                            flag = true
                        }
                        this.getTzSysDeptForExpanded('init', this.form.voteDeptIds.split(',')[i], flag)
                    }
                }
            })
        }
    },
    watch: {
        value(val) {
            this.show = val
            if (val) {
                this.form.startDept = this.deptInfo.name

                this.title = this.modalTitle

                this.defaultExpandedKeys = []
                this.defaultCheckedKeys = []
                this.nodeId = []
                if (this.modalTitle === '新增') {
                    this.form.numberTimes = 1
                    this.getDataList()
                } else if (this.modalTitle === '详情') {
                    this.disabled = true
                    this.id = this.id1
                    this.getDataById(this.id1)
                } else if (this.modalTitle === '编辑') {
                    this.disabled = false
                    this.id = this.id1
                    this.getDataById(this.id1)
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.el-tree {
    min-width: 100%;
    display: inline-block !important;
}
.avatar-uploader ::v-deep .el-upload {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader ::v-deep .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}

.modal-content .body .row .col-sm-6.phone {
    ::v-deep.el-form-item__error {
        color: #F56C6C;
        font-size: 12px;
        line-height: 0;
        padding-top: 4px;
        position: absolute;
        top: 100%;
        left: 0;
    }

}

.modal-content {
    width: 100%;

    .body {
        padding: 20px 30px 30px 30px;
        background: #f8fafb;
        width: auto;

        .row {
            display: flex;

            .col-sm-6 {
                width: 50%;
                padding: 0 15px;

                &:hover {
                    .demo-upload-list-cover {
                        display: block;
                    }
                }

                .demo-upload-list-cover {
                    display: none;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    width: 100%;
                    line-height: 60px;
                    background: rgba(0, 0, 0, .6);
                    text-align: center;

                    &:hover {
                        display: block;
                        background: rgba(0, 0, 0, .6);
                    }
                }

                .ivu-modal {
                    width: 660px !important;
                }

                .demo-upload-list {
                    display: inline-block;
                    width: 60px;
                    height: 60px;
                    text-align: center;
                    line-height: 60px;
                    border: 1px solid transparent;
                    border-radius: 4px;
                    overflow: hidden;
                    background: #fff;
                    position: relative;
                    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
                    margin-right: 4px;
                }

                .demo-upload-list img {
                    width: 100%;
                    height: 100%;
                }

                .demo-upload-list-cover {
                    display: none;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: rgba(0, 0, 0, .6);
                }

                .demo-upload-list:hover .demo-upload-list-cover {
                    display: block;
                }

                .demo-upload-list-cover i {
                    color: #fff;
                    font-size: 20px;
                    cursor: pointer;
                    margin: 0 2px;
                    margin-top: 30px;
                }

                .label {
                    ::v-deep.el-form-item__label {
                        line-height: 18px;
                    }
                }


                .el-form-item {
                    line-height: 20px;

                    .input-row {
                        width: 100%;
                    }
                    margin-bottom: 15px;
                }
            }
        }
    }

    .modal-footer {
        padding: 15px;
        text-align: right;
        border-top: 1px solid #e5e5e5;

        .btn-white {
            border-radius: 3px;
            letter-spacing: 1px;
            color: inherit;
            background: white;
            border: 1px solid #e7eaec;

            display: inline-block;
            padding: 6px 12px;
            margin-bottom: 0;
            font-size: 14px;
            font-weight: normal;
            line-height: 1.42857143;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            -ms-touch-action: manipulation;
            touch-action: manipulation;
            cursor: pointer;
        }

        .btn-blue {
            border-radius: 3px;
            letter-spacing: 1px;

            color: #FFFFFF;
            margin-left: 5px;
            display: inline-block;
            padding: 6px 12px;
            margin-bottom: 0;
            font-size: 14px;
            font-weight: normal;
            line-height: 1.42857143;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            -ms-touch-action: manipulation;
            touch-action: manipulation;
            cursor: pointer;
            background-color: #3d86e7 !important;
            border-color: #3d86e7 !important;
        }
    }
}
</style>
