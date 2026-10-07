"""FastAPI-facing wrapper: keeps your EasyOCR reader, uses the rules in ecg_ocr.py."""
import io

import cv2
import easyocr
import numpy as np
from PIL import Image

from ecg_ocr import parse_metrics, interpret

reader = easyocr.Reader(["en"])


def analyze_ecg_image(file_or_bytes):
    """Accepts raw image bytes, or a FastAPI UploadFile (reads file.file)."""
    image_bytes = file_or_bytes if isinstance(file_or_bytes, (bytes, bytearray)) else file_or_bytes.file.read()
    img = np.array(Image.open(io.BytesIO(image_bytes)).convert("RGB"))
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

    text_results = reader.readtext(gray)
    extracted_text = "\n".join(t[1] for t in text_results)  # one detected line per row

    result = interpret(parse_metrics(extracted_text))
    result["extracted_text"] = extracted_text
    return result


if __name__ == "__main__":
    class DummyFile:
        def __init__(self, path):
            self.file = open(path, "rb")

    print(analyze_ecg_image(DummyFile("ecg_test.jpg")))