import WebSocket, { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 3000 })

console.log('WebSocket server running on ws://localhost:3000')

wss.on('connection', (ws) => {
  console.log('Frontend connected')

  ws.on('message', (audioChunk) => {
    console.log('Received audio chunk:', audioChunk.length)

    // Mock Gemini response
    ws.send(' [listening...] ')
  })
})
