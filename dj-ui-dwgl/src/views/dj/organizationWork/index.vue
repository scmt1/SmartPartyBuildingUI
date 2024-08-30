<template>
    <el-container style="height: 100%">
        <el-dialog title="搜索" center :visible.sync="display" :width="'30%'">
            <el-form ref="form" style="margin-left: -25px;margin-bottom: 0px">
                <el-form-item label="条件" :label-width="formLabelWidth" prop="name">
                    <div style="display: flex">
                        <el-input value="新闻名称" placeholder="" autocomplete="off" size="small" style="width:200px;"
                                  :disabled="true"></el-input>
                        <el-input v-model="whereMap.title" placeholder="输入新闻名称" size="small"
                                  style="width: 200px; margin-left: 15px"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="条件" :label-width="formLabelWidth" prop="idCard" style="margin-top:-15px">
                    <div style="display: flex">
                        <el-input value="新闻类型" size="small" style="width:200px;" :disabled="true"></el-input>
                        <el-select v-model="whereMap.type" placeholder="请选择" clearable size="small"
                                   style="width: 200px;margin-left: 15px">
                            <el-option label="文本新闻" value=1></el-option>
                            <el-option label="视频新闻" value=2></el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <div class="dialog-footer" style="padding: 0 150px">
                    <el-button @click="cancel()">关 闭</el-button>
                    <el-button @click="reset()">重 置</el-button>
                    <el-button type="primary" @click="ok()">搜 索</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!--      顶部按钮-->
        <el-header style="background-color: #fff;padding: 11px 2px">
            <el-row>
                <el-button plain size="small" icon="el-icon-plus" style="background: #b20000;color:#ffffff" @click="add">新增</el-button>
                <el-button plain size="small" icon="el-icon-delete" style="background: #b20000;color:#ffffff" @click="deleteAll()">批量删除</el-button>
                <el-button plain size="small" icon="el-icon-refresh" style="background: #b20000;color:#ffffff" @click="refresh()">刷新</el-button>
                <el-button plain size="small" icon="el-icon-search" style="background: #b20000;color:#ffffff" @click="search()">搜索</el-button>
            </el-row>
        </el-header>
        <!--      主体-->
        <el-container style="height: 625px; border: 1px solid #eee;">

           <!-- <el-aside style="background-color: #fff;">
                <organization-tree @selectByTree="selectByTree" :loading="dataListLoading"></organization-tree>
            </el-aside>-->
            <el-container>
                <!--      主体表格-->
                <el-main>
                    <div class="body">
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
                            <el-table-column
                                    fixed="left"
                                    type="selection"
                                    width="40">
                            </el-table-column>
                            <el-table-column
                                    prop="title"

                                    label="标题">
                            </el-table-column>
                            <el-table-column
                                    prop="type"
                                    :show-overflow-tooltip="true"
                                    label="类型">
                                <template slot-scope="scope">
                                    {{scope.row.type=='1' ? '文本新闻' : '视频新闻'}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="createBy"

                                    label="发起人">
                            </el-table-column>
                            <el-table-column
                                    prop="createTime"
                                    label="发起时间">
                                <template slot-scope="scope">
                                    {{formartDate(scope.row.createTime,'yyyy-MM-dd')}}
                                </template>
                            </el-table-column>

                            <el-table-column prop="status" label="当前状态">
                                <template slot-scope="scope">
                                    {{scope.row.status=='0' ? '未审核' : '已审核'}}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" fixed="right" width="360">
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            @click.native.prevent="detail(scope.row.id)">详情
                                    </el-button>
                                    <el-button
                                            size="mini"
                                            @click.native.prevent="deleteById(scope.row.id)">删除
                                    </el-button>
                                    <el-button
                                            size="mini"
                                            @click.native.prevent="edit(scope.row.id)">编辑
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
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
                </el-main>
                <add @close="close" v-model="show" :newsId="id" :modal-title="title"></add>
            </el-container>
        </el-container>
        <Modal v-model="modal" width="460" :closable="false" class-name="vertical-center-modal">
            <div style="height: 50px;text-align:center;font-weight: bold;font-size: 30px">
                <p>成功删除{{delTotal}}条</p>
            </div>
            <template #footer>
                <div>
                    <Button type="primary" size="large" @click="enter" style="background-color: #8CD4F5;    margin: 0 auto;display: block;">确定</Button>
                </div>
            </template>
        </Modal>
    </el-container>

</template>
<script>
    import { getByPage,getDelById } from "../../../api/orgWorkservice";
    import add from './add'

    export default {
        name: '',
        components: {
            // organizationTree,
            add
        },
        data() {
            return {
                delTotal:0,
                modal:false,
                detailShow: false,
                ids: [],
                id: '',
                show: false,
                pageNum: 1,
                pageSize: 10,
                whereMap: {
                    pageSize: 10,
                    pageNumber: 1
                },
                total: 0,
                startDept: '',
                createBy: '',
                tableDataNow: [],
                form: {'name': '', code: '', name: '', parentName: '', description: ''},
                dataList: [],
                columnId: '0',
                title: '',
                dataListLoading: false,
                display: false,
                formLabelWidth: '100px',
                //删除项
                deleteItmes: []
            }
        },
        created() {

            this.getDataById()
            // this.getDataList()
        },
        methods: {
            enter () {
                this.modal = false
            },
            formartDate (date, fmt) {
                if (date == undefined || date == null || date.toString().trim().length <= 0) {
                    return ''
                }
                if (typeof date === 'string') {
                    date = new Date(date)
                }
                date = date == undefined ? new Date() : date
                date = typeof date == 'number' ? new Date(date) : date
                fmt = fmt || 'yyyy-MM-dd HH:mm:ss'
                var obj = {
                    'y': date.getFullYear(), // 年份，注意必须用getFullYear
                    'M': date.getMonth() + 1, // 月份，注意是从0-11
                    'd': date.getDate(), // 日期
                    'q': Math.floor((date.getMonth() + 3) / 3), // 季度
                    'w': date.getDay(), // 星期，注意是0-6
                    'H': date.getHours(), // 24小时制
                    'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
                    'm': date.getMinutes(), // 分钟
                    's': date.getSeconds(), // 秒
                    'S': date.getMilliseconds() // 毫秒
                }
                var week = ['天', '一', '二', '三', '四', '五', '六']
                for (var i in obj) {
                    fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
                        var val = obj[i] + ''
                        if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val]
                        for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
                        return m.length == 1 ? val : val.substring(val.length - m.length)
                    })
                }
                return fmt
            },
            close(){
                this.getDataById()
            },
            selectByTree(data) {
                this.reset()
                this.whereMap.deptId = data.whereMap.deptId
                this.pageSize = data.pageSize
                this.pageNumber = data.pageNum
                this.getDataById()
            },
            getDataList(type) {
                var that = this
                this.dataListLoading = true
                let data = {}
               /* this.$http({
                    url: this.$http.adornUrl('/scmt/tzSysDept/getTzSysDeptNameList'),
                    method: 'get',
                    params: this.$http.adornParams(data)
                }).then(({data, success}) => {
                    if (success) {
                        that.dataList = treeDataTranslate(data.list, 'id', 'parentId')
                        this.dataListLoading = false
                    }
                }).finally(i => {
                    this.dataListLoading = false
                })*/
            },
            getdict(type) {
                let tmp = []

                return tmp
            },
            convert(endDate) {
                // Date.parse(scope.row.endDate)>new Date() ? '进行中' : '已结束'
            },
            deleteById(id) {
                this.$confirm('您确认要删除所点击选的数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showClose:false,
                    type: 'warning'
                }).then(() => {
                    var ids = []
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
                // JSON.stringify(ids)
                JSON.parse(JSON.stringify(ids))
                getDelById({ids:ids}).then(res=>{
                    if(res.code=='000000'){
                        this.delTotal=res.data.data
                        this.modal = true
                        this.getDataById()
                    }else{
                        this.$message.error('删除失败')
                    }
                })
              /*  this.$http({
                    url: this.$http.adornUrl('/multi/tzVote/deleteTzVoteById'),
                    method: 'POST',
                    data: ids
                }).then(data => {
                    if (data.data) {
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            duration: 1500
                        })
                        this.getDataById()
                    }
                })*/
            },
            handleDelete(row) {
                this.$confirm('您确认要删除所点击选的数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showClose:false,
                    type: 'warning'
                }).then(() => {
                    var ids = []
                    if (row != null || row != undefined) {
                        ids.push(row)
                    } else {
                        ids = this.ids
                    }
                    this.deleteOk(ids)
                }).catch(() => {

                });
            },
            deleteAll(index, rows) {
                if (this.ids == undefined || this.ids == null || this.ids.length == 0) {
                    this.$message.error('没有选择的数据')
                    return
                }
                this.handleDelete()
            },
            handleSelectionChange(val, a, b) {
                var tmp = []
                val.forEach(i => {
                    tmp.push(i.id)
                })
                this.ids = tmp
            },
            detail(id) {
                this.id = id.toString()
                this.title = '详情'
                this.show = true
            },
            close() {
                this.show = false
                this.getDataById()
            },
            closeDetail() {
                this.detailShow = false
            },
            add() {
                this.show = true
                this.title = '新增'
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.getDataById()
            },
            handleCurrentChange(val) {
                this.pageNum = val
                this.getDataById()
            },
            filterNode(value, data) {
                if (!value) return true
                return data.name.indexOf(value) !== -1
            },
            selectId(event) {
                this.columnId = event.id
                this.whereMap.columnName = event.name
                // this.getDataById()
            },
            search() {
                this.display = true
            },
            edit(id) {
                this.id = id.toString()
                this.title = '编辑'
                this.show = true
            },
            refresh() {
                this.whereMap = {}
                this.getDataById()
            },
           async getDataById() {

                this.dataListLoading = true
                let data = {}
                data = this.whereMap
                data.pageSize = this.pageSize
                data.pageNumber = this.pageNum

                await getByPage({ data: data}).then(res => {
                    if (res.code == "000000") {
                      this.tableDataNow = res.data.data.records
                        this.total = res.data.data.total
                    /*  this.startDept = data.startDept
                      this.createBy = data.createBy
                      this.total = data.result.total*/
                    }
                }).finally(i => {
                    this.dataListLoading = false
                })
            },
            reset() {
                this.getDataById()
            },
            cancel() {
                this.display = false
                this.resetForm()
            },
            resetForm() {
                this.whereMap = {}
            },
            ok() {
                this.getDataById()
                this.display = false
                this.resetForm()
            },
        },
        watch: {
            loading(val) {
                this.dataListLoading = val
            }
        }
    }
</script>

<style lang="scss" scoped>
    .buttons {
        padding: 5px 8px;
        color: #a68f7f;
        border-color: #a68f7f;
    }


    .tree {
        margin-left: 20px;
        margin-top: 20px;
    }


</style>
