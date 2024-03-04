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

Step5: Push Docker Image to ACR
- First, authenticate Docker to your container registry, `az acr login --name yongyeapiacr`
- Second, create a docker image with a tag (optional), default is latest
```bash
docker build -t <image name>:<tag> .
example: docker build -t express-demo:latest .
```
- Third: Tag your local Docker image with the ACR login server name.
    - This creates a duplication of the original docker image
```bash
docker tag <image name in step 2> <name of ACR>.azurecr.io/<image name in step 2>
example: docker tag express-demo:latest yongyeapiacr.azurecr.io/express-demo:latest 
```
- Fourth, push the docker image to ACR
```bash
docker push yongyeapiacr.azurecr.io/express-demo
```
- Fifth, check your docker image on Azure Container Registry, you should see a new image called `express-demo`

Step6: Create a Container App Environment
- Before creating a container app, we need a container app environment for the container 
```bash
az containerapp env create --name <name of container app environment> --resource-group <name of resource gorup we created in step 1> --location eastus
example: az containerapp env create --name expressDemoAppEnv --resource-group api-resource-group --location eastus
```

Step7: Create a container App (Last step, but be very careful with this steps)
- This is where we create our container app and deploy the image from ACR
- Must use the same name for the resource group and container enviornment
```bash
az containerapp create 
--name <name of container app> \
--resource-group <name of resource group> 
--environment myContainerAppEnv --image myContainerRegistry.azurecr.io/myimage:latest --target-port 80 --ingress external --query configuration.ingress.fqdn

```

## Important Commands
```bash
# build the image
docker image build -t <image name> .

# use the image to run container 
docker container run --name <container name> -p <local port: container port> -d <image name>
```

