import React from "react";
import { useLocation } from "react-router-dom";

const PnL = () => {
  const location = useLocation();
  const { pnlData } = location.state || {};

  if (!pnlData) {
    return <div>No P&L data available.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Profit & Loss Details</h1>

      <h2>Holdings P&L</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Instrument Type</th>
            <th>P&L</th>
          </tr>
        </thead>
        <tbody>
          {pnlData.holdingsPnL.map((holding, index) => (
            <tr key={index}>
              <td>{holding.symbol}</td>
              <td>{holding.instrument_type}</td>
              <td>{holding.pnl}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Positions P&L</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Instrument Type</th>
            <th>P&L</th>
          </tr>
        </thead>
        <tbody>
          {pnlData.positionsPnL.map((position, index) => (
            <tr key={index}>
              <td>{position.symbol}</td>
              <td>{position.instrument_type}</td>
              <td>{position.pnl}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Mutual Funds P&L here if available */}
    </div>
  );
};

export default PnL;
