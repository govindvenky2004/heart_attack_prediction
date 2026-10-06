## Project history
The published paper (IJSREM, June 2025) used a Flask prototype and benchmarked five classifiers
(Logistic Regression, Decision Tree, Random Forest, SVM, XGBoost) on a public heart-disease dataset.
After publication I extended the system on my own:
- SHAP explainability for the tree-based models
- an ECG-image classifier (YOLOv8) for scanned ECGs, served at /ecg/analyze
- a FastAPI backend with a React frontend, PDF risk reports and MongoDB storage

## SHAP findings
![SHAP summary](docs/shap_summary.png)
![SHAP feature importance](docs/shap_bar.png)

Across the test set, the Random Forest relies most on ST_Slope, ChestPainType and ExerciseAngina, followed by MaxHR and Oldpeak. This agrees with clinical expectation: exercise-induced angina, ST-segment changes and a lower peak heart rate are all well-known markers of heart disease. Resting BP, cholesterol and age contributed surprisingly little; one possible reason is that missing cholesterol values in the data were imputed.

## Evaluation
Stratified 80/20 split (random_state=42), SMOTE applied to the training data only.
Random Forest: 88.6% test accuracy; 5-fold cross-validation: 85.7% (±2.5).

## ECG image classifier
A YOLOv8n image classifier, fine-tuned from pretrained weights, labels a scanned ECG as
Normal, Abnormal, Myocardial_infarction or History_of_MI (endpoint: POST /ecg/analyze).
- Data: four-class ECG image dataset, 491 unique images after removing exact duplicates
- Split: 393 train / 98 validation (stratified, per class)
- Result: about 95% top-1 accuracy on the validation split (single run)
- Per class: Abnormal 100% (47 images), Normal 96% (28), History_of_MI 94% (17),
  Myocardial_infarction 50% (6). The MI class has only 30 images in total, so its result is
  unreliable, and one MI image was classified as Normal.
Train with: yolo classify train data=<dataset> model=yolov8n-cls.pt epochs=20 imgsz=224

## Limitations
- Research prototype, not a clinical tool, and not used by clinicians.
- Tabular model trained on a public heart-disease dataset (918 records, 11 clinical features).