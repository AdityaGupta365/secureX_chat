
// const fs = require('fs');
// const path = require('path');

// import fs from 'fs'
// import path from 'path'
// function getLogs(req, res) {
//   const logPath = path.join(__dirname, '../packet_logs.json');
//   const lines = fs.existsSync(logPath)
//     ? fs.readFileSync(logPath, 'utf-8').split('\n').filter(Boolean).map(JSON.parse)
//     : [];
//   res.json(lines.slice(-100));
// }

// // module.exports = getLogs;

// export default getLogs;











// packetLogs.js
// --------------------------------------------------
// Tiny helper that streams the last 100 JSON lines
// from packet_logs.json  (one JSON object per line)
// --------------------------------------------------

// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname  = path.dirname(__filename);

// // ../packet_logs.json   (relative to this file)
// const LOG_FILE = path.join(__dirname, '../packet_logs.json');

// export default function getLogs(req, res) {
//   if (!fs.existsSync(LOG_FILE)) return res.json([]);

//   // read, split by newline, drop empties, parse
//   const lines = fs
//     .readFileSync(LOG_FILE, 'utf-8')
//     .trim()
//     .split('\n')
//     .filter(Boolean)           // defensive in case of trailing newline
//     .map((l) => {
//       try { return JSON.parse(l); }
//       catch { return { malformed: l }; }
//     });

//   res.json(lines.slice(-100)); // last 100 entries
// }






import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fix: Look for packet_logs.json in the sniffer directory
const LOG_FILE = path.join(__dirname, '../sniffer/packet_logs.json');

export default function getLogs(req, res) {
  try {
    console.log(`🔍 Looking for log file at: ${LOG_FILE}`);
    
    if (!fs.existsSync(LOG_FILE)) {
      console.log(`⚠️  Log file not found at ${LOG_FILE}`);
      return res.json([]);
    }
    
    const fileContent = fs.readFileSync(LOG_FILE, 'utf-8');
    console.log(`📄 Log file size: ${fileContent.length} bytes`);
    
    if (!fileContent.trim()) {
      console.log(`⚠️  Log file is empty`);
      return res.json([]);
    }
    
    // Parse log entries
    const lines = fileContent
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch (parseError) {
          console.error(`❌ Failed to parse log line: ${line}`);
          return { malformed: line, error: parseError.message };
        }
      });
    
    console.log(`📊 Found ${lines.length} log entries`);
    
    // Return last 100 entries
    const recentLogs = lines.slice(-100);
    res.json(recentLogs);
    
  } catch (error) {
    console.error('❌ Error reading log file:', error);
    res.status(500).json({ error: 'Failed to read log file', details: error.message });
  }
}