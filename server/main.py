from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from crawler import generate_demo_leads

app = FastAPI()

# Allow CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For demo purposes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Lead Gen Agent Operational"}

@app.get("/leads")
def get_leads(count: int = 50):
    """
    Returns a ranked list of leads enriched with scoring data.
    """
    data = generate_demo_leads(count)
    return data

@app.post("/scan")
def trigger_scan():
    """
    Simulates triggering a new scan. In a real app, this would start a background Celery task.
    For demo, we just return fresh random data.
    """
    data = generate_demo_leads(10)
    return {"message": "Scan complete", "new_leads": len(data), "data": data}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
