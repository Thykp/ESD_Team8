import firebase_admin
from firebase_admin import credentials, storage, firestore
import json
import os
from firebase_admin import firestore as firestore_admin

cred = credentials.Certificate("firebase_credentials.json")
firebase_admin.initialize_app(cred, {
    "storageBucket": "menu-b8c1f.firebasestorage.app" 
})

# Firestore and Storage clients
db = firestore.client()
bucket = storage.bucket()

def upload_image_to_firebase(image_path, storage_path, document_name, field_name):
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
    doc_ref = db.collection('Menu').document(document_name)
    
    # Check if the document exists
    doc = doc_ref.get()
    if doc.exists:
        # If the document exists, update the array field
        doc_ref.update({field_name: firestore_admin.ArrayUnion([image_url])})
    else:
        # If the document does not exist, create it with the array field
        doc_ref.set({field_name: [image_url]})

# Example usage
# upload_image_to_firebase(
#     image_path="path/to/local/image.jpg",  # Local image file
#     storage_path="menu/image.jpg",        # Firebase Storage path            
#     document_name="Nasi_Lemak",           # Firestore document
#     field_name="image_url"                # Field to store the URL
# )

with open('sample.json', 'r') as file:
    data = json.load(file)
    


folder_path = "images"  # Replace with your folder path
files = os.listdir(folder_path)

for images in files:
    org_name = images
    images = images.rstrip('.jpg')
    images = images.rstrip('.png')
    if images.endswith('LOGO'):
        upload_image_to_firebase(f"images/{org_name}", f"{images[:-4]}/logo/{org_name}", images[:-4], 'logo_url')
        print(images[:-4])
    else:
        upload_image_to_firebase(f"images/{org_name}", f"{images[:-1]}/menu/{org_name}", images[:-1], 'menu_url')
        print(images[:-1])
        


