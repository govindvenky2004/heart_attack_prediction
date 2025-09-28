# train_models.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
from imblearn.over_sampling import SMOTE
from xgboost import XGBClassifier   # ✅ Added
import joblib

# ---------------- Load dataset ----------------
heart_df = pd.read_csv(r"C:\Users\govin\heart_attack_prediction\data\heart_clean.csv")
heart_df = pd.get_dummies(heart_df, drop_first=True)

# Features & Target
X = heart_df.drop('HeartDisease', axis=1)
y = heart_df['HeartDisease']

# Apply SMOTE to balance classes
sm = SMOTE(random_state=42)
X, y = sm.fit_resample(X, y)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Scale data
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# Utility to print all metrics
def print_metrics(name, params, y_true, y_pred):
    acc = accuracy_score(y_true, y_pred)
    f1 = f1_score(y_true, y_pred)
    prec = precision_score(y_true, y_pred)
    rec = recall_score(y_true, y_pred)
    support = len(y_true)
    print(f"✅ {name} ({params}) "
          f"Accuracy: {acc:.4f}, "
          f"Precision: {prec:.4f}, "
          f"Recall: {rec:.4f}, "
          f"F1: {f1:.4f}, "
          f"Support: {support}")

# ---------------- Logistic Regression ----------------
param_grid = {
    "solver": ['lbfgs', 'liblinear', 'newton-cg', 'saga'],
    "C": [0.01, 0.1, 1, 10]
}
grid = GridSearchCV(LogisticRegression(max_iter=2000), param_grid, cv=cv, scoring='f1')
grid.fit(X_train, y_train)
lr_best = grid.best_estimator_
lr_pred = lr_best.predict(X_test)
print_metrics("Logistic Regression", grid.best_params_, y_test, lr_pred)
#joblib.dump(lr_best, "../models/log_reg.pkl")

# ---------------- SVM ----------------
param_grid = {
    "kernel": ['linear', 'rbf'],
    "C": [0.1, 1, 10],
    "gamma": ['scale', 'auto']
}
grid = GridSearchCV(SVC(), param_grid, cv=cv, scoring='f1')
grid.fit(X_train, y_train)
svm_best = grid.best_estimator_
svm_pred = svm_best.predict(X_test)
print_metrics("SVM", grid.best_params_, y_test, svm_pred)
#joblib.dump(svm_best, "../models/svm.pkl")

# ---------------- Decision Tree ----------------
param_grid = {
    'max_depth': [3, 5, 7, 10, None],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
    'class_weight': ['balanced', None]
}
grid = GridSearchCV(DecisionTreeClassifier(random_state=42), param_grid, cv=cv, scoring='f1')
grid.fit(X_train, y_train)
dtree_best = grid.best_estimator_
dt_pred = dtree_best.predict(X_test)
print_metrics("Decision Tree", grid.best_params_, y_test, dt_pred)
#joblib.dump(dtree_best, "../models/decision_tree.pkl")

# ---------------- Random Forest ----------------
param_grid = {
    'n_estimators': [100, 200, 500],
    'max_depth': [5, 10, 20, None],
    'min_samples_split': [2, 5, 10],
    'max_features': ['sqrt', 'log2'],
    'class_weight': ['balanced', None]
}
grid = GridSearchCV(RandomForestClassifier(random_state=42), param_grid, cv=cv, scoring='f1', n_jobs=-1)
grid.fit(X_train, y_train)
rf_best = grid.best_estimator_
rf_pred = rf_best.predict(X_test)
print_metrics("Random Forest", grid.best_params_, y_test, rf_pred)
#joblib.dump(rf_best, "../models/random_forest.pkl")

# ---------------- XGBoost ----------------
param_grid = {
    'n_estimators': [100, 200, 500],
    'max_depth': [3, 5, 7, 10],
    'learning_rate': [0.01, 0.1, 0.2],
    'subsample': [0.8, 1.0],
    'colsample_bytree': [0.8, 1.0],
    'scale_pos_weight': [1]  # since SMOTE already balanced
}

grid = GridSearchCV(
    XGBClassifier(eval_metric='logloss', random_state=42),
    param_grid, cv=cv, scoring='f1', n_jobs=-1
)
grid.fit(X_train, y_train)
xgb_best = grid.best_estimator_
xgb_pred = xgb_best.predict(X_test)
print_metrics("XGBoost", grid.best_params_, y_test, xgb_pred)
#joblib.dump(xgb_best, "../models/xgboost.pkl")
