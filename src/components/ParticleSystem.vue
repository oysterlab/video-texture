<template>
	<div ref="canvas">
	</div>
</template>

<script>
import * as THREE from 'three'

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
		
		const renderer = new THREE.WebGLRenderer({ antialias: true })		
		renderer.setSize(WIDTH, HEIGHT)
		this.$refs.canvas.appendChild(renderer.domElement)

		const scene = new THREE.Scene()
		const postScene = new THREE.Scene()
		const camera = new THREE.PerspectiveCamera()
		const postCamera = new THREE.OrthographicCamera( WIDTH / - 2, WIDTH / 2, HEIGHT / 2, HEIGHT / - 2, 1, 1000 )
		postCamera.position.z = 3		

		const particleMaterial = new THREE.RawShaderMaterial({
			vertexShader, fragmentShader,	
			blending: THREE.AdditiveBlending,
			blendSrcAlpha: THREE.OneFactor,
			depthTest: false,
			transparent: true
		})

		const particlesGeometry = new THREE.BufferGeometry()

		this.setup()
		particlesGeometry.setAttribute('position', new THREE.BufferAttribute(this.vertices, 3))

		const particles = new THREE.LineSegments(particlesGeometry, particleMaterial)
		scene.add(particles)

		const frame = this.createFrame()
		postScene.add(frame)

		this.renderer = renderer
		this.renderTarget = new THREE.WebGLRenderTarget()
		this.renderTarget.setSize(WIDTH, HEIGHT)
		this.scene = scene
		this.camera = camera
		this.particles = particles
		this.drawType = 2
		this.postScene = postScene
		this.postCamera = postCamera
		this.frame = frame

		this.animate()

		this.changeType()
	},
	methods: {
		changeType: function() {
			setTimeout(() => {
				this.drawType = (this.drawType + 1) % 3
				this.changeType()
			}, 1500)
		},
		setup: function() {
			const { width: WIDTH, height: HEIGHT } = this
			let vertices = []
			let velThetaArr = []
			let velRadArr = []
			let ratio = WIDTH/HEIGHT
			let velocities = []
			let thetaArr = []
			let freqArr = []
			let boldRateArr = []
			let randomTargetXArr = []
			let randomTargetYArr = []
			
			for (let ii = 0; ii < PARTICLE_COUNT; ii++) {
				const rad = ( 0.1 + .2 * Math.random() )
				const theta = Math.random() * Math.PI * 2
				const velTheta = Math.random() * Math.PI * 2 / 30
				const freq = Math.random() * 0.12 + 0.03
				const boldRate = Math.random() * .04 + .01
				const randomPosX = (Math.random() * 2  - 1) * WIDTH/HEIGHT
				const randomPosY = Math.random() * 2 - 1

				vertices.push(rad * Math.cos(theta), rad * Math.sin(theta)  * ratio, 0.0)
				vertices.push(rad * Math.cos(theta), rad * Math.sin(theta) * ratio, 0.0)

				thetaArr.push(theta)
				velThetaArr.push(velTheta)
				velRadArr.push(rad)
				freqArr.push(freq)
				boldRateArr.push(boldRate)

				randomTargetXArr.push(randomPosX);
				randomTargetYArr.push(randomPosY);
			}

			this.vertices = new Float32Array(vertices)
			this.velThetaArr =  new Float32Array(velThetaArr)
			this.velRadArr =  new Float32Array(velRadArr)
			this.velocities =  new Float32Array(velocities)
			this.thetaArr =  new Float32Array(thetaArr)
			this.freqArr =  new Float32Array(freqArr)
			this.boldRateArr = boldRateArr
			this.randomTargetXArr = randomTargetXArr
			this.randomTargetYArr = randomTargetYArr
			this.ratio = ratio
		},
		draw0: function() {
			const { vertices, randomTargetXArr, randomTargetYArr } = this
			let i, bp;
			let px, py;
			let num
			let targetX, targetY

			for (i = 0; i < PARTICLE_COUNT * 2; i += 2) {
				bp = i * 3

				vertices[bp] = vertices[bp + 3]
				vertices[bp + 1] = vertices[bp + 4]

				num = parseInt(i / 2)
				targetX = randomTargetXArr[num]
				targetY = randomTargetYArr[num]

				px = vertices[bp + 3]
				px += (targetX - px) * (Math.random() * .04 + .06)
				vertices[bp + 3] = px

				py = vertices[bp + 4]
				py += (targetY - py) * (Math.random() * .04 + .06)
				vertices[bp + 4] = py
			}
		},
		draw1: function() {
			const { vertices, thetaArr, velRadArr, velThetaArr, ratio } = this
			let i, bp
			let px, py
			let pTheta
			let rad
			let num
			let targetX, targetY

			for (i = 0; i < PARTICLE_COUNT * 2; i += 2) {
				bp = i * 3;

				vertices[bp] = vertices[bp + 3];
				vertices[bp + 1] = vertices[bp + 4];

				num = parseInt(i / 2);
				pTheta = thetaArr[num];
				rad = velRadArr[num];

				pTheta = pTheta + velThetaArr[num]
				thetaArr[num] = pTheta;

				targetX = rad * Math.cos(pTheta)
				targetY = rad * Math.sin(pTheta) * ratio

				px = vertices[bp + 3];
				px += (targetX - px) * (Math.random() * .1 + .1);
				vertices[bp + 3] = px;


				//py = (Math.sin(cn) + 1) * .2 * (Math.random() * .5 - .25);
				py = vertices[bp + 4];
				py += (targetY - py) * (Math.random() * .1 + .1);
				vertices[bp + 4] = py;
			}
		},
		draw2: function() {
			const { vertices, thetaArr, velRadArr, velThetaArr, ratio } = this
			let i, bp
			let px, py
			let pTheta
			let rad
			let num

			for (i = 0; i < PARTICLE_COUNT * 2; i += 2) {
				bp = i * 3;

				vertices[bp] = vertices[bp + 3]
				vertices[bp + 1] = vertices[bp + 4]

				num = parseInt(i / 2)
				pTheta = thetaArr[num]
				rad = velRadArr[num]

				pTheta = pTheta + velThetaArr[num]
				thetaArr[num] = pTheta

				px = vertices[bp + 3]
				px = rad * Math.cos(pTheta) * 0.1 + px
				vertices[bp + 3] = px

				py = vertices[bp + 4]

				py = py + rad * Math.sin(pTheta) * 0.1  * ratio
				vertices[bp + 4] = py
			}			
		},
		animate: function() {
			requestAnimationFrame(this.animate)
			this.renderer.setRenderTarget(this.renderTarget)			
			this.renderer.render(this.scene, this.camera)
			if (!this.particles) return
			if (this.drawType == 0) this.draw0()
			else if (this.drawType == 1) this.draw1()
			else if (this.drawType == 2) this.draw2()			
			this.particles.geometry.attributes.position.needsUpdate = true
			console.log(this.frame)
			this.frame.material.uniforms.map.value = this.renderTarget.texture
			this.renderer.setRenderTarget(null)
			this.renderer.render(this.postScene, this.postCamera)
	
		},
		createFrame: function() {
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
			const material = new THREE.ShaderMaterial({
				transparent: true,
				uniforms: {
					scale: { value: 1.0 },
					map: { value: null },
					translate: { value: [0.0, 0.0]}
				},
				vertexShader, fragmentShader
			})
			const geometry = new THREE.PlaneGeometry(2, 2)

			const rect = [{x: -0.99, y: 0.4},
								{x:  1, y: 0.9},
								{x: -0.94, y:-1},
								{x:  1, y:-0.8}]
			rect.forEach(({x, y}, i) => geometry.attributes.position.setXY(i, x, y))

			return new THREE.Mesh(geometry, material)
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