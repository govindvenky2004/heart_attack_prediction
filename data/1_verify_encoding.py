"""Step 1: print the real training encoding and compare it with the app's decoder.
Run:  python 1_verify_encoding.py "C:\\Users\\govin\\heart_attack_prediction\\data\\heart.csv"
Creates encoding_map.json (use it in the app and in the React form)."""
import sys, json
import pandas as pd

path = r"C:\\Users\\govin\\heart_attack_prediction\\data\\heart.csv"
raw = pd.read_csv(path)

# Same logic as preprocess.py: number each text value in order of first appearance.
train_map = {}
for col in raw.select_dtypes(include="object").columns:
    train_map[col] = {str(v): i for i, v in enumerate(raw[col].unique())}

print("Feature order used for training (heart_clean.csv keeps this order):")
feats = [c for c in raw.columns if c != "HeartDisease"]
for i, c in enumerate(feats):
    print(f"  Feature {i}: {c}")

print("\nTraining encoding (from your heart.csv):")
for col, m in train_map.items():
    print(f"  {col}: {m}")

# What app2.py's decode_patient_data currently assumes (value -> label)
app_codes = {
    "Sex": {0: "F", 1: "M"},
    "ChestPainType": {0: "TA", 1: "ATA", 2: "NAP", 3: "ASY"},
    "RestingECG": {0: "Normal", 1: "ST", 2: "LVH"},
    "ExerciseAngina": {0: "N", 1: "Y"},
    "ST_Slope": {0: "Down", 1: "Flat", 2: "Up"},
}
print("\nComparison with the app decoder:")
bad = False
for col, am in app_codes.items():
    tm = {v: k for k, v in train_map.get(col, {}).items()}
    same = am == tm
    bad |= not same
    print(f"  {col}: {'OK' if same else 'MISMATCH'}")
    if not same:
        print(f"      training: {tm}\n      app     : {am}")
print("\nRESULT:", "MISMATCH FOUND - fix the app/form (see 4_app_decoder_patch.py)" if bad else "All match.")

with open("encoding_map.json", "w") as f:
    json.dump({"feature_order": feats, "encoding": train_map}, f, indent=2)
print("Saved encoding_map.json")
