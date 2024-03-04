# Instructions of how to push a docker image to Docker Hub to your Docker account

## Have docker daemon running before doing any of below
1. Build an docker image locally: 
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

# Instructions of how to deploy a dockerized application on Azure
- Create an Azure account and use the `Azure for Students` subscription
-  Install Azure CLI from this [link](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
- Login to to your Azure account using `az login`, this will redirect to login page

Step 1: Create a Resource Group
- A resource group is a container that holds related resources for an Azure solution.
```bash
az group create --name <name of resource group> --location <name of location>
example: az group create --name api-resource-group --location eastus
```

Step 3: Verify that you created a resource group successfully by typing `az group list` or `az group list --output table`

Step 4: Create a Container Registry (ACR)
-  ACR is where you'll store your Docker images on Azure platform.
```bash
az acr create --resource-group <name of resource group> --name <name of container registry> --sku Basic --admin-enabled true
example: az acr create --resource-group api-resource-group --name yongyeapiacr --sku Basic --admin-enabled true 
```
- Use the `Basic` plans and enable admin access
- admin access must be enabled in order to push docker images to ACR
    - If activated, you can use the registry name as username and admin user access key as password to docker login to your container registry.

Step5: Push Docker Image to DockerHub or ACR
- First, authenticate Docker to your container registry, `az acr login --name yongyeapiacr`
- Second, create a docker image with a tag (optional), default is latest
- Third, (optional), if you are on M1 chip, you will have to add an additional flag to the following docker build, [`--platform=linux/amd64`](https://github.com/docker/for-mac/issues/6356)
```bash
docker build -t <image name>:<tag> .
example: docker build -t express-demo:latest .
M1 chip example: docker image build --platform=linux/amd64 -t express-demo:latest .
```
- Third: Tag your local Docker image with the ACR login server name.
    - This creates a duplication of the original docker image but with the name
```bash
docker tag <image name in step 2> <name of ACR>.azurecr.io/<image name in step 2>
example: docker tag express-demo:latest yongyeapiacr.azurecr.io/express-demo:latest 
```
- Fourth, push the docker image to DockerHub and ACR
```bash
docker push yongye0997/express-demo
docker push yongyeapiacr.azurecr.io/express-demo
```
- Fifth, check your docker image on Azure Container Registry, you should see a new image called `express-demo`

Step6: Create a Container App Environment
- Before creating a container app, we need a container app environment for the container 
```bash
az containerapp env create --name <name of container app environment> --resource-group <name of resource gorup we created in step 1> --location eastus
example: az containerapp env create --name expressDemoAppEnv --resource-group api-resource-group --location eastus
```

Step7: Create a container App (Be very careful with this step since it involves with lots of flags)
- This is where we create our container app and deploy the image from ACR or DockerHub
- If you using GUI, navigate to your container app > Settings > Ingress after deployment
    - Have to enable `ingress` to receive traffic
    - Have to enable `accepting traffic from anywhere` for Ingress traffic
    - target port must be 8080 for this express app
- Must use the same name for the resource group and container enviornment from previous steps
```bash
az containerapp create \
    --name <name of container app> \
    --resource-group <name of resource group> \
    --environment <name of container environment> \
    --image <name of image from the ACR or docker hub> \
    --target-port <port number> \
    --ingress external 

Pulling image from Docker Hub example: 
az containerapp create 
    --name yongye-express-api-demo-app 
    --resource-group api-resource-group 
    --environment expressDemoAppEnv 
    --image yongye0997s/express-demo:latest 
    --target-port 8080 
    --ingress external

Pulling image from ACR example:
# need to manually specify registry-server, registry-username, or registry-password if authentication is required, link: https://github.com/microsoft/azure-container-apps/issues/863#issuecomment-1669564470
az containerapp create 
    --name yongye-express-api-demo-app 
    --resource-group api-resource-group 
    --environment expressDemoAppEnv 
    --image yongyeapiacr.azurecr.io/express-demo:latest 
    --registry-server yongyeapiacr.azurecr.io
    --registry-username yongyeapiacr
    --registry-password <your password>
    --target-port 8080 
    --ingress external
```

Step8: You should receive an application url on Terminal or Azure container app website.
My application link is: https://express-api-container.yellowdune-bb83b275.eastus.azurecontainerapps.io/
- [Home route](https://express-api-container.yellowdune-bb83b275.eastus.azurecontainerapps.io/)
- [Hello route](https://express-api-container.yellowdune-bb83b275.eastus.azurecontainerapps.io/hello)
- [Testing route](https://express-api-container.yellowdune-bb83b275.eastus.azurecontainerapps.io/testing)

Step 9: Thank you!

## Important Commands
```bash
# build the image
docker image build -t <image name> .

# use the image to run container 
docker container run --name <container name> -p <local port: container port> -d <image name>
```

