// server.js
import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { bucket } from "./firebase/firebaseAdmin.js";

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/api/render-video', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'audio', maxCount: 1 }
]), async (req, res) => {
  try {
    const images = req.files['images'];
    const audio = req.files['audio'][0];
    const outputPath = `outputs/output-${Date.now()}.mp4`;

    // Create a video from images
    const command = ffmpeg();
    images.forEach(img => command.input(img.path));
    command
      .input(audio.path)
      .on('end', async () => {
        // Upload to Firebase Storage
        await bucket.upload(outputPath, {
          destination: path.basename(outputPath),
          metadata: {
            contentType: 'video/mp4',
          },
        });

        // Get public URL
        const file = bucket.file(path.basename(outputPath));
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: '03-09-2491',
        });

        // Cleanup
        images.forEach(img => fs.unlinkSync(img.path));
        fs.unlinkSync(audio.path);
        fs.unlinkSync(outputPath);

        res.json({ videoUrl: url });
      })
      .on('error', err => {
        console.error('FFmpeg error:', err);
        res.status(500).send('Video processing failed.');
      })
      .save(outputPath);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Server error.');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
