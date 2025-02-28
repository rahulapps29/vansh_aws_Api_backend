const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

// ✅ Route for Login with Amazon
router.get("/login", (req, res) => {
  const amazonAuthUrl = `${process.env.AMAZON_AUTH_URL}?client_id=${
    process.env.LWA_CLIENT_ID
  }&scope=profile&response_type=code&redirect_uri=${encodeURIComponent(
    process.env.REDIRECT_URI
  )}`;
  res.redirect(amazonAuthUrl);
});

router.get("/callback", async (req, res) => {
  const authCode = req.query.code;
  if (!authCode)
    return res.status(400).json({ error: "Authorization code missing" });

  console.log("Received Authorization Code:", authCode);

  try {
    const response = await axios.post(process.env.AMAZON_TOKEN_URL, null, {
      params: {
        grant_type: "authorization_code",
        code: authCode,
        client_id: process.env.LWA_CLIENT_ID,
        client_secret: process.env.LWA_CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
      },
    });

    const { access_token, refresh_token } = response.data;

    // Store refresh_token in HTTP-only cookie
    res.cookie("refresh_token", refresh_token, { httpOnly: true });

    // ✅ Send token as JSON response instead of redirecting
    res.json({ access_token });
  } catch (error) {
    console.error(
      "Error exchanging code for token:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Authentication failed",
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;
