const requestLogs = {}
const WINDOW_MS = 60*1000
const MAX_REQUEST = 5

export const slidingWindowRateLimiter = (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'];
    const now = Date.now();

    // 1. if the ip is not in the requestLogs, initialize it with an empty array
    if(!requestLogs[ip]){
        requestLogs[ip] = []
    }

    // 2. Filter out timestamps that are older than our 1-minute window
    requestLogs[ip] = requestLogs[ip].filter(timmstamp => now - timmstamp < WINDOW_MS);

    // ! 3. Check if the user has exceeded the maximum number of requests
    if (requestLogs[ip].length >= MAX_REQUEST) {
        return res.status(429).json({ message: 'Too many requests. Please try again later.' });
    }
    
    // 4. Add the current timestamp to the request logs
    requestLogs[ip].push(now);
    next();
}