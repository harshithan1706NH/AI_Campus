from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch

print("Loading CLIP...")

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

print("CLIP Loaded Successfully!")

# Put a test image in the same folder
image = Image.open("test.jpg")

text = "fan not working in classroom"

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

print("Image Embedding Shape:", image_embedding.shape)
print("Text Embedding Shape:", text_embedding.shape)

final_vector = torch.cat((image_embedding, text_embedding), dim=1)

print("Final Vector Shape:", final_vector.shape)