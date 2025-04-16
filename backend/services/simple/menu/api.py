from google.cloud import firestore
from flask import Flask, request, jsonify
from flask_cors import CORS
from prometheus_flask_exporter import PrometheusMetrics

# Initialize Firestore using credentials
db = firestore.Client.from_service_account_json("firebase_credentials.json")
app = Flask(__name__)
CORS(app)

metrics = PrometheusMetrics(app)
metrics.info('app_info', 'Menu service metrics', version='1.0.0')

# check if alive
@app.route('/', methods=['GET'])
def test():
    return 'alive (AW yeah 😎😎)'

# Get all the menues
@app.route("/all", methods=['GET'])
def get_menus():
    holder = {}
    users_ref = db.collection("Menu").stream()
    for doc in users_ref:
        holder[doc.id] = doc.to_dict()
    # users_list = [{doc.id: doc.to_dict()} for doc in users_ref]
    return jsonify(holder)

#get a specific menue
@app.route("/<restraunt>")
def get_menu(restraunt):
    doc_ref = db.collection("Menu").document(restraunt)
    doc = doc_ref.get()
    if doc.exists:
        tbr = doc.to_dict()
        return jsonify(tbr)
    else:
        return jsonify({"error": "Restraunt not found"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)