from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json
from db_control import crud, mymodels


class Customer(BaseModel):
    customer_id: str
    customer_name: str
    age: int
    gender: str


app = FastAPI()

# CORSミドルウェアの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def index():
    return {"message": "FastAPI top page!"}


@app.post("/customers")
def create_customer(customer: Customer):
    values = customer.dict()
    tmp = crud.myinsert(mymodels.Customers, values)
    result = crud.myselect(mymodels.Customers, values.get("customer_id"))

    if result:
        result_obj = json.loads(result)
        return result_obj if result_obj else None
    return None


@app.get("/customers")
def read_one_customer(customer_id: str = Query(...)):
    result = crud.myselect(mymodels.Customers, customer_id)
    if not result:
        raise HTTPException(status_code=404, detail="Customer not found")
    result_obj = json.loads(result)
    return result_obj[0] if result_obj else None


@app.get("/allcustomers")
def read_all_customer():
    result = crud.myselectAll(mymodels.Customers)
    # 結果がNoneの場合は空配列を返す
    if not result:
        return []
    # JSON文字列をPythonオブジェクトに変換
    return json.loads(result)


@app.put("/customers")
def update_customer(customer: Customer):
    values = customer.dict()
    values_original = values.copy()
    tmp = crud.myupdate(mymodels.Customers, values)
    result = crud.myselect(mymodels.Customers, values_original.get("customer_id"))
    if not result:
        raise HTTPException(status_code=404, detail="Customer not found")
    result_obj = json.loads(result)
    return result_obj[0] if result_obj else None


@app.delete("/customers")
def delete_customer(customer_id: str = Query(...)):
    result = crud.mydelete(mymodels.Customers, customer_id)
    if not result:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"customer_id": customer_id, "status": "deleted"}


@app.get("/fetchtest")
def fetchtest():
    response = requests.get('https://jsonplaceholder.typicode.com/users')
    return response.json()

# 天気取得用エンドポイントの追加
@app.get("/weather")
def get_weather(city: str = Query(..., description="地名を入力してください")):
    """
    指定された地名の現在の天気を取得するエンドポイント。
    1. OpenCage APIで地名から緯度経度を取得
    2. OpenWeatherMap APIでその緯度経度の天気を取得
    """

    # 🔑 APIキー（実運用では .env などで管理推奨）
    OPENCAGE_API_KEY = "1f58073d18dd49de888c4011a7b7aa68"
    OPENWEATHER_API_KEY = "dbb52f1fb30d0853a9116985b3fbb264"

    # ① 地名から緯度経度を取得（OpenCage API）
    geo_url = f"https://api.opencagedata.com/geocode/v1/json?q={city}&key={OPENCAGE_API_KEY}"
    geo_res = requests.get(geo_url).json()

    if not geo_res["results"]:
        raise HTTPException(status_code=404, detail="指定された地名が見つかりませんでした")

    lat = geo_res["results"][0]["geometry"]["lat"]
    lon = geo_res["results"][0]["geometry"]["lng"]

    # ② 緯度経度から天気を取得（OpenWeatherMap API）
    weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&lang=ja&units=metric"
    weather_res = requests.get(weather_url).json()

    # ③ 必要な情報だけ抽出して返却
    return {
        "city": city,
        "coordinates": {"lat": lat, "lon": lon},
        "weather": weather_res.get("weather", [{}])[0].get("description", "情報なし"),
        "temperature": weather_res.get("main", {}).get("temp", "情報なし")
    }
