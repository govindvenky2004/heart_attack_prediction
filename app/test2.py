import joblib
import pandas as pd
import os
import warnings
warnings.filterwarnings("ignore", category=UserWarning)

# Define a low-risk sample input
high_risk_input = pd.DataFrame([{
    "Age": 68,              # Older age
    "Sex": 1,               # Male
    "ChestPainType": 3,     # Severe chest pain type
    "RestingBP": 180,       # Very high blood pressure
    "Cholesterol": 320,     # Very high cholesterol
    "FastingBS": 1,         # High fasting blood sugar
    "RestingECG": 2,        # Abnormal ECG
    "MaxHR": 90,            # Low max heart rate
    "ExerciseAngina": 1,    # Exercise angina present
    "Oldpeak": 4.0,         # Very high ST depression
    "ST_Slope": 2           # Down slope (worst)
}])

# Path to models folder
model_dir = os.path.join("..", "models")

models = {
    "Logistic Regression": "log_reg.pkl",
    "SVM": "svm.pkl",
    "Decision Tree": "decision_tree.pkl",
    "Random Forest": "random_forest.pkl",
    "XGBoost": "xgboost.pkl"
}

for model_name, filename in models.items():
    try:
        model = joblib.load(os.path.join(model_dir, filename))

        pred = model.predict(high_risk_input)[0]

        if hasattr(model, "predict_proba"):
            prob = model.predict_proba(high_risk_input)[0][1]
            prob = round(prob, 4)
        else:
            prob = "N/A"

        print(f"🔹 {model_name} → Prediction: {pred} | Risk Probability: {prob}")

    except Exception as e:
        print(f"⚠️ {model_name} failed: {e}")
