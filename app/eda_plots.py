# eda_plots.py
import pandas as pd
import plotly.express as px

# Load cleaned dataset
heart_df = pd.read_csv(r"C:\Users\govin\heart_attack_prediction\data\heart_clean.csv")

# Random sample
print("\nRandom sample:\n", heart_df.sample())

# Correlation
corr_series = heart_df.corr()['HeartDisease'][:-1].sort_values()
print("\nCorrelation with HeartDisease:\n", corr_series)
px.line(corr_series, title="Correlation with HeartDisease").show()

# Plots
px.sunburst(heart_df, path=['HeartDisease', 'Age']).show()
px.histogram(heart_df, x='Age', color='HeartDisease').show()
px.pie(heart_df, names='HeartDisease', title="HeartDisease distribution").show()
px.histogram(heart_df, x='Sex', color='HeartDisease').show()
px.histogram(heart_df, x='ChestPainType', color='HeartDisease').show()
px.sunburst(heart_df, path=['HeartDisease', 'RestingBP']).show()
px.histogram(heart_df, x='FastingBS', color='HeartDisease').show()
px.sunburst(heart_df, path=['HeartDisease', 'MaxHR']).show()
px.violin(heart_df, x='HeartDisease', y='MaxHR', color='HeartDisease').show()
px.violin(heart_df, x='HeartDisease', y='Oldpeak', color='HeartDisease').show()
px.histogram(heart_df, x='ST_Slope', color='HeartDisease').show()
px.histogram(heart_df, x='ExerciseAngina', color='HeartDisease').show()
