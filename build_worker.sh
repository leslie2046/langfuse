docker build \
--build-arg HTTP_PROXY=http://192.168.0.188:21026 \
--build-arg HTTPS_PROXY=http://192.168.0.188:21026 \
-t leslie2046/langfuse-worker:$1 -f worker/Dockerfile .
