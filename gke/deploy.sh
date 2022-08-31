echo running start script...

echo creating clusters...
kind create cluster --name kind-1 --config kind/cluster-config.yaml

kubectl cluster-info --context kind-kind-1
kubectl get nodes --context kind-kind-1

echo creating deployment
kubectl apply -f ./frontend-deployment.yaml --context kind-kind-1

kubectl wait --for=condition=ready pod --selector=app=cs3219g27 --timeout=180s --context kind-kind-1
kubectl get po -l app=cs3219g27 -o wide --context kind-kind-1

echo creating service...
kubectl apply -f ./frontend-service.yaml --context kind-kind-1

kubectl describe svc frontend-service --context kind-kind-1
kubectl get svc -l app=cs3219g27 -o wide --context kind-kind-1

echo creating ingress controller...
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml --context kind-kind-1

kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=90s --context kind-kind-1
kubectl --namespace ingress-nginx get po -l app.kubernetes.io/component=controller -o wide --context kind-kind-1
kubectl -n ingress-nginx get deploy --context kind-kind-1

echo creating ingress...
kubectl apply -f ./ingress.yaml --context kind-kind-1

kubectl get ingress -l app=cs3219g27 -o wide --context kind-kind-1

sleep 10 # sneaky sleep, instantly curling has issues

echo testing curl
curl localhost/signup

# create hpa metrics
echo starting up metrics server...
kubectl apply -f ./metrics-server.yaml --context kind-kind-1
kubectl wait -nkube-system --for=condition=ready pod --selector=k8s-app=metrics-server --timeout=180s --context kind-kind-1
kubectl -nkube-system --selector=k8s-app=metrics-server get deploy --context kind-kind-1

echo starting auto scaling hpa...
kubectl apply -f ./hpa.yaml --context kind-kind-1
kubectl describe hpa --context kind-kind-1
