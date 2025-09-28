import pandas as pd
import joblib
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

df = pd.read_excel(r"C:\Users\govin\heart_attack_prediction\data\HA_1dataset.csv.xlsx")

df.columns = df.columns.str.strip()
df = df.drop_duplicates().reset_index(drop=True)

bp = df['Blood Pressure'].astype(str).str.extract(r'(?P<Systolic_BP>\d{2,3})\s*/\s*(?P<Diastolic_BP>\d{2,3})')
df['Systolic_BP'] = pd.to_numeric(bp['Systolic_BP'], errors='coerce')
df['Diastolic_BP'] = pd.to_numeric(bp['Diastolic_BP'], errors='coerce')
df = df.drop(columns=['Blood Pressure'])

# Convert numeric-like strings to numeric
for c in df.columns:
    if c not in ['Sex', 'Heart Attack Risk']:
        if df[c].dtype == 'object':
            df[c] = pd.to_numeric(df[c].str.replace(r'[^0-9.\-]', '', regex=True), errors='coerce')

# Clip extreme values
df['Age'] = df['Age'].clip(1, 120)
df['Systolic_BP'] = df['Systolic_BP'].clip(70, 250)
df['Diastolic_BP'] = df['Diastolic_BP'].clip(40, 150)
df['Cholesterol'] = df['Cholesterol'].clip(80, 700)

# Split features and target
target_col = 'Heart Attack Risk'
X = df.drop(columns=[target_col])
y = df[target_col].astype(int)
print(X.info())
"""cat_cols = [c for c in X.columns if c == 'Sex']
num_cols = [c for c in X.columns if c not in cat_cols]

numeric_pre = SimpleImputer(strategy='median')
categorical_pre = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

preprocessor = ColumnTransformer([
    ('num', numeric_pre, num_cols),
    ('cat', categorical_pre, cat_cols)
])
rf = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight='balanced'
)

pipe = Pipeline([
    ('preprocess', preprocessor),
    ('rf', rf)
])

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, stratify=y, random_state=42
)

pipe.fit(X_train, y_train)
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

y_pred = pipe.predict(X_test)
joblib.dump(pipe, '2heart_attack_rf_pipeline.pkl')
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Classification Report:\n", classification_report(y_test, y_pred))
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))"""