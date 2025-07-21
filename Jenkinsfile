pipeline {
  agent any

  environment {
    IMAGE_NAME = 'frontend'
    CONTAINER_NAME = 'devops_2'
    PORT = '3002'
  }

  stages {
    stage('Clone Repo') {
      steps {
        git 'https://github.com/heet2604/dsbi_frontend'
      }
    }

    stage('Build Docker Image') {
      steps {
        echo "Building Docker image: $IMAGE_NAME"
        sh "docker build -t $IMAGE_NAME ."
      }
    }

    stage('Stop and Remove Old Container') {
      steps {
        echo "Stopping and removing container if it exists..."
        sh """
          if [ \$(docker ps -q -f name=$CONTAINER_NAME) ]; then
            docker stop $CONTAINER_NAME
          fi
          if [ \$(docker ps -aq -f name=$CONTAINER_NAME) ]; then
            docker rm $CONTAINER_NAME
          fi
        """
      }
    }

    stage('Run New Container') {
      steps {
        echo "Running container: $CONTAINER_NAME on port $PORT"
        sh "docker run -d -p $PORT:$PORT --name $CONTAINER_NAME $IMAGE_NAME"
      }
    }
  }
}
