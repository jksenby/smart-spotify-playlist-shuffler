pipeline {
    agent any
    options {
        disableConcurrentBuilds()
        timeout(time: 20, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '15'))
        skipDefaultCheckout(true)
    }
    // Polling works on localhost without exposing Jenkins to GitHub webhooks.
    triggers { pollSCM('H/2 * * * *') }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.IMAGE_TAG = "${env.BUILD_NUMBER}-${sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()}"
                }
            }
        }
        stage('Unit tests') {
            steps {
                sh 'docker build --target test -t smart-spotify-tests:$IMAGE_TAG backend'
                script {
                    sh 'mkdir -p test-results'
                    def result = sh(script: 'docker run --rm smart-spotify-tests:$IMAGE_TAG > test-results/unit-tests.log 2>&1', returnStatus: true)
                    sh 'cat test-results/unit-tests.log'
                    if (result != 0) { error('Unit tests failed; runtime image will not be built.') }
                }
            }
        }
        stage('Build Docker image') {
            steps {
                sh '''
                    if [ -n "${NETWORK_CA_FILE:-}" ] && [ -f "$NETWORK_CA_FILE" ]; then
                        docker build --target runtime --secret id=network_ca,src="$NETWORK_CA_FILE" -t smart-spotify-backend:$IMAGE_TAG backend
                    else
                        docker build --target runtime -t smart-spotify-backend:$IMAGE_TAG backend
                    fi
                '''
            }
        }
        stage('Smoke test') {
            steps {
                sh '''docker run --rm smart-spotify-backend:$IMAGE_TAG python -c 'from app.internal.shuffle_algorithms import reverse_pairs; assert reverse_pairs([1, 2, 3]) == [2, 1, 3]; print("Runtime algorithm smoke test passed")' '''
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'test-results/*.log', allowEmptyArchive: true
        }
        cleanup {
            sh 'docker image rm smart-spotify-tests:$IMAGE_TAG || true'
        }
    }
}
