// Question: 1 Write code snippets showing blocking vs non-blocking behavior ?


const blockingBehaviour = () => {
  console.log("=== Demonstrating Blocking Behavior ===");
  console.log("Start of blocking operation");
  // A synchronous loop that simulates heavy work
  const start = Date.now();
  while (Date.now() - start < 3000) {
    // Busy-wait for 3 seconds - this BLOCKS the thread
  }
  console.log("Blocking operation completed after 3 seconds");
  console.log("End - This logs only after the 3 seconds are done");
};

// blockingBehaviour();


const nonBlockingBehaviour = () => {
  console.log("=== Demonstrating NON-Blocking Behavior ===");
  console.log("Start of operation");
  // setTimeout is the classic non-blocking API
  setTimeout(() => {
    console.log("Async operation completed after 2 seconds");
  }, 2000);
  console.log("End - This logs immediately, without waiting");
};

// nonBlockingBehaviour();
console.log("=== Demonstrating Non-Blocking with Async/Await ===");

const nonBlockingAsync = async () => {
  try {
    console.log("Start of operation");

    // We create a promise and AWAIT it, making the code *look* synchronous
    // but it's still non-blocking under the hood.
    const data = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const result = true;
        if (result) {
          resolve("Data received!"); // This resolves the promise
        } else {
          reject(new Error("Operation failed"));
        }
      }, 2000);
    });

    // This line waits for the promise above to resolve
    console.log("Promise resolved:", data);
    console.log("End of async function");

  } catch (error) {
    // This will catch any rejected promise in the try block
    console.error("Caught an error:", error.message);
  }
};

nonBlockingAsync();
console.log("This logs immediately after calling nonBlockingAsync()");