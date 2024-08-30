<template>
    <div style="height: 100%;background-color: white;">
        <el-container style=" border: 1px solid #eee;">
            <!--      主体表格-->
            <el-main>
                <div style="text-align: left;margin-bottom: 10px">
                    <el-button plain size="small" icon="el-icon-back" style="background: #b20000;color:#ffffff" @click="returnBack()">
                        返回&nbsp;&nbsp;-&nbsp;&nbsp;{{ voteInfo.name }}
                    </el-button>
                </div>
                <div class="body">
                    <el-table
                        v-loading="dataListLoading"
                        ref="multipleTable"
                        :data="tableDataNow"
                        border
                        :cell-style="{'text-align':'center'}"
                        :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                        tooltip-effect="dark"
                        :row-class-name="tableRowClassName"
                        @selection-change="handleSelectionChange"
                        style="width: 100%">
                        <el-table-column fixed="left" type="index" label="序号" width="80"></el-table-column>
                        <el-table-column prop="imgPath" width="200" v-bind:label="lablename">
                            <template slot-scope="scope">
                                <img :src="base + scope.row.imgPath" v-if="!videoVote" style="max-width: 100%; max-height: 100px;">
                                <videoPlayer :id="new Date().getTime().toString().substring(8)" :url="scope.row.imgPath" style="margin-top:10px;width: 50%;border-style:solid;border-width: 0.5px;" v-if="videoVote"></videoPlayer>
                            </template>
                        </el-table-column>
                        <el-table-column prop="orders" label="排名"></el-table-column>
                        <el-table-column prop="nameItem" label="名称"></el-table-column>
                        <el-table-column prop="numberVote" label="票数"></el-table-column>
                        <el-table-column prop="voteBy" width="180" :show-overflow-tooltip="true" label="投票人">
                            <template slot-scope="scope">
                                {{ isScore == '0' ? '不记名' : scope.row.voteBy }}
                            </template>
                        </el-table-column>
                    </el-table>
<!--                    <el-pagination
                        style="margin-top: 10px;"
                        v-if="tableDataNow!=null&&tableDataNow.length"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageNum"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>-->
                </div>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import util from '@/libs/util'
import videoPlayer from '@/views/dj/components/videoPlayer.vue'
import {queryTzVoteById} from "@/api/tzVote";
import {queryTzVoteDetailById} from "@/api/tzVideoDetail";

export default {
    name: '',
    components: {
        videoPlayer
    },
    data() {
        return {
            isScore: '',
            videoVote: false,
            lablename: '图片',
            base: util.nginxUrl,
            voteId: '',
            ids: [],
            id: '',
            pageNum: 1,
            pageSize: 10,
            whereMap: {
                voteId: '',
                pageSize: 10,
                pageNumber: 1
            },
            total: 0,
            tableDataNow: [],
            title: '',
            props: {
                id: 'id',
                label: 'name',
                children: 'children'
            },
            voteInfo: {},
            dataListLoading: false
        }
    },
    created() {
        this.whereMap.voteId = this.$route.query.id
        this.isScore = this.$route.query.isScore
        this.getDataById()
        this.isVideoVote(this.$route.query.id)
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            row.index = rowIndex
        },
        returnBack() {
            this.$router.push({path: '/dwgl/vote'})
        },
        isVideoVote(id) {
            queryTzVoteById(id).then((res) => {
                if (res.data.code = '00000') {
                    this.voteInfo = res.data.data
                    if (res.data.data.voteType == 4) {
                        this.videoVote = true
                        this.lablename = "视频"
                    }
                }
            })
        },
        handleSelectionChange(val, a, b) {
            var tmp = []
            val.forEach(i => {
                tmp.push(i.id)
            })
            this.ids = tmp
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getDataById()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getDataById()
        },
        refresh() {
            this.whereMap = {
                voteId: '',
                pageSize: 10,
                pageNumber: 1
            }
            this.getDataById()
        },
        getDataById() {
            this.dataListLoading = true
            let data = {
                tzVoteDetail: this.whereMap,
            }
            queryTzVoteDetailById({data: data}).then((res) => {
                const data = res.data
                if (data.code == '00000') {
                    this.tableDataNow = data.data
                    //this.tableDataNow = data.data.records
                    //this.total = data.data.total
                }

            }).finally(i => {
                this.dataListLoading = false
            })
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
