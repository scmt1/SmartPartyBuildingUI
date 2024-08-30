<template>
  <view v-loading="loading" class="online-lessons">
    <!-- <j-navbar title="在线课程" /> -->
    <view class="container">
      <j-section-swiper :config="config">
        <template #graphic>
          <GraphicLessons />
        </template>
        <template #video>
          <VideoLessons />
        </template>
      </j-section-swiper>
    </view>
  </view>
</template>

<script>
import GraphicLessons from './components/GraphicLessons.vue'
import VideoLessons from './components/VideoLessons.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('user')
export default {
  name: 'OnlineLessons',
  components: {
    GraphicLessons,
    VideoLessons,
  },
  data() {
    return {
      config: [
        {
          name: '图文课程',
          slot: 'graphic',
        },
        {
          name: '视频课程',
          slot: 'video',
        },
      ],
    }
  },
  computed: {
  	...mapState([
  		'loading'
  	])
  },
  onReady() {
  	this.setLoading(false);
  },
  onLoad(){
		this.setLoading(true);
	},
  methods: {
  	...mapMutations(['setLoading']),
  }
}
</script>

<style lang="scss" scoped>
.online-lessons {
  /* height: calc(100vh - 44px); */
  /* // padding: $p-20; */
  /* display: flex; */
  /* flex-direction: column; */

  height: 100vh;
  display: flex;
  flex-direction: column;
  .container {
    display: flex;
    flex-direction: column;
  }
}
</style>
