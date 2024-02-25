from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def testing(): 
    return {"message": "hello, world!"}

@router.get("/testing")
async def testing(): 
    return {"message": "testing!"}

@router.get("/testing/{testing_id}")
async def testing2(testing_id: int): 
    return {"message": testing_id}