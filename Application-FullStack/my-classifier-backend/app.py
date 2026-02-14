""" Standalone prediction script for Sinhala News Classifier """
import numpy as np
import pandas as pd
import pickle
import re
import string
from nltk.stem import PorterStemmer

# ============================================================================
# CONFIGURATION - UPDATE THESE PATHS
# ============================================================================
MODEL_PATH = '/Users/rashidahamed/Desktop/fyp/static/model/samrtmodel.pickle'
VOCAB_PATH = '/Users/rashidahamed/Desktop/fyp/static/model/vocabulary.txt'

# Load model and vocabulary
print("Loading model...")
with open(MODEL_PATH, 'rb') as f:
    model = pickle.load(f)

print("Loading vocabulary...")
vocab = pd.read_csv(VOCAB_PATH, header=None)
tokens = vocab[0].tolist()

ps = PorterStemmer()

# ============================================================================
# PREPROCESSING FUNCTIONS
# ============================================================================

def remove_punctuations(text):
    for punctuation in string.punctuation:
        text = text.replace(punctuation, '')
    return text

def preprocessing(text):
    data = pd.DataFrame([text], columns=['Title'])
    data["Title"] = data["Title"].apply(lambda x: " ".join(x.lower() for x in x.split()))
    data["Title"] = data['Title'].apply(lambda x: " ".join(re.sub(r'^https?:\/\/.*[\r\n]*', '', x, flags=re.MULTILINE) for x in x.split()))
    data["Title"] = data["Title"].apply(remove_punctuations)
    data["Title"] = data["Title"].str.replace(r'\d+', '', regex=True)
    data["Title"] = data['Title'].apply(lambda x: " ".join(ps.stem(x) for x in x.split()))
    return data["Title"]

def vectorizer(ds, vocabulary):
    vectorized_lst = []
    for sentence in ds:
        sentence_lst = np.zeros(2806)
        for i in range(len(vocabulary)):
            if vocabulary[i] in sentence.split():
                sentence_lst[i] = 1
        vectorized_lst.append(sentence_lst)
    return np.asarray(vectorized_lst, dtype=np.float32)

def get_prediction(vectorized_text):
    prediction = model.predict(vectorized_text)
    try:
        probabilities = model.predict_proba(vectorized_text)
        confidence = float(np.max(probabilities))
    except:
        confidence = 0.85
    return prediction[0], confidence

# ============================================================================
# MAIN PREDICTION
# ============================================================================

if __name__ == '__main__':
    print("\n" + "="*60)
    print("Sinhala News Classifier")
    print("="*60)
    
    # INPUT TEXT HERE
    txt = "ශ්‍රී ලංකා ක්‍රිකට් කණ්ඩායම ජයග්‍රහණය කරයි"
    
    print(f"Input: {txt}\n")
    
    # Process and predict
    preprocessed_txt = preprocessing(txt)
    print(f"Preprocessed: {preprocessed_txt.values[0]}\n")  # DEBUG
    
    vectorized_txt = vectorizer(preprocessed_txt, tokens)
    print(f"Non-zero features: {np.count_nonzero(vectorized_txt)}\n")  # DEBUG
    
    prediction, confidence = get_prediction(vectorized_txt)
    
    # Show probabilities for all classes if available
    try:
        probabilities = model.predict_proba(vectorized_txt)
        print("All class probabilities:")
        for idx, prob in enumerate(probabilities[0]):
            print(f"  Class {idx}: {prob:.4f}")
        print()
    except:
        pass
    
    # Display result
    print("="*60)
    print("RESULT")
    print("="*60)
    print(f"Category: {prediction}")
    print(f"Confidence: {confidence:.4f} ({confidence*100:.2f}%)")
    print("="*60 + "\n")
    print("="*60 + "\n")
