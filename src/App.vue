<template>
  <VideoTexture :videoSrc='src'/>
  <!-- <VideoTexture :videoSrc='src' :rect='rect' :scale='scale'  :position='position'/> -->
</template>

<script>
import VideoTexture from './components/VideoTexture.vue'

export default {
  name: 'App',
  components: {
    VideoTexture
  },
  data() {
    return {
      src: require('./assets/sample.mp4'),
      scale: 0.4,
      rect: [{x: -0.5, y: 1},
								{x:  1, y: 1},
								{x: -1, y:-0.5},
								{x:  1, y:-1}],
      position: [0.0, 0.0]
    }
  }
}
</script>

<style>
body {
  margin: 0px;
  padding: 0px;
  background: #000;
}
#app {
  width: 100vw;
  height: 100vh;
}
</style>
