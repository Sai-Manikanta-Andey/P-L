const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

app.use(express.json());

const apiKey = "feb73b04-bb78-4d34-91bc-49f759b09ab9"; // Your Upstox API Key
const apiSecret = "sh3wmqncat"; // Your Upstox API Secret
const redirectUri = "http://localhost:3000/api/callback"; // The URL where users will be redirected

// Step 1: Redirect user to Upstox login
app.get("/api/login", (req, res) => {
  const loginUrl = `https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id=${apiKey}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;
  res.redirect(loginUrl);
});

// Step 2: Handle the authorization callback
app.get("/api/callback", async (req, res) => {
  const { code } = req.query;
  console.log("Authorization code received:", code);

  if (!code) {
    return res.status(400).send("Authorization code missing");
  }

  // Prepare the data for exchanging the authorization code for an access token
  const data = new URLSearchParams({
    client_id: apiKey,
    client_secret: apiSecret,
    code: code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });
  console.log("Data for token exchange:", data);

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    // Exchange authorization code for an access token
    const response = await axios.post(
      "https://api.upstox.com/v2/login/authorization/token",
      data,
      config
    );
    console.log("Token exchange response:", response.data);

    const accessToken = response.data.access_token;

    // Step 3: Fetch the user's P&L data
    const pnlData = await getPnLData(accessToken);

    res.send(pnlData);
  } catch (error) {
    if (error.response) {
      console.error(
        "Error during token exchange, Status:",
        error.response.status
      );
      console.error("Response data:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
    res.status(500).send("Error fetching token");
  }
});

// Helper function to fetch P&L data
const getPnLData = async (token) => {
  const segment = "EQ"; // You can modify this to 'FO', 'COM', 'CD' based on what you need
  const financialYear = "2425"; // Example: Financial year 2021-2022
  const pageNumber = 1; // Start with page 1
  const pageSize = 100; // You can adjust this based on the API's max limit
  const fromDate = "01-04-2024"; // Start date (investment date)
  const toDate = "31-03-2025"; // End date (same as today)

  try {
    const response = await axios.get(
      "https://api.upstox.com/v2/trade/profit-loss/data",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        params: {
          segment: "FO", // Equity segment for penny stocks
          financial_year: "2425", // Financial year 2024-2025 (to match today's date)
          page_number: 1,
          page_size: 100,
          from_date: fromDate, // Start date
          to_date: toDate, // End date
        },
      }
    );
    console.log("P&L data response:", response.data);

    // Process the P&L data
    // const pnl = response?.data?.map((position) => {
    //   const buyValue = position.buy_price;
    //   const sellValue = position.sell_price;
    //   const quantity = position.quantity;
    //   return {
    //     symbol: position.symbol,
    //     pnl: (sellValue - buyValue) * quantity,
    //   };
    // });
    // console.log("Processed P&L data:", pnl);

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching P&L data, Status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
    return { error: "Error fetching P&L data" };
  }
};

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
