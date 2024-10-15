const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

app.use(express.json());

const apiKey = "feb73b04-bb78-4d34-91bc-49f759b09ab9";
const apiSecret = "kgzakiaju7";
const redirectUri = "http://localhost:3000/api/callback"; // The URL where users will be redirected
// Step 1: Redirect user to Upstox login

app.get("/api/login", (req, res) => {
  const loginUrl = `https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id=${apiKey}&redirect_uri=${redirectUri}&state=123`;
  res.redirect(loginUrl);
});
// https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id=<Your-API-Key-Here>&redirect_uri=<Your-Redirect-URI-Here>&state=<Your-Optional-State-Parameter-Here>

// Step 2: Handle the authorization callback
app.get("/api/callback", async (req, res) => {
  const { code } = req.query;
  const data = new URLSearchParams({
    client_id: apiKey,
    client_secret: apiSecret,
    code: code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });
console.log(data);

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
    console.log("response", response.data);

    const accessToken = response.data.access_token;

    // Step 3: Fetch the user's P&L data
    const pnlData = await getPnLData(accessToken);

    res.send(pnlData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching token");
  }
});

// Helper function to fetch P&L data
const getPnLData = async (token) => {
  console.log("token", token);

  try {
    // Example API endpoint for fetching short-term positions
    const positions = await axios.get(
      "https://api.upstox.com/v2/trade/profit-loss/data",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    console.log(positions);

    // Example P&L calculation based on the data
    const pnl = positions?.data?.map((position) => {
      const buyValue = position.buy_price;
      const sellValue = position.sell_price;
      const quantity = position.quantity;
      return {
        symbol: position.symbol,
        pnl: (sellValue - buyValue) * quantity,
      };
    });
    // console.log(pnl);

    return pnl;
  } catch (error) {
    
    return { error: "Error fetching P&L data" };
  }
};

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
