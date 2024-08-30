<template>
    <div style="height: 100%; background-color: white; padding: 15px; float: left; width: 100%;">
        投票名称：<el-input v-model="whereMap.name" placeholder="投票名称" size="small" style="width: 220px;"></el-input>
        <el-button size="small" type="primary" @click="ok" style="margin-left: 15px;">搜 索</el-button>
        <el-button plain size="small" icon="el-icon-plus" style="background: #b20000;color:#ffffff" @click="add">新增</el-button>
        <el-button plain size="small" icon="el-icon-refresh" style="background: #b20000;color:#ffffff" @click="refresh()">刷新</el-button>

        <div v-if="tableDataNow!=null&&tableDataNow.length" style="margin-top: 10px; float: left; width: 100%; ">
            <div style="width: 25%; padding: 10px; float: left; min-width: 300px;" v-for="(item, index) in tableDataNow" :key="index" >
                <div class="content-box">
                    <div class="title-box">
                        <div class="title">{{ item.name }}</div>
                        <div>
                            <template v-if="item.voteStatus == 1">
                                <div class="status1">未发布</div>
                            </template>
                            <template v-else-if="item.voteStatus == 2">
                                <div class="status2">已发布</div>
                            </template>
                        </div>
                    </div>
                    <div class="create-time" style="display: flex; flex-direction: row;">
                        创建于{{ item.createTime }}
                    </div>
                    <div class="img-box">
                        <img class="img" :src="item.imagePath && item.imagePath.length > 0? base + item.imagePath : defaultImg">
                    </div>
                    <div class="start-and-end">
                        <div><img class="time-icon" :src="timeImg" style=""></div>
                        <div class="time">{{ item.startDate }} 至 {{ item.endDate }}</div>
                    </div>
                    <div style="margin-top: 20px; word-break: break-all;">
                        <el-row :gutter="10" style="font-weight: bold;">
                            <el-col :span="8">{{ item.detailNum?item.detailNum:0 }}</el-col>
                            <el-col :span="8">{{ item.userNum?item.userNum:0 }}</el-col>
                            <el-col :span="8">{{ item.viewCount?item.viewCount: 0 }}</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="8">参选数</el-col>
                            <el-col :span="8">总票数</el-col>
                            <el-col :span="8">浏览量</el-col>
                        </el-row>
                    </div>

                    <div class="button-box">
                        <template v-if="item.voteStatus == 1">
                            <div class="row">
                                <el-row style="width: 100%;">
                                    <el-col :span="8" >
                                        <div class="col1" @click="edit(item.id)">编辑活动</div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="col2" @click="goDetail(item.id)">参选列表</div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="col3" @click="deleteById(item.id)">
                                            删除
                                         </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </template>

                        <template v-else-if="item.voteStatus == 2">
                            <div class="row">
                                <div class="row-left" @click="detail(item.id)">活动详情</div>
                                <div class="row-right1" @click="goDetail(item.id)">参选列表</div>
                            </div>
                        </template>

                        <div class="row">
                            <div class="row-left" @click="voteCalculate(item)">查看排名</div>
                            <div class="row-right2" @click="updateStatus(item)">
                                <template v-if="item.voteStatus == 1">
                                    发布活动
                                </template>
                                <template v-else-if="item.voteStatus == 2">
                                    撤回活动
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="tableDataNow.length == 0" class="empty">
            <el-empty description="暂无数据"></el-empty>
        </div>
        <div style="width: 100%; margin-top: 10px; float: inherit;">
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
        <add :value="show" :id1="id" :deptId="deptId+''" :modal-title="title" @close="close"></add>
    </div>
</template>
<script>
import add from './addVote.vue'
import {deleteTzVoteById, queryTzVoteList, updateStatusById} from "@/api/tzVote";
import {getLocalStorageInfo} from '@/utils/localStorageInfo';
import defaultImg from '@/assets/defaultImg.png'
import timeImg from '@/assets/vote/time.png'
import util from "@/libs/util";
import {mapGetters} from "vuex";

export default {
    name: '',
    components: {
        // detail,
        add
    },
    data() {
        return {
            base: util.nginxUrl,
            defaultImg: defaultImg,
            timeImg: timeImg,
            deptId: '',
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
            tableDataNow: [],
            //dataList: [],
            title: '',
            dataListLoading: false,
            formLabelWidth: '100px'
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    created() {
        this.deptId = this.deptInfo.id
        this.getDataById()
    },
    methods: {
        goDetail(id) {
            this.$router.push({
                path: '/dwgl/vote/voteDetail',
                query: {
                    voteId: id
                }
            })
        },
        updateStatus(item) {
            let msg = ''
            let newStatus = ''
            let result = ''
            if (item.voteStatus == 1) {
                if (item.detailNum < 2) {
                    this.$message.error('参选数量不可小于2')
                    return
                }
                msg = '确定要发布该投票活动吗？'
                newStatus = 2
                result = '发布'
            } else if (item.voteStatus == 2) {
                msg = '确定要撤回该投票活动吗？'
                newStatus = 1
                result = '撤回'
            } else {
                this.$message.error('未知状态')
            }

            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const data = {
                    id: item.id+'',
                    status: newStatus+''
                }
                updateStatusById({ data: data }).then(res => {
                    const data = res.data
                    if (data.code == '00000') {
                        this.$message.success(result+'成功')
                        this.getDataById()
                    } else {
                        this.$message.error('操作失败：'+result)
                    }
                })
            })
        },
        convert(endDate) {
            // Date.parse(scope.row.endDate)>new Date() ? '进行中' : '已结束'
        },
        deleteById(id) {
            this.$confirm('确定要删除该投票活动吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let ids = []
                ids.push(id)
                this.deleteOk(ids)
            })
        },
        deleteOk(ids) {
            if (ids == undefined || ids == null || ids.length == 0) {
                this.$message.error('没有选择的数据')
                return
            }
            JSON.parse(JSON.stringify(ids))
            deleteTzVoteById(ids).then(data => {
                if (data.data.data) {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        //duration: 1500
                    })
                    this.getDataById()
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
        detail(id) {
            this.id = id.toString()
            this.title = '详情'
            this.show = true
        },
        edit(id) {
            this.id = id.toString()
            this.title = '编辑'
            this.show = true
        },
        close() {
            this.show = false
            this.getDataById()
        },
        add() {
            this.title = '新增'
            this.show = true
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getDataById()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getDataById()
        },
        voteCalculate(row) {
            this.$router.push({path: '/dwgl/vote/votetStatistics', query: {'id': row.id, 'isScore': row.isScore}})
        },
        refresh() {
            this.whereMap = {}
            this.getDataById()
        },
        getDataById() {
            this.dataListLoading = true
            let data = {
                tzVote: this.whereMap,
                pageVo: {
                    pageNumber: this.pageNum,
                    pageSize: this.pageSize
                }
            }
            data.tzVote.StartDeptId = this.deptId

            queryTzVoteList(data).then(res => {
                let resData = res.data
                if (resData.code = '00000') {
                    this.tableDataNow = resData.data.result.records
                    this.total = resData.data.result.total
                }
            }).finally(i => {
                this.dataListLoading = false
            })
        },
        ok() {
            this.getDataById()
        }
    },
    watch: {
        loading(val) {
            this.dataListLoading = val
        }
    }
}
</script>

<style lang="scss" scoped>

.content-box {
    border-radius: 8px; padding: 10px; border: 3px rgb(237, 130 ,101) solid;
    width: 100%;

    .title-box{
        margin-top: 5px;
        font-weight: bold; display: flex; flex-direction: row;

        .title {
            flex: 1; line-height: 28px; text-align: left; font-size: 16px;
        }
        .status2 {
            color: white; border-radius: 8px; padding: 5px 10px; background-color: rgb(161, 206, 89)
        }
        .status1 {
            color: white; border-radius: 8px; padding: 5px 10px; background-color: rgb(226, 66, 64)
        }
    }

    .create-time {
        margin-top: 20px; text-align: left; color: rgb(127, 127, 127)
    }

    .img-box {
        position: relative;
        width: 100%;
        height: 0px;
        padding-top: 70%;

        .img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .start-and-end {
        display: flex; text-align: left;

        .time-icon {
            height: 8px; margin-top: -2px;
        }

        .time {
            margin-left: 3px; color: rgb(127, 127, 127);
        }
    }

    .button-box {
        margin-top: 20px; border-top: 3px rgb(237, 130, 101) dashed; display: flex; flex-direction: column;

        .row {
            margin-top: 10px; display: flex; flex-direction: row;

            .col1 {
                cursor: pointer;
                height: 30px;
                line-height: 30px;
                border-radius: 5px;
                background-color: rgb(238, 125, 101);
                color: white;
                margin-right: 3px;
            }

            .col2 {
                cursor: pointer;
                height: 30px;
                line-height: 30px;
                border-radius: 5px;
                background-color: rgb(238, 125, 101);
                color: white;
                margin: 0 3px;
            }

            .col3 {
                cursor: pointer;
                height: 30px;
                line-height: 30px;
                border-radius: 5px;
                background-color: rgb(238, 125, 101);
                color: white;
                margin-left: 3px;
            }

            .row-left {
                cursor: pointer;
                height: 30px;
                line-height: 30px;
                border-radius: 5px;
                background-color: rgb(238, 125, 101);
                color: white;
                width: calc(50% - 3px);
            }

            .row-right1 {
                cursor: pointer;
                height: 30px;
                line-height: 30px;
                border-radius: 5px;
                background-color: rgb(238, 125, 101);
                color: white; width: calc(50% - 3px);
                margin-left: 6px;
            }

            .row-right2 {
                cursor: pointer;
                height: 30px;
                line-height: 30px;
                border-radius: 5px;
                background-color: rgb(226, 66, 64);
                color: white;
                width: calc(50% - 3px);
                margin-left: 6px;
            }
        }
    }
}

.empty {
    float: left;
    width: 100%;
    text-align: center;
}
</style>
