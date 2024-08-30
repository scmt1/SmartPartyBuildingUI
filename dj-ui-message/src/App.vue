<template>
  <div id="app">
    <div id="react"></div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
  created() {
    let a = document.getElementById("loading-wrap");
    a.style.display = "none";
  },
};
</script>


<style lang="less">
@import url("//unpkg.com/element-ui@2.15.7/lib/theme-chalk/index.css");
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //text-align: center;

    .el-loading-mask {
        z-index: 90;
    }
    .el-table__body, .el-table__footer, .el-table__header{
        font-size: 14px !important;
    }
    .drop-down{
        padding: 0 5px;
    }
    .el-pagination{
        display: flex;
        justify-content: center;
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
  .drop-down{
    font-size: 14px;
  }
</style>
