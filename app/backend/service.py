import os
import pickle
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences

class ClassificationService:
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.label_encoder = None
        self.model_loaded = False
        self.errors = []
        
        # Load resources immediately
        self.load_resources()

    def load_resources(self):
        """Attempts to load model, tokenizer, and encoder from the current directory."""
        try:
            # Current directory (where this script is)
            current_dir = os.path.dirname(os.path.abspath(__file__))
            print(f"Loading resources from: {current_dir}")

            model_path = os.path.join(current_dir, 'model.h5')
            tokenizer_path = os.path.join(current_dir, 'tokenizer.pkl')
            label_encoder_path = os.path.join(current_dir, 'label_encoder.pkl')

            # Load Model
            if os.path.exists(model_path):
                print(f"Loading model from {model_path}...")
                self.model = tf.keras.models.load_model(model_path)
            else:
                self.errors.append(f"Model file not found at {model_path}")

            # Load Tokenizer
            if os.path.exists(tokenizer_path):
                print(f"Loading tokenizer from {tokenizer_path}...")
                with open(tokenizer_path, 'rb') as f:
                    self.tokenizer = pickle.load(f)
            else:
                self.errors.append(f"Tokenizer file not found at {tokenizer_path}")

            # Load Label Encoder
            if os.path.exists(label_encoder_path):
                print(f"Loading label encoder from {label_encoder_path}...")
                with open(label_encoder_path, 'rb') as f:
                    self.label_encoder = pickle.load(f)
            else:
                self.errors.append(f"Label encoder file not found at {label_encoder_path}")

            # Verify all loaded
            if self.model and self.tokenizer and self.label_encoder:
                self.model_loaded = True
                print("All resources loaded successfully.")
            else:
                print(f"Failed to load resources. Errors: {self.errors}")

        except Exception as e:
            self.errors.append(str(e))
            print(f"Error loading resources: {e}")

    def predict(self, text):
        if not self.model_loaded:
            return {"error": "Model not loaded. Please ensure model.h5, tokenizer.pkl, and label_encoder.pkl are in the backend directory.", "details": self.errors}
        
        try:
            # Preprocess
            sequence = self.tokenizer.texts_to_sequences([text])
            padded_sequence = pad_sequences(sequence, maxlen=100, padding='post')
            
            # Predict
            prediction = self.model.predict(padded_sequence)[0]
            predicted_class_index = np.argmax(prediction)
            
            class_label = "Unknown"
            if self.label_encoder:
                # Add check for inverse_transform availability
                if hasattr(self.label_encoder, 'inverse_transform'):
                     class_label = self.label_encoder.inverse_transform([predicted_class_index])[0]
                else:
                     class_label = str(predicted_class_index)
            
            return {
                "class": class_label,
                "confidence": float(np.max(prediction))
            }
        except Exception as e:
            print(f"Prediction error: {e}")
            return {"error": "Prediction failed", "details": str(e)}

# Singleton instance
classification_service = ClassificationService()
