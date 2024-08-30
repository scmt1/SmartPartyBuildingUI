<template>
    <el-dialog title="发送对象选择" :visible.sync="show" width="85%" top="8vh" @close="cancel">
        <div class="modal-content">
            <div class="left">
                <div style="font-size: 18px;">组织选择</div>
                <organization-tree @selectByTree="selectByTree" style="height: calc(100% - 30px); width:100%"/>
            </div>
            <div class="body">
                <div style="font-size: 18px;margin-bottom: 5px;">
                    发送对象选择
                </div>
                <div>
                    <div class="search-div">
                        姓名：
                        <el-input clearable v-model="whereMap.realName" placeholder="姓名" size="small"
                                  style="width: 100px;"></el-input>
                    </div>
                    <div class="search-div">
                        手机号：
                        <el-input clearable v-model="whereMap.phone" size="small" placeholder="手机号"
                                  style="width: 140px;"></el-input>
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
                        ref="tableDataList"
                        @select="handleRowClick"
                        @select-all="handleAllclick"
                        :row-key="row => { return row.id }"
                        height="530"
                        v-loading="tableLoading"
                        :data="tableDataNow"
                        :header-cell-style="{'text-align':'center',background : '#f8f8f9'}"
                        border
                        tooltip-effect="dark"
                        style="width: 100%;margin-top: 10px">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column prop="realName" width="120" label="姓名"/>
                    <el-table-column prop="phone" label="电话"/>
                    <el-table-column label="职务">
                        <template slot-scope="scope">
                            {{ convertFiled(scope.row.position, 'position') }}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="right">
                <div style="font-size: 18px">已选择对象</div>
                <div style="margin-top: 10px;height: 575px;border: 1px solid #dcdee2;overflow-y: auto;">
                    <div v-for="(item,index) in selectData" style="display: flex">
                        <div style="margin-left:5px">{{ item.realName }}</div>
                        <div style="margin-left:10px">{{ item.phone }}</div>
                        <div
                                style="display: flex;align-items: center;justify-content: center;margin-left: 10px;cursor: pointer;"
                                @click="deleteItem(index, item.id)">
                            <img src="../../assets/message/close.png" style="height: 13px;width: 13px;">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="margin-top: 10px;text-align:center;margin-left: 20%;">
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

        <div slot="footer" class="footer">
            <div>
                <div class="button" @click="confirm">
                    <div class="button-font">确认选择</div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import organizationTree from '@/views/dj/components/organizationTree'
import {getPartyMemberList} from "@/api/jcxfPartyMember";
import {mapGetters} from "vuex";
import {getDictByCode} from "@/api/jcxfSysDictionary";

export default {
    name: 'SelectTemplate',
    components: {
        organizationTree
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        // eslint-disable-next-line vue/require-default-prop
        modalTitle: {
            type: String
        },
        selectSendObject: {
            default: Array
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
            rows: [],
            show: this.value,
            pageSize: 10,
            pageNum: 1,
            total: 0,
            title: '',
            tableDataNow: [],
            tableLoading: false,
            positionList: [],
            selectedMap: {},
            selectData: [],
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    watch: {
        value(val) {
            let deptId = this.deptInfo.id
            if (val) {
                this.show = val
                this.selectData = []
                this.selectedMap = {}
                if (this.selectSendObject != null && this.selectSendObject.length > 0) {
                    for (let i = 0; i < this.selectSendObject.length; i++) {
                        this.selectData.push(this.selectSendObject[i])
                        this.selectedMap[this.selectSendObject[i].id + '_index'] = true
                    }
                }
                this.getDict2('position')
                this.getDeptId(deptId)
            }
        }
    },
    methods: {
        search() {
            this.pageSize = 10
            this.pageNum = 1
            this.getDataById()
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
        confirm() {
            this.$emit("confirm", this.selectData)
            this.cancel()
        },
        reset() {
            this.selected = []
            this.rows = []
            this.pageSize = 10
            this.pageNum = 1
            this.tableDataNow = []
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
            if (!this.show) {
                return
            }
            this.tableLoading = true;
            let data = {
                ...this.whereMap,
                pageSize: this.pageSize,
                pageNumber: this.pageNum
            }

            getPartyMemberList({data: data}).then((res) => {
                this.tableLoading = false;
                const data = res.data
                if (data.code == '00000') {
                    this.tableDataNow = data.data.records
                    this.total = data.data.total
                    this.$nextTick(() => {
                        this.tableDataNow.forEach(item => {
                            this.selectData.forEach(row => {
                                if (item.id == row.id) {
                                    this.$refs.tableDataList.toggleRowSelection(item)
                                }
                            })
                        })
                    })
                } else {
                    this.$message.error('获取党员数据出错')
                }
            }).catch(e => {
                this.tableLoading = false;
            })
        },
        cancel() {
            this.show = false
            this.$emit('cancel')
        },
        deleteItem(index, id) {
            let find = this.tableDataNow.find(item => item.id == id);
            this.selectData.splice(index, 1)
            // let num = this.selected.indexOf(item)
            // if (num > -1) {
            //     this.selected.splice(num, 1)
            // }
            //
            // for (let i = 0; i < this.tableDataNow.length; i++) {
            //     if (this.tableDataNow[i].id == id) {
            //         this.tableDataNow[i].isSelected = false
            //         delete this.selectedMap[id + '_index']
            //         break
            //     }
            // }
            this.$refs.tableDataList.toggleRowSelection(find)
        },
        close() {
            this.show = false
            this.$emit('close')
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getDataById()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getDataById()
        },
        //当用户手动勾选数据行的 Checkbox 时触发的事件
        handleRowClick(selection, row) {
            // 点击行
            let _this = this
            let selectionIdList = []
            // 判断是否再当前选中组中
            selection.forEach(m => {
                selectionIdList.push(m.id)
            })
            let idList = []
            _this.selectData.forEach(m => {
                idList.push(m.id)
            })
            if (selectionIdList.indexOf(row.id) < 0) {
                _this.selectData.forEach((v, i) => {
                    if (v.id == row.id) {
                        _this.selectData.splice(i, 1)
                    }
                })
            } else {
                if (idList.indexOf(row.id) < 0) {
                    _this.selectData.push(row)
                }
            }
        },
        //当用户手动勾选全选 Checkbox 时触发的事件
        handleAllclick(selection) {
            let _this = this
            let selectionIdList = []
            let idList = []
            if (selection.length > 0) {
                // 判断是否再当前选中组中
                selection.forEach(m => {
                    selectionIdList.push(m.id)
                })
                _this.selectData.forEach(m => {
                    idList.push(m.id)
                })
                selectionIdList.forEach((v, n) => {
                    if (idList.indexOf(v) < 0) {
                        _this.selectData.push(selection[n])
                    }
                })
            } else {
                _this.tableDataNow.forEach(v => {
                    _this.selectData.forEach((m, n) => {
                        if (v.id == m.id) {
                            _this.selectData.splice(n, 1)
                        }
                    })
                })
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.search-div {
    display: inline-block;
    padding: 0 10px 10px 0;
}

.button {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 147px;
    height: 40px;
    background: #e24240;
    border-radius: 3px;
    font-size: 16px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: normal;
    text-align: CENTER;
    color: #ffffff;
    line-height: 22px;
    margin: auto;
    margin-top: 28px;

    .button-font {
        font-size: 16px;
        font-family: Microsoft YaHei, Microsoft YaHei-Bold;
        font-weight: normal;
        text-align: CENTER;
        color: #ffffff;
        line-height: 22px;
    }
}

.unSelected {
    background-color: #dbf0e2;
}

.body {
    width: 42%;
    margin-left: 30px;
    position: relative;
}

.left {
    width: calc(33% - 30px);
    position: relative;
}

.right {
    width: 25%;
    margin-left: 30px;
}

.modal-content {
    width: 100%;
    display: flex;

}
</style>
