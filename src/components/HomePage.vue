<template>
  <div class="home-container">
    <div class="content-box">
      <h1 class="title">Love Message Generator</h1>
      <p class="subtitle">Create a beautiful love animation with your message</p>

      <div class="input-group">
        <input
            v-model="message"
            type="text"
            placeholder="Enter your love message..."
            maxlength="10"
            @keyup.enter="generateAnimation"
        />
        <span class="char-count">{{ message.length }}/10</span>
      </div>

      <button
          class="generate-btn"
          @click="generateAnimation"
          :disabled="!message.trim()"
      >
        Generate Animation
      </button>
    </div>

    <div class="floating-hearts">
      <div v-for="n in 20" :key="n" class="heart" :style="randomHeartStyle(n)"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      message: ''
    }
  },
  methods: {
    generateAnimation() {
      if (this.message.trim()) {
        this.$router.push(`/animation/${encodeURIComponent(this.message)}`)
      }
    },
    randomHeartStyle(index) {
      const size = Math.floor(Math.random() * 20) + 10
      const left = Math.floor(Math.random() * 100)
      const animationDuration = Math.floor(Math.random() * 10) + 10
      const animationDelay = Math.floor(Math.random() * 10)

      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        animationDuration: `${animationDuration}s`,
        animationDelay: `${animationDelay}s`
      }
    }
  }
}
</script>

<style scoped>
.home-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
}

.content-box {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
  text-align: center;
  z-index: 10;
}

.title {
  color: #f584b7;
  margin-bottom: 10px;
  font-size: 2.5rem;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.input-group {
  position: relative;
  margin-bottom: 25px;
}

input {
  width: 100%;
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 1.1rem;
  transition: all 0.3s;
  outline: none;
}

input:focus {
  border-color: #f584b7;
  box-shadow: 0 0 0 3px rgba(245, 132, 183, 0.3);
}

.char-count {
  position: absolute;
  right: 15px;
  bottom: -25px;
  font-size: 0.8rem;
  color: #999;
}

.generate-btn {
  background: #f584b7;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 6px rgba(245, 132, 183, 0.3);
}

.generate-btn:hover {
  background: #e06a9c;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(245, 132, 183, 0.4);
}

.generate-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Floating hearts background */
.floating-hearts {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.heart {
  position: absolute;
  bottom: -10%;
  background-color: #f584b7;
  display: inline-block;
  opacity: 0.6;
  animation: floating linear infinite;
}

.heart:before,
.heart:after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #f584b7;
  border-radius: 50%;
}

.heart:before {
  left: -50%;
  top: 0;
}

.heart:after {
  top: -50%;
  left: 0;
}

@keyframes floating {
  0% {
    transform: translateY(0) rotate(45deg);
    opacity: 0.6;
  }
  100% {
    transform: translateY(-1000px) rotate(45deg);
    opacity: 0;
  }
}

@media (max-width: 600px) {
  .content-box {
    padding: 30px 20px;
  }

  .title {
    font-size: 2rem;
  }
}
</style>