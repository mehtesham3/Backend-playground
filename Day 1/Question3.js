//Implement a retry function with promises

function retry(fn, retries = 3, delay = 500) {
  return new Promise((resolve, reject) => {
    function attempt(remaining) {
      fn()
        .then(resolve) // ✅ success → return result
        .catch(err => {
          if (remaining === 0) {
            reject(err); // ❌ no retries left → reject
          } else {
            console.log(`Retrying... attempts left: ${remaining}`);
            setTimeout(() => attempt(remaining - 1), delay);
          }
        });
    }
    attempt(retries);
  });
}

function unstableTask() {
  return new Promise((resolve, reject) => {
    const success = Math.random() > 0.9; // 10% chance to succeed
    setTimeout(() => {
      if (success) resolve("✅ Success!");
      else reject("❌ Failed!");
    }, 200);
  });
}

// Run with retry
retry(unstableTask, 3, 500)
  .then(result => console.log("Result:", result))
  .catch(err => console.error("Final Error:", err));
