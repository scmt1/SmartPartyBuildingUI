<template>
    <div id="app">
        <div id="react"></div>
        <router-view/>
    </div>
</template>

<script>

export default {
    name: "app",
    created() {
        let a = document.getElementById("loading-wrap");
        a.style.display = "none";
    }
};
</script>


<style lang="less">
//@import url("//unpkg.com/element-ui@2.15.7/lib/theme-chalk/index.css");
@import "./utils/element-ui/index.css";

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    //text-align: center;

    .el-loading-mask {
        z-index: 90;
    }

    ::-webkit-scrollbar {
        opacity: 0;
        width: 4px;
        height: 4px;
    }

    :hover::-webkit-scrollbar {
        display: block;
        width: 0;
        height: 4px;
    }

    .el-table__fixed-right {
        height: calc(100% - 0px) !important;
        right: 0 !important;
    }

    .el-table__fixed {
        height: calc(100% - 0px) !important;
    }
    .el-table__body, .el-table__footer, .el-table__header{
        font-size: 14px !important;
    }
    .el-table__empty-block{
        height: 0 !important;
    }
    .drop-down{
        padding: 0 5px;
    }
    .el-pagination{
        display: flex;
        justify-content: center;
    }
    .topBtn{
        background:  rgba(228, 53, 43, 1);
        color:#ffffff;
        border-color: rgba(228, 53, 43, 1);
    }

    ::-webkit-scrollbar-track {
        opacity: 0;
    }
    :hover::-webkit-scrollbar-track {
        background-color: #f1f1f1;
    }

    ::-webkit-scrollbar-thumb {
        opacity: 0;
        border-radius: 4px;
    }

    :hover::-webkit-scrollbar-thumb {
        background-color: rgba(136, 136, 136, 0.18);
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: rgba(85, 85, 85, 0.53);
    }

    .el-date-editor .el-range-separator {
        width: 7% !important;
    }
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}

.drop-down {
    font-size: 14px;
}
.ivu-modal-header p, .ivu-modal-header-inner{
    font-size: 18px !important;
}
</style>
