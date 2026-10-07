## Project history
The published paper (IJSREM, June 2025) used a Flask prototype and benchmarked five classifiers
(Logistic Regression, Decision Tree, Random Forest, SVM, XGBoost) on a public heart-disease dataset.
A related paper was accepted for presentation at ACDSA 2026 (IEEE-affiliated). I could not attend, so it was not presented and does not appear in the proceedings.
After publication I extended the system on my own:
- SHAP analysis of the tree-based models (global feature importance, see below)
- an ECG-image classifier (YOLOv8n) for scanned ECGs, served at /ecg/analyze
- OCR and rule-based reading of printed values on ECG report images (ecg_ocr.py, ecg_analysis.py)
- a FastAPI backend with a React frontend, PDF risk reports and MongoDB storage

## SHAP findings
![SHAP summary](docs/shap_summary.png)
![SHAP feature importance](docs/shap_bar.png)

SHAP is used here as a global feature-importance analysis of the Random Forest. The API does not return a per-patient SHAP explanation.

Ranked by mean absolute SHAP value, ST_Slope (0.1925) is first, then ChestPainType (0.1101), ExerciseAngina (0.0780), MaxHR (0.0507) and Oldpeak (0.0461). This agrees with clinical expectation: exercise-induced angina, ST-segment changes and a lower peak heart rate are all well-known markers of heart disease. Resting BP, cholesterol and age contributed little; one possible reason is that missing cholesterol values in the data were imputed. Categorical features are label-encoded, so the direction of their effect is not interpreted here.

## Evaluation
Stratified 80/20 split (random_state=42), SMOTE applied to the training data only.

| Setup | Random Forest accuracy |
|---|---|
| SMOTE on train only (reported setup) | 88.6% |
| No SMOTE | 89.7% |
| 5-fold cross-validation (918 rows) | 85.7% (±2.5) |

Note on the paper's figure: the paper reports 89.98% for Random Forest. That evaluation applied SMOTE before the train/test split, which lets synthetic samples leak into the test set, so it overstates performance. The numbers above are the corrected ones. [Add: the paper used 1,190 records and this repo 918; state the reason only once verified.]

## ECG image classifier
A YOLOv8n image classifier, fine-tuned from pretrained weights, labels a scanned ECG as
Normal, Abnormal, Myocardial_infarction or History_of_MI (endpoint: POST /ecg/analyze).
- Data: four-class ECG image dataset, 491 unique images after removing exact duplicates [add dataset source and link]
- Split: 393 train / 98 validation (stratified, per class). There is no separate held-out test set.
- Result: about 95% top-1 accuracy on the validation split (single run)
- Per class: Abnormal 100% (47 images), Normal 96% (28), History_of_MI 94% (17),
  Myocardial_infarction 50% (6). The MI class has only 30 images in total, so its result is
  unreliable, and one MI image was classified as Normal.
Train with: yolo classify train data=<dataset> model=yolov8n-cls.pt epochs=20 imgsz=224

## ECG report reading (OCR and rules)
`ecg_analysis.py` reads printed text on an uploaded ECG report image with EasyOCR, and `ecg_ocr.py` applies simple rules to it:
- heart rate below 60 bpm is flagged as possible bradycardia, above 100 bpm as possible tachycardia
- an ST statement (ST elevation or depression) in the printed text is reported as a possible ST-segment abnormality

Limits: this reads printed text only and does not analyse the waveform. If the image has no readable values it returns `no_readable_values`. The output is preliminary and not a diagnosis. Run the rule tests with `python test_ecg_ocr.py`-style checks in `test_ecg_ocr.py`.

## Limitations
- Research prototype, not a clinical tool, and not used by clinicians.
- Tabular model trained on a public heart-disease dataset (918 records, 11 clinical features).
- SHAP is a global analysis, not a per-prediction explanation in the app.
- ECG classifier validated on a small single split; the MI class is very small.