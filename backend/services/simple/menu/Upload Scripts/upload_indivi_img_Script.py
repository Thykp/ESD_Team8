import firebase_admin
from firebase_admin import credentials, storage, firestore
import json
import os

cred = credentials.Certificate("firebase_credentials.json")
firebase_admin.initialize_app(cred, {
    "storageBucket": "menu-b8c1f.firebasestorage.app" 
})

# Firestore and Storage clients
db = firestore.client()
bucket = storage.bucket()

def upload_image_to_firebase(image_path, storage_path, document_name, category, food_name):
    """
    Uploads an image to Firebase Storage and saves its URL in Firestore.

    :param image_path: Local path to the image file (e.g., 'images/food.jpg')
    :param storage_path: Path in Firebase Storage (e.g., 'menu/food.jpg')
    :param document_name: Firestore document name (e.g., 'Nasi_Lemak')
    :param field_name: Field to store the image URL (e.g., 'image_url')
    
    Works only for 
    """
    blob = bucket.blob(storage_path)
    
    # Upload the image
    blob.upload_from_filename(image_path)
    
    # Make the file publicly accessible
    blob.make_public()
    
    # Get the public URL
    image_url = blob.public_url
    print(f"Uploaded image URL: {image_url}")

# Save the URL to Firestore
    db.collection('Menu').document(document_name).update({
        f"{category}.{food_name}.photo": image_url
    })

# Example usage
# upload_image_to_firebase(
#     image_path="path/to/local/image.jpg",  # Local image file
#     storage_path="menu/image.jpg",        # Firebase Storage path            
#     document_name="Nasi_Lemak",           # Firestore document
#     field_name="image_url"                # Field to store the URL
# )

with open('sample.json', 'r') as file:
    data = json.load(file)


for key, value in data.items():
    for sub_key, cat in value.items():
        for food_name, details in cat.items():
            upload_image_to_firebase(f"images/food/{food_name}.jpg", f"{key}/items/{food_name}.jpg", key, sub_key, food_name)
