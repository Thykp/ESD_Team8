from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, ConfigDict
from typing import Dict, Any
from supabaseClient import SupabaseClient
from dotenv import load_dotenv
import os
import uvicorn

load_dotenv()

app = FastAPI(title="Simplified Recommendation Service")
supabase = SupabaseClient()

class Recommendation(BaseModel):
    id: str
    recommendations: Dict[str, Any]
    model_config = ConfigDict(arbitrary_types_allowed=True)

@app.get("/")
def read_root():
    return {"message": "Recommendation Service is running 🚀"}

@app.post("/recommendation")
def create_recommendation(rec: Recommendation):
    response = supabase.insert_recommendation(rec)
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to store recommendation.")
    return {"message": "Recommendation stored successfully", "data": rec}

@app.get("/recommendation/{id}")
def get_recommendation(id: str):
    recommendation = supabase.fetch_recommendation(id)
    if not recommendation:
        return {}
    return recommendation

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=4000)