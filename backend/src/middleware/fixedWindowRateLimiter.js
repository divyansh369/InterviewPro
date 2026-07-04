const fixedWindowStore = {}
const WINDOW_MS = 60*1000
const MAX_REQUEST = 5

export const fixedWindowRateLimiter = (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'];
    const now = Date.now();

    // 1. if the ip is not in the requestLogs, initialize it with an empty array
    if (!fixedWindowStore[ip]) {
        fixedWindowStore[ip] = {
            count:0,
            resetTime: now + WINDOW_MS
        }
    }

    // ! 2. CRITICAL STEP: Check if the current window has expired
    if (now > fixedWindowStore[ip].resetTime){
        // The fixed window is over! Reset their counter and start a new 1-minute window
        fixedWindowStore[ip].count = 0;
        fixedWindowStore[ip].resetTime = now + WINDOW_MS;
    }

    // ! 3. Check if the user has exceeded the maximum number of requests
    if (fixedWindowStore[ip].count >= MAX_REQUEST) {
        // The user has exceeded the maximum number of requests in the current window
        return res.status(429).json({ message: 'Too many requests. Please try again later.' });
    }

    // Increment the request count for the user
    fixedWindowStore[ip].count ++;
    console.log(fixedWindowStore[ip]);
    next();
}