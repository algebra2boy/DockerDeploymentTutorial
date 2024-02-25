from fastapi import FastAPI
from testing import router as testing_router

app = FastAPI()

app.include_router(testing_router)

