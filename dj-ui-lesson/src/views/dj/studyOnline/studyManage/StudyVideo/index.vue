<template>
    <div style="padding: 15px; background: white;">
        <div style="margin-top: 10px;">
            <el-form ref="searchForm" :model="whereMap" label-width="90px" inline size="medium" style="text-align: left;">
                <el-form-item prop="title" label="标题：">
                    <el-input clearable v-model="whereMap.title" placeholder="请输入标题" size="small" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item prop="columnId" label="课程类型：">
                    <el-select size="small" clearable v-model="whereMap.columnId" placeholder="请选择" class="input-row">
                        <el-option-group v-for="group in columnList" :key="group.label" :label="group.label">
                            <el-option v-for="item in group.options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item prop="top" label="是否置顶：">
                    <el-select size="small" clearable v-model="whereMap.top" placeholder="请选择" style="width: 200px;">
                        <el-option  label="是" :value="1"></el-option>
                        <el-option  label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="showHome" label="首页展示：" v-if="drop">
                    <el-select size="small" clearable v-model="whereMap.showHome" placeholder="请选择" style="width: 200px;">
                        <el-option  label="是" :value="1"></el-option>
                        <el-option  label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="viewType" label="可见类型：" v-if="drop">
                    <el-select size="small" clearable v-model="whereMap.viewType" placeholder="请选择" style="width: 140px;">
                        <el-option v-for="(item, index) in viewTypeOption" :label="item.label" :value="item.itemValue" :key="index"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <a class="drop-down" @click="dropDown">
                        {{dropDownContent}}
                        <i :class="dropDownIcon"></i>
                    </a>
                    <el-button size="small" icon="el-icon-search" style="background:  rgba(228, 53, 43, 1);color:#ffffff;border-color: rgba(228, 53, 43, 1);" @click="search">搜索</el-button>
                    <el-button size="small" @click="resetForm('searchForm')">重置</el-button>
                    <el-button plain size="small" icon="el-icon-plus" type="danger" @click="add">新增</el-button>
                    <el-button plain size="small" icon="el-icon-delete" type="danger" @click="deleteAll()">批量删除</el-button>
                </el-form-item>
            </el-form>
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
                @selection-change="handleSelectionChange"
                style="width: 100%">
                <el-table-column fixed="left" type="selection" width="40"></el-table-column>
                <el-table-column prop="title" label="标题" show-overflow-tooltip min-width="200"></el-table-column>
                <el-table-column label="课程" prop="columnName" show-overflow-tooltip min-width="150">
                </el-table-column>
                <el-table-column prop="" label="缩略图" min-width="180">
                    <template slot-scope="scope">
                        <el-image
                            fit="contain"
                            style="height: 50px;"
                            :preview-src-list="[scope.row.imageUrl]"
                            :src="scope.row.imageUrl && scope.row.imageUrl.length > 0? scope.row.imageUrl: defaultImg">
                        </el-image>
                    </template>
                </el-table-column>
<!--                <el-table-column label="学分" prop="scores" width="60"></el-table-column>-->
                <el-table-column prop="status" min-width="100" label="发布状态">
                    <template slot-scope="scope">
                        {{ scope.row.status == 0 ? '未发布' : '已发布' }}
                    </template>
                </el-table-column>
                <el-table-column prop="status" min-width="150" label="可见设置" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ getDirectLabelByValue(scope.row.viewType, viewTypeOption)}}<br>
                        <template v-if="scope.row.viewType == '1'">
                            {{ scope.row.startTime }} 至 {{ scope.row.endTime }}
                        </template>
                    </template>
                </el-table-column>
                <el-table-column min-width="150" label="置顶/首页">
                    <template slot-scope="scope">
                        <template v-if="scope.row.top == 1">
                            置顶顺序：{{scope.row.topSort}}
                        </template>
                        <template v-if="scope.row.showHome == 1">
                            <br>首页顺序：{{scope.row.showHomeSort}}
                        </template>
                    </template>
                </el-table-column>
                <!--  <el-table-column prop="playCount" width="" label="点击数"></el-table-column>
                  <el-table-column prop="likeCount" width="" label="点赞数"></el-table-column>
                  <el-table-column prop="collectCount" width="" label="收藏数"></el-table-column>-->
<!--                <el-table-column prop="updateTime" width="160" label="最后一次修改时间">-->
<!--                    <template slot-scope="scope">-->
<!--                        <span>{{scope.row.updateTime ? scope.row.updateTime : '暂无'}}</span>-->
<!--                    </template>-->
<!--                </el-table-column>-->
                <el-table-column prop="createTime" min-width="180" label="创建时间"></el-table-column>
                <el-table-column prop="messageTime" min-width="180" label="短信发送时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.messageTime ? scope.row.messageTime : '暂无'}}</span>
                    </template>
                </el-table-column>
<!--                <el-table-column width="80" label="学习情况">
                    <template slot-scope="scope">
                        <el-button size="mini" class="button-blue" @click="viewStudyLog(scope.row.id)">查看</el-button>
                    </template>
                </el-table-column>-->
                <el-table-column label="操作" fixed="right" min-width="550">
                    <template slot-scope="scope">
                        <div class="button-group" style=" padding: 0 0 0 5px;">
                            <el-button size="mini" class="button-blue" @click="viewStudyLog(scope.row.id)">学习情况</el-button>
                            <!-- 审核状态(0未发布 1 已发布) -->
                            <template v-if="scope.row.status == '0'">
                                <el-button class="button-red" size="mini" @click="deleteById(scope.row.id)">删除</el-button>
                                <el-button class="button-blue" size="mini" @click="edit(scope.row)">编辑</el-button>
                                <el-button class="button-blue" size="mini" @click="postVideo(scope.row, '1')">发布</el-button>
                            </template>
                            <template v-else-if="scope.row.status == '1'">
                                <el-button class="button-blue" size="mini" @click="detail(scope.row)">详情</el-button>
                                <el-button class="button-red" size="mini" @click="postVideo(scope.row, '0')">取消发布</el-button>
                            </template>
                            <el-button class="button-blue" v-if="scope.row.fileUrl != null && scope.row.fileUrl.length > 0" size="mini" @click="fileDown(scope.row)">文件下载</el-button>
                            <el-button class="button-blue" size="mini" @click="setView(scope.row.id, scope.row.columnId)">可查看范围</el-button>
                            <el-button class="button-blue" size="mini" @click="messageConfirm(scope.row.id)">短信通知</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div style="margin: 10px;">
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

        <add :value="show" :id1="id" :modal-title="title" @close="close"></add>
        <detail :value="detailShow" :id1="id" :modal-title="title" @close="closeDetail"></detail>
        <studyLog :show="studyLogShow" :id="selectStudyId+''" @close="studyLogShow = false"></studyLog>
        <selectSend :studyId="selectStudyId + ''" :columnId="selectColumnId" :value="viewObjectShow" @close="viewObjectShow = false" @cancel="viewObjectShow = false"></selectSend>
        <send-message-confirm :show="messageConfirmShow" :id="selectStudyId + ''" @cancel="messageConfirmShow = false"></send-message-confirm>
    </div>
</template>
<script>
import axios from 'axios'
import {deleteTzStudyVideo, postVideo, queryTzStudyVideoList} from "@/api/tzStudyVideo";
import add from './addVideo'
import {queryAll} from "@/api/tzVideoColumn";
import Detail from "./detail.vue";
import defaultImg from "@/assets/defaultImg.png"
import util from '@/libs/util.js'
import fileDownload from 'js-file-download'
import studyLog from "@/views/dj/studyOnline/studyManage/StudyVideo/studyLog";
import selectSend from "@/components/selectSend/index.vue";
import {getDictByType2} from "@/api/tDictData";
import SendMessageConfirm from "@/views/dj/studyOnline/studyManage/StudyVideo/sendMessageConfirm.vue";
import {getFileDateForDown} from "@/api/attachFile";
import {fileByteToBlob} from "@/utils/fileUtils";
import {mapGetters} from "vuex";

export default {
    name: '',
    components: {
        SendMessageConfirm,
        Detail,
        add,
        studyLog,
        selectSend
    },
    data() {
        return {
            base: util.minionUrl,
            defaultImg: defaultImg,
            content: '',
            detailShow: false,
            tmpId: null,
            ids: [],
            id: '',
            show: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
            tableDataNow: [],
            parentName: '',
            parentId: '',
            isAdd: true,
            form: {code: '', name: '', parentName: '', description: ''},
            dataList: [],
            columnId: '0',
            title: '',
            props: {
                id: 'id',
                label: 'name',
                children: 'children'
            },
            dataListLoading: false,
            // 输入状态
            input: '',
            whereMap: {
                deptId: '',
                title: '',
                columnId: '',
                scores: '',
                top:'',
                showHome: '',
                viewType: ''
            },
            columnList: [
                {
                    label: '图文课程',
                    options: []
                },
                {
                    label: '视频课程',
                    options: []
                }
            ],
            studyLogShow: false,
            selectStudyId: null,
            selectColumnId: null,
            viewObjectShow: false,
            treeLoading: false,
            viewTypeOption: [],
            messageConfirmShow: false,

            drop: false,
            dropDownContent: "展开",
            dropDownIcon: "el-icon-arrow-down",
        }
    },
    created() {
        document.title = "课程管理";
        this.getColumnList();
        this.getTzStudyVideoList();
        this.getDict('viewType')
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    methods: {
        resetForm (formName) {
            this.$refs[formName].resetFields()
        },
        //展开 收起
        dropDown() {
            if (this.drop) {
                this.dropDownContent = "展开";
                this.dropDownIcon = "el-icon-arrow-down";
            } else {
                this.dropDownContent = "收起";
                this.dropDownIcon = "el-icon-arrow-up";
            }
            this.drop = !this.drop;
        },
        messageConfirm(id) {
            this.selectStudyId = id;
            this.messageConfirmShow = true
        },
        getDict(type) {
            getDictByType2(type).then(res => {
                let data = res.data;
                if (type == 'viewType') {
                    this.viewTypeOption = data
                }
            })
        },
        getDirectLabelByValue(value, direct) {
            for (let i = 0; i < direct.length; i++) {
                if (value == direct[i].itemValue) {
                    return direct[i].label
                }
            }
        },
        selectByTree(event) {
            this.whereMap.deptId = event.whereMap.deptId
            this.pageNum = 1
            this.pageSize = 10
        },
        getDeptId(deptId) {
            this.whereMap.deptId = deptId
        },
        setView(studyId, columnId) {
            this.selectStudyId = studyId + ''
            this.selectColumnId = columnId + ''
            this.viewObjectShow = true
        },
        viewStudyLog(id) {
            this.studyLogShow = true
            this.selectStudyId = id
        },
        fileDown(row){
            window.open(row.fileUrl);
            // getFileDateForDown(this.base + row.fileUrl).then(res => {
            //     const data = res.data
            //     if (data.code === '00000') {
            //         let result = res.data.data
            //         let blob = fileByteToBlob(result)
            //         let fileName = row.fileName
            //         fileDownload(blob, fileName)  //this.fileName 文件名
            //     }
            // })
        },
        search() {
            this.pageNum = 1
            this.getTzStudyVideoList()
        },
        deleteById(id) {
            this.$confirm('您确认要删除所点击选的数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                type: 'warning'
            }).then(() => {
                let ids = []
                ids.push(id)
                this.deleteOk(ids)
            }).catch(() => {

            });
        },
        deleteOk(ids) {
            if (ids == undefined || ids == null || ids.length == 0) {
                this.$message.error('没有选择的数据')
                return
            }
            deleteTzStudyVideo(ids).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        //duration: 1500
                    })
                    this.getTzStudyVideoList()
                }
            })
        },
        handleDelete(row) {
            this.$confirm('您确认要删除所点击选的数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                type: 'warning'
            }).then(() => {
                let ids = []
                if (row != null || row != undefined) {
                    ids.push(row)
                } else {
                    ids = this.ids
                }
                this.deleteOk(ids)
            }).catch(() => {

            });
        },
        deleteAll() {
            if (this.ids == undefined || this.ids == null || this.ids.length == 0) {
                this.$message.error('没有选择的数据')
                return
            }
            this.handleDelete()
        },
        handleSelectionChange(val, a, b) {
            let tmp = []
            val.forEach(i => {
                tmp.push(i.id)
            })
            this.ids = tmp
        },
        detail(row) {
            this.id = row.id.toString()
            this.show = true
            this.title = '详情'
        },
        postVideo(row, status) {
            let content = ""
            if(status == 1){
                content = "请确认是否已设置可查看范围，确认发布吗?"
            }else{
                content = "是否确定取消发布?"
            }
            this.$confirm(content, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                type: 'warning'
            }).then(() => {
                this.id = row.id.toString()

                let data = {
                    id: this.id,
                    status: status
                }
                postVideo(data).then(res => {
                    const data = res.data
                    if (data.code == '00000') {
                        if(status == 1){
                            this.$message.success('发布成功')
                        }else{
                            this.$message.success('取消发布成功')
                        }
                        this.getColumnList()
                        this.getTzStudyVideoList()
                    }
                    this.$Modal.remove()
                })
            }).catch(() => {

            });

        },
        close() {
            this.show = false
            this.getTzStudyVideoList()
        },
        closeDetail() {
            this.detailShow = false
        },
        edit(row) {
            this.id = row.id.toString()
            this.title = '编辑'
            this.show = true
        },
        add() {
            this.show = true
            this.title = '新增'
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getTzStudyVideoList()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getTzStudyVideoList()
        },
        getTzStudyVideoList() {
            this.dataListLoading = true


            let data = {
                tzStudyVideo: this.whereMap,
                pageVo: {
                    pageNumber: this.pageNum,
                    pageSize: this.pageSize
                }
            }
            data.tzStudyVideo.deptId = this.deptInfo.id

            queryTzStudyVideoList({data: data}).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.tableDataNow = data.data.records
                    this.total = data.data.total
                }
            }).finally(i => {
                this.dataListLoading = false
            })
        },
        getColumnList() {
            let data = {
                deptId: this.deptInfo.id + ''
            }
            this.columnList[0].options = []
            this.columnList[1].options = []
            queryAll({data: data}).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    for (let i = 0; i < data.data.length; i++) {
                        const item = data.data[i]
                        if (item.type == '1') {
                            this.columnList[0].options.push(item)
                        } else if (item.type == '2') {
                            this.columnList[1].options.push(item)
                        }
                    }
                }
            })
        },
        reset() {
            this.getDataById()
        }
    }
}
</script>

<style lang="scss" scoped>
    @import url("//unpkg.com/element-ui@2.15.7/lib/theme-chalk/index.css");
    .button-group > .el-button {
        margin-bottom: 5px;
    }
    .search-div {
        display: inline-block;
        padding: 0 10px 10px 0;
    }

    .flex-box {
        display: flex;
        justify-content: space-between;
    }
    .button {
        margin: 4px;
    }
    .button-green {
        border: 1px solid rgb(103, 194, 58);
        color: rgb(103, 194, 58);
    }

    .button-blue {
        border: 1px solid rgb(58, 144, 232);
        color: rgb(58, 144, 232);
    }

    .button-red {
        border: 1px solid red;
        color: red;
    }
</style>
