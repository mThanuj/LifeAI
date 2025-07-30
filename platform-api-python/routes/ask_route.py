from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os

from utils.b2_storage import download_file_from_b2
from LifeAgent import ask_question_with_file

router = APIRouter()

class QueryRequest(BaseModel):
    bucket_id: str
    file_id: str
    question: str

@router.post("/ask")
async def ask_from_file(req: QueryRequest):
    try:
        local_file = download_file_from_b2(req.bucket_id, req.file_id)
        answer = ask_question_with_file(local_file, req.question)
        os.remove(local_file)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
