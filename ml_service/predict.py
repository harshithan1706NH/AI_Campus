from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch
import joblib

print("Loading Models...")

clip_model = CLIPModel.from_pretrained(
    "openai/clip-vit-base-patch32"
)

processor = CLIPProcessor.from_pretrained(
    "openai/clip-vit-base-patch32"
)

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

print("Models Loaded!")

image_path = "test4.jpg"

description = input(
    "Enter issue description: "
)

image = Image.open(image_path).convert("RGB")

inputs = processor(
    text=[description],
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

category = category_encoder.inverse_transform(cat_pred)[0]
severity = severity_encoder.inverse_transform(sev_pred)[0]

print("\nPrediction")
print("Category:", category)
print("Severity:", severity)