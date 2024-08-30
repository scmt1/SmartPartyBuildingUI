<template>
    <Modal v-model="show" :mask-closable="false" :closable="false" width="1400px" footer-hide closable
           @on-visible-change="cancel">

        <div class="search-div">
            请选择范围：
            <el-select v-model="form.type" clearable placeholder="请选择" size="small" @change="typeChange" style="width: 250px;">
                <el-option v-for="(item,index) in typeList" :key="index" :label="item.label"
                           :value="item.itemValue"></el-option>
            </el-select>
        </div>
        <div class="search-div" v-if="form.type == '3' || form.type == '4'">
            请选择职务：
            <el-select v-model="selectedPositionList" multiple  clearable placeholder="请选择职务">
                <el-option v-for="(item,index) in positionList" :key="index" :label="item.label"
                           :value="item.itemValue.toString()"></el-option>
            </el-select>
        </div>
        <div v-if="form.createTime != null && form.createTime != ''" class="search-div">
            <span>创建时间：{{ form.createTime }}</span>
            <span style="margin-left: 15px;" v-if="form.updateTime != null && form.updateTime != ''">修改时间：{{ form.updateTime }}</span>
        </div>

        <div class="modal-content">
            <div class="left" style="display: flex; flex-direction: column">
                <div style="font-size: 18px;">组织选择</div>
                <organizationTreeSelect @selectByTree="selectByTree" @checkedKeysChange="checkedKeysChange"
                                        @checkedNodesChange="checkedNodesChange" :key="treeKey"
                                        :checkedKeys="checkedKeys" :show-checkbox="showCheckbox"
                                   style="min-height: 535px; height: 100%; width:100%"/>
            </div>
            <div class="body">
                <div style="font-size: 18px;">
                    <template v-if="form.type == '2' || this.form.type == '4'">
                        当前部门党员
                    </template>
                    <template v-else>
                        当前及其所有下级部门党员
                    </template>
                </div>
                <div>
                    <div class="search-div">
                        姓名：
                        <el-input clearable v-model="whereMap.realName" placeholder="姓名" size="small"
                                  style="width: 90px;"></el-input>
                    </div>
                    <div class="search-div">
                        手机号：
                        <el-input clearable v-model="whereMap.phone"  size="small" placeholder="手机号"
                                  style="width: 100px;"></el-input>
                    </div>
                    <div class="search-div">
                        职务：
                        <el-select v-model="whereMap.position" clearable placeholder="请选择" size="small"
                                   style="width: 100px;">
                            <el-option v-for="(item,index) in positionList" :key="index" :label="item.label"
                                       :value="item.itemValue"></el-option>
                        </el-select>
                    </div>
                    <el-button size="small" @click="search" style="background: #b20000;color:#ffffff">搜索</el-button>
                </div>
                <el-table
                    :data="tableDataNow"
                    v-loading="tableLoading"
                    :cell-style="cellStyle"
                    :header-cell-style="{'text-align':'center',background : '#f8f8f9'}"
                    border
                    tooltip-effect="dark"
                    height="535"
                    style="width: 100%;margin-top: 10px;">
                    <el-table-column prop="deptName" label="部门"></el-table-column>
                    <el-table-column prop="realName" width="100" label="姓名"/>
                    <el-table-column prop="phone" label="电话" width="120"/>
                    <el-table-column label="职务">
                        <template slot-scope="scope">
                            {{ convertFiled(scope.row.position, 'position') }}
                        </template>
                    </el-table-column>
                    <el-table-column v-if="form.type == '5'" width="120" label="操作">
                        <template slot-scope="scope">
                            <div style="cursor: pointer" @click="selectRow(scope.row, scope.$index)">选择</div>
                        </template>
                    </el-table-column>
                </el-table>

            </div>
            <div class="right">
                <div style="font-size: 18px">
                    <div v-if="form.type == '1'">已选部门列表-当前及其所有下级</div>
                    <div v-else-if="form.type == '2'">已选部门列表-仅当前部门</div>
                    <div v-else-if="form.type == '3'">职务-已选择部门-当前及其所有下级部门</div>
                    <div v-else-if="form.type == '4'">职务-已选择部门-仅当前部门</div>
                    <div v-else-if="form.type == '5'">已选择党员</div>
                </div>


                <div style="margin-top: 10px;height: 100%;border: 1px solid #dcdee2;">
                    <template v-if="form.type != '5'">
                        <div v-for="(item, index) in selectedDeptList" :key="index" class="select-list">
                            <div class="select-name" style="flex: 1;">{{ item.name }}</div>
                            <div class="select-icon" @click="deleteItem(item.id, item)">
                                <i class="el-icon-error" style="color: rgb(119, 119, 119)"></i>
                            </div>
                        </div>
                    </template>

                    <template v-if="form.type == '5'">
                        <div v-for="(item,index) in selected" :key="index" class="select-list">
                            <div class="select-name">{{ item.realName }}</div>
                            <div class="select-phone">{{ item.phone + ';' }}</div>
                            <div class="select-icon" @click="deleteItem(item.id, item)">
                                <i class="el-icon-error" style="color: rgb(119, 119, 119)"></i>
                            </div>
                        </div>
                    </template>

                </div>
            </div>
        </div>
        <div style="margin-top: 10px;text-align:center">
            <el-pagination
                v-if="tableDataNow!=null&&tableDataNow.length"
                :current-page="pageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"/>
        </div>

        <!--<div slot="footer" class="footer">-->
        <div @click="confirm" style="text-align: center;">
            <div class="button">保存设置</div>
        </div>
        <!--</div>-->
    </Modal>
</template>

<script>
import organizationTreeSelect from '@/views/dj/components/organizationTreeSelect'
import {queryPartyMemberList} from "@/api/jcxfPartyMember";
import {getDictByType2} from "@/api/tDictData";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import {saveTzStudyView ,getTzStudyViewByStudyId} from "@/api/tzStudyView";
import {fromArc} from "zrender/lib/core/bbox";
import {mapGetters} from "vuex";

export default {
    name: 'SelectTemplate',
    components: {
        organizationTreeSelect
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        studyId: {
            type: String,
            default: null
        },
        columnId: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            whereMap: {
                deptId: '',
                realName: '',
                phone: '',
                position: ''
            },
            selected: [],
            selectedMap: {},
            show: this.value,
            pageSize: 10,
            pageNum: 1,
            total: 0,
            title: '',
            tableDataNow: [],
            tableLoading: false,
            positionList: [],
            checkedKeys: [],
            typeList: [],
            form: {
                id: '',
                type: '1',
                studyId: '',
                partyMemberIds: '',
                deptIds: '',
                positionIds: '',
                createTime: null,
                updateTime: null,
                messageTime: null,
                columnId: null
            },
            selectedDeptList: [],
            showCheckbox: true,
            selectedPositionList: [],
            treeKey: 0
        }
    },
    watch: {
        value(val) {
            this.show = this.value
            if (val) {
                this.treeKey++
                this.$nextTick(() => {
                    this.reset()
                    this.init()
                })
            }
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    methods: {
        fromArc,
        async init() {
            this.getDict2('position')
            this.getDict('viewScopeType')
            await this.getStudyView()

            if (this.checkedKeys.length > 0) {
                this.getDeptId(this.checkedKeys[0])
            } else {
                let deptId = this.deptInfo.id
                this.getDeptId(deptId)
            }
        },
        getDict(type) {
            getDictByType2(type).then((res) => {
                let data = res.data
                if (type == 'viewScopeType') {
                    this.typeList = data
                }
            })
        },
        getDict2(type) {
            getDictByCode(type).then((res) => {
                let data = res.data.data
                if (type == 'position') {
                    this.positionList = data
                    this.positionList.forEach(i => {
                        i.itemValue = parseInt(i.itemValue)
                    })
                }
            })
        },
        convertFiled(row, type) {
            let tmp = ''
            if (type == 'position') {
                this.positionList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            }
            return tmp
        },
        getStudyView() {
            return new Promise((resolve, reject) => {
                getTzStudyViewByStudyId(this.studyId).then(res => {
                    if (res.data.code == '00000') {
                        let data = res.data.data
                        if (data) {
                            this.form.id = data.id
                            this.form.type = data.type
                            this.form.createTime = data.createTime
                            this.form.updateTime = data.updateTime
                            this.form.messageTime = data.messageTime

                            if (data.type != '5') {
                                let va = data.deptIds.split(',')
                                for (let i = 0; i < va.length; i++) {
                                    if (va[i] != '') {
                                        this.checkedKeys.push(va[i])
                                    }
                                }
                                this.selectedDeptList = data.tzSysDeptList
                            }
                            if (data.type == '3' || data.type == '4') {
                                let va = data.positionIds.split(',')
                                for (let i = 0; i < va.length; i++) {
                                    if (va[i] != '') {
                                        this.selectedPositionList.push(va[i])
                                    }
                                }
                            }

                            if (data.type == '5') {
                                this.selected = data.partyMemberList
                                for (let i = 0; i < this.selected.length > 0; i++) {
                                    this.selectedMap[this.selected[i].id+'_index'] = true
                                }
                            }
                            this.typeChange()
                        }
                        resolve()
                    }
                })
            })
        },
        typeChange() {
            if (this.form.type != '5') {
                this.showCheckbox = true
            } else {
                this.showCheckbox = false
            }
        },
        checkedKeysChange(event) {
            this.checkedKeys = event
        },
        checkedNodesChange(event) {
            this.selectedDeptList = event
        },
        search() {
            this.pageSize = 10
            this.pageNum = 1
            this.getDataById()
        },
        confirm() {
            let type = this.form.type
            if (type != '5') {
                if (this.checkedKeys.length == 0) {
                    this.$message.info('请选择部门')
                    return
                }
                this.form.deptIds = ',' + this.checkedKeys + ','
                if (type == '1' || type == '2') {
                    this.form.positionIds = ''
                } else if (type == '3' || type == '4') {
                    if (this.selectedPositionList.length == 0) {
                        this.$message.info('请选择职务')
                        return
                    }
                    this.form.positionIds =  ',' + this.selectedPositionList + ','
                }

                this.form.partyMemberIds = ''
            } else {
                if (this.selected.length == 0) {
                    this.$message.info('请选择党员')
                    return
                }
                let ids = ''
                for (let i = 0; i < this.selected.length; i++) {
                    ids += this.selected[i].id + ','
                }
                if (ids.length > 0) {
                    ids = ',' + ids
                }
                this.form.partyMemberIds = ids

                this.form.deptIds = ''
                this.form.positionIds = ''
            }

            this.form.studyId = this.studyId
            this.form.columnId = this.columnId

            saveTzStudyView({data: this.form}).then(res => {
                if (res.data.code == '00000') {
                    this.$message.success('保存成功')
                    this.reset()
                    this.show = false
                    this.$emit('close')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        reset() {
            this.selected = []
            this.pageSize = 10
            this.pageNum = 1
            this.tableDataNow = []

            //重置树相关
            this.selectedDeptList = []
            this.checkedKeys = []
            this.showCheckbox = true

            //重置职务
            this.selectedPositionList = []

            this.form = {
                id: '',
                type: '1',
                studyId: '',
                partyMemberIds: '',
                deptIds: '',
                positionIds: '',
                createTime: null,
                updateTime: null,
                messageTime: null
            }
        },
        selectByTree(data) {
            this.whereMap.deptId = data.whereMap.deptId
            this.pageSize = data.pageSize
            this.pageNumber = data.pageNum
            this.getDataById()
        },
        getDeptId(deptId) {
            this.whereMap.deptId = deptId
            this.getDataById()
        },
        // 获取分页信息
        getDataById() {
            this.tableLoading = true
            let data = this.whereMap
            data.pageSize = this.pageSize
            data.pageNumber = this.pageNum

            if (this.form.type == '2' || this.form.type == '4') {
                data.onlyThisDept = '1'
            } else {
                data.onlyThisDept = null
            }
            queryPartyMemberList({data: data}).then((res) => {
                this.tableLoading = false
                const data = res.data
                if (data.code == '00000') {
                    for (let i = 0; i < data.data.records.length > 0; i++) {
                        if (this.selectedMap[data.data.records[i].id+'_index']) {
                            data.data.records[i].isSelected = true
                        } else {
                            data.data.records[i].isSelected = false
                        }
                    }
                    this.tableDataNow = data.data.records
                    this.total = data.data.total
                } else {
                    this.$message.error('获取党员数据出错')
                }
            }).catch(e => {
                this.loading = false;
            })
        },
        cancel(event) {
            if (!event) {
                this.reset()
                this.$emit('cancel')
            }
        },
        cellStyle({row, column, rowIndex, columnIndex}) {
            let tmp = {textAlign: 'center'}
            if (columnIndex == 4) {
                tmp.cursor = 'pointer'
            }

            if (row && row.isSelected && columnIndex == 4) {
                tmp.backgroundColor = '#dbf0e2'
                tmp.color = '#36ab60'
            }
            return tmp
        },
        deleteItem(id, item) {
            if (this.form.type == '1' || this.form.type == '2') {
                this.delCheckedKeysNode(id, item)
            }
            if (this.form.type == '5') {
                this.delPartyMember(id, item)
            }
        },
        delCheckedKeysNode(id, item) {
            let num1 = this.checkedKeys.indexOf(id)
            if (num1 > -1) {
                this.checkedKeys.splice(num1 , 1)
            }
            let num2 = this.selectedDeptList.indexOf(item)
            if (num2 > -1) {
                this.selectedDeptList.splice(num2 , 1)
            }
        },
        delPartyMember(id, item) {
            let num = this.selected.indexOf(item)
            if (num > -1) {
                this.selected.splice(num, 1)
            }

            for (let i = 0; i < this.tableDataNow.length; i++) {
                if (this.tableDataNow[i].id == id) {
                    this.tableDataNow[i].isSelected = false
                    delete this.selectedMap[id+'_index']
                    break
                }
            }

            // this.tableKey++
            /*this.selected = this.selected.filter(item => item.id !== id)
            this.tableDataNow = this.tableDataNow.map(item => {
                if (item.id === id) {
                    return {...item, isSelected: false}
                } else {
                    return {...item}
                }
            })*/
        },
        selectRow(row, index) {
            if (this.tableDataNow[index].id == row.id && !this.tableDataNow[index].isSelected) {
                this.selected.push(row)
                this.tableDataNow[index].isSelected = true

                this.selectedMap[row.id+'_index'] = true
                // this.tableKey++
            }

            /*this.tableDataNow = this.tableDataNow.map(item => {
                if (item.id === row.id && !item.isSelected) {
                    this.selected.push(row)
                    return {...item, isSelected: true}
                } else {
                    return {...item}
                }
            })*/
        },
        close() {
            this.$emit('close')
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getDataById()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getDataById()
        }
    }
}
</script>

<style lang="scss" scoped>

.select-list {
    display: flex;
    align-items: center;
    padding: 3px 10px;
    word-break: break-all;

    .select-name {
        margin-left:5px;
        width: 90px;
    }

    .select-phone {
        width: 90px;
    }

    .select-icon{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 10px;
        cursor: pointer;
    }
}

.search-div {
    display: inline-block;
    padding: 0 10px 10px 0;
}

.button {
    cursor: pointer;
    display: inline-block;
    align-items: center;
    justify-content: center;
    background: #e24240;
    border-radius: 3px;
    font-size: 16px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: normal;
    text-align: CENTER;
    color: #ffffff;
    padding: 5px 10px;
    margin: 20px 10px;
}

.unSelected {
    background-color: #dbf0e2;
}

.body {
    width: 40%;
    margin-left: 30px;
}

.left {
    width: calc(33% - 30px);
    overflow: auto;
    position: relative;
}

.right {
    width: calc(27% - 30px);
    margin-left: 30px;
    display: flex;
    flex-direction: column;
}

.modal-content {
    //margin-top: -28px;
    width: 100%;
    display: flex;
}
</style>
