export async function retry(fn, retries = 3, delay = 500) {
  let attempt = 0;
  async function execute() {

    try {
      return await fn();
    } catch (err) {
      attempt++;
      console.log(`Retry ${attempt} failed . Attempt left ${retries - attempt}`);

      if (attempt >= retries) {
        throw err;
      }
      await new Promise(res => setTimeout(res, delay)); // wait before retry
      return execute();
    }
  }
  return execute();
}

/*
// retry.js
async function retry(fn, retries = 3, delay = 500) {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn(); // ✅ success
    } catch (err) {
      lastError = err;
      console.log(`Retry ${i + 1} failed. Attempts left: ${retries - i}`);
      if (i < retries) {
        await new Promise(res => setTimeout(res, delay)); // wait before retry
      }
    }
  }
  throw lastError; // ❌ after all attempts fail
}

module.exports = retry;
*/