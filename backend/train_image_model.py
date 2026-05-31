import torch
import torch.nn as nn
import torch.optim as optim

from torchvision import datasets, transforms
from torch.utils.data import DataLoader
from torchvision.models import efficientnet_b0

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print(f"\n🔥 USING DEVICE: {device}\n")

transform = transforms.Compose([

    transforms.Resize((224, 224)),

    transforms.RandomHorizontalFlip(),

    transforms.RandomRotation(10),

    transforms.ColorJitter(
        brightness=0.2,
        contrast=0.2,
        saturation=0.2
    ),

    transforms.ToTensor(),

    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )

])

train_dataset = datasets.ImageFolder(
    "datasets/image/Dataset/Train",
    transform=transform
)

val_dataset = datasets.ImageFolder(
    "datasets/image/Dataset/Validation",
    transform=transform
)

print(f"✅ Train Images: {len(train_dataset)}")
print(f"✅ Validation Images: {len(val_dataset)}")
print(f"✅ Classes: {train_dataset.classes}")

train_loader = DataLoader(
    train_dataset,
    batch_size=64,
    shuffle=True,
    num_workers=0,
    pin_memory=True
)

val_loader = DataLoader(
    val_dataset,
    batch_size=64,
    shuffle=False,
    num_workers=0,
    pin_memory=True
)

model = efficientnet_b0(weights="DEFAULT")

model.classifier[1] = nn.Linear(
    model.classifier[1].in_features,
    2
)

model = model.to(device)

criterion = nn.CrossEntropyLoss()

optimizer = optim.Adam(
    model.parameters(),
    lr=0.0001
)

epochs = 3

best_accuracy = 0.0

for epoch in range(epochs):

    print(f"\n========== EPOCH {epoch + 1}/{epochs} ==========\n")

    model.train()

    train_correct = 0
    train_total = 0

    for images, labels in train_loader:

        images = images.to(device)
        labels = labels.to(device)

        optimizer.zero_grad()

        outputs = model(images)

        loss = criterion(outputs, labels)

        loss.backward()

        optimizer.step()

        _, predicted = torch.max(outputs, 1)

        train_total += labels.size(0)

        train_correct += (
            predicted == labels
        ).sum().item()

    train_accuracy = (
        100 * train_correct / train_total
    )

    print(f"✅ Train Accuracy: {train_accuracy:.2f}%")

    model.eval()

    val_correct = 0
    val_total = 0

    with torch.no_grad():

        for images, labels in val_loader:

            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)

            _, predicted = torch.max(outputs, 1)

            val_total += labels.size(0)

            val_correct += (
                predicted == labels
            ).sum().item()

    val_accuracy = (
        100 * val_correct / val_total
    )

    print(f"🔥 Validation Accuracy: {val_accuracy:.2f}%")

    if val_accuracy > best_accuracy:

        best_accuracy = val_accuracy

        torch.save(
            model.state_dict(),
            "image_model.pth"
        )

        print("💾 BEST MODEL SAVED")

print("\n✅ TRAINING COMPLETED!")

print(
    f"🏆 BEST VALIDATION ACCURACY: {best_accuracy:.2f}%"
)