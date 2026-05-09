from django.contrib import admin

# Register your models here.
# core/admin.py
from .models import Place, SearchHistory

@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    # What columns to show in the list
    list_display = ('name', 'country', 'latitude', 'longitude', 'faiss_id')
    
    # Add a search bar for these fields
    search_fields = ('name', 'country', 'description')
    
    # Add filters on the right side
    list_filter = ('country',)
    
    # Make the list editable directly (Optional, useful for quick tweaks)
    # list_editable = ('country',)

@admin.register(SearchHistory)
class SearchHistoryAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'predicted_place', 'has_image')
    readonly_fields = ('timestamp', 'uploaded_image') # Prevent tampering with history

    def has_image(self, obj):
        return bool(obj.uploaded_image)
    has_image.boolean = True