import firebase_admin
from firebase_admin import credentials, storage

cred = credentials.Certificate("firebase_credentials.json")
firebase_admin.initialize_app(cred, {
    "storageBucket": "menu-b8c1f.firebasestorage.app" 
})

bucket = storage.bucket()

def get_photo_by_id(name):
    listie = []
    blob = bucket.list_blobs(prefix=name)
    for photo in blob:
        file_path = photo.name
        encoded_file_path = file_path.replace("/", "%2F")  # Encode slashes in the file path
        url = f"https://firebasestorage.googleapis.com/v0/b/{bucket.name}/o/{encoded_file_path}?alt=media"
        listie+=[url]
    return listie[1:]


print(get_photo_by_id('King Kong Curry'))