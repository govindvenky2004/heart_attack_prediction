"""Step 2: clean evaluation (split FIRST, SMOTE only on training data) + named SHAP plots.
Run:  python 2_clean_eval_and_shap.py "C:\\Users\\govin\\heart_attack_prediction\\data\\heart_clean.csv"
Outputs go to ./heart_fix_output/ (metrics.txt, shap_summary.png, shap_bar.png)."""
import sys, os
import numpy as np, pandas as pd
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
import shap
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline
from xgboost import XGBClassifier

path = sys.argv[1] if len(sys.argv) > 1 else "heart_clean.csv"
out = "heart_fix_output"; os.makedirs(out, exist_ok=True)
df = pd.read_csv(path)
X = df.drop("HeartDisease", axis=1); y = df["HeartDisease"]
lines = []
def log(s): print(s); lines.append(s)
def metrics(name, yt, yp):
    log(f"{name}: acc={accuracy_score(yt,yp):.4f} prec={precision_score(yt,yp):.4f} "
        f"rec={recall_score(yt,yp):.4f} f1={f1_score(yt,yp):.4f}")

rf_params = dict(n_estimators=500, random_state=42, n_jobs=-1)

# A) Your original protocol (SMOTE before the split) - for comparison only
Xs, ys = SMOTE(random_state=42).fit_resample(X, y)
Xa, Xb, ya, yb = train_test_split(Xs, ys, test_size=0.2, random_state=42, stratify=ys)
rf = RandomForestClassifier(**rf_params).fit(Xa, ya)
log(f"Rows: {len(df)} | class balance: {y.mean():.3f}")
metrics("A) SMOTE before split (original script)", yb, rf.predict(Xb))

# B) Clean protocol: split first, SMOTE inside the training data only
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
pipe = Pipeline([("smote", SMOTE(random_state=42)), ("rf", RandomForestClassifier(**rf_params))])
pipe.fit(Xtr, ytr)
metrics("B) Clean split, SMOTE on train only - Random Forest", yte, pipe.predict(Xte))
base = RandomForestClassifier(**rf_params).fit(Xtr, ytr)
metrics("C) Clean split, no SMOTE - Random Forest", yte, base.predict(Xte))
xp = Pipeline([("smote", SMOTE(random_state=42)),
               ("xgb", XGBClassifier(eval_metric="logloss", random_state=42, n_estimators=200, max_depth=5, learning_rate=0.1))])
xp.fit(Xtr, ytr)
metrics("D) Clean split, SMOTE on train only - XGBoost", yte, xp.predict(Xte))
cv = StratifiedKFold(5, shuffle=True, random_state=42)
sc = cross_val_score(pipe, X, y, cv=cv, scoring="accuracy")
log(f"E) 5-fold CV accuracy (SMOTE inside each fold) - Random Forest: {sc.mean():.4f} +/- {sc.std():.4f}")

# SHAP on the clean RF, with feature names
rf_clean = pipe.named_steps["rf"]
sv = shap.TreeExplainer(rf_clean).shap_values(Xte)
sv1 = sv[1] if isinstance(sv, list) else sv[:, :, 1]
plt.figure(); shap.summary_plot(sv1, Xte, show=False)
plt.savefig(f"{out}/shap_summary.png", bbox_inches="tight", dpi=150); plt.close()
plt.figure(); shap.summary_plot(sv1, Xte, plot_type="bar", show=False)
plt.savefig(f"{out}/shap_bar.png", bbox_inches="tight", dpi=150); plt.close()
rank = pd.Series(np.abs(sv1).mean(0), index=X.columns).sort_values(ascending=False)
log("\nSHAP ranking (mean |SHAP|, Random Forest, clean split):")
for k, v in rank.items(): log(f"  {k}: {v:.4f}")
# direction: correlation between feature value and its SHAP value
log("\nDirection (corr of feature value with SHAP; + means higher value pushes toward disease):")
for i, c in enumerate(X.columns):
    r = np.corrcoef(Xte[c], sv1[:, i])[0, 1]
    log(f"  {c}: {r:+.2f}")
open(f"{out}/metrics.txt", "w").write("\n".join(lines))
print(f"\nSaved to ./{out}/")
