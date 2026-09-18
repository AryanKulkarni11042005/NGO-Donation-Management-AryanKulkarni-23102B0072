
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
        stage('Selenium E2E') {
            steps {
                // Drives the site nginx is serving, so this exercises the frontend,
                // the proxy and the backend together rather than any one of them.
                sh 'cd selenium-tests && mvn -B test -Dbase.url=http://localhost:8081'
            }
        }
        stage('Build Docker Image') {
            steps {
                // Only reached once Test and Selenium E2E have both passed --
                // that's what makes this "deploy after successful tests".
                // Docker (and its credential helper, docker-credential-desktop)
                // live in /usr/local/bin, which isn't on the launchd/brew-services
                // PATH Jenkins runs with.
                withEnv(['PATH+DOCKER=/usr/local/bin']) {
                    sh "cd backend-springboot && docker build -t localhost:5050/ngo-backend:${env.BUILD_NUMBER} -t localhost:5050/ngo-backend:latest ."
                }
            }
        }
        stage('Push to Registry') {
            steps {
                withEnv(['PATH+DOCKER=/usr/local/bin']) {
                    sh "docker push localhost:5050/ngo-backend:${env.BUILD_NUMBER}"
                    sh 'docker push localhost:5050/ngo-backend:latest'
                }
            }
        }
        stage('Deploy Container') {
            steps {
                withEnv(['PATH+DOCKER=/usr/local/bin']) {
                    // Always run from the freshly pushed image rather than whatever
                    // Docker already has cached locally.
                    sh "docker pull localhost:5050/ngo-backend:${env.BUILD_NUMBER}"
                    sh 'docker rm -f ngo-backend-cd || true'
                    withCredentials([
                        string(credentialsId: 'db-password', variable: 'DB_PASSWORD'),
                        string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET')
                    ]) {
                        sh """
                            docker run -d --name ngo-backend-cd -p 8093:8080 \
                                -e DB_URL='jdbc:postgresql://host.docker.internal:5433/ngo-donation-portal' \
                                -e DB_PASSWORD=\$DB_PASSWORD \
                                -e JWT_SECRET=\$JWT_SECRET \
                                localhost:5050/ngo-backend:${env.BUILD_NUMBER}
                        """
                    }
                }
            }
        }
        stage('Verify Container') {
            steps {
                sh '''
                    for i in $(seq 1 12); do
                        if curl -fs http://localhost:8093/store/health > /dev/null; then
                            echo "Containerized backend is up (attempt $i)"
                            curl -s http://localhost:8093/store/health
                            exit 0
                        fi
                        echo "Waiting for containerized backend... ($i/12)"
                        sleep 5
                    done
                    echo "Containerized backend did not come up in time"
                    exit 1
                '''
            }
        }
    }
    post {
        always {
            // Publishes the Maven unit tests and the Selenium results together --
            // the pipeline equivalent of the "Publish JUnit test result report"
            // post-build action on a freestyle job.
            junit testResults: '**/target/surefire-reports/*.xml', allowEmptyResults: true
            archiveArtifacts artifacts: 'backend-springboot/target/store.war',
                             allowEmptyArchive: true,
                             fingerprint: true
        }
        success {
            echo "Deployed to ${params.ENVIRONMENT} (Tomcat + Docker build ${env.BUILD_NUMBER}) and all tests passed."
        }
        failure {
            echo "Build failed - check the test report for the failing stage."
        }
    }
}
