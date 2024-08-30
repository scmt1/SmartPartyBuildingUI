<template>
    <div>
        <tree-and-table>
            <template v-slot:tree>
                <organization-tree @selectByTree="selectByTree" @getDeptId="getDeptId"
                                   :loading="dataListLoading"></organization-tree>
            </template>
            <template v-slot:search>
                <el-form ref="searchForm" :model="search" label-width="90px" inline size="medium"
                         style="text-align: left;">
                    <el-form-item prop="awardName" label="颁奖单位：">
                        <el-input style="width: 200px;" maxlength="150" v-model="search.awardName"
                                  placeholder="颁奖单位" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item prop="honorName" label="荣誉名称：">
                        <el-input clearable v-model="search.honorName" placeholder="请输入名称"
                                  style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item prop="honorType" label="荣誉类型：">
                        <el-select v-model="search.honorType" clearable placeholder="请选择" style="width: 200px;">
                            <el-option v-for="item in honorTypeOptions" :key="item.id" :value="item.itemValue"
                                       :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="honorClass" label="荣誉等级：">
                        <el-select v-model="search.honorClass" clearable placeholder="请选择" style="width: 180px;">
                            <el-option v-for="item in honorClassOptions" :key="item.id" :value="item.itemValue"
                                       :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="getYear" label="获奖年份：" v-if="drop">
                        <el-date-picker clearable v-model="search.getYear" type="year" value-format="yyyy"
                                        placeholder="选择年份" size="small" style="width: 180px;"></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <a class="drop-down" @click="dropDown">
                            {{ dropDownContent }}
                            <i :class="dropDownIcon"></i>
                        </a>
                    </el-form-item>
                    <el-form-item style="margin-left: 20px;">
                        <el-button size="small" @click="ok" icon="el-icon-search" class="topBtn">搜索</el-button>
                        <el-button size="small" @click="reset('searchForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </template>

            <template v-slot:table>
                <el-table
                    v-loading="tableLoading"
                    ref="multipleTable"
                    :data="organizationHonorList"
                    border
                    max-height="700"
                    :cell-style="{'text-align':'center'}"
                    :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                    tooltip-effect="dark"
                    style="width: 100%"
                    :key="Math.random()">
                    <el-table-column fixed="left" type="selection" width="40"></el-table-column>
                    <el-table-column label="获奖者" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <template v-if="scope.row.honorType == 1">
                                {{ scope.row.tzSysDept?.name ? scope.row.tzSysDept?.name : '--' }}
                            </template>
                            <template v-else-if="scope.row.honorType == 2">
                                {{ scope.row.partyMember?.realName ? scope.row.partyMember?.realName : '--' }}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="awardName" label="颁奖单位" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="honorName" label="荣誉名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="honorType" label="荣誉类型">
                        <template slot-scope="scope">
                            {{ getDirectLabelByValue(scope.row.honorType, honorTypeOptions) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="honorClass" label="荣誉级别" width="120">
                        <template slot-scope="scope">
                            {{ getDirectLabelByValue(scope.row.honorClass, honorClassOptions) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="getYear" label="获奖年份" width="120">
                        <template slot-scope="scope">
                            {{ new Date(scope.row.getYear).getFullYear() }}
                        </template>
                    </el-table-column>

                    <el-table-column label="荣誉图片" width="300">
                        <template slot-scope="scope">
                            <el-image
                                style="width: 300px;height: 100px;"
                                :src="scope.row.imagePath"
                                :preview-src-list=[scope.row.imagePath]
                            ></el-image>
                        </template>
                    </el-table-column>
                </el-table>
                .
            </template>
            <template v-slot:pagination>
                <el-pagination v-if="organizationHonorList.length"
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page="pageNum"
                               :page-sizes="[10, 20, 50, 100]"
                               :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="total">
                </el-pagination>
            </template>
        </tree-and-table>
    </div>
</template>

<script>
import TreeAndTable from "@/components/TreeAndTable.vue";
import organizationTree from '@/views/dj/components/organizationTree'
import {queryTzPartyHonorList} from "@/api/TzPartyHonor";
import {getDictByType2} from "@/api/tDictData";
import {mapGetters} from "vuex";

export default {
    name: "honorShow",
    components: {
        TreeAndTable,
        organizationTree
    },
    data() {
        return {
            dataListLoading: false,
            drop: false,
            dropDownContent: "展开",
            dropDownIcon: "el-icon-arrow-down",
            tableLoading: false,
            organizationHonorList: [],
            search: {
                deptId: '',
                awardName: '',
                honorName: '',
                honorType: '',
                honorClass: '',
                getYear: '',
                status: 2
            },
            pageNum: 1,
            pageSize: 10,
            total: 0,
            honorTypeOptions: [],
            honorClassOptions: [],
            honorStatusOptions: []
        }
    },
    mounted() {
        this.getHonorList()
        this.getDict('honorClass')
        this.getDict('honorType')
        this.getDict('honorStatus')

    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    methods: {
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
        getDict(type) {
            getDictByType2(type).then(res => {
                let data = res.data
                if (type === 'honorClass') {
                    this.honorClassOptions = data
                } else if (type === 'honorType') {
                    this.honorTypeOptions = data
                } else if (type === 'honorStatus') {
                    this.honorStatusOptions = data
                }
            })
        },
        selectByTree(data) {
            this.search.deptId = data.whereMap.deptId
            this.getHonorList()
        },
        getDeptId(data) {
            this.search.deptId = data.deptId
            this.getHonorList()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getHonorList()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getHonorList()
        },
        reset(formName) {
            this.$refs[formName].resetFields()
        },
        ok() {
            this.pageSize = 10
            this.pageNum = 1
            this.getHonorList()
        },
        getHonorList() {
            this.tableLoading = true
            const data = {
                tzPartyHonor: this.search,
                pageVo: {
                    pageNumber: this.pageNum,
                    pageSize: this.pageSize
                }
            }
            queryTzPartyHonorList({data: data}).then(res => {
                this.tableLoading = false
                const result = res.data
                if (result.code = '00000') {
                    this.organizationHonorList = result.data.records
                    this.total = result.data.total
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
    }
}
</script>

<style scoped lang="scss">
.honorShow {
    //height:calc(100vh - 70px)
}

::v-deep .el-carousel__item {
    width: calc(100% - 120px);
    margin-left: 60px;
}

.head-content {
    display: flex;
    justify-content: center;

    .line-box {
        flex: 1;
        position: relative;

        .left-line-top {
            height: 1px;
            width: calc(100% - 60px);
            background: rgb(255, 195, 0);
            top: 30px;
            right: -3px;
            position: absolute;
        }

        .left-line-bottom {
            height: 1px;
            width: calc(100% - 100px);
            background: rgb(255, 195, 0);
            top: 35px;
            right: -5px;
            position: absolute;
        }

        .right-line-top {
            height: 1px;
            width: calc(100% - 60px);
            background: rgb(255, 195, 0);
            top: 30px;
            left: -3px;
            position: absolute;
        }

        .right-line-bottom {
            height: 1px;
            width: calc(100% - 100px);
            background: rgb(255, 195, 0);
            top: 35px;
            left: -5px;
            position: absolute;
        }
    }

    .star-img-box {
        width: 23px;

        .img {
            width: 100%;
            margin-top: 20px;
        }
    }

    .honor-box {
        display: flex;
        flex-direction: column;
        width: 100px;
        margin: 0 5px;

        .title {
            color: rgb(225, 53, 27);
            font-weight: bold;
            font-size: 16px;
            text-align: center;
        }

        .img-box {
            margin-top: -28px;

            .img {
                width: 100%;
            }
        }
    }
}


::v-deep .el-carousel__arrow {
    background: rgba(225, 53, 27, 1);
    margin-top: -30px;
}


.img-box {
    position: relative;
    width: 100%;
    height: 0px;
    padding-top: 67.924%;
    margin-bottom: 10px;

    .img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.carousel-box {
    display: flex;
    // align-items: center;
    justify-content: center;

    .carousel-content-box {
        height: 100%;
        width: 25%;
        padding: 0 25px;
        font-weight: bold;

        .decorate-box {
            position: relative;

            .decorate-img {
                width: 100%;
                height: 28px;
                margin-bottom: 10px;
            }

            .decorate-text {
                position: absolute;
                color: white;
                top: 0;
                width: 100%;
                text-align: center;
                line-height: 28px;
            }
        }
    }

    .center {
        text-align: center;
    }
}

.empty {
    text-align: center;
    color: #B4B4B9FF;
    padding: 100px 0;
}

</style>
