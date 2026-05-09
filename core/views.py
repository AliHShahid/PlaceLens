# from django.shortcuts import render

# def index(request):
#     return render(request, 'index.html')

# # core/views.py
# import os
# import numpy as np
# import faiss
# from PIL import Image

# from django.shortcuts import render
# from django.apps import apps
# from django.conf import settings

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.parsers import MultiPartParser

# from .models import Place, SearchHistory

# # 1. Simple Home View
# def index(request):
#     return render(request, 'index.html')

# # 2. The Main Search API
# class LandmarkSearchView(APIView):
#     parser_classes = [MultiPartParser]

#     def post(self, request):
#         # --- A. MODEL LOADING (Optimized) ---
#         # Get the model loaded in apps.py (Singleton)
#         CoreConfig = apps.get_app_config('core')
#         model = CoreConfig.model
        
#         if model is None:
#              return Response({"error": "Model is still loading, please wait..."}, status=503)

#         # --- B. IMAGE PROCESSING (Memory First) ---
#         try:
#             file_obj = request.FILES['image']
#             img = Image.open(file_obj)
            
#             # CRITICAL: Resize huge images to prevent CPU spikes
#             # CLIP usually resizes to 224x224 internally, so sending 
#             # a 4000px image is wasteful. We downscale to 600px first.
#             if img.height > 600 or img.width > 600:
#                 img.thumbnail((600, 600))

#             # Generate Embedding
#                 embedding = model.encode(img, normalize_embeddings=True)
#                 query_vector = np.array([embedding]).astype('float32')

#         except Exception as e:
#             return Response({"error": f"Image processing failed: {str(e)}"}, status=400)

#         # --- C. SAVE HISTORY ---
#         # We must reset the file pointer because Image.open() read it
#         file_obj.seek(0) 
#         search_record = SearchHistory.objects.create(uploaded_image=file_obj)

#         # --- D. FAISS SEARCH ---
#         index_path = "places.index"
#         if not os.path.exists(index_path):
#             return Response({"error": "Index not found. Run build_index first."}, status=500)
            
#         try:
#             # Read index from disk (Fast enough for this scale)
#             # For massive scale, load this in apps.py too.
#             index = faiss.read_index(index_path)
            
#             # Search for Top 3 matches
#             D, I = index.search(query_vector, k=3)
            
#             top_match_idx = I[0][0]     # The ID of the best match
#             confidence = float(D[0][0]) # The similarity score

#         except Exception as e:
#             return Response({"error": f"Search failed: {str(e)}"}, status=500)

#         # --- E. FORMAT RESULTS ---
#         results = []
#         if top_match_idx != -1:
#             # Retrieve the specific Place from DB using the FAISS ID
#             place = Place.objects.filter(faiss_id=top_match_idx).first()
            
#             if place:
#                 # Link the history to the predicted place
#                 search_record.predicted_place = place
#                 search_record.save()
                
#                 results.append({
#                     "name": place.name,
#                     "country": place.country,
#                     "description": place.description,
#                     "lat": place.latitude,
#                     "lng": place.longitude,
#                     "confidence": f"{confidence:.2f}",
#                     "image_url": request.build_absolute_uri(place.image.url)
#                 })

#         return Response({"matches": results})
    
# # from django.apps import apps
# # from rest_framework.views import APIView
# # from rest_framework.response import Response
# # from PIL import Image
# # import numpy as np
# # from rest_framework.views import APIView
# # from rest_framework.response import Response
# # from rest_framework.parsers import MultiPartParser
# # from django.conf import settings
# # from .models import Place, SearchHistory
# # from .ai import generate_embedding
# # import faiss
# # import numpy as np
# # import os

# # class LandmarkSearchView(APIView):
# #     parser_classes = [MultiPartParser]

# #     def post(self, request):
# #         file_obj = request.FILES['image']
        
# #         # 1. Save search history
# #         search_record = SearchHistory.objects.create(uploaded_image=file_obj)
        
# #         # 2. Generate embedding for uploaded image
# #         try:
# #             query_vector = generate_embedding(search_record.uploaded_image.path)
# #         except Exception as e:
# #             return Response({"error": str(e)}, status=500)

# #         # 3. Load FAISS index
# #         index_path = "places.index"
# #         if not os.path.exists(index_path):
# #             return Response({"error": "Index not found. Run build_index first."}, status=500)
            
# #         index = faiss.read_index(index_path)
        
# #         # 4. Search (k=1 for top match, k=3 for suggestions)
# #         D, I = index.search(query_vector, k=3)
        
# #         # 5. Retrieve results
# #         top_match_idx = I[0][0] # Index of best match
# #         confidence = float(D[0][0]) # Score

# #         results = []
# #         if top_match_idx != -1:
# #             # Fetch the place where faiss_id matches the result
# #             place = Place.objects.filter(faiss_id=top_match_idx).first()
# #             if place:
# #                 search_record.predicted_place = place
# #                 search_record.save()
                
# #                 results.append({
# #                     "name": place.name,
# #                     "country": place.country,
# #                     "description": place.description,
# #                     "lat": place.latitude,
# #                     "lng": place.longitude,
# #                     "confidence": f"{confidence:.2f}",
# #                     "image_url": request.build_absolute_uri(place.image.url)
# #                 })

# #         return Response({"matches": results})

# core/views.py
import os
import numpy as np
import faiss
from PIL import Image

from django.shortcuts import render
from django.apps import apps
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser

from .models import Place, SearchHistory

# 1. Simple Home View
# def index(request):
#     return render(request, 'index.html')

def home(request):
    return render(request, 'home.html') 

def placefinder(request):
    return render(request, 'app.html')

# 2. The Main Search API
class LandmarkSearchView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        # --- A. MODEL LOADING ---
        CoreConfig = apps.get_app_config('core')
        model = CoreConfig.model
        
        if model is None:
             return Response({"error": "Model is still loading, please wait..."}, status=503)

        # --- B. IMAGE PROCESSING ---
        try:
            file_obj = request.FILES['image']
            img = Image.open(file_obj)
            
            # Resize huge images to prevent CPU spikes
            if img.height > 600 or img.width > 600:
                img.thumbnail((600, 600))

            # CRITICAL: Must use normalize_embeddings=True to match build_index.py
            embedding = model.encode(img, normalize_embeddings=True)
            query_vector = np.array([embedding]).astype('float32')

        except Exception as e:
            return Response({"error": f"Image processing failed: {str(e)}"}, status=400)

        # --- C. SAVE HISTORY ---
        # Reset file pointer so Django can read it from the start
        file_obj.seek(0) 
        search_record = SearchHistory.objects.create(uploaded_image=file_obj)

        # --- D. FAISS SEARCH ---
        index_path = "places.index"
        if not os.path.exists(index_path):
            return Response({"error": "Index not found. Run build_index first."}, status=500)
            
        try:
            index = faiss.read_index(index_path)
            
            # Search for Top 3 matches
            D, I = index.search(query_vector, k=3)
            
            top_match_idx = I[0][0]     # The ID of the best match
            confidence = float(D[0][0]) # The similarity score (0.0 to 1.0)

            # --- E. THRESHOLD CHECK ---
            # If confidence is below 24%, it's likely noise or an unknown place
            if confidence < 0.66:
                return Response({
                    "matches": [], 
                    "message": "No landmark detected (Low confidence)."
                })

        except Exception as e:
            return Response({"error": f"Search failed: {str(e)}"}, status=500)

        # --- F. FORMAT RESULTS ---
        results = []
        if top_match_idx != -1:
            # Retrieve the specific Place from DB using the FAISS ID
            place = Place.objects.filter(faiss_id=top_match_idx).first()
            
            if place:
                search_record.predicted_place = place
                search_record.save()
                
                results.append({
                    "name": place.name,
                    "country": place.country,
                    "description": place.description,
                    "lat": place.latitude,
                    "lng": place.longitude,
                    "confidence": f"{confidence:.2f}",
                    "image_url": request.build_absolute_uri(place.image.url)
                })

        return Response({"matches": results})