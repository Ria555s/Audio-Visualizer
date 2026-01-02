import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="main-layout">
    <header>
      <h1>Audio Visualizer</h1>
      <p>Click start and speak or play music</p>
    </header>

    <div class="visualizer-container">
      <canvas id="canvas"></canvas>
    </div>

    <div class="controls">
      <button id="toggle">Start Visualizer</button>
    </div>
  </div>
`

// 🎨 Canvas setup
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const startBtn = document.getElementById('toggle') // <--- FIXED: This was missing!

let audioContext, analyser, dataArray, bufferLength
let animationId
let isRunning = false
let rotation = 0

// Set canvas size
function resize() {
  const size = Math.min(window.innerWidth * 0.8, 500)
  canvas.width = size
  canvas.height = size
}
window.addEventListener('resize', resize)
resize()

startBtn.addEventListener('click', async () => {
  if (isRunning) {
    cancelAnimationFrame(animationId)
    isRunning = false
    startBtn.innerText = 'Start Visualizer'
    return
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 512 
    analyser.smoothingTimeConstant = 0.8

    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)

    bufferLength = analyser.frequencyBinCount
    dataArray = new Uint8Array(bufferLength)

    isRunning = true
    startBtn.innerText = 'Stop Visualizer'
    animate()
  } catch (err) {
    console.error('Audio error:', err)
    alert("Please allow microphone access to see the visualizer.")
  }
})

function animate() {
  if (!isRunning) return
  animationId = requestAnimationFrame(animate)

  analyser.getByteFrequencyData(dataArray)

  const cx = canvas.width / 2
  const cy = canvas.height / 2
  const baseRadius = canvas.width * 0.25

  // 1. Background trail effect
  ctx.fillStyle = '#1a1a1a' 
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 2. Bass Pulse logic
  let sum = 0
  for(let i = 0; i < 10; i++) sum += dataArray[i]
  let bass = sum / 10
  let pulse = (bass / 255) * 30
  let dynamicRadius = baseRadius + pulse

  // 3. Draw Symmetrical Circle
  const BAR_COUNT = 120
  const angleStep = (Math.PI * 2) / BAR_COUNT

  for (let i = 0; i < BAR_COUNT; i++) {
    // Mirroring the data so the circle looks full
    let index = i > BAR_COUNT / 2 ? BAR_COUNT - i : i
    const dataIndex = Math.floor((index / (BAR_COUNT / 2)) * (bufferLength * 0.6))
    const value = dataArray[dataIndex] || 0
    
    const barLength = (value / 255) * (canvas.width * 0.25) + 5
    const angle = i * angleStep + rotation

    const x1 = cx + Math.cos(angle) * dynamicRadius
    const y1 = cy + Math.sin(angle) * dynamicRadius
    const x2 = cx + Math.cos(angle) * (dynamicRadius + barLength)
    const y2 = cy + Math.sin(angle) * (dynamicRadius + barLength)

    ctx.strokeStyle = `hsl(${(i / BAR_COUNT) * 360}, 80%, 60%)`
    ctx.lineWidth = 4
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  // 4. Center Glow
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, dynamicRadius)
  gradient.addColorStop(0, 'rgba(0, 210, 255, 0.3)')
  gradient.addColorStop(1, 'transparent')
  
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(cx, cy, dynamicRadius, 0, Math.PI * 2)
  ctx.fill()

  rotation += 0.005
}





