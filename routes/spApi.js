const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

router.get("/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) return res.status(401).send("No refresh token found");

  try {
    const response = await axios.post(process.env.AMAZON_TOKEN_URL, null, {
      params: {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: process.env.LWA_CLIENT_ID,
        client_secret: process.env.LWA_CLIENT_SECRET,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error refreshing token:",
      error.response?.data || error.message
    );
    res.status(500).send("Token refresh failed");
  }
});

router.get("/orders", async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken) return res.status(401).send("No access token");

  try {
    const response = await axios.get(
      `${process.env.SP_API_URL}/orders/v0/orders`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching orders:",
      error.response?.data || error.message
    );
    res.status(500).send("Failed to get orders");
  }
});

module.exports = router;
