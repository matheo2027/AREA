// services/githubService.js
const crypto = require('crypto');
const { handleGitHubStar } = require('./githubStar');

// Validate GitHub signature
function verifyGitHubSignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  const payload = JSON.stringify(req.body);
  const hmac = crypto.createHmac('sha256', process.env.GITHUB_SECRET || 'github_secret');
  hmac.update(payload);
  const calculated = `sha256=${hmac.digest('hex')}`;

  return crypto.timingSafeEqual(
    Buffer.from(signature || '', 'utf8'),
    Buffer.from(calculated, 'utf8')
  );
}

// Periodic star checking
function startGitHubStarCheck() {
  // every 15 seconds
  setInterval(() => {
    handleGitHubStar().catch((err) => {
      console.error('[GITHUB] Error checking stars:', err);
    });
  }, 15000);
}

module.exports = {
  verifyGitHubSignature,
  startGitHubStarCheck,
};
