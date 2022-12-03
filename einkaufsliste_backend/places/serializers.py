from rest_framework import serializers

class ShoppingPlacesSerializers(serializers.Serializer):
    def __init__(self, data):
        self.data = data

    def serialize(self):
        return {
            'id': self.data.id,
            'name': self.data.name,
            'address': self.data.address,
            'latitude': self.data.latitude,
            'longitude': self.data.longitude,
        }

 