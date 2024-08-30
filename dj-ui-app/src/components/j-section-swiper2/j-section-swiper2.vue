<template>
  <view class="section-swiper">
    <u-subsection
      :list="config"
      :current="current"
      bgColor="#fff"
      activeColor="#000000"
      fontSize="14px"
      @change="changeCurrent"
    ></u-subsection>
    <view class="list">
      <swiper :current="current" @change="changeSwiperCurrent">
        <swiper-item v-for="(item, index) in config" :key="index">
          <slot :name="item.slot"></slot>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
export default {
  name: 'j-section-swiper',
  props: ['config'],
  data() {
    return {
      current: 0,
    }
  },
  mounted() {
    // console.log('data', this.list)
  },
  methods: {
    changeCurrent(idx) {
      this.current = idx
    },
    changeSwiperCurrent(e) {
      this.current = e.detail.current
    },
  },
}
</script>

<style lang="scss" scoped>
.section-swiper {
  flex: 1;
  display: flex;
  flex-direction: column;

  .list {
    flex: 1;
    display: flex;
    flex-direction: column;

    ::v-deep uni-swiper {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: scroll;

      .uni-swiper-wrapper {
        flex: 1;
      }

      uni-swiper-item {
        overflow-y: scroll;
      }

    }
  }
}
</style>
