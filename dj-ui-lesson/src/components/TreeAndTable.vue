<template>
    <div class="box" :style="'min-height:' +height "  v-loading="loading">
        <div class="left">
            <slot name="tree"></slot>
        </div>
        <div class="interval"></div>
        <div class="right" ref="right">
            <div class="btngroup">
                <slot name="btngroup"></slot>
            </div>
            <div class="search">
                <slot name="search"></slot>
            </div>
            <div class="table">
                <slot name="table"></slot>
            </div>
            <div class="pagination">
                <slot name="pagination"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "TreeAndTable",
    data() {
        return {
            height: null
        }
    },
    props: {
        loading:{
            type: Boolean,
            default: false
        }
    },
    mounted() {
        this.setBoxHeight()
        let _this = this
        window.addEventListener('resize', () => {
            _this.setBoxHeight()
        })
    },
    methods: {
        setBoxHeight() {
            this.$nextTick(() =>{
                this.height = (window.innerHeight - 95) + 'px'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.box {
    background-color: white;
    display: flex;
    flex-direction: row;
    padding: 10px;
    //padding: 10px 10px 10px 0px;
    height: 100%;
}

.left {
    width: 290px;
    position: relative;
    margin-right: 10px;
}

.interval {
    width: 1px;
    background-color: rgb(220, 223, 240);
    transform: scaleX(0.5);
}

.right {
    width: calc(100% - 305px);
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-left: 10px;

    .btngroup {
        text-align: left;
    }

    .search {
        margin-top: 10px;
        text-align: left;
    }

    .table {
        margin-top: 10px;
    }

    .pagination {
        overflow: auto;
        margin-top: 10px;
    }
}
</style>
