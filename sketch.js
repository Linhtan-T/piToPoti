// sketch.js
let port = null;
let reader = null;
let latestValue = 0; // 0..1023 from Arduino

// --- UI wiring ---
const statusEl = document.getElementById('status');
const connectBtn = document.getElementById('connectBtn');

connectBtn.addEventListener('click', async () => {
  try {
    if (!('serial' in navigator)) {
      status('Web Serial not supported. Use Chrome/Edge over HTTPS.');
      return;
    }

    // Ask user to pick the Arduino
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 }); // match your Arduino sketch!

    status('Connected. Reading…');
    connectBtn.disabled = true;

    // Stream text lines from serial
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    reader = textDecoder.readable.getReader();

    readLoop(); // start reading in background
  } catch (err) {
    status('Connect failed: ' + err.message);
    console.error(err);
  }
});

function status(msg) { statusEl.textContent = msg; }

async function readLoop() {
  try {
    let buffer = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        buffer += value;
        let lines = buffer.split('\n');
        buffer = lines.pop(); // keep incomplete
        for (const line of lines) {
          const t = line.trim();
          if (!t) continue;
          const v = parseInt(t, 10);
          if (!Number.isNaN(v)) {
            // clamp 0..1023
            latestValue = Math.max(0, Math.min(1023, v));
          }
        }
      }
    }
  } catch (err) {
    console.error('readLoop error', err);
    status('Disconnected.');
  } finally {
    try { reader && reader.releaseLock(); } catch {}
    try { port && (await port.close()); } catch {}
    connectBtn.disabled = false;
  }
}

// --- p5 sketch: move a circle with the pot value ---
let W = 800, H = 400;

function setup() {
  const c = createCanvas(W, H);
  c.parent('sketch-holder');
  noStroke();
  textFont('system-ui');
}

function draw() {
  background(245);
  fill(20);
  textSize(14);
  text('Pot value: ' + latestValue, 12, 22);

  const x = map(latestValue, 0, 1023, 40, W - 40);
  fill(50, 120, 255);
  circle(x, H / 2, 80);
}

