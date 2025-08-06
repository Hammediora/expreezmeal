pipeline {
    agent any

    environment {
        IMAGE_TAG = "v.0.${env.BUILD_NUMBER}"
        DOCKERHUB_CREDENTIALS = credentials('5f8b634a-148a-4067-b996-07b4b3276fba')
        DOCKERHUB_USERNAME = 'idrisniyi94'
        DEPLOYMENT_NAME = 'expreezmeal'
        
        // Backend image names
        BACKEND_DEV_IMAGE_NAME = "${DOCKERHUB_USERNAME}/${DEPLOYMENT_NAME}-backend-dev:${IMAGE_TAG}"
        BACKEND_PROD_IMAGE_NAME = "${DOCKERHUB_USERNAME}/${DEPLOYMENT_NAME}-backend-prod:${IMAGE_TAG}"
        
        // Frontend image names
        FRONTEND_DEV_IMAGE_NAME = "${DOCKERHUB_USERNAME}/${DEPLOYMENT_NAME}-frontend-dev:${IMAGE_TAG}"
        FRONTEND_PROD_IMAGE_NAME = "${DOCKERHUB_USERNAME}/${DEPLOYMENT_NAME}-frontend-prod:${IMAGE_TAG}"
        
        BRANCH_NAME = "${GIT_BRANCH.split('/')[1]}"
    }

    parameters {
        choice(
            name: "DEPLOYMENT_OPTION",
            choices: ['run', 'stop', 'delete'],
            description: "What deployment operation do you want to perform?"
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
                        checkout([$class: 'GitSCM', 
                            branches: [[name: '*/dev'], [name: '*/prod']], 
                            userRemoteConfigs: [[url: 'https://github.com/stwins60/expreezmeal.git']]
                        ])
                    }
                }
                
                stage("Test Backend") {
                    steps {
                        dir('./backend') {
                            script {
                                sh "python3 -m pip install -r requirements.txt --no-cache-dir --break-system-packages"
                                sh "python3 -m pytest app-test.py"
                            }
                        }
                    }
                }
                
                stage("Test Frontend") {
                    steps {
                        dir('./frontend') {
                            script {
                                sh "npm ci"
                                sh "npm run lint"
                                sh "npm run type-check"
                            }
                        }
                    }
                }
                
                stage("Build Backend Image") {
                    steps {
                        dir('./backend') {
                            script {
                                if (BRANCH_NAME == 'dev') {
                                    echo "Building Backend Dev Image"
                                    sh "docker build -t $BACKEND_DEV_IMAGE_NAME -f Dockerfile.dev ."
                                } else if (BRANCH_NAME == 'prod') {
                                    echo "Building Backend Prod Image"
                                    sh "docker build -t $BACKEND_PROD_IMAGE_NAME -f Dockerfile.prod ."
                                }
                            }
                        }
                    }
                }
                
                stage("Build Frontend Image") {
                    steps {
                        dir('./frontend') {
                            script {
                                if (BRANCH_NAME == 'dev') {
                                    echo "Building Frontend Dev Image"
                                    sh "docker build -t $FRONTEND_DEV_IMAGE_NAME -f Dockerfile.dev ."
                                } else if (BRANCH_NAME == 'prod') {
                                    echo "Building Frontend Prod Image"
                                    sh "docker build -t $FRONTEND_PROD_IMAGE_NAME -f Dockerfile.prod ."
                                }
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
                                echo "Pushing Dev Images"
                                sh "docker push $BACKEND_DEV_IMAGE_NAME"
                                sh "docker push $FRONTEND_DEV_IMAGE_NAME"
                            } else if (BRANCH_NAME == 'prod') {
                                echo "Pushing Prod Images"
                                sh "docker push $BACKEND_PROD_IMAGE_NAME"
                                sh "docker push $FRONTEND_PROD_IMAGE_NAME"
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
                            sh "docker-compose -f docker-compose.dev.yml down"
                        } else if (params.DEPLOYMENT_OPTION == 'delete') {
                            sh "docker-compose -f docker-compose.dev.yml down -v"
                            sh "docker system prune -f"
                        } else if (params.DEPLOYMENT_OPTION == 'run') {
                            sh "docker-compose -f docker-compose.dev.yml up -d"
                            
                            // Deploy to K8s
                            dir('./k8s') {
                                withKubeCredentials(kubectlCredentials: [[
                                    caCertificate: '', 
                                    clusterName: '', 
                                    contextName: '', 
                                    credentialsId: '3f12ff7b-93cb-4ea5-bc21-79bcf5fb1925', 
                                    namespace: '', 
                                    serverUrl: ''
                                ]]) {
                                    sh "sed -i 's|BACKEND_IMAGE_NAME|$BACKEND_DEV_IMAGE_NAME|g' backend-deployment.yaml"
                                    sh "sed -i 's|FRONTEND_IMAGE_NAME|$FRONTEND_DEV_IMAGE_NAME|g' frontend-deployment.yaml"
                                    sh "kubectl apply -f backend-deployment.yaml"
                                    sh "kubectl apply -f frontend-deployment.yaml"
                                    sh "kubectl apply -f backend-service.yaml"
                                    sh "kubectl apply -f frontend-service.yaml"
                                }
                            }
                        }
                    } else if (BRANCH_NAME == 'prod') {
                        if (params.DEPLOYMENT_OPTION == 'stop') {
                            sh "docker-compose -f docker-compose.yml down"
                        } else if (params.DEPLOYMENT_OPTION == 'delete') {
                            sh "docker-compose -f docker-compose.yml down -v"
                            sh "docker system prune -f"
                        } else if (params.DEPLOYMENT_OPTION == 'run') {
                            sh "docker-compose -f docker-compose.yml up -d"
                            
                            // Deploy to K8s
                            dir('./k8s') {
                                withKubeCredentials(kubectlCredentials: [[
                                    caCertificate: '', 
                                    clusterName: '', 
                                    contextName: '', 
                                    credentialsId: '3f12ff7b-93cb-4ea5-bc21-79bcf5fb1925', 
                                    namespace: '', 
                                    serverUrl: ''
                                ]]) {
                                    sh "sed -i 's|BACKEND_IMAGE_NAME|$BACKEND_PROD_IMAGE_NAME|g' backend-deployment.yaml"
                                    sh "sed -i 's|FRONTEND_IMAGE_NAME|$FRONTEND_PROD_IMAGE_NAME|g' frontend-deployment.yaml"
                                    sh "kubectl apply -f backend-deployment.yaml"
                                    sh "kubectl apply -f frontend-deployment.yaml"
                                    sh "kubectl apply -f backend-service.yaml"
                                    sh "kubectl apply -f frontend-service.yaml"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
            sh "docker system prune -f"
        }
    }
}