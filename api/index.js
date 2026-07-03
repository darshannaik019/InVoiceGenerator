export default async function handler(req, res) {
  try {
    const { default: app } = await import('../backend/src/server.js');
    return app(req, res);
  } catch (error) {
    console.error("CRITICAL ERROR: Failed to load Express app:", error);
    res.status(500).json({
      message: "Internal Server Error - Failed to load backend application",
      error: error.message,
      stack: error.stack
    });
  }
}
