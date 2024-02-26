from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def testing(): 
    return {"message": "hello, world!"}

@app.get("/testing")
async def testing(): 
    return {"message": "testing!"}

@app.get("/testing/{testing_id}")
async def testing2(testing_id: int): 
    return {"message": testing_id}
