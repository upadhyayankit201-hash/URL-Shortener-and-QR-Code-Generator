const express = require('express')
const fs = require('fs').promises
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000
const DATA_FILE = path.join(__dirname, 'urls.json')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

// Helper: validate URL
function isValidUrl(value) {
  try {
    new URL(value)
    return true
  } catch (e) {
    return false
  }
}

// Helper: generate random short code (6 chars, base62)
function generateCode(len = 6) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let out = ''
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

// Load URL mappings from file (creates file if missing)
async function loadUrls() {
  try {
    const txt = await fs.readFile(DATA_FILE, 'utf8')
    return JSON.parse(txt || '{}')
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(DATA_FILE, JSON.stringify({}), 'utf8')
      return {}
    }
    throw err
  }
}

// Save mappings
async function saveUrls(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
}

// API: shorten URL
app.post('/shorten', async (req, res) => {
  const { url } = req.body || {}
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL' })
  }

  const urls = await loadUrls()

  // Try to avoid collisions
  let code
  do {
    code = generateCode()
  } while (urls[code])

  urls[code] = url
  await saveUrls(urls)

  const shortUrl = `${req.protocol}://${req.get('host')}/${code}`
  res.json({ code, shortUrl })
})

// Redirect short code to original URL
app.get('/:code', async (req, res) => {
  const code = req.params.code
  const urls = await loadUrls()
  const dest = urls[code]
  if (dest) return res.redirect(dest)
  res.status(404).send('<h1>Not found</h1><p>No URL for that code.</p>')
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
