pipeline {
    agent any
    tools {
        nodejs 'node-20'  // Usa la configuración del plugin de NodeJS
    }
    environment {
        NODE_VERSION = "20.x"
        BUILD_PATH = "dist"
        TOKEN_DEV = credentials('STATIC_WEB_APP_DEV_TOKEN')
        TOKEN_PROD = credentials('STATIC_WEB_APP_TOKEN')
        STATIC_WEB_APP_TOKEN = ""
        DEPLOY_ENV =""
        CONFIG_ENV = ""
        STATIC_WEB_APP_DEV_TOKEN=""
        STATIC_WEB_APP_URL=""
        APP_LOCATION = 'src' // Carpeta donde está tu aplicación Node.js
        OUTPUT_LOCATION = 'dist/er-portal/browser/browser' // Carpeta de salida (generada por npm run build)
    }
    stages {
        stage('Validate Branch') {
            steps {
                script {
                    echo "Rama actual: ${env.GIT_BRANCH}"
                    if (env.GIT_BRANCH ==~ 'origin/main') {
                        echo "Se desplegará en Producción."
                        STATIC_WEB_APP_TOKEN = TOKEN_PROD
                        DEPLOY_ENV = "Production"
                        CONFIG_ENV = "production"
                        STATIC_WEB_APP_NAME="er-portal-app"
                        STATIC_WEB_APP_URL="https://white-coast-0fa879810.4.azurestaticapps.net"
                    } else if (env.GIT_BRANCH ==~ 'origin/develop') {
                        echo "Se desplegará en Desarrollo."
                        STATIC_WEB_APP_TOKEN = TOKEN_DEV
                        DEPLOY_ENV = "Production"
                        CONFIG_ENV = "development"
                        STATIC_WEB_APP_NAME="er-portal-app-dev"
                        STATIC_WEB_APP_URL="https://delightful-river-002b49710.4.azurestaticapps.net"
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
                sh "npm run build -- --configuration=${CONFIG_ENV}"
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

                        echo "Ejecutando despliegue ..."
                        sh 'npm install -g @azure/static-web-apps-cli'
                        sh "swa deploy ${OUTPUT_LOCATION} --app-name ${STATIC_WEB_APP_NAME} --deployment-token ${STATIC_WEB_APP_TOKEN} --env ${DEPLOY_ENV} --verbose"
                    }
                }
            }
        }
        stage('Validate Deployment') {
            steps {
                script {
                    echo "Validando despliegue en ${STATIC_WEB_APP_NAME}..."
                    def response = sh(script: "curl -s -o /dev/null -w '%{http_code}' ${STATIC_WEB_APP_URL}", returnStdout: true).trim()

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
