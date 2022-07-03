
<template>
	<div ref="canvas">
	</div>
</template>

<script>

import * as THREE from 'three'

export default {
	name: 'VideoTexture',
	data: function() {
		return {
		}
	},
	props: {
		videoSrc: {
			type: String,
			require: true
		},
		width: {
			type: Number,
			default: 1920,
		},
		height: {
			type: Number,
			default: 1080,
		},		
		scale: {
			type: Number,
			default: 1.0,
		},
		rect:  {
			type: Array,
			default: () => {
				return [{x: -1, y: 1},
								{x:  1, y: 1},
								{x: -1, y:-1},
								{x:  1, y:-1}]
				}
		},
		position: {
			type: Array,
			default: () => [0.0, 0.0]
		}
	},
	watch: {
		scale: function() {
			this.mesh.material.uniforms.scale.value = this.scale
		},
		rect: function() {
			const { mesh } = this
			this.rect.forEach(({x, y}, i) => mesh.geometry.attributes.position.setXY(i, x, y))
			mesh.geometry.attributes.position.needsUpdate = true
		},
		position: function() {
			this.mesh.material.uniforms.translate.value = this.position
		}
	},
	mounted: function() {
		const { width:WIDTH, height: HEIGHT, scale: SCALE, position:TRANSLATE } = this

		const scene = new THREE.Scene()
		const camera = new THREE.PerspectiveCamera()
		const renderer = new THREE.WebGLRenderer({ antialias: true })		
		const geometry = new THREE.PlaneGeometry(2, 2)
		const uv = geometry.getAttribute('uv')
		console.log(uv.array)
		uv.array[0] = 0; uv.array[1] = 1;
		uv.array[2] = 1; uv.array[3] = 1;
		uv.array[4] = 0; uv.array[5] = 0;
		uv.array[6] = 1; uv.array[7] = 0;				

		// uv.array[0] = 0; uv.array[1] = 1;
		// uv.array[2] = 1; uv.array[3] = 1;
		// uv.array[4] = 1; uv.array[5] = 0;
		// uv.array[6] = 0; uv.array[7] = 0;				
		
		uv.needsUpdate = true
		// 0 1 
		// 1 1 
		// 0 0 
		// 1 0
 
		this.rect.forEach(({x, y}, i) => geometry.attributes.position.setXY(i, x, y))

		const vertexShader = `
			varying vec2 vUv;
			uniform float scale;
			uniform vec2 translate;

			void main() {
				vUv = uv;
				vec2 scaledPosition = position.xy * scale + translate;
				gl_Position = vec4(scaledPosition, 1.0, 1.0);
			}
		`

		const fragmentShader = `
			uniform sampler2D map;
			varying vec2 vUv;
			void main() {
				vec4 videoColor = texture2D(map, vUv);
				gl_FragColor = vec4(videoColor.rgb, 1.0);
			}
		`

		const video = document.createElement('video')
		const source = document.createElement('source')
		source.src = this.videoSrc
		source.type = 'video/mp4'
		video.muted = 'muted'
		video.appendChild(source)
		video.play()

		const texture = new THREE.VideoTexture(video)
		texture.minFilter = THREE.LinearFilter
		texture.magFilter = THREE.LinearFilter

		const material = new THREE.ShaderMaterial({
			transparent: true,
			uniforms: {
				scale: { value: SCALE },
				map: { value: texture },
				translate: { value: TRANSLATE}
			},
			vertexShader, fragmentShader
		})
		const mesh = new THREE.Mesh(geometry, material)

		this.scene = scene
		this.renderer = renderer
		this.camera = camera
		this.mesh = mesh
		this.source = source
		this.video = video

		this.scene.add(this.mesh)
		this.renderer.setSize(WIDTH, HEIGHT)

		this.$refs.canvas.appendChild(this.renderer.domElement)
		this.animate()
	},
	methods: {
		animate: function() {
			requestAnimationFrame(this.animate)
			this.renderer.render(this.scene, this.camera)
		}
	}
}

</script>

<style scoped>
	canvas {
		width: 100vw;
		height: 100vh;
	}
</style>