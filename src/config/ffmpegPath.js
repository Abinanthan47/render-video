/**
 * Helper to get FFmpeg path
 * 
 * This file is created automatically by check-ffmpeg.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Try to find the FFmpeg executable path
 * @returns {string} FFmpeg executable path
 */
function getFFmpegPath() {
  try {
    // First try: Check if ffmpeg is in PATH
    try {
      const ffmpegPath = execSync('where ffmpeg', { encoding: 'utf8' }).trim().split('\n')[0];
      if (ffmpegPath && fs.existsSync(ffmpegPath)) {
        return ffmpegPath;
      }
    } catch (e) {
      // Not found via where command, try other methods
    }
    
    // Second try: Check common install locations
    const commonPaths = [
      // Windows paths
      'C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe',
      'C:\\ffmpeg\\bin\\ffmpeg.exe',
      // Linux/macOS paths
      '/usr/bin/ffmpeg',
      '/usr/local/bin/ffmpeg',
      // Render.com path
      '/opt/render/project/bin/ffmpeg'
    ];
    
    for (const p of commonPaths) {
      if (fs.existsSync(p)) {
        return p;
      }
    }
    
    // Final attempt: Try to require ffmpeg-static if installed
    try {
      return require('ffmpeg-static');
    } catch (e) {
      // Not installed
    }
    
    throw new Error('FFmpeg not found. Please install FFmpeg and ensure it is in your PATH.');
  } catch (error) {
    throw new Error(`Failed to locate FFmpeg: ${error.message}`);
  }
}

module.exports = getFFmpegPath;
