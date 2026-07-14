const { execSync } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

try {
  console.log('Running prisma db push via CMD...');
  execSync('npx prisma db push', {
    env: { ...process.env },
    shell: 'cmd.exe',
    stdio: 'inherit'
  });
} catch (error) {
  console.error('Error running prisma db push:', error.message);
  process.exit(1);
}
