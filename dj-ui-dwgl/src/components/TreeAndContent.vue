<template>
    <div class="box" :style="'min-height:' +height "  v-loading="loading">
        <div class="left">
            <slot name="tree"></slot>
        </div>
        <div class="interval"></div>
        <div class="right" ref="right">
            <div class="content">
                <slot name="content"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "TreeAndContent",
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
                this.height = (window.innerHeight - 94) + 'px'
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
    padding: 10px 10px 10px 10px;
    height: calc(100% - 65px);
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
    display: flex;
    flex-direction: column;
    padding-left: 10px;
    height: 100%;

    .content {
        height: 100%;
        text-align: left;
    }
}
</style>
