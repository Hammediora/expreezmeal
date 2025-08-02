pipeline {

    agent any

    environment {
        IMAGE_TAG = "v.0.${env.BUILD_NUMBER}"
        DOCKERHUB_CREDENTIALS = credentials('5f8b634a-148a-4067-b996-07b4b3276fba')
        DOCKERHUB_USERNAME = 'idrisniyi94'
        DEPLOYMENT_NAME = 'expreezmeal'
        DEV_IMAGE_NAME = "${DOCKERHUB_USERNAME}/${DEPLOYMENT_NAME}-dev:${IMAGE_TAG}"
        PROD_IMAGE_NAME = "${DOCKERHUB_USERNAME}/${DEPLOYMENT_NAME}-prod:${IMAGE_TAG}"
        BRANCH_NAME = "${GIT_BRANCH.split('/')[1]}"
    }

    parameters {
        choice(
            name: "DEPLOYMENT_OPTION",
            choices: ['run', 'stop', 'delete'],
            description: "What deployment operation do you want to perform ?"
        )
    }

    stages {
        stage("Check Deployment Option") {
            when {
                expression {
                    return params.DEPLOYMENT_OPTION == 'run'
                }
            }
            stages {
                stage("Clean Workspace") {
                    steps {
                        cleanWs()
                    }
                }
                stage("Checkout") {
                    steps {
                        checkout([$class: 'GitSCM', branches: [[name: '*/dev'], [name: '*/prod']], userRemoteConfigs: [[url: 'https://github.com/stwins60/expreezmeal.git']]])
                    }
                }
                stage("Pytest") {
                    steps {
                        script {
                            sh "python3 -m pip install -r requirements.txt --no-cache-dir --break-system-packages"
                            sh "python3 -m pytest app-test.py"
                        }
                    }
                }
                stage("Build Docker Image") {
                    steps {
                        script {
                            if (BRANCH_NAME == 'dev') {
                                echo "Building Dev Image"
                                sh "docker build -t $DEV_IMAGE_NAME -f Dockerfile.dev ."
                            } else if (BRANCH_NAME == 'prod') {
                                echo "Building Prod Image"
                                sh "docker build -t $PROD_IMAGE_NAME -f Dockerfile.prod ."
                            }
                        }
                    }
                }
                stage("Login to DockerHub") {
                    steps {
                        script {
                            sh "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin"
                        }
                    }
                }
                stage("Push to DockerHub") {
                    steps {
                        script {
                            if (BRANCH_NAME == 'dev') {
                                echo "Pushing Dev Image"
                                sh "docker push $DEV_IMAGE_NAME"
                            } else if (BRANCH_NAME == 'prod') {
                                echo "Pushing Prod Image"
                                sh "docker push $PROD_IMAGE_NAME"
                            }
                        }
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    if (BRANCH_NAME == 'dev') {
                        if (params.DEPLOYMENT_OPTION == 'stop') {
                            sh "docker stop $DEPLOYMENT_NAME-dev"
                        } else if (params.DEPLOYMENT_OPTION == 'delete') {
                            sh "docker rm $DEPLOYMENT_NAME-dev"
                        } else if (params.DEPLOYMENT_OPTION == 'run') {
                            sh "docker run -d --name $DEPLOYMENT_NAME-dev -p 5551:5000 $DEV_IMAGE_NAME"
                            dir('./k8s') {
                                withKubeCredentials(kubectlCredentials: [[caCertificate: '', clusterName: '', contextName: '', credentialsId: '3f12ff7b-93cb-4ea5-bc21-79bcf5fb1925', namespace: '', serverUrl: '']]) {
                                    sh "sed -i 's|IMAGE_NAME|$env.DEV_IMAGE_NAME|g' deployment.yaml"
                                    sh "kubectl apply -f deployment.yaml"
                                    sh "kubectl apply -f service.yaml"
                                }
                            }
                        }
                    } else if (BRANCH_NAME == 'prod') {
                        if (params.DEPLOYMENT_OPTION == 'stop') {
                            sh "docker stop $DEPLOYMENT_NAME-prod"
                        } else if (params.DEPLOYMENT_OPTION == 'delete') {
                            sh "docker rm $DEPLOYMENT_NAME-prod"
                        } else if (params.DEPLOYMENT_OPTION == 'run') {
                            sh "docker run -d --name $DEPLOYMENT_NAME-prod -p 5552:5000 $PROD_IMAGE_NAME"
                            dir('./k8s') {
                                withKubeCredentials(kubectlCredentials: [[caCertificate: '', clusterName: '', contextName: '', credentialsId: '3f12ff7b-93cb-4ea5-bc21-79bcf5fb1925', namespace: '', serverUrl: '']]) {
                                    sh "sed -i 's|IMAGE_NAME|$env.PROD_IMAGE_NAME|g' deployment.yaml"
                                    sh "kubectl apply -f deployment.yaml"
                                    sh "kubectl apply -f service.yaml"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
