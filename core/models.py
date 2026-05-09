from django.db import models

class Place(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    country = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    image = models.ImageField(upload_to='places/')
    # This ID links the DB row to the FAISS vector index
    faiss_id = models.IntegerField(unique=True, null=True, blank=True)

    def __str__(self):
        return self.name

class SearchHistory(models.Model):
    uploaded_image = models.ImageField(upload_to='searches/')
    timestamp = models.DateTimeField(auto_now_add=True)
    # Storing the JSON result optionally
    predicted_place = models.ForeignKey(Place, null=True, on_delete=models.SET_NULL)