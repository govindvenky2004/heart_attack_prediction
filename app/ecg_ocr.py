"""OCR + rule-based preliminary interpretation for uploaded ECG report images.

Scope (be honest in docs): this reads the PRINTED TEXT on an ECG image/report
(heart rate, intervals, ST statements) with Tesseract and applies simple rules.
It does not analyse the waveform and is not a diagnosis. Waveform-image
classification is done separately by the YOLOv8n model.
"""
import re
from dataclasses import dataclass, field, asdict
from typing import Optional

import cv2


def preprocess(image_path: str):
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Cannot read image: {image_path}")
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    gray = cv2.GaussianBlur(gray, (3, 3), 0)
    return cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]


def extract_text(image_path: str) -> str:
    import pytesseract  # only needed for the Tesseract path
    return pytesseract.image_to_string(preprocess(image_path), config="--psm 6")


@dataclass
class Metrics:
    heart_rate_bpm: Optional[int] = None
    pr_ms: Optional[int] = None
    qrs_ms: Optional[int] = None
    qt_ms: Optional[int] = None
    st_statements: list = field(default_factory=list)


_NUM = r"[:=\s]*([0-9]{2,3})"


def parse_metrics(text: str) -> Metrics:
    m = Metrics()
    def grab(pattern):
        g = re.search(pattern, text, re.I)
        return int(g.group(1)) if g else None
    m.heart_rate_bpm = grab(r"(?:heart\s*rate|\bHR\b|\bVent(?:ricular)?\s*rate)" + _NUM)
    m.pr_ms = grab(r"\bPR(?:\s*interval)?" + _NUM)
    m.qrs_ms = grab(r"\bQRS(?:\s*duration)?" + _NUM)
    m.qt_ms = grab(r"\bQT(?!c)(?:\s*interval)?" + _NUM)
    for line in text.splitlines():
        if re.search(r"\bST\b.*(elevat|depress|abnormal|change)|(elevat|depress).*\bST\b|ST-?T", line, re.I):
            m.st_statements.append(line.strip())
    return m


def interpret(m: Metrics) -> dict:
    findings = []
    if m.heart_rate_bpm is not None:
        if m.heart_rate_bpm < 60:
            findings.append(f"Possible bradycardia (heart rate {m.heart_rate_bpm} bpm < 60)")
        elif m.heart_rate_bpm > 100:
            findings.append(f"Possible tachycardia (heart rate {m.heart_rate_bpm} bpm > 100)")
        else:
            findings.append(f"Heart rate {m.heart_rate_bpm} bpm within 60-100")
    if m.st_statements:
        findings.append("Possible ST-segment abnormality mentioned: " + "; ".join(m.st_statements))
    return {
        "metrics": asdict(m),
        "findings": findings,
        "status": "ok" if findings else "no_readable_values",
        "disclaimer": "Preliminary rule-based reading of printed text only; not a diagnosis.",
    }


def analyze_ecg_image(image_path: str) -> dict:
    return interpret(parse_metrics(extract_text(image_path)))


if __name__ == "__main__":
    import json, sys
    print(json.dumps(analyze_ecg_image(sys.argv[1]), indent=2))
