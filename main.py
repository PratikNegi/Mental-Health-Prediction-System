import joblib
from fastapi import FastAPI

model = joblib.load('model.pkl')
app = FastAPI()

@app.get('/')
def greet():
    return {'Welcome to Mental health Predictor'}

print("heloo")