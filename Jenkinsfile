pipeline {
    agent any
    tools {
        nodejs 'node-20'  // Usa la configuración del plugin de NodeJS
    }
    environment {
        NODE_VERSION = "20.x"
        BUILD_PATH = "dist"
    }
    stages {
        stage('Validate Branch') {
            steps {
                script {
                    echo "Rama actual: ${env.GIT_BRANCH}"
                    if (env.GIT_BRANCH ==~ 'origin/main') {
                        echo "Se desplegará en Producción."
                        STATIC_WEB_APP_NAME = "er-portal-app"
                        RESOURCE_GROUP = "er-rg-portal"
                    } else {
                        echo "Rama no destinada para despliegue. Saliendo..."
                        currentBuild.result = 'ABORTED'
                        error("Saliendo del pipeline.")
                    }
                }
            }
        }
        stage('Checkout') {
            steps {
                script {
                    checkout scm
                }
            }
        }
        stage('Setup Node.js') {
            steps {
                script {
                    sh 'node --version'
                    sh 'npm --version'
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                sh "npm install --force --verbose"
            }
        }
        stage('Build Application') {
            steps {
                sh "npm run build -- --configuration=production"
            }
        }
        stage('Deploy to Azure Web App') {
            steps {
                withCredentials([azureServicePrincipal('AZURE_CREDENTIALS')]) {
                    script {
                        echo "Iniciando sesión en Azure..."
                        def loginResponse = sh(script: '''
                        az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET --tenant $AZURE_TENANT_ID
                        ''', returnStatus: true)

                        if (loginResponse != 0) {
                            error "Error en la autenticación con Azure."
                        }

                        echo "Desplegando en Azure Web App: ${STATIC_WEB_APP_NAME}..."
                        def deployResponse = sh(script: """
                        az staticwebapp upload --resource-group ${RESOURCE_GROUP} --name ${STATIC_WEB_APP_NAME} --source ${BUILD_PATH}
                        """, returnStatus: true)

                        if (deployResponse != 0) {
                            error "Error en el despliegue a Azure."
                        }
                    }
                }
            }
        }
        stage('Validate Deployment') {
            steps {
                script {
                    echo "Validando despliegue en ${STATIC_WEB_APP_NAME}..."
                    def response = sh(script: "curl -s -o /dev/null -w '%{http_code}' https://white-coast-0fa879810.4.azurestaticapps.net", returnStdout: true).trim()

                    if (response != '200') {
                        error "La aplicación no responde correctamente después del despliegue (HTTP $response)."
                    } else {
                        echo "La aplicación está corriendo correctamente en Azure Static Web Apps."
                    }
                }
            }
        }
    }
    post {
        success {
            echo "¡Despliegue exitoso en Azure Static Web Apps!"
        }
        failure {
            echo "Error en el despliegue. Revisa los logs."
        }
    }
}
