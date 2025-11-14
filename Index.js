import express from "express";
import ytdl from "@distube/ytdl-core";

const app = express();

app.get("/", (req, res) => {
  res.send(`
    <h1>YouTube Live → M3U8 Proxy AKTIF</h1>
    <p>Gunakan: /stream?url=YouTube_Live_URL</p>
    <p>Contoh:</p>
    <code>?url=https://www.youtube.com/live/XXXX</code>
  `);
});

app.get("/stream", async (req, res) => {
  try {
    const url = req.query.url;

    if (!url) {
      return res.status(400).send("Parameter ?url= tidak ditemukan.");
    }

    const info = await ytdl.getInfo(url);

    // Filter hanya HLS
    const hlsFormats = info.formats.filter(f => f.isHLS || f.mimeType?.includes("application/vnd.apple.mpegurl"));

    if (!hlsFormats.length) {
      return res.status(404).send("Stream M3U8 tidak ditemukan untuk live ini.");
    }

    // Kualitas terbaik
    const best = hlsFormats.sort((a, b) => (b.height || 0) - (a.height || 0))[0];

    return res.redirect(best.url);

  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan server: " + err.message);
  }
});

// PORT untuk Render
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("YT Stream Proxy aktif di port", port));
