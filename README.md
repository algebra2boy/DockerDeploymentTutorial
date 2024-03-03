# Instructions of how to deploy a docker container to Azure

1. Build an docker image: 
```bash
docker image build -t <dockerhub username>/<image-name> .
example: docker image build -t yongye0997/docker_python .
```

2. Run the container using the docker image create above to test if image works
```bash
docker container run --name <container name> -p <local port:container port> <image name>
example: docker container run --name fastapi_testing -p 8000:8000 yongye0997/docker_python
```

3. Push the image to docker hub
```bash
docke push <docker username>/<image name>
docker push yongye0997/docker_python
```

## Important Commands
```bash
# build the image
docker image build -t <image name> .

# use the image to run container 
docker container run --name <container name> -p <local port: container port> -d <image name>
```

