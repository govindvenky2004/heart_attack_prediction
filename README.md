# Heart Attack Risk Prediction with Explainable AI and ECG Image Analysis

A full-stack machine learning system for early heart disease risk prediction, combining structured clinical data with ECG image analysis and explainable AI. Built as part of undergraduate research, accepted for presentation at **ACDSA 2026** (International Conference on Artificial Intelligence, Computer, Data Sciences and Applications, IEEE-affiliated).

## Overview

Most heart disease prediction tools stop at a single risk score with no explanation of *why*. This project addresses that gap in two ways:

1. **Multi-model risk prediction** using 11 clinical parameters (including a RestingECG feature), evaluated across five machine learning models to compare performance and reliability.
2. **SHAP-based explainability**, so every prediction comes with a breakdown of which factors drove the outcome — making the system genuinely useful for clinical interpretation, not just a black-box classifier.

On top of the clinical-parameter model, the system adds an **ECG image analysis module**: users can upload an ECG image directly, and the system classifies it (Normal / Abnormal / History of MI / Myocardial Infarction) and flags indicators such as possible ST-segment abnormalities, bradycardia, and tachycardia.

## Key Features

- **Five ML models compared head-to-head**: Logistic Regression, Decision Tree, Random Forest, SVM, and XGBoost — with confusion matrices for each to show real performance, not just headline accuracy
- **SHAP explainability** for every model, so predictions are interpretable rather than opaque
- **ECG image classification** using a trained deep learning model on labeled ECG image data (Normal, Abnormal, History of MI, Myocardial Infarction)
- **Web-based interface** (FastAPI backend + React frontend) for real-time predictions and ECG uploads
- **Automated PDF report generation** summarizing a patient's risk assessment, explainability breakdown, and ECG findings

## Tech Stack

- **Backend**: FastAPI, scikit-learn, XGBoost
- **ECG Analysis**: Deep learning image classifier (PyTorch-based)
- **Explainability**: SHAP
- **Reporting**: ReportLab, PyPDF2
- **Frontend**: React
- **Data handling**: pandas, NumPy

## Project Structure

```
├── app/                  # FastAPI backend, ECG analysis logic
├── data/ECG/              # ECG training/validation image data (gitignored — see note below)
├── frontend/              # React frontend
├── models/                # Trained model weights (gitignored — see note below)
├── confusion_matrices/    # Per-model confusion matrix visualizations
├── shap_plots/             # Per-model SHAP explainability plots
├── requirements.txt
└── start.sh
```

> **Note on data/weights:** ECG training images and model weight files are excluded from version control going forward via `.gitignore` to keep the repo lightweight. [Add a note here on how to obtain the dataset/weights, or a download script, if you want this repo to be fully reproducible by someone else.]

## Research Context

This project builds on prior work co-authored with Dr. C Nandini (Professor & HOD, Computer Science and Engineering, Dayananda Sagar Academy of Technology and Management), extending an earlier heart disease prediction model with SHAP-based explainability and the ECG-image analysis component as core novel contributions. The combined work has been accepted for presentation at ACDSA 2026.

## Author

**Govind Venkatesh**
Systems Engineer Trainee, Infosys | CS Graduate, DSATM Bengaluru
[GitHub](https://github.com/govindvenky2004)
