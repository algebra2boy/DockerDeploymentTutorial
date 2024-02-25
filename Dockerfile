FROM python:3.9-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install any dependencies
RUN pip install -r requirements.txt

# COPY the content of the local src directory to the working directory
COPY . .

# RUN the application
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]