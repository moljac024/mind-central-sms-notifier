const {spawn} = require('child_process');
const path = require('path');

require('dotenv').config();

const ANDROID_DIR = path.resolve(__dirname, '../android');

async function main() {
  const gradlew = path.join(ANDROID_DIR, 'gradlew');
  const args = ['assembleRelease']; // Arguments for the Gradle command
  const cwd = ANDROID_DIR; // Current working directory for the command

  // Set up the environment variables
  const env = {
    ...process.env, // Inherit the current process's environment
    ANDROID_APP_SIGNING_KEYSTORE_PATH:
      process.env.ANDROID_APP_SIGNING_KEYSTORE_PATH,
    ANDROID_APP_SIGNING_KEYSTORE_PASSWORD:
      process.env.ANDROID_APP_SIGNING_KEYSTORE_PASSWORD,
    ANDROID_APP_SIGNING_KEY_ALIAS: process.env.ANDROID_APP_SIGNING_KEY_ALIAS,
  };

  // Spawn the Gradle process
  const gradleProcess = spawn(gradlew, args, {cwd, env, stdio: 'inherit'});

  gradleProcess.on('error', error => {
    console.error(`Error: ${error.message}`);
  });

  gradleProcess.on('close', code => {
    if (code !== 0) {
      console.error(`Gradle process exited with code ${code}`);
    } else {
      console.log('Build completed successfully.');
    }
  });
}

main();
