// Simple frontend logic for shortening and QR generation
async function postJson(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

// URL Shortener
const longEl = document.getElementById('longUrl')
const shortenBtn = document.getElementById('shortenBtn')
const resultBox = document.getElementById('result')
const shortLink = document.getElementById('shortLink')
const copyBtn = document.getElementById('copyBtn')
const openBtn = document.getElementById('openBtn')

shortenBtn.addEventListener('click', async () => {
  const url = longEl.value.trim()
  if (!url) return alert('Please enter a URL')

  const data = await postJson('/shorten', { url })
  if (data.error) return alert(data.error)

  shortLink.href = data.shortUrl
  shortLink.textContent = data.shortUrl
  resultBox.classList.remove('hidden')
})

copyBtn.addEventListener('click', async () => {
  const txt = shortLink.href
  try { await navigator.clipboard.writeText(txt); alert('Copied!') } catch (e) { alert('Copy failed') }
})

openBtn.addEventListener('click', () => {
  const url = shortLink.href
  if (url) window.open(url, '_blank')
})

// QR Code Generator
const qrInput = document.getElementById('qrUrl')
const genQrBtn = document.getElementById('genQrBtn')
const clearQrBtn = document.getElementById('clearQrBtn')
const qrArea = document.getElementById('qrArea')
const qrCanvas = document.getElementById('qrcanvas')
const downloadQrBtn = document.getElementById('downloadQrBtn')

function isValidUrl(value) {
  try { new URL(value); return true } catch (e) { return false }
}

genQrBtn.addEventListener('click', () => {
  const url = qrInput.value.trim()
  if (!url || !isValidUrl(url)) return alert('Please enter a valid URL')

  // Use QRCode library (included via CDN)
  QRCode.toCanvas(qrCanvas, url, { width: 256 }, function (error) {
    if (error) return alert('QR generate error')
    qrArea.classList.remove('hidden')
  })
})

clearQrBtn.addEventListener('click', () => {
  qrInput.value = ''
  qrArea.classList.add('hidden')
  const ctx = qrCanvas.getContext('2d')
  ctx && ctx.clearRect(0, 0, qrCanvas.width, qrCanvas.height)
})

downloadQrBtn.addEventListener('click', () => {
  const data = qrCanvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = data
  a.download = 'qrcode.png'
  document.body.appendChild(a)
  a.click()
  a.remove()
})
