from ultralytics import YOLO

# Initialize YOLOv8 classification model
model = YOLO("yolov8n-cls.pt")

# Train
model.train(
    data="C:/Users/govin/heart_attack_prediction/data/ECG",
    epochs=30,
    imgsz=224,
    batch=16,
    device="cpu"  # or 'cpu' if you don’t have GPU
)

# Export final model
model.export(format="pt")
print("✅ ECG classification model trained successfully!")
