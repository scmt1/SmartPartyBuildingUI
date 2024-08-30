<template>
    <div style="padding: 15px; width: 100%; height: 100%; background-color: white;">
        <el-row :gutter="20" style="width: 100%;">
            <el-col :span="8" style="display: flex; flex-direction: column;">
                <div>课程发布数量</div>
                <div style="height: 40px; display: flex; margin-top: 20px;">
                    <div style="width: 50%;">
                        <div style="float: right; width: 50px; height: 2px; background-color: rgb(2, 84, 120);transform: rotate(-45deg)"></div>
                    </div>
                    <div style="width: 50%;">
                        <div style="width: 50px; height: 2px; background-color: rgb(2, 84, 120);transform: rotate(45deg)"></div>
                    </div>
                </div>
            </el-col>
        </el-row>

    </div>
</template>

<script>
export default {
    name: "dataView",
    data() {
        return {

        }
    },
    created() {
        document.title = "数据展示";
    },
}
</script>

<style scoped>

</style>
