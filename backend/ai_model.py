import torch
import torch.nn as nn
from torchvision import transforms
from torchvision.models import efficientnet_b0
from PIL import Image

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print(f"🔥 USING DEVICE: {device}")

model = efficientnet_b0(weights=None)

model.classifier[1] = nn.Linear(
    model.classifier[1].in_features,
    2
)

model.load_state_dict(
    torch.load(
        "image_model.pth",
        map_location=device
    )
)

model = model.to(device)

model.eval()

print("✅ CUSTOM IMAGE MODEL LOADED!")

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])

def run_vit_model(image):

    if not isinstance(image, Image.Image):
        image = Image.open(image).convert("RGB")

    image = transform(image)

    image = image.unsqueeze(0).to(device)

    with torch.no_grad():

        outputs = model(image)

        probabilities = torch.softmax(
            outputs,
            dim=1
        )[0]

    fake_probability = probabilities[0].item()

    real_probability = probabilities[1].item()

    print(
        f"🔥 FAKE: {fake_probability:.4f} | REAL: {real_probability:.4f}"
    )

    return float(fake_probability)