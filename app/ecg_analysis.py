import cv2
import easyocr
import numpy as np
from PIL import Image
import io

reader = easyocr.Reader(['en'])

def analyze_ecg_image(file):
    # Read uploaded image
    image_bytes = file.file.read()
    img = np.array(Image.open(io.BytesIO(image_bytes)))

    # Convert to grayscale for better OCR
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

    # Extract text
    text_results = reader.readtext(gray)
    extracted_text = " ".join([t[1] for t in text_results])

    # Basic feature interpretation (rule-based first version)
    analysis = []
    if "ST" in extracted_text:
        analysis.append("Possible ST-segment abnormality detected.")
    if "brady" in extracted_text.lower():
        analysis.append("Signs of bradycardia (slow heart rate).")
    if "tachy" in extracted_text.lower():
        analysis.append("Signs of tachycardia (fast heart rate).")

    if not analysis:
        analysis.append("Normal sinus rhythm or unremarkable ECG pattern detected.")

    return {
        "extracted_text": extracted_text,
        "interpretation": analysis
    }
if __name__ == "__main__":
    from types import SimpleNamespace
    class DummyFile:
        def __init__(self, path):
            self.file = open(path, "rb")

    dummy_file = DummyFile("ecg_test.jpg")  # change name if different
    result = analyze_ecg_image(dummy_file)
    print("\n🩺 ECG Analysis Result:")
    print(result)
