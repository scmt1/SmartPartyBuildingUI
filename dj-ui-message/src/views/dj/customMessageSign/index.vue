<template>
    <div class="customUserGroup">
        <div style="padding: 15px; background: white;">
            <div class="flex-box">
                <div class="search-div" style="width: 300px;">
                    <div class="label">
                        签名：
                    </div>
                    <div class="input-box" style="width: 200px;">
                        <el-input clearable v-model="search.sign" placeholder="请输入签名" size="small" style="width: 200px;"></el-input>
                    </div>
                </div>
                <el-button size="small" icon="el-icon-plus" @click="showEditFrame()" type="danger"
                           style="background:  rgba(228, 53, 43, 1);color:#ffffff;border-color: rgba(228, 53, 43, 1);">新增</el-button>
                <el-button size="small" icon="el-icon-search" style="background:  rgba(228, 53, 43, 1);color:#ffffff;border-color: rgba(228, 53, 43, 1);"
                           @click="searchPage">搜索
                </el-button>
            </div>
            <div class="label-container">
                <div class="label-content" :style="{justifyContent: messageList.length === 0 ? 'center' : ''}">
                    <div v-for="(item, index) in messageList" :key="index" class="label-item">
                        <div class="font-line">
                            签名：{{ item.sign }}
                        </div>
                        <div class="font-line">
                            创建时间：{{ item.createTime }}
                        </div>
                        <div class="op-btn-wrapper">
                            <span @click="showEditFrame(item.id)">编辑</span>
                            <span @click="deleteLabel(item.id)">删除</span>
                        </div>
                    </div>
                    <div v-if="messageList.length === 0" class="no-data">暂无数据</div>
                </div>
            </div>
            <div style="margin: 10px;">
                <el-pagination
                    v-if="messageList!=null&&messageList.length"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="search.pageNumber"
                    :page-sizes="[10, 20, 50]"
                    :page-size="search.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
            <update :id="messageSignId" :value="showModal" :modal-title="title" @close="showModal = false" @refresh="searchPage()"></update>
        </div>
    </div>
</template>

<script>
import update from "./update";
import {queryMessageSign, deleteMessageSign} from "@/api/tzMessageSign";

export default {
    name: "index",
    components: {update},
    data() {
        return {
            search:{
                sign:'',
                pageNumber:1,
                pageSize:20,
            },
            messageList: [],
            messageSignId: null,
            showModal: false,
            title: '',
            total:0
        }
    },
    mounted() {
      this.searchPage()
    },
    methods: {
        showEditFrame(messageSignId) {
            this.messageSignId = messageSignId || null
            this.title = '新增签名'
            if(messageSignId) {
                this.title = '修改签名'
            }
            this.showModal = true
        },
        deleteLabel(messageSignId) {
            this.$confirm('确认要删除该数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                type: 'warning'
            }).then(() => {
                deleteMessageSign( messageSignId).then(res => {
                    const data = res.data
                    if (data.code == '00000') {
                        this.$message.success('删除成功')
                        this.searchPage()
                    }
                })
            }).catch(() => {

            });
        },
        handleSizeChange(val) {
            this.search.pageSize = val
            this.searchPage()
        },
        handleCurrentChange(val) {
            this.search.pageNumber = val
            this.searchPage()
        },
        searchPage() {
            let data = {
                tzMessageSign:{
                    sign: this.search.sign,
                    pageNumber: this.search.pageNumber,
                    pageSize: this.search.pageSize
                },
            }
            queryMessageSign(data).then(res => {
                if (res.data.code == '00000') {
                    this.messageList = res.data.data.records
                    this.total = res.data.data.total
                }
            })
        }
    }
}
</script>

<style lang="less">
@import url("//unpkg.com/element-ui@2.15.7/lib/theme-chalk/index.css");

.customUserGroup {
    .search-div {
        padding: 0 10px 10px 0;
        box-sizing: border-box;
        width: 260px;
        display: inline-flex;
        align-items: center;
        .input-box {
            width: 150px;
        }
        .label {
            flex: 1;
            text-align: right;
        }
    }

    .label-container {
        background-color: #f2f2f6;
        padding: 10px;
        margin-top: 10px;
        border-radius: 10px;

        .label-tips {
            margin: 15px 0 10px 0;

            .label-type {
                font-size: 16px;
                font-weight: bold;
            }

            .label-tips {
                font-size: 14px;
                color: #999;
                margin-left: 15px;
            }
        }

        .label-content {
            display: flex;
            flex-wrap: wrap;

            .label-item {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: 215px;
                height: 150px;
                padding: 12px;
                font-size: 12px;
                color: #666;
                background: white;
                border: 1px solid #E8E9EC;
                border-radius: 4px;
                margin: 0 12px 12px 0;

                .label-name {
                    font-size: 14px;
                    color: #000;
                }

                .op-btn-wrapper {
                    text-align: right;

                    & span {
                        color: #155bd4;
                        cursor: pointer;
                        margin-left: 8px;
                    }
                }
            }
        }
    }
}
</style>
