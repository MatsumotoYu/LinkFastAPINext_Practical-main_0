"use client";
import OneCustomerInfoCard from "@/app/components/one_customer_info_card.jsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import fetchCustomers from "./fetchCustomers";

export default function Page() {
  // 顧客情報
  const [customerInfos, setCustomerInfos] = useState([]);

  // 天気機能用の状態
  const [city, setCity] = useState("");
  const [weatherInfo, setWeatherInfo] = useState(null);

  useEffect(() => {
    const fetchAndSetCustomer = async () => {
      const customerData = await fetchCustomers();
      setCustomerInfos(customerData);
    };
    fetchAndSetCustomer();
  }, []);

  // 天気取得処理
  const fetchWeather = async () => {
    try {
      const res = await fetch(`http://localhost:8000/weather?city=${encodeURIComponent(city)}`);
      if (!res.ok) throw new Error("天気情報が取得できませんでした");
      const data = await res.json();
      setWeatherInfo(data);
    } catch (error) {
      alert(error.message);
      setWeatherInfo(null);
    }
  };

  return (
    <>
      {/* 🌤 地名入力→天気表示フォーム */}
      <div className="p-4 bg-gray-100 rounded-md mb-4">
        <h2 className="text-lg font-bold mb-2">地名から天気を調べる</h2>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="例: Tokyo"
          className="input input-bordered mr-2"
        />
        <button onClick={fetchWeather} className="btn btn-primary">
          天気を取得
        </button>

        {weatherInfo && (
          <div className="mt-4 p-4 border rounded-md bg-white shadow">
            <p><strong>地名:</strong> {weatherInfo.city}</p>
            <p><strong>緯度経度:</strong> {weatherInfo.coordinates.lat}, {weatherInfo.coordinates.lon}</p>
            <p><strong>天気:</strong> {weatherInfo.weather}</p>
            <p><strong>気温:</strong> {weatherInfo.temperature}℃</p>
          </div>
        )}
      </div>

      {/* 顧客作成ボタン */}
      <div className="p-4">
        <Link href="/customers/create" className="mt-4 pt-4" prefetch={false}>
          <button className="btn btn-neutral w-full border-0 bg-blue-200 text-black hover:text-white">
            Create
          </button>
        </Link>
      </div>

      {/* 顧客一覧表示 */}
      {customerInfos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customerInfos.map((customerInfo, index) => (
            <div
              key={index}
              className="card bordered bg-white border-blue-200 border-2 flex flex-row max-w-sm m-4"
            >
              <OneCustomerInfoCard {...customerInfo} />
              <div className="card-body flex flex-col justify-between">
                <Link href={`/customers/read/${customerInfo.customer_id}`}>
                  <button className="btn btn-neutral w-20 border-0 bg-blue-200 text-black hover:text-white">
                    Read
                  </button>
                </Link>
                <Link href={`/customers/update/${customerInfo.customer_id}`}>
                  <button className="btn btn-neutral w-20 border-0 bg-blue-200 text-black hover:text-white">
                    Update
                  </button>
                </Link>
                <Link href={`/customers/delete/${customerInfo.customer_id}`}>
                  <button className="btn btn-neutral w-20 border-0 bg-blue-200 text-black hover:text-white">
                    Delete
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4">
          <p>顧客情報がありません。</p>
        </div>
      )}
    </>
  );
}
