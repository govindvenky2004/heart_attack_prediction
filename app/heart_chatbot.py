# heart_chatbot.py
import json
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import re
import os

class HeartChatbot:
    def __init__(self, kb_path="heart_kb.json", model_name='all-MiniLM-L6-v2', similarity_threshold=0.5, log_file="unknown_queries.json"):
        self.kb_path = kb_path
        self.model_name = model_name
        self.similarity_threshold = similarity_threshold
        self.log_file = log_file
        
        # Load knowledge base
        self._load_kb()
        
        # Load embedding model
        self.model = SentenceTransformer(self.model_name)
        
        # Compute embeddings for KB questions once
        self.question_embeddings = self.model.encode(self.questions, convert_to_numpy=True, show_progress_bar=False)

    def _load_kb(self):
        if not os.path.exists(self.kb_path):
            raise FileNotFoundError(f"Knowledge base file not found: {self.kb_path}")
        with open(self.kb_path, "r", encoding="utf-8") as f:
            self.kb = json.load(f)
        self.questions = [item["question"] for item in self.kb]

    @staticmethod
    def normalize_text(text):
        text = text.lower()
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^\w\s]', '', text)
        return text.strip()

    def log_unknown_query(self, query):
        unknown = []
        if os.path.exists(self.log_file):
            with open(self.log_file, "r", encoding="utf-8") as f:
                unknown = json.load(f)
        unknown.append({"query": query})
        with open(self.log_file, "w", encoding="utf-8") as f:
            json.dump(unknown, f, ensure_ascii=False, indent=2)

    def get_response(self, user_query, top_k=1):
        """
        Returns the most relevant answer(s) from KB.
        Handles out-of-scope queries with fallback and logging.
        """
        # Normalize and encode
        query_norm = self.normalize_text(user_query)
        user_emb = self.model.encode([query_norm], convert_to_numpy=True)
        
        # Compute similarity
        similarities = cosine_similarity(user_emb, self.question_embeddings)[0]
        top_indices = similarities.argsort()[-top_k:][::-1]
        top_similarities = similarities[top_indices]

        # Out-of-scope query
        if top_similarities[0] < self.similarity_threshold:
            self.log_unknown_query(user_query)
            closest_question = self.questions[top_indices[0]]
            return (
                "Sorry, I couldn't find a clear answer. "
                "Please consult a doctor for heart-related concerns. "
                f"Did you mean: '{closest_question}'?"
            )
        
        # Return top answer(s)
        answers = [self.kb[idx]["answer"] for idx in top_indices if similarities[idx] >= self.similarity_threshold]
        return " ".join(answers)


# Example usage:
if __name__ == "__main__":
    chatbot = HeartChatbot()
    while True:
        query = input("Ask about heart health: ")
        if query.lower() in ["quit", "exit"]:
            break
        response = chatbot.get_response(query)
        print(response)
