from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import pandas as pd
import torch
import numpy as np

print("Loading CLIP...")

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

print("CLIP Loaded!")

df = pd.read_csv("dataset.csv")

X = []
y_category = []
y_severity = []

for _, row in df.iterrows():

    image_path = f"images/{row['image']}"
    text = row["text"]

    image = Image.open(image_path).convert("RGB")

    inputs = processor(
        text=[text],
        images=image,
        return_tensors="pt",
        padding=True
    )

    with torch.no_grad():
        outputs = model(**inputs)

    image_embedding = outputs.image_embeds
    text_embedding = outputs.text_embeds

    final_vector = torch.cat(
        (image_embedding, text_embedding),
        dim=1
    )

    X.append(final_vector.squeeze().numpy())
    y_category.append(row["category"])
    y_severity.append(row["severity"])

print("Embeddings Generated!")

X = np.array(X)

print("Shape of X:", X.shape)

print("Category Labels:", len(y_category))
print("Severity Labels:", len(y_severity))