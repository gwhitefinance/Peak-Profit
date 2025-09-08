const { spawn } = require('child_process');

// Start backend server
console.log('Starting backend server...');
const backendProcess = spawn('tsx', ['server/index.ts'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '5000' }
});

// Start frontend server
console.log('Starting frontend server...');
const frontendProcess = spawn('npx', ['vite'], {
  stdio: 'inherit'
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  backendProcess.kill('SIGINT');
  frontendProcess.kill('SIGINT');
  process.exit(0);
});

backendProcess.on('close', (code) => {
  console.log(`Backend server exited with code ${code}`);
  frontendProcess.kill('SIGINT');
});

frontendProcess.on('close', (code) => {
  console.log(`Frontend server exited with code ${code}`);
  backendProcess.kill('SIGINT');
});