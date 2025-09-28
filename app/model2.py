import pandas as pd
import numpy as np
from sklearn.impute import KNNImputer
import plotly.express as px

# ---- Load dataset ----
heart_df = pd.read_csv(r"C:\Users\govin\heart_attack_prediction\data\heart.csv")

# ---- Basic dataset checks ----
print("Null values before cleaning:\n", heart_df.isnull().sum())
print("\nDuplicate rows:", heart_df.duplicated().sum())
print("\nUnique values per column:\n", heart_df.nunique())
print("\nColumns:", heart_df.columns.tolist())

# ---- Handle categorical features ----
cat_col = heart_df.select_dtypes(include='object').columns
print("\nCategorical Columns:", cat_col.tolist())

for col in cat_col:
    print(f"\nEncoding column: {col}")
    print("Unique values:", heart_df[col].unique())
    mapping = dict(zip(heart_df[col].unique(), range(heart_df[col].nunique())))
    heart_df[col].replace(mapping, inplace=True)

# ---- Handle Cholesterol ----
print("\nReplacing invalid Cholesterol = 0 with NaN...")
heart_df['Cholesterol'] = heart_df['Cholesterol'].replace(0, np.nan)

# ---- Impute missing values using KNN ----
imputer = KNNImputer(n_neighbors=3)
heart_df = pd.DataFrame(imputer.fit_transform(heart_df), columns=heart_df.columns)

# ---- Handle RestingBP ----
print("\nReplacing invalid RestingBP = 0 with NaN and imputing...")
heart_df['RestingBP'] = heart_df['RestingBP'].replace(0, np.nan)
heart_df = pd.DataFrame(imputer.fit_transform(heart_df), columns=heart_df.columns)

# ---- Fix Oldpeak ----
heart_df['Oldpeak'] = heart_df['Oldpeak'].apply(lambda x: max(x, 0))

# ---- Convert to integer where appropriate ----
withoutOldPeak = heart_df.columns.drop('Oldpeak')
heart_df[withoutOldPeak] = heart_df[withoutOldPeak].astype('int32')

# ---- Final dataset info ----
print("\nFinal dataset info:")
print(heart_df.info())
print("\nPreview of cleaned dataset:\n", heart_df.head())

# ---- EDA Plots ----
print("\nRandom sample:\n", heart_df.sample())

# Correlation with HeartDisease
corr_series = heart_df.corr()['HeartDisease'][:-1].sort_values()
print("\nCorrelation with HeartDisease:\n", corr_series)

fig = px.line(corr_series, title="Correlation with HeartDisease")
fig.show()

# Sunburst: HeartDisease vs Age
fig = px.sunburst(heart_df, path=['HeartDisease', 'Age'])
fig.show()

# Histogram: Age distribution by HeartDisease
fig = px.histogram(heart_df, x='Age', color='HeartDisease')
fig.show()

# Pie chart: HeartDisease distribution
fig = px.pie(heart_df, names='HeartDisease', title='Percentage of HeartDisease classes distribution')
fig.show()

# Histogram: Sex distribution by HeartDisease
fig = px.histogram(heart_df, x='Sex', color='HeartDisease')
fig.show()

# Histogram: ChestPainType by HeartDisease
fig = px.histogram(heart_df, x='ChestPainType', color='HeartDisease')
fig.show()

# Sunburst: HeartDisease vs RestingBP
fig = px.sunburst(heart_df, path=['HeartDisease', 'RestingBP'])
fig.show()

print("Unique RestingBP values:", heart_df['RestingBP'].unique())

# Histogram: FastingBS by HeartDisease
fig = px.histogram(heart_df, x='FastingBS', color='HeartDisease')
fig.show()

# Sunburst: HeartDisease vs MaxHR
fig = px.sunburst(heart_df, path=['HeartDisease', 'MaxHR'])
fig.show()

# Violin plots
fig = px.violin(heart_df, x='HeartDisease', y='MaxHR', color='HeartDisease')
fig.show()

fig = px.violin(heart_df, x='HeartDisease', y='Oldpeak', color='HeartDisease')
fig.show()

# Histogram: ST_Slope by HeartDisease
fig = px.histogram(heart_df, x='ST_Slope', color='HeartDisease')
fig.show()

# Histogram: ExerciseAngina by HeartDisease
fig = px.histogram(heart_df, x='ExerciseAngina', color='HeartDisease')
fig.show()
import pandas as pd
heart_df=pd.get_dummies(heart_df,drop_first=True)
from sklearn.model_selection import train_test_split
X_train,X_test,y_train,y_test=train_test_split(
    heart_df.drop('HeartDisease', axis=1),
    heart_df['HeartDisease'],
    test_size=0.2,
    random_state=42,
    stratify=heart_df['HeartDisease']
)
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

solver=['lbfgs','liblinear','newton-cg','newton-cholesky','sag','saga']
best_solver=''
test_score=np.zeros(6)
for i,n in enumerate(solver):
    lr=LogisticRegression(solver=n).fit(X_train,y_train)
    test_score[i]=lr.score(X_test,y_test)
    if lr.score(X_test,y_test)==test_score.max():
        best_solver=n
print(best_solver)
lr=LogisticRegression(solver=best_solver)
lr.fit(X_train,y_train)
lr_pred=lr.predict(X_test)
print(f'Logistic Regression Score:{accuracy_score(y_test,lr_pred)}')
from sklearn.svm import SVC
from sklearn.metrics import f1_score, accuracy_score

kernels = ['linear', 'poly', 'rbf', 'sigmoid']
best = None
best_score = 0

for k in kernels:
    svm = SVC(kernel=k)
    svm.fit(X_train, y_train)
    yhat = svm.predict(X_test)
    
    f1 = f1_score(y_test, yhat, average="weighted")
    acc = accuracy_score(y_test, yhat)
    
  #  print(f"Kernel: {k}, Accuracy: {acc:.4f}, F1 Score: {f1:.4f}")
    
    if f1 > best_score:   
        best_score = f1
        best = k

print(f"\nBest kernel: {best}, Best F1 Score: {best_score:.4f}")
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import GridSearchCV

dtree=DecisionTreeClassifier(class_weight='balanced')
param_grid={
    'max_depth':[3,4,5,6,7,8],
    'min_samples_split':[2,3,4],
    'min_samples_leaf':[1,2,3,4],
    'random_state':[0,42]
}
grid_search=GridSearchCV(dtree,param_grid,cv=5)
grid_search.fit(X_train,y_train)
Ctree=DecisionTreeClassifier(**grid_search.best_params_,class_weight='balanced')
Ctree.fit(X_train,y_train)
dtc_pred=Ctree.predict(X_test)
print("DecisionTrees's Accuracy:",accuracy_score(y_test,dtc_pred))
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV

rfc=RandomForestClassifier()
param_grid={
    'n_estimators':[50,100,150,500],
    'max_features':['sqrt','log2',None],
    'max_depth':[3,6,9,19],
    'max_leaf_nodes':[3,6,9],
}
grid_search=GridSearchCV(rfc,param_grid)
grid_search.fit(X_train,y_train)
rfctree=RandomForestClassifier(**grid_search.best_params_)
rfctree.fit(X_train,y_train)
rfc_pred=rfctree.predict(X_test)
print("RandomForestClassifier's Accuracy: ",accuracy_score(y_test,rfc_pred))
