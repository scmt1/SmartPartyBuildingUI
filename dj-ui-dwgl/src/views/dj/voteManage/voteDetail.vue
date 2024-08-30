<template>
    <div style="height: 100%; float: left; width: 100%; background: white; padding: 15px;">
        <div style="text-align: left;margin-bottom: 10px">
            <el-button plain size="small" icon="el-icon-back" style="background: #b20000;color:#ffffff" @click="returnBack()">
                返回&nbsp;&nbsp;-&nbsp;&nbsp;{{ voteInfo.name }}
            </el-button>

            <span style="margin-left: 40px;">
                投票项名称：<el-input clearable v-model="search.nameItem" placeholder="请输入" size="small" style="width: 220px;"></el-input>
            </span>

            <span style="margin-left: 10px;">
                状态：
                <el-select clearable v-model="search.status" placeholder="请选择" style="width: 100px;" size="small">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </span>
            <el-button size="small" type="primary" @click="ok" style="margin-left: 15px;">搜 索</el-button>
            <el-button v-if="voteInfo.voteStatus == 1" plain size="small" icon="el-icon-plus" style="background: #b20000;color:#ffffff" @click="addDetail">新增</el-button>
        </div>

        <div>
            <div style="margin-top: 10px; width: 100%; float: left;" v-loading="tableLoading">
                <div style="width: 20%; padding: 10px; float: left; min-width: 270px;" v-for="(item, index) in tableDataNow" :key="index" >
                    <div class="content-box">
                        <div class="img-box">
                            <img class="img" :src="item.imgPath && item.imgPath.length > 0? base + item.imgPath : defaultImg">
                        </div>

                        <div style="margin-top: 5px; word-break: break-all;">
                            <div>{{ item.nameItem }}</div>
                            <div style="font-weight: bold;">{{ item.numberVote }}票</div>
                        </div>

                        <div class="button-box">
                            <div class="row">
                                <div class="row-left" @click="getVoteDetailInfo(item.id)">
                                    <template v-if="voteInfo.voteStatus == 1">
                                        编辑
                                    </template>
                                    <template v-else-if="voteInfo.voteStatus == 2">
                                        详情
                                    </template>
                                </div>
                                <div v-if="voteInfo.isScore == '0'" class="row-right" style="background-color: rgb(199,197,197); cursor: not-allowed;">投票记录</div>
                                <div v-else-if="voteInfo.isScore == '1'" class="row-right" @click="getVoteUser(item.id)">投票记录</div>
                            </div>

                            <div class="row" v-if="voteInfo.voteStatus == 1">
                                <div class="row-left" @click="editStatus(item.id, item.status)">
                                    <template v-if="item.status == 1">
                                        屏蔽
                                    </template>
                                    <template v-else-if="item.status == 2">
                                        取消屏蔽
                                    </template>
                                </div>
                                <div class="row-right" @click="delDetail(item.id)">删除</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="tableDataNow.length == 0" class="empty">
                    <el-empty description="暂无数据"></el-empty>
                </div>
            </div>
        </div>

        <div style="float: left; width: 100%; text-align: center;">
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

        <el-drawer
            title="投票项编辑"
            :visible.sync="editDialogVisible"
            size="400px">
            <div>
                <div style="display: flex; padding: 0 15px;">
                    <div>参选图片：</div>
                    <div style="flex: 1;">
                        <div style="width: 100%;">
                            <img :src="voteDetailInfo.imgPath && voteDetailInfo.imgPath.length > 0?base + voteDetailInfo.imgPath:defaultImg" style="width: 100%;">
                        </div>
                        <Upload v-if="voteInfo.voteStatus == 1"
                                accept=".jpg,.png,.jpeg"
                                ref="upload2"
                                :show-upload-list="false"
                                :format="['jpg','jpeg','png']"
                                :max-size="2048"
                                :before-upload="(e) =>handleUpload2(e)"
                                :headers="{Authorization: $cookie.get('Authorization_party_vp')}"
                                :action="'#'"
                                style="width:80px;display:inline-block;margin-top: 10px">
                            <Button type="info" ghost>选择图片</Button>
                        </Upload>
                    </div>
                </div>

                <div v-if="voteInfo.voteType == '4'" style="margin-top: 10px; display: flex; padding: 0 15px;">
                    <div>参选视频：</div>
                    <div style="flex: 1;">
                        <div style="width: 100%;">
                            <videoPlayer style="width: 100%;" :url="base + voteDetailInfo.videoPath" v-if="voteDetailInfo.videoPath && voteDetailInfo.videoPath!=''"></videoPlayer>
                            <div style="display:flex;margin-top:20px">
                                <Upload v-if="voteInfo.voteStatus == 1"
                                        style="width: 100%"
                                        size="small"
                                        name="file"
                                        accept=".mp4,.MP4"
                                        :format="['MP4', 'mp4']"
                                        :action="'#'"
                                        :show-upload-list="true"
                                        :headers="{Authorization: $cookie.get('Authorization_party_vp')}"
                                        :before-upload="(e) =>handleUploadVideo(e)"
                                        ref="upload">
                                    <div style="display: flex">
                                        <el-button size="mini" style="height: 30px">上传文件</el-button>
                                    </div>
                                </Upload>
                            </div>
                        </div>
                    </div>
                </div>


                <div style="text-align: left; display: flex; align-items: center; margin-top: 10px; width: 100%; padding: 0 20px;">
                    <div>名称：</div>
                    <div style="flex: 1;">
                        <el-input v-if="voteInfo.voteStatus == 1" v-model="voteDetailInfo.nameItem" placeholder="请输入标题" maxlength="30" size="small" style="width:100%;"></el-input>
                        <span v-else-if="voteInfo.voteStatus == 2">{{ voteDetailInfo.nameItem }}</span>
                    </div>
                </div>
                <div style="text-align: left; display: flex; margin-top: 10px; width: 100%; padding: 0 20px;">
                    <div>介绍：</div>
                    <div style="flex: 1;">
                        <el-input v-if="voteInfo.voteStatus == 1" style="width: 100%;" v-model="voteDetailInfo.voteIntro" placeholder="请输入介绍(100字以内)" maxlength="100" size="small"
                                  type="textarea" :rows="6" show-word-limit ></el-input>
                        <span v-else-if="voteInfo.voteStatus == 2">{{ voteDetailInfo.voteIntro }}</span>
                    </div>
                </div>

            </div>
            <div style="margin-top: 20px; margin-bottom: 10px;" >
                <el-button size="small" @click="editDialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="saveVoteDetail" v-if="voteInfo.voteStatus == 1">确定</el-button>
            </div>
        </el-drawer>

        <el-drawer
            title="投票记录"
            :visible.sync="userDialogVisible"
            size="400px">
            <div style="padding: 0 15px;">
                <el-table :data="userTableData" stripe style="width: 100%" v-loading="userTableLoading">
                    <el-table-column prop="userName" label="用户名" align="center" width="100"></el-table-column>
                    <el-table-column prop="avatar" label="头像" width="60">
                        <template slot-scope="scope">
                            <img style="width: 100%; border-radius: 50%;" :src="scope.row.avatar && scope.row.avatar.length > 0?base + scope.row.avatar:defaultHeader">
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" align="center" label="投票时间"></el-table-column>
                </el-table>
            </div>
            <div style="margin-top: 20px;">
                <el-pagination
                    v-if="userTableData!=null&&userTableData.length"
                    @size-change="userHandleSizeChange"
                    @current-change="userHandleCurrentChange"
                    :current-page="userPageNum"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="userPageSize"
                    :page-count="5"
                    layout="total, sizes, prev, pager, next"
                    :total="userTotal">
                </el-pagination>
            </div>
        </el-drawer>
        <cropper ref="cropper" @cropperResult="uploadCropperImg"></cropper>
    </div>
</template>

<script>
import { queryTzVoteDetailListByPage, getVoteDetailInfoById, addVoteDetail, editVoteDetail, editVoteDetailStatus, deleteVoteDetail } from "@/api/tzVideoDetail";
import {queryTzVoteUserListByPage} from "@/api/tzVoteUser";
import {uploadVideo} from "@/api/attachFile";
import util from "@/libs/util";
import defaultImg from '@/assets/defaultImg.png'
import {queryTzVoteById} from "@/api/tzVote";
import {uploadImages} from "@/api/attachFile";
import defaultHeader from "@/assets/default-header.png";
import videoPlayer from "@/views/dj/components/videoPlayer.vue";
import cropper from "@/views/dj/components/cropper.vue";

export default {
    name: "voteDetail",
    components: {
        videoPlayer,
        cropper
    },
    data() {
        return {
            defaultHeader: defaultHeader,
            defaultImg: defaultImg,
            base: util.nginxUrl,
            pageNum: 1,
            pageSize: 10,
            total: 0,
            userPageNum: 1,
            userPageSize: 10,
            userTotal: 0,
            options: [
                {
                    label: '未屏蔽',
                    value: 1
                },
                {
                    label: '已屏蔽',
                    value: 2
                }
            ],
            search: {
                voteId: '',
                nameItem: ''
            },
            tableDataNow: [],
            tableLoading: false,
            userTableLoading: false,
            selectedIds: [],
            editDialogVisible: false,
            userDialogVisible: false,
            voteInfo: {},
            voteDetailInfo: {},
            userTableData: []
        }
    },
    mounted() {
        this.search.voteId = this.$route.query.voteId
        this.getVoteInfo()
        this.getTzVoteDetailList()
    },
    methods: {
        returnBack() {
            this.$router.push({
                path: '/dwgl/vote'
            })
        },
        ok() {
            this.pageNum = 1
            this.pageSize = 10
            this.getTzVoteDetailList()
        },
        getVoteInfo() {
            queryTzVoteById(this.search.voteId).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.voteInfo = data.data
                }
            })
        },
        getTzVoteDetailList() {
            this.tableLoading = true
            const data = {
                tzVoteDetail: this.search,
                pageVo: {
                    pageNumber: this.pageNum,
                    pageSize: this.pageSize,
                }
            }
            queryTzVoteDetailListByPage({ data: data }).then(res =>{
                this.tableLoading = false
                const data = res.data

                if (data.code == '00000') {
                    this.tableDataNow = data.data.records
                    this.total = data.data.total
                }
            })
        },
        handleSelectionChange(val, a, b) {
            let tmp = []
            val.forEach(i => {
                tmp.push(i.id)
            })
            this.selectedIds = tmp
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getTzVoteDetailList()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getTzVoteDetailList()
        },
        userHandleSizeChange(val) {
            this.userPageSize = val
            this.getTzVoteDetailList()
        },
        userHandleCurrentChange(val) {
            this.pageNum = val
            this.getTzVoteDetailList()
        },
        addDetail() {
            this.voteDetailInfo = {}
            this.editDialogVisible = true
        },
        getVoteDetailInfo(id) {
            getVoteDetailInfoById(id).then(res =>{
                const data = res.data
                if (data.code == '00000') {
                    this.editDialogVisible = true
                    this.voteDetailInfo = data.data
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        handleUpload2(file) {
            let tmp = file.name.split('.')
            let name = tmp[tmp.length - 1]
            if (name !== 'png' && name !== 'jpg' && name !== 'jpeg') {
                this.$message({
                    message: '请选择png、jpg、jpeg图片类型',
                    type: 'error',
                    //duration: 1000
                })
                return false
            }
            if (file.size > 5242880) {
                this.$message({
                    message: '文件不能大于5M',
                    type: 'error',
                    //duration: 1000
                })
                return false
            }

            this.$refs.cropper.init(file)

            /*let reader = new FileReader()
            reader.readAsDataURL(file)

            let _this = this
            reader.onload = () => {
                uploadImages({imgUrl: reader.result}).then((res) => {
                    _this.voteDetailInfo.imgPath = res.data.data
                    _this.$forceUpdate()
                })
            }*/
            return false
        },
        uploadCropperImg(file) {
            let reader = new FileReader()
            reader.readAsDataURL(file)

            let _this = this
            reader.onload = () => {
                uploadImages({imgUrl: reader.result}).then((res) => {
                    _this.voteDetailInfo.imgPath = res.data.data
                    _this.$forceUpdate()
                })
            }
        },
        handleUploadVideo(file) {
            file.oneTime = new Date()
            let tmp = file.name.split('.')
            let name = tmp[tmp.length - 1]
            if (name !== 'mp4' && name !== 'Mp4') {
                this.$message.error('请选择mp4文件类型')
                return false
            }
            this.videoUrl = null
            file.oneTime = new Date()

            let reader = new FileReader()
            reader.readAsDataURL(file)

            let _this = this
            reader.onload = () => {
                const data = {
                    file: reader.result,
                    name: file.name
                }
                uploadVideo({ data: data }).then(res => {
                    const data = res.data
                    if (data.code == '00000') {
                        _this.voteDetailInfo.videoPath =  data.data.filePath
                    } else {
                        _this.$message.error('上传失败')
                    }
                })
            }
        },
        saveVoteDetail() {
            if (this.voteDetailInfo.imgPath == null || this.voteDetailInfo.imgPath.length == 0) {
                this.$message.error('请上传图片')
                return
            }

            if (this.voteInfo.voteType == '4' && (this.voteDetailInfo.videoPath == null || this.voteDetailInfo.videoPath.length == 0)) {
                this.$message.error('请上传视频')
                return
            }

            if (this.voteDetailInfo.nameItem.trim().length == 0) {
                this.$message.error('请输入名称')
                return
            }

            if (this.voteDetailInfo.voteIntro.trim().length == 0) {
                this.$message.error('请输入介绍')
                return
            }

            if (this.voteDetailInfo.id && this.voteDetailInfo.id != null && this.voteDetailInfo.id != '') {
                const data  = {
                    tzVoteDetail: this.voteDetailInfo
                }
                editVoteDetail({ data: data}).then(res =>{
                    const result = res.data
                    if (result.code == '00000') {
                        this.$message.success('修改成功')
                        this.editDialogVisible = false
                        this.getTzVoteDetailList()
                    } else {
                        this.$message.error(result.msg)
                    }
                })
            } else {
                const data  = {
                    tzVoteDetail: this.voteDetailInfo
                }
                data.tzVoteDetail.voteId = this.search.voteId
                addVoteDetail({ data: data}).then(res =>{
                    const result = res.data
                    if (result.code == '00000') {
                        this.$message.success('新增成功')
                        this.editDialogVisible = false
                        this.getTzVoteDetailList()
                    } else {
                        this.$message.error(result.msg)
                    }
                })
            }
        },
        editStatus(id, status) {
            let msg = ''
            let data = {
                id: id+''
            }
            if (status == 1) {
                data.status = '2'
                msg = '确定要屏蔽该投票项吗？'
            } else if (status == 2) {
                data.status = '1'
                msg = '确定要取消该投票项的屏蔽吗？'
            }
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                editVoteDetailStatus({data: data}).then(res => {
                    const result = res.data
                    if (result.code == '00000') {
                        this.$message.success('修改成功')
                        this.getTzVoteDetailList()
                    } else {
                        this.$message.error(result.msg)
                    }
                })
            })
        },
        delDetail(id) {
            this.$confirm('确定要删除该投票项吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteVoteDetail(id).then(res =>{
                    const result = res.data
                    if (result.code == '00000') {
                        this.$message.success('删除成功')
                        this.getTzVoteDetailList()
                    } else {
                        this.$message.error(result.msg)
                    }
                })
            })
        },
        getVoteUser(id) {
            this.userDialogVisible = true
            this.userPageNum = 1
            this.userPageSize = 10
            this.getTzVoteUserList(id)
        },
        getTzVoteUserList(id) {
            this.userTableLoading = true
            const data = {
                tzVoteUser: {
                    voteDetailId: id
                },
                pageVo: {
                    pageNumber: this.userPageNum,
                    pageSize: this.userPageSize,
                }
            }
            queryTzVoteUserListByPage({ data: data }).then(res =>{
                this.userTableLoading = false
                const data = res.data

                if (data.code == '00000') {
                    this.userTableData = data.data.records
                    this.userTotal = data.data.total
                }
            })

        }
    }
}
</script>

<style lang="scss" scoped>
.empty {
    float: left;
    width: 100%;
    text-align: center;
}

.content-box {
    border-radius: 8px; padding: 10px; border: 3px rgb(237, 130 ,101) solid;
    width: 100%;

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

    .button-box {
        margin-top: 10px; border-top: 3px rgb(237, 130, 101) dashed; display: flex; flex-direction: column;

        .row {
            margin-top: 10px; display: flex; flex-direction: row;

            .row-left {
                cursor: pointer;
                height: 30px;
                line-height: 30px;
                border-radius: 5px;
                background-color: rgb(226, 66, 64);
                color: white;
                width: calc(50% - 3px);
            }

            .row-right {
                cursor: pointer;
                height: 30px;
                line-height: 30px;
                border-radius: 5px;
                background-color: rgb(226, 66, 64);
                color: white; width: calc(50% - 3px);
                margin-left: 6px;
            }
        }
    }
}
</style>
