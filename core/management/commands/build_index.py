# # core/management/commands/build_index.py
# from django.core.management.base import BaseCommand
# from core.models import Place
# from core.ai import generate_embedding
# import faiss
# import numpy as np
# import os

# class Command(BaseCommand):
#     help = 'Regenerates the FAISS vector index'

#     def handle(self, *args, **options):
#         places = Place.objects.all()
#         if not places.exists():
#             self.stdout.write(self.style.WARNING("No places found in DB."))
#             return

#         # 1. Initialize FAISS Index
#         d = 512  # Dimension for ViT-B-32
#         index = faiss.IndexFlatIP(d)  # IP = Inner Product (Cosine Similarity)

#         # 2. Add vectors
#         ids = []
#         for place in places:
#             try:
#                 emb = generate_embedding(place.image.path)
#                 index.add(emb)
#                 # Store the FAISS ID (index position) back to DB
#                 place.faiss_id = index.ntotal - 1 
#                 place.save()
#                 self.stdout.write(f"Indexed: {place.name}")
#             except Exception as e:
#                 self.stdout.write(self.style.ERROR(f"Failed {place.name}: {e}"))

#         # 3. Save index to disk
#         faiss.write_index(index, "places.index")
#         self.stdout.write(self.style.SUCCESS("Successfully built places.index"))

# core/management/commands/build_index.py
from django.core.management.base import BaseCommand
from core.models import Place
from core.ai import generate_embedding
import faiss
import numpy as np

class Command(BaseCommand):
    help = 'Regenerates the FAISS vector index'

    def handle(self, *args, **options):
        places = Place.objects.all()
        if not places.exists():
            self.stdout.write(self.style.WARNING("No places found in DB."))
            return

        # 1. Initialize FAISS Index
        d = 512  # Dimension for ViT-B-32
        index = faiss.IndexFlatIP(d)  # IP = Inner Product (works as Cosine Sim if normalized)

        # 2. Add vectors
        counter = 0
        
        for place in places:
            try:
                # generate_embedding now uses normalize_embeddings=True from core/ai.py
                emb = generate_embedding(place.image.path)
                index.add(emb)
                
                # Store the new index position
                place.faiss_id = counter
                place.save()
                
                self.stdout.write(f"Indexed [{counter}]: {place.name}")
                counter += 1
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed {place.name}: {e}"))

        # 3. Save index to disk
        faiss.write_index(index, "places.index")
        self.stdout.write(self.style.SUCCESS(f"Successfully built places.index with {counter} items."))