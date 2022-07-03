<template>
	<div ref="canvas">
	</div>
</template>

<script>
import * as THREE from 'three'
import State1 from './ParticleState/State1'
import State2 from './ParticleState/State2'

const PARTICLE_COUNT = 40000

const vertexShader = `
	attribute vec3 position; 
	void main() {
		gl_Position = vec4(position.xy, 1.0, 1.0);
	}
`

const fragmentShader = `
	void main() {
		gl_FragColor = vec4(0.2, 0.3, 0.4, 1.0);
	}
`
export default {
	name: 'ParticleSystem',
	props: {
		width: { type: Number, required: true },
		height: { type: Number, required: true },
	},
	mounted: function() {
		const { width: WIDTH, height: HEIGHT } = this
		this.ratio = WIDTH/HEIGHT
		
		const renderer = new THREE.WebGLRenderer({ antialias: true })		
		renderer.setSize(WIDTH, HEIGHT)
		this.$refs.canvas.appendChild(renderer.domElement)

		const scene = new THREE.Scene()
		const camera = new THREE.PerspectiveCamera()

		const particleMaterial = new THREE.RawShaderMaterial({
			vertexShader, fragmentShader,	
			blending: THREE.AdditiveBlending,
			blendSrcAlpha: THREE.OneFactor,
			depthTest: false,
			transparent: true
		})

		const particlesGeometry = new THREE.BufferGeometry()

		this.position = new Float32Array(PARTICLE_COUNT * 3 * 2)
		this.current = new State1(PARTICLE_COUNT, this.ratio)

		particlesGeometry.setAttribute('position', new THREE.BufferAttribute(this.current.position, 3))
		const particles = new THREE.LineSegments(particlesGeometry, particleMaterial)
		scene.add(particles)

		this.renderer = renderer
		this.scene = scene
		this.camera = camera
		this.particles = particles

		this.animate()
	},
	methods: {
		animate: function() {
			requestAnimationFrame(this.animate)
			this.renderer.render(this.scene, this.camera)
			if (!this.particles) return

			this.current.update()

			this.particles.geometry.attributes.position.needsUpdate = true
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