import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const url = window.location.href;
      const requestToken = new URL(url).searchParams.get("request_token");

      if (requestToken) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/callback?request_token=${requestToken}`
          );
          // Optionally, store the response data (P&L) in state or context
          navigate("/pnl", { state: { pnlData: response.data } });
        } catch (error) {
          console.error("Error fetching P&L data", error);
        }
      }
    };

    fetchData();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
