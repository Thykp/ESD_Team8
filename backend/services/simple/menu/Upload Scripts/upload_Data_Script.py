import json
import firebase_admin
from firebase_admin import credentials, firestore

# Step 1: Initialize Firebase Admin SDK
# Replace 'path/to/serviceAccountKey.json' with the path to your Service Account Key JSON file
cred = credentials.Certificate('firebase_credentials.json')
firebase_admin.initialize_app(cred)

# Initialize Firestore client
db = firestore.client()

# Step 2: Load JSON file
# Replace 'path/to/your-data.json' with the path to your JSON file
with open('sample.json', 'r') as file:
    data = json.load(file)

for dicti in data:
    for keys in data[dicti]:
        for items in data[dicti][keys]:
            data[dicti][keys][items]['price'] = float(data[dicti][keys][items]['price'])
                    

# Step 3: Upload data to Firestore
def upload_to_firestore(document_name, document_data):
    doc_ref = db.collection('Menu').document(document_name)
    doc_ref.set(document_data)
    print(f"Uploaded {document_name} to {'Menu'}")

# Iterate through the JSON data and upload to Firestore
for document_name, documents_data in data.items():
    upload_to_firestore(document_name, documents_data)

print("Upload complete!")