<template>
    <div>
        <el-select v-if="level > 0" v-model="level1Select" clearable ref="select1" :style="style" @change="areaChange(level1Select, 1, 'select1')">
            <el-option v-for="(item, index) in level1Option" :label="item.name" :value="item.id" :key="index" ></el-option>
        </el-select>
        <el-select v-if="level > 1" v-model="level2Select" clearable ref="select2" :style="style" @change="areaChange(level2Select, 2, 'select2')">
            <el-option v-for="(item, index) in level2Option" :label="item.name" :value="item.id" :key="index" ></el-option>
        </el-select>
        <el-select v-if="level > 2" v-model="level3Select" clearable ref="select3" :style="style" @change="areaChange(level3Select, 3, 'select3')">
            <el-option v-for="(item, index) in level3Option" :label="item.name" :value="item.id" :key="index" ></el-option>
        </el-select>
        <el-select v-if="level > 3" v-model="level4Select" clearable ref="select4" :style="style" @change="areaChange(level4Select, 4, 'select4')">
            <el-option v-for="(item, index) in level4Option" :label="item.name" :value="item.id" :key="index"></el-option>
        </el-select>
    </div>
</template>

<script>
import {getAreaList} from "@/api/jcxfSysArea";

export default {
    name: "selectArea",
    props: {
        level: {
            type: Number,
            default: 4
        }
    },
    data() {
        return {
            style: {
                width: '100px'
            },
            level1Select: '',
            level2Select: '',
            level3Select: '',
            level4Select: '',
            level1Option: [],
            level2Option: [],
            level3Option: [],
            level4Option: [],
        }
    },
    mounted() {
        this.getList('', 1)
    },
    methods: {
        areaChange(id, index, ref) {
            this.$nextTick(() => {
                let data = []
                let selectId = id
                if (index == 1) {
                    data = this.level1Option
                } else if (index == 2) {
                    if (id != null && id != '') {
                        data = this.level2Option
                    } else {
                        selectId = this.level1Select
                        data = this.level1Option
                    }
                } else if (index == 3) {
                    if (id != null && id != '') {
                        data = this.level3Option
                    } else {
                        selectId = this.level2Select
                        data = this.level2Option
                    }
                } else if (index == 4) {
                    if (id != null && id != '') {
                        data = this.level4Option
                    } else {
                        selectId = this.level3Select
                        data = this.level3Option
                    }
                }

                let areaName = ''
                for (let i = 0; i < data.length; i++) {
                    const item = data[i]
                    if (item.id == selectId) {
                        areaName = item.mergerName
                        break;
                    }
                }

                this.$emit('selected', { areaName: areaName, areaId: id })
            })

            if (index == 1) {
                if (id != null && id != '') {
                    this.getList(id, 2)
                } else {
                    this.level2Option = []
                }
                this.level2Select = ''
                this.level3Select = ''
                this.level4Select = ''
                this.level3Option = []
                this.level4Option = []

            } else if (index == 2) {
                if (id != null && id != '') {
                    this.getList(id, 3)
                } else {
                    this.level3Option = []
                }
                this.level3Select = ''
                this.level4Select = ''
                this.level4Option = []

            } else if (index == 3) {
                if (id != null && id != '') {
                    this.getList(id, 4)
                } else {
                    this.level4Option = []
                }
                this.level4Select = ''
                this.level4Option = []
            }
        },
        getList(id, level) {
            let data = {
                id: id + '',
                level: level + ''
            }
            getAreaList(data).then(res => {
                const data = res.data
                let option = []
                if (data.code == '00000') {
                    option = data.data
                }

                if (level == 1) {
                    this.level1Select = ''
                    this.level1Option = option
                } else if (level == 2) {
                    this.level2Select = ''
                    this.level2Option = option
                } else if (level == 3) {
                    this.level3Select = ''
                    this.level3Option = option
                } else if (level == 4) {
                    this.level4Select = ''
                    this.level4Option = option
                }

            })

        }
    }
}
</script>

<style scoped>

</style>
