import React, { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = "https://sdsensor-hainetsukaishu-demo1-backe.onrender.com";

const App = () => {
  const [realTimeData, setRealTimeData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/realtime`);
        console.log("取得したデータ:", response.data); // デバッグ用
        setRealTimeData(response.data);
        setError(null);
      } catch (error) {
        console.error("リアルタイムデータの取得に失敗しました:", error);
        setRealTimeData(null);
        setError("データの取得に失敗しました。");
      }
    };

    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 5000);
    return () => clearInterval(interval);
  }, []);

  // 日本語変換用マッピング
  const energyLabels = {
    electricity: "電気代 (円/kWh)",
    gas: "ガス代 (円/kWh)",
    kerosene: "灯油代 (円/kWh)",
    heavy_oil: "重油代 (円/kWh)",
  };

  return (
    <div className="min-h-screen flex flex-col bg-white p-6">
      <h1 className="text-2xl font-bold text-center mb-4">排熱回収システム</h1>
      
      {/* ✅ 単価とリアルタイムデータを横並びで表示 */}
      {realTimeData ? (
        <div className="bg-gray-50 p-4 rounded-lg shadow-md mt-6 text-sm">
          <h2 className="text-md font-semibold text-gray-700 text-center mb-2">単価とリアルタイムデータ</h2>
          <div className="flex flex-col space-y-4">
            {/* 単価（横一列） */}
            <div className="flex justify-center space-x-6">
              {Object.entries(realTimeData.unitCosts || {}).map(([key, value]) => (
                <div key={key} className="bg-gray-200 p-3 rounded-md shadow w-48 text-center">
                  <h3 className="text-gray-700">{energyLabels[key] ?? key}</h3>
                  <p className="text-lg font-bold">{value ?? "null"} 円/kWh</p>
                </div>
              ))}
            </div>
            
            {/* リアルタイム温度（横一列） */}
            <div className="flex justify-center space-x-6">
              {Object.entries(realTimeData.temperature || {}).map(([key, value]) => (
                <div key={key} className="bg-gray-200 p-3 rounded-md shadow w-48 text-center">
                  <h3 className="text-gray-700">{key}</h3>
                  <p className="text-lg font-bold">{value ?? "null"} °C</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (<p className="text-center">データなし (null)</p>)}
      
      <p className="text-gray-500 text-sm text-center mt-10">© 2006-2025 株式会社 ショウワ 無断転載禁止。</p>
    </div>
  );
};

export default App;
