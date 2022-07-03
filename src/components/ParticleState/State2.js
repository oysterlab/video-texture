import ParticleState from "./ParticleState";

export default class State2 extends ParticleState {
	constructor(paricleCount, ratio) {
		super()
		this.paricleCount = paricleCount
		this.ratio = ratio
		this.position = new Float32Array(paricleCount * 3 * 2)
		this.paricleCount = paricleCount
		this.velocity = new Float32Array(paricleCount)
		this.radian1 = new Float32Array(paricleCount)
		this.radian2 = new Float32Array(paricleCount)
		this.depth = new Float32Array(paricleCount)
		this.lineLength = new Float32Array(paricleCount)

		this.init()
	}

	init() {
		const { position, velocity, radian1, radian2, lineLength, depth, paricleCount, ratio } = this

		for(let i = 0; i < paricleCount; i++) {
			depth[i] = 0.05 * Math.random()
			const rad1 = Math.PI * Math.random()

			const LINE_LENGTH = 0.003 + Math.random() * 0.002
			let x1 = Math.cos(rad1)/Math.sin(rad1) * (0.95 + 0.05 * Math.random())
			let y1 = -(0.95 + 0.05 * Math.random())

			const p = Math.random()
			if (p < 0.25) {
				x1 = 1 - (0.05 * Math.random()) / ratio
				y1 = Math.sin(rad1)/Math.cos(rad1) * (0.95 + 0.05 * Math.random())
			} else if (p < 0.5) {
				x1 = -1 + (0.05 * Math.random()) / ratio
				y1 = Math.sin(rad1)/Math.cos(rad1) * (0.95 + 0.05 * Math.random())
			} else if (p < 0.75) {
				x1 = Math.cos(rad1)/Math.sin(rad1) * (0.95 + 0.05 * Math.random())
				y1 = 1 - (0.05 * Math.random())
			}


			const rad2 = Math.PI * 2 * (Math.random() * 0.5 + 0.5)
			const x2 = x1 + Math.cos(rad2) * LINE_LENGTH
			const y2 = y1 + Math.sin(rad2) * LINE_LENGTH

			const si = i * 3 * 2
			const ei = si + 3

			position[si + 0] = x1
			position[si + 1] = y1
			position[si + 2] = 0

			position[ei + 0] = x2
			position[ei + 1] = y2
			position[ei + 2] = 0

			velocity[i] = Math.random() * 0.02 + Math.random() * 0.005
			radian1[i] = rad1
			radian2[i] = rad2
			lineLength[i] = LINE_LENGTH
		}		
	}

	update() {
//		const { position, radian1, radian2, lineLength, velocity, depth, ratio } = this

		// for(let i = 0; i < position.length; i+=6) {
		// 	const idx = i / 6
		// 	const vel = velocity[idx]
		// 	const rad1 = radian1[idx] + vel * Math.PI * 2
		// 	const rad2 = radian2[idx]
		// 	const LINE_LENGTH = lineLength[idx]
		// 	const sx = i + 0
		// 	const sy = sx + 1
		// 	const ex = sx + 3
		// 	const ey = ex + 1
		// 	position[sx] = Math.cos(rad1) * depth[i]
		// 	position[sy] = Math.sin(rad1) * depth[i] * ratio
		// 	position[ex] = position[sx] + Math.cos(rad2) * LINE_LENGTH
		// 	position[ey] = position[sy] + Math.sin(rad2) * LINE_LENGTH
		// 	radian1[idx] = rad1
		// }
	}

}