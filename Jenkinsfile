
pipeline {
    agent any
    tools {
        nodejs 'node-lts'
        maven 'maven'
    }
    parameters {
        choice(name: 'ENVIRONMENT',
        choices: ['staging', 'production'],
        description: 'Target Environment')
    }
    stages {
        stage('Checkout'){
            steps{
                checkout scm
                dir('backend-springboot') {
                    git url: 'https://github.com/AryanKulkarni11042005/ngo-donation-portal-springboot.git', branch: 'main'
                }
            }
        }
        stage('Compile'){
            steps{
                sh 'cd frontend && npm ci'
                sh 'cd backend-springboot && mvn -B clean compile'
            }
        }
        stage('Test'){
            steps{
                withCredentials([string(credentialsId: 'db-password', variable: 'DB_PASSWORD')]) {
                    sh 'cd backend-springboot && mvn -B test'
                }
            }
        }
        stage('Package WAR'){
            steps{
                sh 'cd frontend && npm run build'
                sh 'cd backend-springboot && mvn -B package -DskipTests'
            }
        }
        stage('Deploy WAR to Tomcat') {
            steps {
                echo "Deploying to ${params.ENVIRONMENT}"
                sh 'mkdir -p /opt/homebrew/var/www/ngo-frontend'
                sh 'cp -r frontend/dist/* /opt/homebrew/var/www/ngo-frontend'
                sh 'cp nginx/nginx.conf /opt/homebrew/etc/nginx/nginx.conf'
                sh '/opt/homebrew/bin/brew services restart nginx'
                sh 'cp backend-springboot/target/*.war /opt/homebrew/opt/tomcat/libexec/webapps/'
                sh '/opt/homebrew/bin/brew services restart tomcat'
            }
        }
        stage('Verify') {
            steps {
                sh 'sleep 10'
                sh 'curl -f http://localhost:8082/store/campaigns || exit 1'
            }
        }
    }
}
