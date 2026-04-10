import numpy as np
from flask import Flask, request, jsonify
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = None
scaler = MinMaxScaler()
DAYS = 7

def build_model():
    m = Sequential([
        LSTM(50, input_shape=(DAYS, 1)),
        Dense(1)
    ])
    m.compile(optimizer="adam", loss="mse")
    return m

@app.route("/health")
def health():
    return {"status": "ok"}

@app.route("/forecast", methods=["POST"])
def forecast():
    global model

    sales = request.json.get("sales", [])
    if len(sales) < DAYS + 1:
        return jsonify({"predicted_demand": sales[-1] if sales else 0})

    data = np.array(sales, dtype=float)
    scaled = scaler.fit_transform(data.reshape(-1, 1))

    X, y = [], []
    for i in range(len(scaled) - DAYS):
        X.append(scaled[i:i+DAYS])
        y.append(scaled[i+DAYS])

    X = np.array(X).reshape(-1, DAYS, 1)
    y = np.array(y)

    if model is None:
        model = build_model()
        model.fit(X, y, epochs=5, verbose=0)  

    last_seq = scaled[-DAYS:].reshape(1, DAYS, 1)
    prediction = model.predict(last_seq, verbose=0)
    prediction = scaler.inverse_transform(prediction)[0][0]

    return jsonify({"predicted_demand": max(0, round(prediction))})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=2500)
