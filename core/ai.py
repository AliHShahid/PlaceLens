# # core/ai.py
# from sentence_transformers import SentenceTransformer
# from PIL import Image
# import numpy as np

# class ClipModel:
#     _instance = None

#     @classmethod
#     def get_instance(cls):
#         if cls._instance is None:
#             # 'clip-ViT-B-32' is a good balance of speed/accuracy
#             cls._instance = SentenceTransformer('clip-ViT-B-32')
#         return cls._instance

# def generate_embedding(image_path):
#     model = ClipModel.get_instance()
#     img = Image.open(image_path)
#     # Generate embedding and normalize it for cosine similarity
#     embedding = model.encode(img)
#     return np.array([embedding]).astype('float32')

# core/ai.py
from sentence_transformers import SentenceTransformer
from PIL import Image
import numpy as np

class ClipModel:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            # 'clip-ViT-B-32' is the standard balance of speed/accuracy
            cls._instance = SentenceTransformer('clip-ViT-B-32')
        return cls._instance

def generate_embedding(image_path):
    """
    Generates a normalized embedding for a given image path.
    Used by the build_index command.
    """
    model = ClipModel.get_instance()
    img = Image.open(image_path)
    
    # CRITICAL: Normalize embeddings so cosine similarity works (0.0 to 1.0)
    embedding = model.encode(img, normalize_embeddings=True)
    
    return np.array([embedding]).astype('float32')