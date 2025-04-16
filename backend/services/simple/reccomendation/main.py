from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import Response
from pydantic import BaseModel, ConfigDict
from typing import Dict, Any
from supabaseClient import SupabaseClient
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from dotenv import load_dotenv
import os
import uvicorn
import time

load_dotenv()

app = FastAPI(title="Simplified Recommendation Service")
supabase = SupabaseClient()

REQUEST_COUNT = Counter("recommendation_requests_total", "Total request count", ["method", "endpoint"])
REQUEST_LATENCY = Histogram("recommendation_request_latency_seconds", "Request latency", ["endpoint"])

class Recommendation(BaseModel):
    id: str
    recommendations: Dict[str, Any]
    model_config = ConfigDict(arbitrary_types_allowed=True)

@app.get("/")
def read_root():
    return {"message": "Recommendation Service is running 🚀"}

@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time

    REQUEST_COUNT.labels(method=request.method, endpoint=request.url.path).inc()
    REQUEST_LATENCY.labels(endpoint=request.url.path).observe(process_time)

    return response

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

@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=4000)