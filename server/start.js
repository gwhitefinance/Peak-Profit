const { spawn } = require('child_process');
const path = require('path');

// Build the frontend first
console.log('Building frontend...');
const buildProcess = spawn('npm', ['run', 'build'], {
  cwd: path.resolve(__dirname, '..'),
  stdio: 'inherit'
});

buildProcess.on('close', (code) => {
  if (code !== 0) {
    console.error('Build failed');
    process.exit(1);
  }
  
  // Start the server
  console.log('Starting production server...');
  const serverProcess = spawn('tsx', ['server/index.ts'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
    env: { ...process.env, PORT: '5000' }
  });
  
  serverProcess.on('close', (serverCode) => {
    process.exit(serverCode);
  });
});