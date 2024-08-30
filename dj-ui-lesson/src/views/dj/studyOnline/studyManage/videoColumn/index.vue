<template>
    <div style="background-color: white; padding: 15px; float: left; width: 100%;" class="videoColumn">

        <div class="header-box">
            <div :class="activeName == '1'?'title active':'title'" @click="changeType('1')">图文课程专题管理</div>
            <div :class="activeName == '2'?'title2 active':'title2'" @click="changeType('2')">视频课程专题管理</div>
        </div>

        <div style="text-align: left; margin-top: 20px;">
            <div class="add-button" @click="addColumn(activeName)">
                <i class="el-icon-circle-plus"></i>
                <span style="margin-left: 5px">新建课程专题</span>
            </div>
        </div>

        <div style="display: grid;">
            <div v-if="activeName == '1'">
                <el-row class="row">
                    <template v-for="(item, index) in dataList">

                        <div class="col">
                            <div class="content-box">
                                <div class="content-top">
                                    <div @click="selectId(item.id)">{{ item.name }}</div>
                                    <div class="top-right">
                                        <el-popconfirm title="确实要删除吗？" @confirm="delVideoColumn(item.id)">
                                            <i class="el-icon-error" slot="reference" style="cursor: pointer;"></i>
                                        </el-popconfirm>
                                    </div>
                                </div>
                                <div class="img-box" @click="selectId(item.id)">
                                    <img class="img"
                                         :src="item.topPath&&item.topPath.length >0? item.topPath: defaultImg"/>
                                </div>
                                <div class="content-bottom" style="display: flex; flex-direction: column;"
                                     @click="selectId(item.id)">
                                    <div class="content"
                                         style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
                                        <el-tooltip class="item" effect="dark"
                                                    :content="item.description ? item.description : '暂无'"
                                                    placement="top-start">
                                            <span>{{ item.description ? item.description : '暂无描述' }}</span>
                                        </el-tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="index %4 == 3" style="float: left; width: 100%; height: 10px;"></div>

                    </template>
                </el-row>

            </div>

            <div v-if="activeName == '2'">
                <el-row class="row">
                    <template v-for="(item, index) in dataList">
                        <div class="col">
                            <div class="content-box">
                                <div class="content-top">
                                    <div @click="selectId(item.id)">{{ item.name }}</div>
                                    <div class="top-right">
                                        <el-popconfirm title="确实要删除吗？" @confirm="delVideoColumn(item.id)">
                                            <i class="el-icon-error" slot="reference" style="cursor: pointer;"></i>
                                        </el-popconfirm>
                                    </div>
                                </div>
                                <div class="img-box2" @click="selectId(item.id)">
                                    <img class="img"
                                         :src="item.topPath&&item.topPath.length >0? item.topPath: defaultImg"/>
                                </div>
                                <div class="content-bottom" style="display: flex; flex-direction: column;"
                                     @click="selectId(item.id)">
                                    <div style="flex: 1; overflow: auto;">
                                        <template v-if="item.description != null && item.description.length > 0">
                                            {{ item.description }}
                                        </template>
                                        <template v-else>
                                            暂无描述
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="index %4 == 3" style="float: left; width: 100%; height: 10px;"></div>
                    </template>
                </el-row>
            </div>
            <div style="margin-top: 30px;">
                <el-pagination
                        v-if="dataList.length"
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

        <el-dialog :title="title" :visible.sync="dialogVisible" width="580px" top="6vh">
            <div style="padding: 0 30px;">
                <el-form ref="form" :model="form" :rules="rules" label-width="95px">
                    <el-form-item label="封面图片：">
                        <template v-if="form.type == '1'">
                            <el-upload
                                    class="avatar-uploader3"
                                    action="#"
                                    :show-file-list="false"
                                    :headers="{Authorization: $cookie.get('Authorization_party_vp')}"
                                    :before-upload="beforeAvatarUpload">
                                <img v-if="form.imagePath" :src="form.imagePath" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon3"></i>
                            </el-upload>
                        </template>
                        <template v-else-if="form.type == '2'">
                            <el-upload
                                    class="avatar-uploader2"
                                    action="#"
                                    :show-file-list="false"
                                    :headers="{Authorization: $cookie.get('Authorization_party_vp')}"
                                    :before-upload="beforeAvatarUpload">
                                <img v-if="form.imagePath" :src="form.imagePath" class="avatar2">
                                <i v-else class="el-icon-plus avatar-uploader-icon3"></i>
                            </el-upload>
                        </template>
                    </el-form-item>
                    <el-form-item label="顶部图片：">
                        <el-upload
                                class="avatar-uploader3"
                                action="#"
                                :show-file-list="false"
                                :headers="{Authorization: $cookie.get('Authorization_party_vp')}"
                                :before-upload="beforeAvatarUpload2">
                            <img v-if="form.topPath" :src="form.topPath" class="avatar3">
                            <i v-else class="el-icon-plus avatar-uploader-icon3" style="line-height: 190px;"></i>
                        </el-upload>
                    </el-form-item>
                    <!--                    <el-form-item label="栏目编码：" prop="code">
                                            <el-input v-model="form.code" placeholder="请输入栏目编码（不超过10字符）" maxlength="10" size="medium" ></el-input>
                                        </el-form-item>-->
                    <el-form-item label="栏目名称：" prop="name">
                        <el-input v-model="form.name" placeholder="请输入栏目名称（不超过30字符）" maxlength="30"
                                  size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="排序：" prop="orders">
                        <el-input-number v-model="form.orders" :min="1" style="width: 100%;"></el-input-number>
                        <!--                        <el-input v-model="" placeholder="" type="number" size="medium" ></el-input>-->
                    </el-form-item>
                    <el-form-item label="栏目描述：" prop="description">
                        <el-input v-model="form.description" show-word-limit placeholder="请输入栏目描述（不超过100字符）" :rows="3"
                                  type="textarea" maxlength="100" size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="显示：" style="text-align: left">
                        <el-switch v-model="form.showStatus" inactive-text="否" active-text="是" :active-value="'1'"
                                   :inactive-value="'2'" style="margin-top: 12px;"></el-switch>
                    </el-form-item>
                    <el-form-item label="启用：" style="text-align: left">
                        <el-switch v-model="form.useStatus" inactive-text="否" active-text="是" :active-value="'1'"
                                   :inactive-value="'2'" style="margin-top: 12px;"></el-switch>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel()">取消</el-button>
                <el-button size="small" type="primary" @click="submitForm('form')">确定</el-button>
              </span>
        </el-dialog>
        <cropper :fixed="false" ref="cropper" @cropperResult="uploadCropperImg"></cropper>
        <cropper :fixed="false" ref="cropper2" @cropperResult="uploadCropperImg2"></cropper>
    </div>
</template>
<script>
import {addVideoColumn, deleteVideoColumn, getVideoColumn, queryVideoColumnByPage} from "@/api/tzVideoColumn";
import defaultImg from '@/assets/defaultImg.png'
import moreImg from '@/assets/studyManage/more.png'
import util from "@/libs/util";
import cropper from "@/views/dj/components/cropper.vue";
import {mapGetters} from "vuex";
import {uploadFile} from "@/api/minionFile";

export default {
    name: '',
    components: {
        cropper
    },
    data() {
        return {
            autoCropWidth: 700,
            autoCropHeight: 180,
            defaultImg: defaultImg,
            moreImg: moreImg,
            dialogVisible: false,
            form: {
                id: '',
                imagePath: '',
                topPath: '',
                code: '',
                name: '',
                description: '',
                orders: '',
                type: '',
                deptId: '',
                showStatus: 2,
                useStatus: 1
            },
            dataList: [],
            id: '',
            title: '新增栏目',
            props: {
                id: 'id',
                label: 'name',
                children: 'children'
            },
            dataListLoading: false,
            activeName: '1',
            type: '1',
            pageNum: 1,
            pageSize: 10,
            total: 0,
            rules: {
                code: [
                    {required: true, message: '这是必填字段', trigger: 'blur'}
                ],
                name: [
                    {required: true, message: '这是必填字段', trigger: 'blur'}
                ],
                orders: [
                    {
                        required: false,
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
                ]
            }
        }
    },
    created() {
        document.title = "课程分类管理";
        this.getDataList()
        this.dataListLoading = true
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    methods: {
        cancel() {
            this.dialogVisible = false
            this.$refs.form.resetFields()
        },
        changeType(type) {
            this.activeName = type
            this.type = type
            this.pageNum = 1
            this.pageSize = 10
            this.getDataList()
        },
        addColumn(type) {
            this.title = '新增'
            this.form.id = ''
            this.form.name = ''
            this.form.code = ''
            this.form.description = ''
            this.form.orders = ''
            this.form.type = type
            this.form.imagePath = ''
            this.form.topPath = ''
            this.form.showStatus = '2'
            this.form.useStatus = '1'

            this.dialogVisible = true
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 20;

            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG/PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 20MB!');
            }

            if (this.form.type == '1') {
                this.autoCropWidth = 700
                this.autoCropHeight = 180
            } else if (this.form.type == '2') {
                this.autoCropWidth = 640
                this.autoCropHeight = 580
            }
            this.$refs.cropper.init(file)
            return false
        },
        beforeAvatarUpload2(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 20;

            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG/PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 20MB!');
            }

            this.$refs.cropper2.init(file)
            return false
        },
        uploadCropperImg(file) {
            let reader = new FileReader()
            reader.readAsDataURL(file.data)
            reader.onload = () => {
                uploadFile({imgUrl: reader.result, imgName: file.name}).then(res => {
                    if (res.code == '000000') {
                        this.form.imagePath = res.data.url
                    }
                })
            }
        },
        uploadCropperImg2(file) {
            let reader = new FileReader()
            reader.readAsDataURL(file.data)
            reader.onload = () => {
                uploadFile({imgUrl: reader.result, imgName: file.name}).then(res => {
                    if (res.code == '000000') {
                        this.form.topPath = res.data.url
                    }
                })
            }
        },
        submitForm() {
            if (this.form.imagePath == null || this.form.imagePath == '') {
                this.$message.info('请上传封面图片')
                return
            }
            if (this.form.topPath == null || this.form.topPath == '') {
                this.$message.info('请上传顶部图片')
                return
            }
            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    return false
                }
                this.form.deptId = this.deptInfo.id

                addVideoColumn({data: this.form}).then(res => {
                    this.dialogVisible = false
                    const data = res.data
                    if (data.code == '00000') {
                        this.$message.success('保存成功')
                        this.reset()
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            })
        },
        selectId(id) {
            this.title = '编辑'
            this.getDataById(id)
        },
        getDataById(paramId) {
            this.dataListLoading = true

            getVideoColumn(paramId).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.form = data.data

                    if (this.form.type == '1') {
                        this.autoCropWidth = 700
                        this.autoCropHeight = 180
                    } else if (this.form.type == '2') {
                        this.autoCropWidth = 640
                        this.autoCropHeight = 580
                    }

                    this.dataListLoading = false
                    this.dialogVisible = true
                }
            }).finally(() => {
                this.dataListLoading = false
            })
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getDataList()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getDataList()
        },
        getDataList() {
            this.dataListLoading = true

            let data = {
                deptId: this.deptInfo.id + '',
                type: this.type,
                pageVo: {
                    pageSize: this.pageSize,
                    pageNumber: this.pageNum
                }
            }

            queryVideoColumnByPage({data: data}).then(res => {
                const data = res.data
                this.total = data.data.total
                if (data.code == '00000') {
                    this.dataList = data.data.records
                }
            }).finally(() => {
                this.dataListLoading = false
            })
        },
        delVideoColumn(id) {
            this.dataListLoading = true

            deleteVideoColumn(id).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.$message.success('删除成功')
                    this.reset()
                } else {
                    this.$message.error(data.msg)
                }
            }).finally(i => {
                this.dataListLoading = false
            })
        },
        reset() {
            this.getDataList()
        }
    }
}
</script>

<style lang="scss" scoped>
.videoColumn {
    @import url("//unpkg.com/element-ui@2.15.7/lib/theme-chalk/index.css");

    /deep/ .el-icon-minus {
        line-height: 38px;
    }

    /deep/ .el-icon-plus {
        line-height: 38px;
    }

    .header-box {
        display: flex;
        font-size: 16px;
        transition: all 0.5s;
        font-weight: bold;

        .title {
            line-height: 40px;
            user-select: none;
            cursor: pointer;
        }

        .title2 {
            margin-left: 20px;
            line-height: 40px;
            user-select: none;
            cursor: pointer;
        }

        .active {
            color: rgb(225, 53, 27);
            border-bottom: 2px solid rgb(225, 53, 27);
        }
    }

    .add-button {
        background: rgb(226, 66, 64);
        color: white;
        padding: 5px 20px;
        font-size: 15px;
        border-radius: 5px;
        display: inline-block;
        cursor: pointer;
    }

    .avatar-uploader ::v-deep .el-upload {
        border: 1px dashed #d9d9d9;
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
        width: 375px;
        height: 190px;
        //line-height: 90px;
        line-height: 190px;
        text-align: center;
    }

    .avatar {
        width: 375px;
        //height: 90px;
        height: 190px;
        display: block;
        object-fit: contain;
    }

    .avatar-uploader2 ::v-deep .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader2 ::v-deep .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon2 {
        font-size: 28px;
        color: #8c939d;
        width: 375px;
        //height: 290px;
        //line-height: 290px;
        height: 190px;
        line-height: 190px;
        text-align: center;
    }

    .avatar2 {
        //width: 320px;
        width: 375px;
        //height: 290px;
        height: 190px;
        display: block;
        object-fit: contain;
    }


    .avatar-uploader3 ::v-deep .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader3 ::v-deep .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon3 {
        font-size: 28px;
        color: #8c939d;
        width: 375px;
        height: 190px;
        line-height: 190px;
        text-align: center;
    }

    .avatar3 {
        width: 375px;
        height: 190px;
        display: block;
        object-fit: contain;
    }

    .title {
        text-align: left;
        font-weight: bold;
        font-size: 16px;
    }

    .divider {
        float: left;
        margin: 20px 0 10px 0;
        height: 3px;
        width: 100%;
        background: rgb(248, 248, 250);
    }

    .row {
        width: 100%;
        text-align: left;
        float: left;

        .col {
            height: 100%;
            margin-top: 15px;
            min-width: 300px;
            width: 25%;
            float: left;
            padding: 0 10px;

            .content-box {
                height: 100%;
                display: flex;
                flex-direction: column;
                padding: 0;
                box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);

                .content-top {
                    font-weight: bold;
                    padding: 10px;
                    display: flex;
                    flex-direction: row;
                    font-size: 18px;

                    .top-right {
                        flex: 1;
                        text-align: right;
                        color: red;
                    }
                }

                .img-box {
                    position: relative;
                    width: 100%;
                    cursor: pointer;

                    .img {
                        width: 100%;
                        object-fit: cover;
                    }
                }

                .img-box2 {
                    position: relative;
                    width: 100%;
                    cursor: pointer;

                    .img {
                        width: 100%;
                        object-fit: cover;
                    }
                }

                .content-bottom {
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 8;
                    color: rgb(127, 127, 127);
                    padding: 5px 10px;
                    font-size: 14px;
                    margin-top: 5px;
                    cursor: pointer;
                }
            }

            .addInfo {
                border-left: 1px solid red;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;

                .img {
                    width: 50%;
                }
            }
        }
    }


}
</style>
