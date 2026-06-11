from fastapi import FastAPI
from pydantic import BaseModel

import requests
from PIL import Image
from io import BytesIO

import torch
import joblib

from transformers import CLIPProcessor, CLIPModel

app = FastAPI()

print("Loading CLIP...")

clip_model = CLIPModel.from_pretrained(
    "openai/clip-vit-base-patch32"
)

processor = CLIPProcessor.from_pretrained(
    "openai/clip-vit-base-patch32"
)

print("Loading Trained Models...")

category_model = joblib.load(
    "category_model.pkl"
)

severity_model = joblib.load(
    "severity_model.pkl"
)

category_encoder = joblib.load(
    "category_encoder.pkl"
)

severity_encoder = joblib.load(
    "severity_encoder.pkl"
)

print("Models Ready!")

class IssueRequest(BaseModel):
    imageUrl: str
    description: str

@app.get("/")
def home():
    return {
        "message": "ML Service Running"
    }

@app.post("/predict")
def predict(data: IssueRequest):

    response = requests.get(data.imageUrl)

    image = Image.open(
        BytesIO(response.content)
    ).convert("RGB")

    inputs = processor(
        text=[data.description],
        images=image,
        return_tensors="pt",
        padding=True
    )

    with torch.no_grad():
        outputs = clip_model(**inputs)

    image_emb = outputs.image_embeds
    text_emb = outputs.text_embeds

    vector = torch.cat(
        (image_emb, text_emb),
        dim=1
    )

    vector = vector.numpy()

    cat_pred = category_model.predict(vector)
    sev_pred = severity_model.predict(vector)

    category = category_encoder.inverse_transform(
        cat_pred
    )[0]

    severity = severity_encoder.inverse_transform(
        sev_pred
    )[0]

    return {
        "category": category,
        "severity": severity
    }