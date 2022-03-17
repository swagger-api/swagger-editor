if [ $DOCKER_HUB_USERNAME ]; then
  docker login --username=$DOCKER_HUB_USERNAME --password=$DOCKER_HUB_PASSWORD;

  if [ ! -z "$TRAVIS_TAG" ]; then
    DOCKER_IMAGE_TAG=${TRAVIS_TAG#?};
    docker build -t $DOCKER_IMAGE_NAME .;
    docker tag $DOCKER_IMAGE_NAME $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG;
    docker push $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG;
    docker tag $DOCKER_IMAGE_NAME $DOCKER_IMAGE_NAME:latest;
    docker push $DOCKER_IMAGE_NAME:latest;
  fi;
fi;
if [ $DOCKER_HUB_USERNAME ]; then
  docker login --username=$DOCKER_HUB_USERNAME --password=$DOCKER_HUB_PASSWORD;

  if [ ! -z "$TRAVIS_TAG" ]; then
    DOCKER_IMAGE_TAG=${TRAVIS_TAG#?};
    docker build -t $DOCKER_IMAGE_NAME .;
    docker tag $DOCKER_IMAGE_NAME $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG;
    docker push $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG;
    docker 



fi{

  fi
  exit();
  
}