import joblib
import pandas as pd 
from fastapi import FastAPI
from pydantic import BaseModel ,Field
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware


model = joblib.load('model.pkl')
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)


class data_format(BaseModel):
    Age: int  = Field(..., ge=0, le=120)
    Gender : Literal['Male', 'Female']
    # Country: str
    Academic_Level: Literal['Undergraduate', 'Graduate', 'High School']
    Most_Used_Platform: Literal['Facebook', 'LinkedIn', 'Instagram', 'Snapchat', 'Twitter',
       'YouTube', 'TikTok', 'LINE', 'KakaoTalk', 'VKontakte', 'WhatsApp',
       'WeChat']
    Purpose_Of_Use: Literal['Networking', 'Education', 'Entertainment', 'News']
    Avg_Daily_Usage_Hours: float = Field(..., ge=0, le=24)
    Daily_Unlocks: int =Field(...,ge=0)
    Study_Hours: float = Field(..., ge=0, le=24)
    Physical_Activity_Hours: float = Field(..., ge=0, le=24)
    Sleep_Hours_Per_Night: float= Field(...,ge=0, le=24)
    Stress_Level: Literal['Medium', 'Low', 'Very High', 'High']
    group_country: str


class ResponsePrediction(BaseModel):
    predicted_mental_score: float

@app.get('/')
def greet():
    return {'Welcome to Mental health Predictor'}

@app.post('/predict',response_model= ResponsePrediction)
def predict(data: data_format):

    top_country=['Canada', 'USA', 'India', 'Australia', 'UK', 'Germany',
       'France', 'Mexico', 'Turkey']
    country= data.group_country if data.group_country in top_country else 'Other'

    input=pd.DataFrame([{
        'Age': data.Age,
        'Gender': data.Gender,
        'Academic_Level': data.Academic_Level,
        'Most_Used_Platform': data.Most_Used_Platform,
        'Purpose_Of_Use': data.Purpose_Of_Use,
        'Avg_Daily_Usage_Hours': data.Avg_Daily_Usage_Hours,
        'Daily_Unlocks':data.Daily_Unlocks,
        'Study_Hours': data.Study_Hours,
        'Physical_Activity_Hours': data.Physical_Activity_Hours,
        'Sleep_Hours_Per_Night': data.Sleep_Hours_Per_Night,
        'Stress_Level':data.Stress_Level,
        'group_country': country
    }])

    prediction= model.predict(input)[0]
    return ResponsePrediction(predicted_mental_score=round(float(prediction),2))

