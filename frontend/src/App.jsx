import React, { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = "https://sdsensor-hainetsukaishu-demo1-backe.onrender.com";

const App = () => {
  const [realTimeData, setRealTimeData] = useState(null);

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/realtime`);
        setRealTimeData(response.data);
      } catch (error) {
        console.error("リアルタイムデータの取得に失敗しました:", error);
      }
    };

    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 5000);
    return () => clearInterval(interval);
  }, []);

  // 日本語変換用マッピング
  const energyLabels = {
    electricity: "電気代 (円/h)",
    gas: "ガス代 (円/h)",
    kerosene: "灯油代 (円/h)",
    heavy_oil: "重油代 (円/h)",
  };

  return (
    <div className="min-h-screen flex flex-col bg-white p-6">
      <h1 className="text-2xl font-bold text-center mb-4">排熱回収システム</h1>
      <div className="grid grid-cols-2 gap-6">
        {/* 左側: 現状のコスト */}
        {realTimeData && (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">現状のコスト</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              {Object.entries(realTimeData.cost.current).map(([key, value]) => (
                <div key={key} className="bg-white p-4 rounded-md shadow w-48">
                  <h3 className="text-gray-700">{energyLabels[key] ?? key}</h3>
                  <p className="text-xl font-bold">{value} 円/h</p>
                </div>
              ))}
            </div>
            <h2 className="text-lg font-semibold text-gray-800 text-center mt-6">年間コスト</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              {Object.entries(realTimeData.yearlySavings["365 days"]).map(([key, value]) => (
                <div key={key} className="bg-white p-4 rounded-md shadow w-48">
                  <h3 className="text-gray-700">{energyLabels[key] ?? key}</h3>
                  <p className="text-xl font-bold">{value} 円/年</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 右側: 排熱回収装置のコストメリット */}
        {realTimeData && (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">排熱回収装置のコストメリット</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              {Object.entries(realTimeData.cost.recovery).map(([key, value]) => (
                <div key={key} className="bg-white p-4 rounded-md shadow w-48">
                  <h3 className="text-gray-700">{energyLabels[key] ?? key}</h3>
                  <p className="text-xl font-bold">{value} 円/h</p>
                </div>
              ))}
            </div>
            <h2 className="text-lg font-semibold text-gray-800 text-center mt-6">年間コストメリット</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              {Object.entries(realTimeData.yearlySavings["365 days"]).map(([key, value]) => (
                <div key={key} className="bg-white p-4 rounded-md shadow w-48">
                  <h3 className="text-gray-700">{energyLabels[key] ?? key}</h3>
                  <p className="text-xl font-bold">{value} 円/年</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ✅ 単価と温度データ（小さなフォント） */}
      {realTimeData && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-md mt-6 text-sm">
          <h2 className="text-md font-semibold text-gray-700 text-center mb-2">単価とリアルタイムデータ</h2>
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-600">単価</h3>
              {Object.entries(realTimeData.unitCosts).map(([key, value]) => (
                <p key={key}>{energyLabels[key] ?? key}: {value} 円/kWh</p>
              ))}
            </div>
            <div>
              <h3 className="text-gray-600">リアルタイム温度</h3>
              {Object.entries(realTimeData.temperature).map(([key, value]) => (
                <p key={key}>{key}: {value} °C</p>
              ))}
            </div>
          </div>
        </div>
      )}
      <p className="text-gray-500 text-sm text-center mt-10">© 2006-2025 株式会社 ショウワ 無断転載禁止。</p>
    </div>
  );
};

export default App;
