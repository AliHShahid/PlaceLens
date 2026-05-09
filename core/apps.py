from django.apps import AppConfig
import sys

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'
    
    # This will hold our loaded model
    model = None 

    def ready(self):
        # Prevent double-loading during migrations or auto-reload
        if 'runserver' in sys.argv:
            from sentence_transformers import SentenceTransformer
            print("🧠 Loading AI Model... (This happens only once)")
            CoreConfig.model = SentenceTransformer('clip-ViT-B-32')
            print("✅ AI Model Ready!")