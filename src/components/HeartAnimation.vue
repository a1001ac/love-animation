<template>
  <div class="animation-container">
    <!-- Matrix-like falling text animation with I LOVE YOU -->
    <canvas id="canvas"></canvas>

    <!-- Heart animation with centered Chinese text -->
    <div id="child">
      <h4>💗{{ decodedMessage }}💗</h4>
    </div>
    <canvas id="pinkboard"></canvas>

    <!-- Back button -->
    <button class="back-btn" @click="goBack">
      Back
    </button>
  </div>
</template>

<script>
export default {
  name: 'AnimationPage',
  props: {
    message: {
      type: String,
      default: '💗我永远为你着迷💗'
    }
  },
  computed: {
    decodedMessage() {
      return decodeURIComponent(this.message)
    },
    displayTexts() {
      // Use "I LOVE YOU" for matrix effect
      return 'I LOVE YOU'.split('')
    }
  },
  methods: {
    goBack() {
      this.$router.push('/')
    },
    initMatrixAnimation() {
      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')

      canvas.height = window.innerHeight
      canvas.width = window.innerWidth

      const texts = this.displayTexts

      const fontSize = 16
      const columns = canvas.width / fontSize

      // Used to calculate output text coordinates
      const drops = []

      // Initialize
      for (let x = 0; x < columns; x++) {
        drops[x] = 1
      }

      const draw = () => {
        // Make background gradually change from transparent to opaque
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Text color
        ctx.fillStyle = '#f584b7'
        ctx.font = fontSize + 'px arial'

        // Output text line by line
        for (let i = 0; i < drops.length; i++) {
          const text = texts[Math.floor(Math.random() * texts.length)]
          ctx.fillText(text, i * fontSize, drops[i] * fontSize)

          if (drops[i] * fontSize > canvas.height || Math.random() > 0.95) {
            drops[i] = 0
          }

          drops[i]++
        }
      }

      setInterval(draw, 33)
    },
    initHeartAnimation() {
      const settings = {
        particles: {
          length: 500,
          duration: 2,
          velocity: 100,
          effect: -0.75,
          size: 30,
        },
      }

      // Point class
      class Point {
        constructor(x, y) {
          this.x = (typeof x !== 'undefined') ? x : 0
          this.y = (typeof y !== 'undefined') ? y : 0
        }

        clone() {
          return new Point(this.x, this.y)
        }

        length(length) {
          if (typeof length == 'undefined')
            return Math.sqrt(this.x * this.x + this.y * this.y)
          this.normalize()
          this.x *= length
          this.y *= length
          return this
        }

        normalize() {
          const length = this.length()
          this.x /= length
          this.y /= length
          return this
        }
      }

      // Particle class
      class Particle {
        constructor() {
          this.position = new Point()
          this.velocity = new Point()
          this.acceleration = new Point()
          this.age = 0
        }

        initialize(x, y, dx, dy) {
          this.position.x = x
          this.position.y = y
          this.velocity.x = dx
          this.velocity.y = dy
          this.acceleration.x = dx * settings.particles.effect
          this.acceleration.y = dy * settings.particles.effect
          this.age = 0
        }

        update(deltaTime) {
          this.position.x += this.velocity.x * deltaTime
          this.position.y += this.velocity.y * deltaTime
          this.velocity.x += this.acceleration.x * deltaTime
          this.velocity.y += this.acceleration.y * deltaTime
          this.age += deltaTime
        }

        draw(context, image) {
          function ease(t) {
            return (--t) * t * t + 1
          }
          const size = image.width * ease(this.age / settings.particles.duration)
          context.globalAlpha = 1 - this.age / settings.particles.duration
          context.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size)
        }
      }

      // ParticlePool class
      class ParticlePool {
        constructor(length) {
          this.particles = new Array(length)
          this.firstActive = 0
          this.firstFree = 0
          this.duration = settings.particles.duration

          // Create and populate particle pool
          for (let i = 0; i < this.particles.length; i++)
            this.particles[i] = new Particle()
        }

        add(x, y, dx, dy) {
          this.particles[this.firstFree].initialize(x, y, dx, dy)

          // Handle circular queue
          this.firstFree++
          if (this.firstFree == this.particles.length) this.firstFree = 0
          if (this.firstActive == this.firstFree) this.firstActive++
          if (this.firstActive == this.particles.length) this.firstActive = 0
        }

        update(deltaTime) {
          let i

          // Update active particles
          if (this.firstActive < this.firstFree) {
            for (i = this.firstActive; i < this.firstFree; i++)
              this.particles[i].update(deltaTime)
          }
          if (this.firstFree < this.firstActive) {
            for (i = this.firstActive; i < this.particles.length; i++)
              this.particles[i].update(deltaTime)
            for (i = 0; i < this.firstFree; i++)
              this.particles[i].update(deltaTime)
          }

          // Remove inactive particles
          while (this.particles[this.firstActive].age >= this.duration && this.firstActive != this.firstFree) {
            this.firstActive++
            if (this.firstActive == this.particles.length) this.firstActive = 0
          }
        }

        draw(context, image) {
          let i
          // Draw active particles
          if (this.firstActive < this.firstFree) {
            for (i = this.firstActive; i < this.firstFree; i++)
              this.particles[i].draw(context, image)
          }
          if (this.firstFree < this.firstActive) {
            for (i = this.firstActive; i < this.particles.length; i++)
              this.particles[i].draw(context, image)
            for (i = 0; i < this.firstFree; i++)
              this.particles[i].draw(context, image)
          }
        }
      }

      const canvas = document.getElementById('pinkboard')
      const context = canvas.getContext('2d')
      const particles = new ParticlePool(settings.particles.length)
      const particleRate = settings.particles.length / settings.particles.duration // particles/sec
      let time

      // Get point on heart with -PI <= t <= PI
      function pointOnHeart(t) {
        return new Point(
            160 * Math.pow(Math.sin(t), 3),
            130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
        )
      }

      // Creating the particle image using a dummy canvas
      const image = (() => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = settings.particles.size
        canvas.height = settings.particles.size

        // Helper function to create the path
        function to(t) {
          const point = pointOnHeart(t)
          point.x = settings.particles.size / 2 + point.x * settings.particles.size / 350
          point.y = settings.particles.size / 2 - point.y * settings.particles.size / 350
          return point
        }

        // Create the path
        context.beginPath()
        let t = -Math.PI
        let point = to(t)
        context.moveTo(point.x, point.y)
        while (t < Math.PI) {
          t += 0.01 // Baby steps!
          point = to(t)
          context.lineTo(point.x, point.y)
        }
        context.closePath()

        // Create the fill
        context.fillStyle = '#ea80b0'
        context.fill()

        // Create the image
        const image = new Image()
        image.src = canvas.toDataURL()
        return image
      })()

      // Render that thing!
      function render() {
        // Next animation frame
        requestAnimationFrame(render)

        // Update time
        const newTime = new Date().getTime() / 1000
        const deltaTime = newTime - (time || newTime)
        time = newTime

        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height)

        // Create new particles
        const amount = particleRate * deltaTime
        for (let i = 0; i < amount; i++) {
          const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random())
          const dir = pos.clone().length(settings.particles.velocity)
          particles.add(canvas.width / 2 + pos.x, canvas.height / 2 - pos.y, dir.x, -dir.y)
        }

        // Update and draw particles
        particles.update(deltaTime)
        particles.draw(context, image)
      }

      // Handle (re-)sizing of the canvas
      function onResize() {
        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight
      }
      window.onresize = onResize

      // Delay rendering bootstrap
      setTimeout(() => {
        onResize()
        render()
      }, 10)
    }
  },
  mounted() {
    this.initMatrixAnimation()
    this.initHeartAnimation()

    // Handle window resize
    window.addEventListener('resize', () => {
      const canvas = document.getElementById('canvas')
      canvas.height = window.innerHeight
      canvas.width = window.innerWidth
    })
  }
}
</script>

<style scoped>
.animation-container {
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 100%;
  height: 100vh;
  background: rgb(0, 0, 0);
  position: relative;
}

canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}

#child {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  text-align: center;
  width: 100%;
}

h4 {
  font-family: "STKaiti", "Arial", sans-serif;
  font-size: 40px;
  color: #f584b7;
  text-shadow: 0 0 10px rgba(245, 132, 183, 0.7);
  white-space: nowrap;
  margin: 0;
  padding: 0;
  display: inline-block;
  letter-spacing: 2px;
}

.back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
  background: rgba(245, 132, 183, 0.7);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(245, 132, 183, 1);
  transform: scale(1.05);
}

@media (max-width: 768px) {
  h4 {
    font-size: 30px;
  }
}
</style>