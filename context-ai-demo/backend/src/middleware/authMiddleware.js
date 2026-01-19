const supabase = require('../supabaseClient');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "Missing Authorization header" });
        }

        const token = authHeader.replace("Bearer ", "");

        // Verify the token using Supabase User endpoint
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.error("Auth Middleware Error:", error);
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (err) {
        console.error("Auth Middleware Unexpected Error:", err);
        return res.status(500).json({ error: "Internal Server Auth Error" });
    }
};

module.exports = authMiddleware;
