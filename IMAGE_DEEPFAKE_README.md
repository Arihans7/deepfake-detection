# 🔍 Image Deepfake Detection System

Advanced AI-powered system for detecting manipulated images using state-of-the-art deep learning techniques.

## 🎯 Features

- **Advanced CNN Architecture**: EfficientNetB3-based model for superior accuracy
- **Face Detection Integration**: MTCNN, dlib, and OpenCV support for face-focused analysis
- **Image Enhancement**: Automatic preprocessing with CLAHE and color space optimization
- **Batch Processing**: Handle multiple images simultaneously
- **Web Interface**: User-friendly web application with drag-and-drop support
- **REST API**: Complete API for integration with other systems
- **Multiple Input Formats**: Support for JPG, PNG, BMP, TIFF, and more

## 📁 Project Structure

```
├── model/
│   ├── train_image_model.py      # Advanced training script
│   ├── predict_image.py          # Image prediction module
│   └── image_preprocessing.py    # Image preprocessing pipeline
├── templates/
│   └── image_index.html          # Web interface
├── imgdataset/                   # Your image dataset
│   ├── Real/                     # Real images
│   └── Fake/                     # Deepfake images
├── image_app.py                  # Flask web application
├── train_image_pipeline.py       # Complete training pipeline
├── setup_image_model.py          # Setup and dependency checker
└── requirements.txt              # Python dependencies
```

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Check dependencies and setup
python setup_image_model.py

# Install requirements manually if needed
pip install -r requirements.txt
```

### 2. Prepare Dataset

Organize your images in the following structure:

```
imgdataset/
├── Real/          # Real, unmanipulated images
└── Fake/          # Deepfake/manipulated images
```

### 3. Train the Model

```bash
# Complete pipeline (preprocessing + training)
python train_image_pipeline.py --preprocess --train

# Or just training if data is already prepared
python train_image_pipeline.py --train

# Custom training parameters
python train_image_pipeline.py --train --img-size 256 --epochs 30 --batch-size 16
```

### 4. Test the Model

```bash
# Test single image
python model/predict_image.py --image path/to/image.jpg

# Test directory of images
python model/predict_image.py --directory path/to/images/

# Save batch results to file
python model/predict_image.py --directory path/to/images/ --output results.json
```

### 5. Start Web Interface

```bash
# Start the web server
python image_app.py

# Access at http://localhost:5001
```

## 🔧 Advanced Usage

### Custom Training Parameters

```bash
python train_image_pipeline.py \
    --preprocess \
    --train \
    --img-size 224 \
    --epochs 50 \
    --batch-size 32 \
    --data-dir custom_dataset/
```

### Preprocessing Only

```bash
# Preprocess with face detection
python model/image_preprocessing.py \
    --input imgdataset/ \
    --output processed_images/ \
    --size 224

# Preprocess without face detection
python model/image_preprocessing.py \
    --input imgdataset/ \
    --output processed_images/ \
    --no-faces \
    --no-enhance
```

### API Usage

```python
import requests

# Single image prediction
with open('image.jpg', 'rb') as f:
    response = requests.post('http://localhost:5001/api/predict',
                           files={'file': f})
    result = response.json()
    print(f"Prediction: {result['prediction']}")
    print(f"Confidence: {result['confidence']:.2%}")

# Base64 image prediction
import base64
with open('image.jpg', 'rb') as f:
    image_data = base64.b64encode(f.read()).decode()

response = requests.post('http://localhost:5001/api/predict_base64',
                        json={'image': image_data})
result = response.json()
```

## 📊 Model Architecture

The system uses an advanced CNN architecture based on EfficientNetB3:

- **Base Model**: EfficientNetB3 (pre-trained on ImageNet)
- **Input Size**: 224x224x3 (configurable)
- **Classification Head**:
  - Global Average Pooling
  - Dense layers with BatchNormalization and Dropout
  - Sigmoid output for binary classification
- **Training Strategy**:
  - Initial training with frozen base
  - Fine-tuning with unfrozen layers
  - Advanced data augmentation
  - Early stopping and learning rate scheduling

## 🎛️ API Endpoints

### Health Check

```
GET /api/health
```

### Single Image Prediction

```
POST /api/predict
Content-Type: multipart/form-data
Body: file (image file)
```

### Base64 Image Prediction

```
POST /api/predict_base64
Content-Type: application/json
Body: {"image": "base64_encoded_image"}
```

### Batch Image Prediction

```
POST /api/predict_batch
Content-Type: multipart/form-data
Body: files (multiple image files)
```

### Model Information

```
GET /api/model_info
```

## 📈 Performance Optimization

### Training Tips

1. **Dataset Size**: Use at least 1000+ images per class for good performance
2. **Image Quality**: Higher resolution images (224x224+) work better
3. **Data Balance**: Keep roughly equal numbers of real and fake images
4. **Augmentation**: The system includes advanced augmentation automatically
5. **Face Detection**: Enable for portrait-focused datasets

### Inference Optimization

1. **Batch Processing**: Use batch prediction for multiple images
2. **Image Size**: Smaller images (224x224) are faster but may be less accurate
3. **Preprocessing**: Disable face detection if not needed for speed
4. **Model Format**: Use TensorFlow SavedModel format for deployment

## 🔍 Troubleshooting

### Common Issues

**1. "No model found" error**

```bash
# Train a model first
python train_image_pipeline.py --train
```

**2. "No images found" error**

```bash
# Check dataset structure
ls imgdataset/Real/
ls imgdataset/Fake/
```

**3. Memory errors during training**

```bash
# Reduce batch size
python train_image_pipeline.py --train --batch-size 16
```

**4. Face detection not working**

```bash
# Install dlib (may require cmake)
pip install dlib

# Or disable face detection
python train_image_pipeline.py --train --no-face-detection
```

### Performance Issues

**Slow training:**

- Reduce image size: `--img-size 128`
- Reduce batch size: `--batch-size 16`
- Use GPU if available (CUDA setup required)

**Low accuracy:**

- Increase dataset size
- Enable face detection: remove `--no-face-detection`
- Increase training epochs: `--epochs 100`
- Use larger image size: `--img-size 256`

## 📋 Requirements

### System Requirements

- Python 3.8+
- 8GB+ RAM (16GB+ recommended for training)
- GPU with CUDA support (optional but recommended)

### Python Dependencies

- TensorFlow 2.15+
- OpenCV 4.8+
- NumPy, scikit-learn
- Flask (for web interface)
- Pillow, matplotlib, seaborn
- MTCNN, dlib (optional, for face detection)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- EfficientNet architecture by Google Research
- MTCNN face detection by Zhang et al.
- OpenCV and TensorFlow communities
- Flask web framework

## 📞 Support

For issues and questions:

1. Check the troubleshooting section above
2. Review existing GitHub issues
3. Create a new issue with detailed information

---

**Happy detecting! 🔍✨**
