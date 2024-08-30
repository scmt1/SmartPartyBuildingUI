<template>
    <div>
        <tree-and-table>
            <template v-slot:tree>
                <organization-tree @selectByTree="selectByTree" @getDeptId="getDeptId"></organization-tree>
            </template>
            <template v-slot:search>
                <div class="search-div" v-if="!isZb">
                    <div class="label">
                        组织分类选择：
                    </div>
                    <div class="input-box">
                        <el-select v-model="whereMap.organizationType" clearable placeholder="请选择" size="small" @change="changeSelect1">
                            <el-option v-for="(item,index) in organizationTypeList" :key="index" :label="item.label" :value="item.itemValue"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="search-div" v-if="!isZb">
                    <div class="label">
                        是否是退休支部：
                    </div>
                    <div class="input-box">
                        <el-select v-model="whereMap.veteran" clearable placeholder="请选择：" style="margin-right: -20px;" size="small" @change="changeSelect2">
                            <el-option label="否" value="0"></el-option>
                            <el-option label="是" value="1"></el-option>
                        </el-select>
                    </div>
                </div>
                <el-button class="topBtn" style="margin-left: 20px;"
                           plain size="small" icon="el-icon-plus" @click="gotoOrg()" v-permission-leaf-zb="whereMap">进入支部</el-button>
                <el-button plain size="small" @click="meetingClassEvent(1)" :style="whereMap.meetingType === '1' ? 'background:  rgba(228, 53, 43, 1);color:white;border-color:rgba(228, 53, 43, 1);' : '' ">
                    三会一课
                </el-button>
                <el-button plain size="small" @click="meetingClassEvent(6)" :style="whereMap.meetingType === '6' ? 'background:  rgba(228, 53, 43, 1);color:white;border-color:rgba(228, 53, 43, 1);' : '' ">
                    组织生活会(民主评议党员)
                </el-button>
            </template>

            <template v-slot:table>
                <el-table
                    v-if="whereMap.meetingType === '1'"
                    :row-class-name="tableRowClassName"
                    ref="multipleTable"
                    :data="meetingClass"
                    v-loading="dataListLoading"
                    border
                    :cell-style="{'text-align':'center'}"
                    :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                    tooltip-effect="dark"
                    style="width: 100%">
                    <el-table-column prop="year" label="年份" width="90"></el-table-column>
                    <el-table-column prop="january" label="一月">
                        <template slot-scope="scope">
                            <div :class="scope.row.a === 0 ? '' : 'cells'">
                                {{ scope.row.a }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="february" label="二月">
                        <template slot-scope="scope">
                            <div :class="scope.row.b === 0 ? '' : 'cells'">
                                {{ scope.row.b }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="march" label="三月">
                        <template slot-scope="scope">
                            <div :class="scope.row.c === 0 ? '' : 'cells'">
                                {{ scope.row.c }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="april" label="四月">
                        <template slot-scope="scope">
                            <div :class="scope.row.d === 0 ? '' : 'cells'">
                                {{ scope.row.d }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="may" label="五月">
                        <template slot-scope="scope">
                            <div :class="scope.row.e === 0 ? '' : 'cells'">
                                {{ scope.row.e }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="june" label="六月">
                        <template slot-scope="scope">
                            <div :class="scope.row.f === 0 ? '' : 'cells'">
                                {{ scope.row.f }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="july" label="七月">
                        <template slot-scope="scope">
                            <div :class="scope.row.g === 0 ? '' : 'cells'">
                                {{ scope.row.g }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="august" label="八月">
                        <template slot-scope="scope">
                            <div :class="scope.row.h === 0 ? '' : 'cells'">
                                {{ scope.row.h }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="september" label="九月">
                        <template slot-scope="scope">
                            <div :class="scope.row.i === 0 ? '' : 'cells'">
                                {{ scope.row.i }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="october" label="十月">
                        <template slot-scope="scope">
                            <div :class="scope.row.j === 0 ? '' : 'cells'">
                                {{ scope.row.j }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="november" label="十一月">
                        <template slot-scope="scope">
                            <div :class="scope.row.k === 0 ? '' : 'cells'">
                                {{ scope.row.k }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="december" label="十二月">
                        <template slot-scope="scope">
                            <div :class="scope.row.l === 0 ? '' : 'cells'">
                                {{ scope.row.l }}
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table
                    v-if="whereMap.meetingType === '6'|| whereMap.meetingType === '3'"
                    :row-class-name="tableRowClassName"
                    v-loading="dataListLoading"
                    ref="multipleTable"
                    :data="meetingClass"
                    border
                    :cell-style="{'text-align':'center'}"
                    :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                    tooltip-effect="dark"
                    style="width: 100%">
                    <el-table-column prop="year" label="年份">
                    </el-table-column>
                    <el-table-column prop="oneYear" label="全年">
                        <template slot-scope="scope">
                            <div :class="scope.row.oneYear === 0 ? '' : 'cells'">
                                {{ scope.row.oneYear }}
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </tree-and-table>
    </div>

</template>
<script>
import organizationTree from '@/views/dj/components/organizationTree'
import {getMeetingDecadeCount, getMeetingDecadeCountGroupByYear} from "@/api/jcxfOrganizationLife";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import TreeAndTable from "@/components/TreeAndTable.vue";

export default {
    components: {
        TreeAndTable,
        organizationTree
    },
    data() {
        return {
            deptId: '',
            deptName: '',
            meetingClass: [],
            display: false,
            organizationTypeList: [],
            total: 0,
            whereMap: {
                meetingType: '1',
                deptId: '',
                // dept_id_child: '',
                // parentIdChild: '',
                emptyShell: '',
                undoFlag: '',
                organizationType: '',
                partyOrgType: '',
                partyType: '',
                name: '',
                veteran: '',
                type: ''
            },
            dataListLoading: true,
            isZb: false
        }
    },
    created() {
        this.getDict( 'organizationType')
    },
    methods: {
        getDeptId(data) {
            this.whereMap.deptId = data.deptId
            this.whereMap.type = data.type
            this.whereMap.isLeaf = data.isLeaf
            this.deptName = data.deptName
            const typeList = [631, 632, 931, 932]
            if (typeList.indexOf(data.type) < 0) {
                this.isZb = false
            } else {
                this.isZb = true
            }
            this.getDataById()
        },
        changeSelect1(e) {
            this.whereMap.organizationType = e
            this.getDataById()
        },
        changeSelect2(e) {
            this.whereMap.veteran = e
            this.getDataById()
        },
        meetingClassEvent(type) {
            this.meetingClass = []
            if (type === 1) {
                this.whereMap.meetingType = '1'
                this.getDataById()
            } else if (type === 6) {
                this.whereMap.meetingType = '6'
                this.getDataById2()
            } else if (type === 3) {
                this.whereMap.meetingType = '3'
                this.getDataById()
            }
        },
        selectByTree(data) {
            this.whereMap.deptId = data.whereMap.deptId
            this.whereMap.type = data.whereMap.type
            this.whereMap.isLeaf = data.whereMap.isLeaf
            this.deptName = data.whereMap.deptName
            const typeList = [631, 632, 931, 932]
            if (typeList.indexOf(data.whereMap.type) < 0) {
                this.isZb = false
            } else {
                this.isZb = true
            }
            this.getDataById()
        },
        // 获取信息
        getDataById() {
            if (this.whereMap.meetingType == '1') {
                this.getDataById1()
            } else if (this.whereMap.meetingType == '6') {
                this.getDataById2()
            }
        },
        getDataById1() {
            this.dataListLoading = true

            // 获取近一年的年月数组
            let now = new Date()
            let currentYear = now.getFullYear()
            let currentMonth = now.getMonth() + 1


            let values = []
            let yearMonthArr = []
            for (let n = 0;n < 10; n++) {
                for (let i = 0; i < 12; i++) {
                    let test = currentMonth - i + 1
                    let tmpMonth = currentMonth - i
                    let month = tmpMonth <= 0 ? tmpMonth + 12 : tmpMonth
                    let year = currentYear - Math.floor((month - 1) / 12)
                    if (month > test) {
                        year = year - 1
                    }

                    if (month < 10) {
                        month = "0" + month
                    }

                    yearMonthArr.push(year.toString() + '-' + month.toString())
                    values.push(0)
                }
                currentYear--
            }

            getMeetingDecadeCount({
                deptId:this.whereMap.deptId+"",
                veteran:this.whereMap.veteran,
                organizationType:this.whereMap.organizationType
            }).then(res => {
                const data = res.data
                if (data.code == '00000' && data.data) {
                    for (let i = 0; i < data.data.length; i++) {
                        for (let j = 0; j < yearMonthArr.length; j++) {
                            if (data.data[i].time == yearMonthArr[j]) {
                                values[j] = data.data[i].num
                                break
                            }
                        }
                    }
                }
                let tableData = []
                let lastYear = null
                let yearIndex = -1

                for (let i = 0; i < yearMonthArr.length; i++) {
                    if (lastYear == null || lastYear != yearMonthArr[i].split("-")[0]) {
                        lastYear = yearMonthArr[i].split("-")[0]
                        yearIndex++

                        tableData.push({
                            year: yearMonthArr[i].split("-")[0],
                            a: 0,
                            b: 0,
                            c: 0,
                            d: 0,
                            e: 0,
                            f: 0,
                            g: 0,
                            h: 0,
                            i: 0,
                            j: 0,
                            k: 0,
                            l: 0,
                        })
                    }
                    if (yearMonthArr[i].split("-")[1] == '01') {
                        tableData[yearIndex].a = values[i]
                    } else if (yearMonthArr[i].split("-")[1] == '02') {
                        tableData[yearIndex].b = values[i]
                    } else if (yearMonthArr[i].split("-")[1] == '03') {
                        tableData[yearIndex].c = values[i]
                    } else if (yearMonthArr[i].split("-")[1] == '04') {
                        tableData[yearIndex].d = values[i]
                    } else if (yearMonthArr[i].split("-")[1] == '05') {
                        tableData[yearIndex].e = values[i]
                    } else if (yearMonthArr[i].split("-")[1] == '06') {
                        tableData[yearIndex].f = values[i]
                    } else if (yearMonthArr[i].split("-")[1] == '07') {
                        tableData[yearIndex].g = values[i]
                    } else if (yearMonthArr[i].split("-")[1] == '08') {
                        tableData[yearIndex].h = values[i]
                    } else if (yearMonthArr[i].split("-")[1] == '09') {
                        tableData[yearIndex].i = values[i]
                    } else if (yearMonthArr[i].split("-")[1] == '10') {
                        tableData[yearIndex].j = values[i]
                    } else if (yearMonthArr[i].split("-")[1] == '11') {
                        tableData[yearIndex].k = values[i]
                    } else if (yearMonthArr[i].split("-")[1] == '12') {
                        tableData[yearIndex].l = values[i]
                    }
                }
                this.meetingClass = tableData
                this.dataListLoading = false
            })
        },
        getDataById2() {
            this.dataListLoading = true
            let now = new Date()
            let currentYear = now.getFullYear()

            let yearList = []
            for (let i = 0; i < 12; i++) {
                yearList.push(currentYear- i)
            }
            getMeetingDecadeCountGroupByYear({
                deptId:this.whereMap.deptId+"",
                veteran:this.whereMap.veteran,
                organizationType:this.whereMap.organizationType
            }).then(res => {
                let tableData = []
                const data = res.data
                if (data.code == '00000' && data.data) {
                    for (let j = 0; j < yearList.length; j++) {
                        for (let i = 0; i < data.data.length; i++) {
                            if (data.data[i].time == yearList[j]) {
                                tableData.push({
                                    year: yearList[j],
                                    oneYear: data.data[i].num
                                })
                            }
                        }
                    }
                }
                this.meetingClass = tableData
                this.dataListLoading = false
            })
        },
        tableRowClassName({row, rowIndex}) {
            row.row_index = rowIndex
        },
        getDict(type) {
            getDictByCode(type).then((res) => {
                let data = res.data.data
                if (type === 'organizationType') {
                    this.organizationTypeList = data
                }
            })
        },
        gotoOrg() {
            this.$router.push({
                path: '/dwgl/organizationLife/startMeeting',
                query: {deptId: this.whereMap.deptId, deptName: this.deptName}
            })
        }
    }
}
</script>

<style scoped lang="scss">
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

.vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
}

.vertical-center-modal .ivu-modal {
    top: 0;
}

.partyMember {

.el-dialog el-dialog--center {

::v-deep.el-dialog__body {
    padding: 25px 25px 11px
}

}
}
.cells {
    color: red;
}
</style>
