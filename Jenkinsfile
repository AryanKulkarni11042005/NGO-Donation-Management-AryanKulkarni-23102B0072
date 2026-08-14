
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
                // Fail the build on a bad config rather than taking the site down.
                sh '/opt/homebrew/bin/nginx -t'
                sh '/opt/homebrew/bin/brew services restart nginx'
                // Remove the exploded directory too, otherwise Tomcat can keep
                // serving classes from the previous deployment.
                sh 'rm -rf /opt/homebrew/opt/tomcat/libexec/webapps/store /opt/homebrew/opt/tomcat/libexec/webapps/store.war'
                sh 'cp backend-springboot/target/store.war /opt/homebrew/opt/tomcat/libexec/webapps/'
                // Tomcat reads its environment once at startup, so the secrets have to
                // land in setenv.sh before the restart rather than in this shell.
                withCredentials([
                    string(credentialsId: 'db-password', variable: 'DB_PASSWORD'),
                    string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET')
                ]) {
                    sh '''
                        SETENV=/opt/homebrew/opt/tomcat/libexec/bin/setenv.sh
                        umask 077
                        cat > "$SETENV" <<EOF
export DB_PASSWORD='$DB_PASSWORD'
export JWT_SECRET='$JWT_SECRET'
EOF
                        chmod 700 "$SETENV"
                    '''
                }
                sh '/opt/homebrew/bin/brew services restart tomcat'
            }
        }
        stage('Verify') {
            steps {
                // Tomcat needs time to expand the WAR and boot Spring, so poll
                // instead of sleeping for a fixed guess.
                sh '''
                    for i in $(seq 1 12); do
                        if curl -fs http://localhost:8082/store/health > /dev/null; then
                            echo "Backend is up (attempt $i)"
                            curl -s http://localhost:8082/store/health
                            exit 0
                        fi
                        echo "Waiting for backend... ($i/12)"
                        sleep 5
                    done
                    echo "Backend did not come up in time"
                    exit 1
                '''
            }
        }
    }
}