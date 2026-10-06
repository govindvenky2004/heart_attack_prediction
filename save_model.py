import pandas as pd, joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE

df = pd.read_csv(r"data\heart_clean.csv")
X = df.drop("HeartDisease", axis=1)
y = df["HeartDisease"]
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
Xs, ys = SMOTE(random_state=42).fit_resample(Xtr, ytr)      # SMOTE on training data only
rf = RandomForestClassifier(n_estimators=500, random_state=42, n_jobs=-1).fit(Xs, ys)
joblib.dump(rf, r"models\random_forest.pkl")
print("Saved. Test accuracy:", round(rf.score(Xte, yte), 4))