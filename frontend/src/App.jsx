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
        console.log("取得したデータ:", response.data);
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
    electricity: "電気代",
    gas: "プロパンガス", // ✅ ガス代を「プロパンガス」に変更
    kerosene: "灯油代",
    heavy_oil: "重油代",
    gas_13A: "ガス(13A)代", // ✅ 13Aを「ガス(13A)代」に変更
  };

  // 温度データのラベル変換マッピング
  const temperatureLabels = {
    supply1: "給水1",
    supply2: "給水2",
    discharge1: "排水1",
    discharge2: "排水2",
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white p-6">
      <h1 className="text-2xl font-bold text-center mb-4">排熱回収システム</h1>

      <div className="w-full max-w-6xl grid grid-cols-2 gap-6 justify-center">
        {/* 現状のリアルタイムのコスト */}
        {realTimeData && realTimeData.cost ? (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col items-center w-full">
            <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">現状のコスト</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              {Object.entries(realTimeData.cost.current || {}).map(([key, value]) => (
                <div key={key} className="bg-white p-4 rounded-md shadow w-48">
                  <h3 className="text-gray-700">{energyLabels[key] ?? key}</h3>
                  <div className="bg-gray-200 p-3 rounded-md mt-2">
                    <p className="text-xl font-bold">{value ?? "0.00"} 円/h</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : <p className="text-center">データなし (null)</p>}

        {/* 排熱回収装置のコストメリット */}
        {realTimeData && realTimeData.cost ? (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col items-center w-full">
            <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">排熱回収装置のコストメリット</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              {Object.entries(realTimeData.cost.recovery || {}).map(([key, value]) => (
                <div key={key} className="bg-white p-4 rounded-md shadow w-48">
                  <h3 className="text-gray-700">{energyLabels[key] ?? key}</h3>
                  <div className="bg-gray-200 p-3 rounded-md mt-2">
                    <p className="text-xl font-bold">{value ?? "0.00"} 円/h</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : <p className="text-center">データなし (null)</p>}
      </div>

      <div className="w-full max-w-6xl grid grid-cols-2 gap-6 mt-6 justify-center">
        {/* 現状の年間コスト */}
        {realTimeData && realTimeData.cost ? (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col items-center w-full">
            <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">現状の年間コスト</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              {Object.entries(realTimeData.cost.yearlyCurrent || {}).map(([key, value]) => (
                <div key={key} className="bg-white p-4 rounded-md shadow w-48">
                  <h3 className="text-gray-700">{energyLabels[key] ?? key}</h3>
                  <div className="bg-gray-200 p-3 rounded-md mt-2">
                    <p className="text-xl font-bold">{value ?? "0.00"} 円/年</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : <p className="text-center">データなし (null)</p>}

        {/* 排熱回収装置の年間コストメリット */}
        {realTimeData && realTimeData.cost ? (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col items-center w-full">
            <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">排熱回収装置の年間コストメリット</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              {Object.entries(realTimeData.cost.yearlyRecovery || {}).map(([key, value]) => (
                <div key={key} className="bg-white p-4 rounded-md shadow w-48">
                  <h3 className="text-gray-700">{energyLabels[key] ?? key}</h3>
                  <div className="bg-gray-200 p-3 rounded-md mt-2">
                    <p className="text-xl font-bold">{value ?? "0.00"} 円/年</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : <p className="text-center">データなし (null)</p>}
      </div>

      {/* ✅ 単価とリアルタイム温度データ */}
      {realTimeData ? (
        <div className="w-full max-w-6xl bg-gray-50 p-6 rounded-lg shadow-md mt-6 text-sm flex flex-col items-center">
          <h2 className="text-md font-semibold text-gray-700 text-center mb-2">単価</h2>
          <div className="grid grid-cols-5 gap-4 text-center w-full">
            {Object.entries(realTimeData.unitCosts || {}).map(([key, value]) => (
              <p key={key} className="bg-gray-100 p-3 rounded-md shadow-md">
                {energyLabels[key] ?? key}: <span className="font-bold">{value ?? "null"} 円/kWh</span>
              </p>
            ))}
          </div>
        </div>
      ) : <p className="text-center">データなし (null)</p>}
    </div>
  );
};

export default App;
