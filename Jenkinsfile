pipeline {
    agent any

    environment {
        DOCKER_USER = "rajeevreddy1511"
        IMAGE_TAG = "v${BUILD_NUMBER}"
    }

    stages {

        stage('Clone Code') {
            steps {
                git branch:'main', url: 'https://github.com/Rajeev151124/hmis-project-1.git'
            }
        }

        stage('Build Images') {
            steps {
                sh '''
                docker build -t $DOCKER_USER/patient-service-1:$IMAGE_TAG ./patient-service
                docker build -t $DOCKER_USER/visit-service-1:$IMAGE_TAG ./visit-service
                docker build -t $DOCKER_USER/frontend-service-1:$IMAGE_TAG ./frontend
                '''
            }
        }

        stage('Push Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh '''
                    echo $PASS | docker login -u $USER --password-stdin
                    docker push $DOCKER_USER/patient-service-1:$IMAGE_TAG
                    docker push $DOCKER_USER/visit-service-1:$IMAGE_TAG
                    docker push $DOCKER_USER/frontend-service-1:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Trigger CD') {
            steps {
                build job: 'hmis-project-1-cd', parameters: [
                    string(name: 'IMAGE_TAG', value: "${IMAGE_TAG}")
                ]
            }
        }
    }
}
