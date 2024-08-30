<template>
    <div style="height: 100%; background-color: #ffffff; padding: 10px;">
        <!--      顶部按钮-->
        <div style="display: flex;justify-content: space-between;">
            <div>
                <el-button type="danger" plain icon="el-icon-plus" size="small" @click="addTopic">新增</el-button>
            </div>
            <div>
                <el-button size="small" icon="el-icon-refresh-left" style="background: #ffffff;color: rgba(228, 53, 43, 1);border: 1px solid rgba(228, 53, 43, 1);" @click="reset()">重置</el-button>
                <el-button icon="el-icon-search" style="background:  rgba(228, 53, 43, 1);;color:#ffffff" size="small" @click="ok">搜索</el-button>
            </div>
        </div>
        <div style="margin-top: 10px;">
            <div class="search-div">
                主题名称：<el-input clearable v-model="whereMap.topicName" placeholder="会议名称" size="small" style="width: 220px;"></el-input>
            </div>
            <div class="search-div">
                专题学分：<el-input clearable v-model="whereMap.records" placeholder="会议名称" size="small" style="width: 220px;" type="number"></el-input>
            </div>
            <div class="search-div">
                选择日期：<el-date-picker
                style="margin-left: 15px;width:220px;"
                default-value
                size="small"
                v-model="whereMap.startDate"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd">
            </el-date-picker>
            </div>

        </div>
        <!--      主体-->
        <div style="margin-top: 10px;">
            <el-table
                :row-class-name="tableRowClassName" @row-click="onRowClick"
                v-loading="dataListLoading"
                ref="multipleTable"
                :data="tableDataNow"
                border
                :cell-style="{'text-align':'center'}"
                :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column fixed="left" type="selection" width="40"></el-table-column>
                <el-table-column prop="name" width="" label="文件名"></el-table-column>
                <el-table-column prop="title" width="" label="标题"></el-table-column>
<!--                <el-table-column prop="hours" width="180" label="学时"></el-table-column>-->
                <el-table-column prop="status" width="" label="发布状态">
                    <template slot-scope="scope">
                        {{ convert(scope.row.status) }}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" width="" label="创建时间"></el-table-column>
                <el-table-column prop="updateTime" width="150" label="最后一次修改时间"></el-table-column>
                <el-table-column prop="postTime" width="" label="发布时间"></el-table-column>
<!--                <el-table-column prop="createBy" width="" label="创建人"></el-table-column>-->
                <el-table-column label="操作" fixed="right" width="360">
                    <template slot-scope="scope">
                        <el-button size="mini" @click.native.prevent="handleDelete(scope.row.id)">删除</el-button>
                        <el-button size="mini" @click.native.prevent="edit(scope.row)">编辑</el-button>
                        <el-button v-if="scope.row.status==0" size="mini" @click.native.prevent="postIt(scope.row)">发布文件</el-button>
                        <el-button v-if="scope.row.status==1" size="mini" @click.native.prevent="cancelPostItById(scope.row)">取消发布</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                style="margin-top: 10px;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <add :value="addShow" :modal-title="title" :dept-id="whereMap.deptId" :studyFileId="studyFileId" @close="close"></add>
    </div>

</template>
<script>
import fileDownload from 'js-file-download'
import axios from 'axios'
import add from './addStudyFile'
import {cancelPostIt, postIt, queryTzTStudyFile, deleteTStudyFile} from '@/api/tzStudyFile'
import {mapGetters} from "vuex";

export default {
    name: '',
    components: {
        add
    },
    data() {
        return {
            exportShow: false,
            isAdmin: false,//是否是超级管理员
            studyFileId: '',
            addShow: false,
            filePaths: [],
            id: '',
            title: '',
            deptId: '',
            deptName: '',
            partyMemberIds: '',
            pageNum: 1,
            pageSize: 10,
            total: 0,
            whereMap: {
                topicName: '',
                records: '',
                deptId: '',
                startDate: '',
                endDate: ''
            },
            dataListLoading: false,
            tableDataNow: [],  // 显示的数据
            formLabelWidth: '100px',
            // 加载状态
            loading: false,
            // 输入状态
            input: '',
            //删除项
            deleteItmes: [],
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    created() {
        document.title = "学习文件管理";
        this.dataListLoading = true

        this.whereMap.deptId = this.deptInfo.id
        //调用接口查询组织结构
        this.getDataById()
    },
    methods: {
        convert(status) {
            if (status === null || status === undefined || status === '') {
                return ''
            }
            if (status == 0) {
                return '未发布'
            } else if (status == 1) {
                return '已发布'
            }
        },
        close() {
            this.addShow = false
            this.getDataById()
        },
        addTopic() {
            this.addShow = true
            this.title = '新增'
        },
        edit(row) {
            this.addShow = true
            this.studyFileId = row.id.toString()
            this.title = '编辑'
        },
        postIt(row) {
            this.$confirm('确认发布?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                type: 'warning'
            }).then(() => {
                this.confirmIt(row)
            }).catch(() => {
                this.$message.info('取消发布！')
            });
        },
        cancelPostItById(row) {
            this.$confirm('确认取消发布吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                type: 'warning'
            }).then(() => {
                cancelPostIt(row.id).then(res =>{
                    const data = res.data
                    if (data.code == '00000') {
                        this.$message.success('取消成功')
                        this.getDataById()
                    } else {
                        this.$message.success('取消失败')
                    }
                })
            }).catch(() => {
                this.$message.info('取消操作！')
            });
        },
        confirmIt(row) {
            postIt(row.id).then(res =>{
                const data = res.data
                if (data.code == '00000') {
                    this.$message.success('发布成功')
                    this.getDataById()
                } else {
                    this.$message.success('发布失败')
                }
            })
        },
        selectDown() {
            if (this.filePaths == undefined || this.filePaths == null || this.filePaths.length == 0) {
                this.$message.error('没有选择的数据')
                return
            }
            for (let i = 0; i < this.filePaths.length; i++) {
                axios.get(this.filePaths[i].filePath, {
                    responseType: 'blob' //返回的数据类型
                }).then(res => {
                    fileDownload(res.data, this.filePaths[i].fileName)  //this.fileName 文件名
                })
            }
        },
        ok() {
            this.pageNum = 1
            this.getDataById()
        },
        reset() {
            this.whereMap.topicName = ''
            this.whereMap.records = ''
            this.whereMap.startDate = ''
            this.whereMap.endDate = ''
            this.pageNum = 1
            this.pageSize = 10
            this.getDataById()
        },
        // 获取分页信息
        getDataById() {
            this.dataListLoading = true

            let data = {
                tzStudyFile: this.whereMap,
                pageVo: {
                    pageSize: this.pageSize,
                    pageNumber: this.pageNum
                }
            }

            queryTzTStudyFile({ data: data }).then(res =>{
                const data = res.data.data
                this.tableDataNow = data.records
                this.total = data.total
                this.dataListLoading = false
            }).catch(e => {
                this.dataListLoading = false
            })
        },
        tableRowClassName({row, rowIndex}) {
            row.row_index = rowIndex
        },
        onRowClick(row) {
            this.deleteItmes.push(row.row_index)
        },
        // 分页
        sizeChange(data) {
            let num = data * 9 - 9
            this.tableDataNow = this.tableData.slice(num, num + 9)
        },
        handleSelectionChange(val, a, b) {
            let tmp = []
            let pathTmp = []
            val.forEach(i => {
                tmp.push(i.id)
                pathTmp.push({'filePath': i.filePath, 'fileName': i.fileName})
            })
            this.filePaths = pathTmp
            this.partyMemberIds = tmp
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getDataById()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getDataById()
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
                    // ids = this.partyMemberIds
                    this.$message.info('id为空，请联系管理员！')
                    return
                }
                this.deleteOk(ids)
            }).catch(() => {

            });
        },
        deleteOk(ids) {
            if (ids === undefined || ids === null || ids.length === 0) {
                this.$message.error('没有选择的数据')
                return
            }
            deleteTStudyFile(ids).then(res =>{
                const data = res.data
                if (data.code = '00000') {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        //duration: 1500,
                    })
                    this.getDataById()
                }
            })
        },
        refresh(evt) {
            this.tableDataNow = []
            let target = evt.target
            if (target.nodeName == 'SPAN') {
                target = evt.target.parentNode
            }
            target.blur()
            this.whereMap = {}
            this.pageNum = 1
            this.pageSize = 10
            this.getDataById()
        }
    }
}
</script>

<style lang="scss" scoped>
@import url("//unpkg.com/element-ui@2.15.7/lib/theme-chalk/index.css");


.buttons {
    padding: 5px 8px;
    color: #a68f7f;
    border-color: #a68f7f;
}


.tree {
    margin-left: 20px;
    margin-top: 20px;
}

.search-div {
    display: inline-block;
    padding: 0 10px 10px 0;
}

</style>
