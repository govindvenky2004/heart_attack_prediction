from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

# Load the trained model
model = joblib.load("2heart_attack_rf_pipeline.pkl")

# Define input schema
class HeartInput(BaseModel):
    Age: int
    Sex: str
    Cholesterol: int
    Systolic_BP: int
    Diastolic_BP: int
    Heart_Rate: int
    Diabetes: int
    Family_History: int
    Smoking: int
    Obesity: int
    Alcohol_Consumption: int
    Exercise_Hours_Per_Week: float
    Previous_Heart_Problems: int
    Medication_Use: int
    Stress_Level: int
    Physical_Activity_Days_Per_Week: int
    Sleep_Hours_Per_Day: int

app = FastAPI()

@app.post("/predict-heart-attack")
def predict(data: HeartInput):
    # Convert input to dict
    input_dict = data.dict()

    # Map FastAPI field names (underscores) to pipeline column names (with spaces)
    col_map = {
        "Heart_Rate": "Heart Rate",
        "Family_History": "Family History",
        "Alcohol_Consumption": "Alcohol Consumption",
        "Exercise_Hours_Per_Week": "Exercise Hours Per Week",
        "Previous_Heart_Problems": "Previous Heart Problems",
        "Medication_Use": "Medication Use",
        "Stress_Level": "Stress Level",
        "Physical_Activity_Days_Per_Week": "Physical Activity Days Per Week",
        "Sleep_Hours_Per_Day": "Sleep Hours Per Day"
    }

    # Apply mapping
    input_df = pd.DataFrame([{col_map.get(k, k): v for k, v in input_dict.items()}])

    # Make prediction
    prediction = model.predict(input_df)[0]
    probability = model.predict_proba(input_df)[:, 1][0]

    return {
        "prediction": int(prediction),
        "probability": float(probability)
    }
