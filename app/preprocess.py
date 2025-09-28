# preprocess.py
import pandas as pd
import numpy as np
from sklearn.impute import KNNImputer

def load_and_preprocess(csv_path, save_path):
    heart_df = pd.read_csv(r"C:\Users\govin\heart_attack_prediction\data\heart.csv")
    # Handle categorical encoding
    cat_col = heart_df.select_dtypes(include='object').columns
    for col in cat_col:
        mapping = dict(zip(heart_df[col].unique(), range(heart_df[col].nunique())))
        heart_df[col].replace(mapping, inplace=True)

    # Replace invalid Cholesterol values
    heart_df['Cholesterol'] = heart_df['Cholesterol'].replace(0, np.nan)

    # Impute missing values with KNN
    imputer = KNNImputer(n_neighbors=3)
    heart_df = pd.DataFrame(imputer.fit_transform(heart_df), columns=heart_df.columns)

    # Handle RestingBP
    heart_df['RestingBP'] = heart_df['RestingBP'].replace(0, np.nan)
    heart_df = pd.DataFrame(imputer.fit_transform(heart_df), columns=heart_df.columns)

    # Fix Oldpeak
    heart_df['Oldpeak'] = heart_df['Oldpeak'].apply(lambda x: max(x, 0))

    # Convert non-Oldpeak cols to int
    withoutOldPeak = heart_df.columns.drop('Oldpeak')
    heart_df[withoutOldPeak] = heart_df[withoutOldPeak].astype('int32')

    # Save preprocessed dataset
    heart_df.to_csv(save_path, index=False)
    print(f"✅ Preprocessed data saved at {save_path}")
    return heart_df

if __name__ == "__main__":
    df = load_and_preprocess(
        r"C:\Users\govin\heart_attack_prediction\data\heart.csv",
        r"C:\Users\govin\heart_attack_prediction\data\heart_clean.csv"
    )
    print(df.head())
