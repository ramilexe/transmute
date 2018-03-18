
echo 'KONG ADMIN: ' $KONG_ADMIN_URL
echo 'KONG PROXY: ' $KONG_PROXY_URL

echo 'SETTING UP IPFS'

# Get the service clusterIp for Kong to use.
export IPFS_CLUSTER_IP=$(kubectl get service mini-ipfs-ipfs -o json | jq -r '.spec.clusterIP');

# Add IPFS API to Kong
curl -k -X POST \
  --url $KONG_ADMIN_URL/apis/ \
  --data 'name=ipfs' \
  --data 'hosts=ipfs.transmute.minikube' \
  --data 'upstream_url=http://'$IPFS_CLUSTER_IP':5001/'
  
# Configure CORS for IPFS via Kong
curl -k -X POST $KONG_ADMIN_URL/apis/ipfs/plugins \
    --data "name=cors" \
    --data "config.origins=*" \
    --data "config.methods=GET, PUT, POST"


echo 'IPFS HEALTHCHECK'

# Test IPFS via Kong
curl -k $KONG_PROXY_URL/api/v0/id \
  --header 'Host: ipfs.transmute.minikube'


echo 'SETTING UP GANACHE'
# Get the service clusterIp for Kong to use.
export GANACHE_CLUSTER_IP=$(kubectl get service mini-ganache-ganache-cli -o json | jq -r '.spec.clusterIP');


# Add Ganache API to Kong
curl -k -X POST \
  --url $KONG_ADMIN_URL/apis/ \
  --data 'name=ganache' \
  --data 'hosts=ganache.transmute.minikube' \
  --data 'upstream_url=http://'$GANACHE_CLUSTER_IP':8545/'

echo 'GANACHE HEALTHCHECK'

curl -k -X POST $KONG_PROXY_URL \
  --header 'Host: ganache.transmute.minikube' \
  --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}'

# curl -k $IPFS_GATEWAY/api/v0/id 

# export GANACHE_CLUSTER_IP=$(kubectl get service mini-ganache-ganache-cli -o json | jq -r '.spec.clusterIP');

# curl -k -X POST \
#   --url $KONG_PROXY_URL/apis/ \
#   --data 'name=ganache' \
#   --data 'hosts=ganache.transmute.minikube' \
#   --data 'upstream_url=http://'$GANACHE_CLUSTER_IP':8545/'

# curl -k -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}' https://ganache.transmute.minikube:32443/; echo

# export GANACHE_CLI=$(minikube --namespace transmute-testrpc service transmute-testrpc-ganache-cli --url)

# lerna clean
# lerna bootstrap
# lerna run cleanup
# lerna run contracts:migrate:ganache
# lerna run contracts:generate
# lerna bootstrap
# lerna run test --scope transmute-framework

# migrate -> generate -> test
# lerna bootstrap

# cd ./packages/transmute-contracts
# yarn cleanup
# yarn contracts:migrate
# cd ../../packages/transmute-framework
# yarn install
# lerna bootstrap
# yarn cleanup
# yarn contracts:generate
# lerna run test --scope transmute-ipfs
# yarn test
