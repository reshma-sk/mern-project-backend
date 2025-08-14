🔐 bcrypt.hash(password, saltRounds) is asynchronous because:
✅ 1. Hashing is computationally expensive
Hashing a password using bcrypt involves running a CPU-intensive algorithm.

It performs multiple rounds (e.g., 10 rounds) of calculations and transformations on the password.

The goal is to make it slow enough that attackers can't brute-force passwords quickly.

👉 These calculations take time, especially as you increase the number of rounds.

✅ 2. JavaScript is single-threaded
In Node.js (and JavaScript in general), everything runs on a single main thread.

If bcrypt hashing were synchronous (blocking), it would freeze the entire server while hashing — no other request could be handled in the meantime.

✅ So, bcrypt.hash() is asynchronous by design to avoid blocking the main thread. That’s why it returns a Promise.

