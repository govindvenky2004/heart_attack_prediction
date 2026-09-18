# app2.py – Heart Attack Prediction & Chatbot API (with MongoDB storage)
import os
import io
import uuid
import math
from datetime import datetime
from typing import Optional

import joblib
import pandas as pd
import requests
import pymongo
import matplotlib.pyplot as plt

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image as RLImage,
)
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.pdfgen import canvas
from PyPDF2 import PdfReader, PdfWriter

from dotenv import load_dotenv
from ultralytics import YOLO
from PIL import Image as PILImage

from heart_chatbot import HeartChatbot  # custom chatbot

# --------------------------------------------------------------------
# Environment
# --------------------------------------------------------------------
load_dotenv()

# --------------------------------------------------------------------
# FastAPI App
# --------------------------------------------------------------------
app = FastAPI(
    title="Heart Attack Prediction & Chatbot API",
    description="Predict heart attack risk and provide intelligent heart health advice.",
    version="2.0",
)

# CORS (allow React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # adjust if frontend runs elsewhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------------------------
# Models & Globals
# --------------------------------------------------------------------
# ML model (heart attack risk)
# Make sure this path is correct relative to this file.
model = joblib.load("../models/random_forest.pkl")

# Chatbot
chatbot = HeartChatbot(kb_path="heart_kb.json")

# Google Places API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# In-memory appointment storage
appointments = []

# MongoDB setup
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
MONGODB_DBNAME = os.getenv("MONGODB_DBNAME", "heart_db")

try:
    mongo_client = pymongo.MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
    mongo_client.admin.command("ping")
    db = mongo_client[MONGODB_DBNAME]
    patients_coll = db["patients"]
except Exception as e:
    patients_coll = None
    print(f"Warning: Could not connect to MongoDB ({e}). Patient data will NOT be persisted.")


# --------------------------------------------------------------------
# Schemas
# --------------------------------------------------------------------
class HeartInput(BaseModel):
    # Name provided by user
    name: str
    # Generated patient_id will be created server-side
    Age: int
    Sex: int
    ChestPainType: int
    RestingBP: int
    Cholesterol: int
    FastingBS: int
    RestingECG: int
    MaxHR: int
    ExerciseAngina: int
    Oldpeak: float
    ST_Slope: int


class ChatRequest(BaseModel):
    message: str
    lat: Optional[float] = None
    lng: Optional[float] = None


class Appointment(BaseModel):
    name: str
    contact: str
    hospital: str
    date: str
    time: str
    reason: str = "Heart checkup"


# --------------------------------------------------------------------
# Helper Functions
# --------------------------------------------------------------------
def decode_patient_data(data: dict) -> dict:
    """Decode numeric features and add units."""
    mappings = {
        "Sex": {0: "Female", 1: "Male"},
        "ChestPainType": {
            0: "Typical Angina",
            1: "Atypical Angina",
            2: "Non-Anginal",
            3: "Asymptomatic",
        },
        "RestingECG": {
            0: "Normal",
            1: "ST-T Abnormality",
            2: "LV Hypertrophy",
        },
        "ExerciseAngina": {0: "No", 1: "Yes"},
        "ST_Slope": {
            0: "Downsloping",
            1: "Flat",
            2: "Upsloping",
        },
        "FastingBS": {
            0: "Normal (<120 mg/dL)",
            1: "High (≥120 mg/dL)",
        },
    }

    decoded = data.copy()
    for key, mapping in mappings.items():
        if key in decoded:
            decoded[key] = mapping.get(decoded[key], decoded[key])

    # Add units and format numeric fields
    if "RestingBP" in decoded:
        decoded["RestingBP"] = f"{decoded['RestingBP']} mmHg"
    if "Cholesterol" in decoded:
        decoded["Cholesterol"] = f"{decoded['Cholesterol']} mg/dL"
    if "MaxHR" in decoded:
        decoded["MaxHR"] = f"{decoded['MaxHR']} bpm"
    if "Oldpeak" in decoded:
        decoded["Oldpeak"] = f"{decoded['Oldpeak']} mm"

    return decoded


def add_watermark(pdf_path: str, text: str = "CONFIDENTIAL") -> None:
    """Add watermark to a PDF."""
    temp_pdf = f"{uuid.uuid4().hex}_wm.pdf"
    c = canvas.Canvas(temp_pdf, pagesize=A4)
    c.setFont("Helvetica-Bold", 60)
    c.setFillColorRGB(0.9, 0.9, 0.9)  # light watermark
    c.saveState()
    c.translate(300, 400)
    c.rotate(45)
    c.drawCentredString(0, 0, text)
    c.restoreState()
    c.save()

    reader = PdfReader(pdf_path)
    wm = PdfReader(temp_pdf)
    writer = PdfWriter()

    for page in reader.pages:
        page.merge_page(wm.pages[0])
        writer.add_page(page)

    with open(pdf_path, "wb") as f:
        writer.write(f)

    try:
        os.remove(temp_pdf)
    except OSError:
        pass


def create_pdf(
    pdf_path: str,
    patient: dict,
    risk: str,
    prob: float,
    rec: str,
    logo: str = None,
) -> None:
    """Generate a stylish heart risk report PDF including name & patient_id."""
    styles = getSampleStyleSheet()
    story = []

    # Header / Logo
    if logo and os.path.exists(logo):
        story.append(RLImage(logo, width=80, height=80))

    # Title and meta
    story.append(
        Paragraph(
            "<b><font size=18 color='#003366'>Heart Attack Risk Report</font></b>",
            styles["Title"],
        )
    )
    meta = f"Generated by HeartCare AI | {datetime.now().strftime('%d %b %Y %H:%M')}"
    patient_name = patient.get("name", "Unknown")
    patient_id = patient.get("patient_id", "")

    story.append(
        Paragraph(f"<font size=10 color='#666666'>{meta}</font>", styles["Normal"])
    )
    story.append(
        Paragraph(
            f"<b>Patient:</b> {patient_name} &nbsp;&nbsp; <b>Patient ID:</b> {patient_id}",
            styles["Normal"],
        )
    )
    story.append(Spacer(1, 12))

    # Patient Table (exclude name and patient_id from table)
    display_patient = {
        k: v for k, v in patient.items() if k not in ("name", "patient_id")
    }
    pdata = [["Parameter", "Value"]] + [[k, str(v)] for k, v in display_patient.items()]

    table = Table(pdata, colWidths=[180, 180])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#003366")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.whitesmoke, colors.lightgrey]),
            ]
        )
    )
    story.append(Paragraph("<b>Patient Details:</b>", styles["Heading2"]))
    story.append(table)
    story.append(Spacer(1, 12))

    # Prediction & Recommendation
    color = "red" if risk == "High Risk" else "green"
    story.append(
        Paragraph(
            f"<b>Model Prediction:</b> <font color='{color}'>{risk}</font>",
            styles["Heading2"],
        )
    )
    story.append(
        Paragraph(f"<b>Risk Probability:</b> {prob * 100:.2f}%", styles["Normal"])
    )
    story.append(Paragraph(f"<b>Recommendation:</b> {rec}", styles["Normal"]))
    story.append(Spacer(1, 12))

    # Probability Chart
    chart_buf = io.BytesIO()
    plt.figure(figsize=(4, 2))
    plt.bar(["Risk Probability"], [prob], color=color)  # red/green is fine here
    plt.ylim([0, 1])
    plt.tight_layout()
    plt.savefig(chart_buf, format="PNG")
    plt.close()
    chart_buf.seek(0)

    story.append(RLImage(chart_buf, width=250, height=120))
    story.append(Spacer(1, 20))

    story.append(Paragraph("<i>Generated by HeartCare AI</i>", styles["Normal"]))

    os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
    doc = SimpleDocTemplate(pdf_path, pagesize=A4)
    doc.build(story)
    add_watermark(pdf_path)


async def fetch_nearby_hospitals(lat: float, lng: float, radius: int = 5000):
    """Fetch nearby heart-related hospitals using Google Places API."""
    if not GOOGLE_API_KEY:
        return []

    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{lat},{lng}",
        "radius": radius,
        "type": "hospital",
        "keyword": "heart",
        "key": GOOGLE_API_KEY,
    }
    r = requests.get(url, params=params).json()
    return [
        {"name": h.get("name"), "address": h.get("vicinity")}
        for h in r.get("results", [])
    ]


def get_chatbot_reply(message: str) -> str:
    """
    Safely call the underlying HeartChatbot method, whatever it's named.
    Tries several common method names and falls back gracefully.
    """
    try:
        possible_methods = [
            "answer",
            "chat",
            "ask",
            "get_answer",
            "get_response",
            "respond",
            "reply",
        ]
        for method_name in possible_methods:
            fn = getattr(chatbot, method_name, None)
            if callable(fn):
                return fn(message)

        # If no suitable method found
        print(
            "Warning: HeartChatbot has no suitable method among:",
            possible_methods,
        )
        return (
            "I'm your heart health assistant, but my intelligent reply module "
            "is not configured correctly yet. Please contact the developer."
        )
    except Exception as e:
        return f"Sorry, I couldn't process your question right now. ({e})"


# --------------------------------------------------------------------
# API Endpoints
# --------------------------------------------------------------------
@app.post("/predict-download")
async def predict_download(data: HeartInput):
    try:
        # prepare DataFrame for model prediction (exclude name)
        input_dict = data.dict()
        name = input_dict.pop("name", "Unknown")
        patient_id = uuid.uuid4().hex

        df = pd.DataFrame([input_dict])

        # model prediction
        prediction = model.predict(df)[0]

        # probability handling
        try:
            probability = float(model.predict_proba(df)[0][1])
        except Exception:
            try:
                score = float(model.decision_function(df)[0])
                probability = 1 / (1 + math.exp(-score))
            except Exception:
                probability = float(prediction)

        risk_label = "High Risk" if probability >= 0.45 else "Low Risk"
        recommendation = (
            "Consult a doctor immediately!"
            if probability >= 0.45
            else "Maintain a healthy lifestyle."
        )

        # decoded patient info for report (include name & patient_id)
        full_input = {"name": name, "patient_id": patient_id, **input_dict}
        decoded = decode_patient_data(full_input)

        # create pdf
        pdf_name = f"heart_report_{uuid.uuid4().hex}.pdf"
        pdf_path = os.path.join("temp_pdfs", pdf_name)
        logo = "../frontend/build/logo.png"
        create_pdf(pdf_path, decoded, risk_label, probability, recommendation, logo)

        # store in MongoDB if available
        record = {
            "patient_id": patient_id,
            "name": name,
            "input": input_dict,
            "prediction": int(prediction),
            "probability": float(probability),
            "risk_label": risk_label,
            "recommendation": recommendation,
            "pdf_path": pdf_path,
            "created_at": datetime.utcnow(),
        }
        if patients_coll is not None:
            try:
                patients_coll.insert_one(record)
            except Exception as e:
                print(f"Warning: failed to insert patient record into MongoDB: {e}")

        return {
            "patient_id": patient_id,
            "prediction": int(prediction),
            "probability": float(probability),
            "download_link": f"/download/{pdf_name}",
        }

    except Exception as e:
        import traceback

        print("Error in /predict-download:", e)
        traceback.print_exc()
        return JSONResponse(status_code=400, content={"error": str(e)})


@app.get("/download/{filename}", response_class=FileResponse)
def download_pdf(filename: str):
    path = os.path.join("temp_pdfs", filename)
    if os.path.exists(path):
        return FileResponse(path, media_type="application/pdf", filename=filename)
    return JSONResponse(status_code=404, content={"error": "File not found"})


@app.post("/chat")
async def chat(req: ChatRequest):
    user_msg = req.message.lower().strip()

    # Appointment intent
    appointment_triggers = ["book appointment", "schedule appointment", "make appointment"]
    if any(k in user_msg for k in appointment_triggers):
        return {
            "reply": (
                "Sure! To book an appointment, please provide these details:\n"
                "1. Name (full name)\n"
                "2. Contact (phone/email)\n"
                "3. Hospital (preferred)\n"
                "4. Date (YYYY-MM-DD)\n"
                "5. Time (HH:MM)\n"
                "6. Reason (optional, default: Heart checkup)"
            ),
            "show_appointment_form": True,
        }

    # Nearby hospitals intent (more flexible triggers)
    hospital_triggers = [
        "nearby hospital",
        "nearby hospitals",
        "nearest hospital",
        "nearest hospitals",
        "hospital near me",
        "heart hospital",
        "heart hospitals",
        "find hospital",
        "find hospitals",
    ]
    if any(k in user_msg for k in hospital_triggers):
        if req.lat is None or req.lng is None:
            return {"reply": "Please enable location to find nearby heart hospitals."}

        hospitals = await fetch_nearby_hospitals(req.lat, req.lng)
        if hospitals:
            formatted_lines = ["💖 <b>Nearby Heart Hospitals</b><br><br>"]
            for h in hospitals[:5]:
                name = h.get("name", "Unknown Hospital")
                address = h.get("address", "Address not available")
                maps_url = (
                    f"https://www.google.com/maps/search/?api=1&query={name.replace(' ', '+')}"
                )

                formatted_lines.append(
                    f"🏥 <b>{name}</b><br>"
                    f"📍 {address}<br>"
                    f"<a href='{maps_url}' target='_blank'>🌍 View on Maps</a><br><br>"
                )

            return {"reply": "".join(formatted_lines)}

        return {"reply": "No heart hospitals found nearby."}

    # Fallback: chatbot answer
    bot_reply = get_chatbot_reply(req.message)
    return {"reply": bot_reply}


@app.post("/book-appointment")
async def book_appointment(appointment: Appointment):
    try:
        appointment_id = str(uuid.uuid4())
        appointments.append({"id": appointment_id, **appointment.dict()})
        return {
            "message": "Appointment booked successfully",
            "appointment_id": appointment_id,
            "details": appointment.dict(),
        }
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})


@app.get("/appointments")
async def get_appointments():
    return appointments


# --------------------------------------------------------------------
# Serve React Frontend
# --------------------------------------------------------------------
frontend_path = os.path.join(os.path.dirname(__file__), "../frontend/build")
app.mount(
    "/static",
    StaticFiles(directory=os.path.join(frontend_path, "static")),
    name="static",
)


@app.get("/", response_class=FileResponse)
def root():
    return FileResponse(os.path.join(frontend_path, "index.html"))


@app.get("/{full_path:path}", response_class=FileResponse)
def catch_all(full_path: str):
    return FileResponse(os.path.join(frontend_path, "index.html"))


# --------------------------------------------------------------------
# ECG Analysis Endpoint (YOLOv8 ECG Classifier)
# --------------------------------------------------------------------
try:
    # Make sure path & filename are correct
    ecg_model = YOLO("../models/ecg_model.pt")
    print("✅ ECG Model loaded successfully.")
except Exception as e:
    ecg_model = None
    print(f"⚠️ ECG model not loaded: {e}")


ECG_INTERPRETATIONS = {
    "Normal": "Normal sinus rhythm — no abnormalities detected.",
    "Abnormal": "Irregular ECG pattern detected — possible arrhythmia or conduction issue.",
    "Myocardial_infarction": "Signs of acute myocardial infarction detected — urgent medical attention advised.",
    "History_of_MI": "ECG indicates past myocardial infarction — possible scar tissue formation.",
}


@app.post("/ecg/analyze")
async def analyze_ecg(file: UploadFile = File(...)):
    """Analyze a scanned ECG report and predict heart condition."""
    if ecg_model is None:
        return JSONResponse(status_code=500, content={"error": "ECG model not loaded"})

    try:
        image_bytes = await file.read()
        image = PILImage.open(io.BytesIO(image_bytes)).convert("RGB")

        results = ecg_model(image)
        res = results[0]
        probs = res.probs
        class_names = list(res.names.values())

        top_class_idx = int(probs.top1)
        top_class_name = class_names[top_class_idx]
        confidence = float(probs.top1conf)

        interpretation = ECG_INTERPRETATIONS.get(
            top_class_name,
            "ECG pattern detected. Please consult a cardiologist for detailed evaluation.",
        )

        return {
            "predicted_class": top_class_name,
            "confidence": f"{confidence * 100:.2f}%",
            "interpretation": interpretation,
        }

    except Exception as e:
        import traceback

        print("Error in /ecg/analyze:", e)
        traceback.print_exc()
        return JSONResponse(status_code=400, content={"error": str(e)})
