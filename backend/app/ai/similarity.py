import re
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def clean_text(text: str) -> str:
    """Preprocess text: lowercase, remove non-alphanumeric chars, normalize whitespace."""
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s\+\#\.]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def compute_nlp_similarity(student_text: str, opportunity_text: str) -> float:
    """
    Compute TF-IDF vectorization and Cosine Similarity between student text and opportunity text.
    Returns a score between 0.0 and 1.0.
    """
    student_clean = clean_text(student_text)
    opp_clean = clean_text(opportunity_text)

    if not student_clean or not opp_clean:
        return 0.0

    try:
        # TF-IDF with 1-gram and 2-grams
        vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            stop_words='english',
            sublinear_tf=True
        )
        tfidf_matrix = vectorizer.fit_transform([student_clean, opp_clean])
        sim_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
        score = float(sim_matrix[0][0])
        return max(0.0, min(1.0, score))
    except Exception:
        # Fallback to Jaccard / token set overlap if TF-IDF fails on edge cases
        s_words = set(student_clean.split())
        o_words = set(opp_clean.split())
        if not s_words or not o_words:
            return 0.0
        intersection = s_words.intersection(o_words)
        union = s_words.union(o_words)
        return float(len(intersection) / len(union)) if union else 0.0
