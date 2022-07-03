<template>
  <ParticleSystem width=1920 height=1080 />
  <!-- <VideoTexture :videoSrc='src'/> -->
  <!-- <VideoTexture :videoSrc='src' :rect='rect' :scale='scale'  :position='position'/> -->
</template>

<script>
import ParticleSystem from './components/ParticleSystem.vue'

export default {
  name: 'App',
  components: {
    ParticleSystem
  },
  data() {
    return {
      src: require('./assets/sample-mp4-file.mp4'),
      scale: 1.0,
      rect: [{x: -0.1, y: 1},
								{x:  1, y: 1},
								{x: -1, y:-1},
								{x:  1, y:-0.5}],
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
