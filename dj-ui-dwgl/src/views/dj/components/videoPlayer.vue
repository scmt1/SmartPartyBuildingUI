<template>
  <div class="video_text">
    <video :id="'myVideo'+id" class="video-js">
      <source :src="url" type="video/mp4">
    </video>
  </div>
</template>

<script>

  export default {
    name: 'videoPlayer',
    data () {
      return {
        player: null
      }
    },
    props: {
      url: {
        type: String
      },
      id: {
        type: String
      }
    },
    mounted () {
      this.initVideo() // 初始化视频播放器
    },
    beforeDestroy () {
      if (this.player) {
        this.player.dispose()
      }
    },
    methods: {
      initVideo () {
        // 初始化视频方法
        this.player = this.$video('myVideo' + this.id, {
          // 是否显示控制栏
          controls: true,
          // 是否自动播放,muted:静音播放
          autoplay: false,
          // 是否静音播放
          muted: false,
          // 是否流体自适应容器宽高
          fluid: true,
          // 设置视频播放器的显示宽度（以像素为单位）
          width: '800px',
          // 设置视频播放器的显示高度（以像素为单位）
          height: '400px'
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .video_text {
    width: 70%;
    margin: 0 auto;
  }

  video:focus {
    outline: 0; //去掉选中蓝框
  }

  .video-js {
      width: 100%;
      height: 100%;
  }

  .video-js .vjs-big-play-button {
    /*对播放按钮的样式进行设置*/
    width: 100px;
    height: 60px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }
</style>
