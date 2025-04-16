## To set up Terraform
```bash
terraform plan -var="project_id=YOUR_PROJECT_ID"
terraform apply -var="project_id=YOUR_PROJECT_ID"
```

## Link to GCP
> Need this to get GKE Credentials:
```bash
gcloud container clusters get-credentials my-gke-cluster --zone asia-southeast1-a --project YOUR_PROJECT_ID
```

## To run GKE Cluster
> Make sure context is GKE and you are in backend folder
```bash
# 1. Namespace
kubectl apply -f kubernetes/namespace.yaml

# 2. Secrets + ConfigMaps
kubectl apply -f kubernetes/configmaps/ -n esd

# 3. PersistentVolumeClaims
kubectl apply -f kubernetes/pvcs/ -n esd

# 4. Services
kubectl apply -f kubernetes/services/ -n esd

# 5. Deployments
kubectl apply -f kubernetes/deployments/ -n esd

# 6. Jobs (like rabbitmq setup)
kubectl apply -f kubernetes/jobs/ -n esd

kubectl get svc -n esd

kubectl expose deployment kong --type=LoadBalancer --name=kong-deployment -n esd
kubectl expose deployment socketio --type=LoadBalancer --name=socketio-deployment -n esd
kubectl expose deployment rabbitmq --type=LoadBalancer --name=rabbitmq-deployment -n esd
```

> To access Grafana
```bash
kubectl port-forward svc/grafana -n esd 3000:1010
```

> To scale cluster down/remove
```bash
gcloud container clusters delete my-gke-cluster --zone asia-southeast1-a --project YOUR_PROJECT_ID
```