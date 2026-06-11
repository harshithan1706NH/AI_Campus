from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import pandas as pd
import torch
import numpy as np

from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
import joblib

print("Loading CLIP...")

model = CLIPModel.from_pretrained(
    "openai/clip-vit-base-patch32"
)

processor = CLIPProcessor.from_pretrained(
    "openai/clip-vit-base-patch32"
)

df = pd.read_csv("dataset.csv")

X = []
y_category = []
y_severity = []

for _, row in df.iterrows():

    image = Image.open(
        f"images/{row['image']}"
    ).convert("RGB")

    inputs = processor(
        text=[row["text"]],
        images=image,
        return_tensors="pt",
        padding=True
    )

    with torch.no_grad():
        outputs = model(**inputs)

    image_emb = outputs.image_embeds
    text_emb = outputs.text_embeds

    vector = torch.cat(
        (image_emb, text_emb),
        dim=1
    )

    X.append(vector.squeeze().numpy())
    y_category.append(row["category"])
    y_severity.append(row["severity"])

X = np.array(X)

print("Training Category Model...")

cat_encoder = LabelEncoder()
y_cat = cat_encoder.fit_transform(y_category)

category_model = LogisticRegression(
    max_iter=5000
)

category_model.fit(X, y_cat)

print("Category Model Trained!")

print("Training Severity Model...")

sev_encoder = LabelEncoder()
y_sev = sev_encoder.fit_transform(y_severity)

severity_model = LogisticRegression(
    max_iter=5000
)

severity_model.fit(X, y_sev)

print("Severity Model Trained!")

joblib.dump(category_model, "category_model.pkl")
joblib.dump(severity_model, "severity_model.pkl")

joblib.dump(cat_encoder, "category_encoder.pkl")
joblib.dump(sev_encoder, "severity_encoder.pkl")

print("Models Saved!")