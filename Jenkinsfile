#!groovy

def app = "project42-frontend" // Application name, don't use spaces
def repository = "dev.arch/project42-frontend"
def nexusRegistry = "https://nexus.sorintdev.it/repository/binaries/it.sorintlab.${app}"
def dockerRegistry = 'https://registry.sorintdev.it'
def targetMap = [ master: 'dev', stable: 'uat', release: 'prod' ] // Environment mapping: branch -> env

def branch = env.BRANCH_NAME
def target = targetMap[branch]
def version
def podId = UUID.randomUUID().toString()

podTemplate(
  label: podId,
  containers: [
    containerTemplate(
      name: 'nodejs',
      image: 'node:12.13.0',
      command: 'cat',
      ttyEnabled: true
    ),
    containerTemplate(
      name: 'docker',
      image: 'docker',
      command: 'cat',
      ttyEnabled: true
    )
  ],
  volumes: [
    hostPathVolume(hostPath: '/usr/bin/kubectl', mountPath: '/usr/bin/kubectl'),
    secretVolume(mountPath: '/etc/kubernetes', secretName: 'cluster-admin'),
    hostPathVolume(hostPath: '/var/run/docker.sock', mountPath: '/var/run/docker.sock')
  ]
) {
  node(podId) {

    if (target) {

      stage('Checkout') {
        cleanWs()
        git credentialsId: 'git', url: "git@wecode.sorint.it:${repository}.git", branch: branch
      }

      container('nodejs') {
        stage('Build') {
          sh "rm -rf dist"
          sh "npm install"
          sh "npm run build"
        }

        stage('Nexus') {
          version = sh ( script: 'node -pe "JSON.parse(process.argv[1]).version" "$(cat package.json)"', returnStdout: true ).trim()

          def tarball = target == 'prod' ? "${app}-${version}.tar.gz" : "${app}.tar.gz"
          sh "tar cvfz ${tarball} dist"

          withCredentials([usernamePassword(credentialsId: 'nexus', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
            sh "curl -v -k -u ${USERNAME}:${PASSWORD} --upload-file ${tarball} ${nexusRegistry}/${tarball}"
          }
        }
      }

      container('docker') {
        stage('Docker') {
          docker.withRegistry(dockerRegistry, 'nexus') {
            def img = docker.build(app, '.')
            target == 'prod' ? img.push(version) : img.push('latest');
          }
        }
      }
      
      if (target == 'dev') {
        stage ('Kubernetes') {
          sh "kubectl replace --force --kubeconfig=/etc/kubernetes/kubernetes.conf -f k8s/${target}"
        }
      }

    } else {
      echo "Pipeline skipped: branch '${branch}' not configured."
    }

  }
}
