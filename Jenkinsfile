import java.text.SimpleDateFormat
import groovy.transform.Field
@Library('jenkins-pipeline-utils') _

def scmInfo
def branch
def curStage = 'Start'
@Field
def pipelineStatus = 'SUCCESS'
@Field
def successColor = '11AB1B'
@Field
def failureColor = '#FF0000'
def VERSION
def VCS_REF
SimpleDateFormat dateFormatGmt = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
buildDate = dateFormatGmt.format(new Date())
DOCKER_CREDENTIALS_ID = '6ba8d05c-ca13-4818-8329-15d41a089ec0'
GITHUB_CREDENTIALS_ID = '433ac100-b3c2-4519-b4d6-207c029a103b'

switch(env.BUILD_JOB_TYPE) {
  case "master": buildMaster(); break;
  case "release":releasePipeline(); break;
  case "regression": buildRegression(); break;
  default: buildPullRequest();
}

def buildRegression() {
  node('intake-slave') {
    try {
      regressionTestStage()
    } catch(Exception exception) {
      currentBuild.result = "FAILURE"
      throw exception
    } finally {
      cleanupStage('')
    }
  }
}

def regressionTestStage() {
  stage('Regression Test') {
    withDockerRegistry([credentialsId: JENKINS_MANAGEMENT_DOCKER_REGISTRY_CREDENTIALS_ID]) {
        sh "docker-compose -f docker/test/docker-compose.yml up -d --build"
        sh "docker-compose -f docker/test/docker-compose.yml exec bundle exec rspec spec/regression"
    }
  }
}

def buildPullRequest() {
  node('intake-slave') {
    def triggerProperties = githubPullRequestBuilderTriggerProperties()
    properties([
      githubConfig(),
      pipelineTriggers([triggerProperties]),
      buildDiscarderDefaults()
    ])

    try {
      scmCheckOut()
      buildingTestBench()
      lintTest()
      verifySemVerLabel()
      karmaTests()
      rspecTestsSnapshot()
      rspecRegressionSnapshot()
      reports()
    } catch(Exception exception) {
      currentBuild.result = "FAILURE"
      throw exception
    } finally {
      cleanUpStage('')
    }
  }
}

def buildMaster() {
  node('intake-slave') {
    triggerProperties = pullRequestMergedTriggerProperties('snapshot-master')
    properties([
      pipelineTriggers([triggerProperties]),
      buildDiscarderDefaults('master'),
      parameters([
        string(name: 'INCREMENT_VERSION', defaultValue: '', description: 'major, minor, or patch')
      ])
    ])

    try {
      scmCheckOut()
      buildingTestBench()
      lintTest()
      karmaTests()
      rspecTestsSnapshot()
      build()
      incrementTag()
      tagRepo()
      release()
      acceptanceTestBubble()
      publish()
      triggerSecurityScan()
      triggerReleasePipeline()
      reports()
    } catch(Exception exception) {
      pipelineStatus = "FAILED"
      slackNotification(pipelineStatus)
      currentBuild.result = "FAILURE"
      throw exception
    } finally {
      cleanUpStage(pipelineStatus)
    }
  }
}

def releasePipeline() {
  parameters([
    string(name: 'APP_VERSION', defaultValue: '', description: 'App version to deploy')
  ])

  try {
    deployWithSmoke('integration')
  } catch(Exception exception) {
    currentBuild.result = "FAILURE"
    throw exception
  }
}

def scmCheckOut() {
  scmInfo = checkout scm
  branch = scmInfo.GIT_BRANCH ?: env.GIT_BRANCH
}

def buildingTestBench() {
  stage('Building testing bench') {
    curStage = 'Building testing bench'
    sh './scripts/ci/build_testing_bench.rb'
  }
}

def lintTest() {
  stage('Lint test') {
    curStage = 'Lint test'
    sh './scripts/ci/lint_test.rb'
  }
}

def verifySemVerLabel() {
  stage('Verify SemVer Label') {
    curStage = 'Verify SemVer Label'
    checkForLabel("snapshot")
  }
}

def karmaTests() {
  stage('Karma tests') {
    curStage = 'Karma tests'
    sh './scripts/ci/karma_test.rb'
  }
}

def rspecTestsSnapshot() {
  stage('Rspec tests for Snapshot') {
    curStage = 'Rspec tests for Snapshot'
    sh 'EXCLUDE_PATTERN="{features/screening,spec/regression}" ./scripts/ci/rspec_test.rb'
  }
}

def rspecRegressionSnapshot() {
  stage('Regression tests') {
    curStage = 'Rspec tests for Snapshot'
    sh 'EXCLUDE_PATTERN="features/screening" ./scripts/ci/rspec_regression_test.rb'
  }
}

def build() {
  stage('Build') {
    curStage = 'Build'
    sh 'make build'
  }
}

def incrementTag() {
  stage('Increment Tag') {
    curStage = 'Increment Tag'
    VERSION = newSemVer(env.INCREMENT_VERSION)
    VCS_REF = sh(
      script: 'git rev-parse --short HEAD', returnStdout: true
    )
  }
}

def tagRepo() {
  stage('Tag Repo'){
    curStage = 'Tag Repo'
    tagGithubRepo(VERSION, GITHUB_CREDENTIALS_ID)
  }
}

def release() {
  stage('Release') {
    curStage = 'Release'
    withEnv(["BUILD_DATE=${buildDate}","VERSION=${VERSION}","VCS_REF=${VCS_REF}"]) {
      sh 'make release'
    }
  }
}

def acceptanceTestBubble() {
  stage('Acceptance test Bubble'){
    curStage = 'Acceptance test Bubble'
    withDockerRegistry([credentialsId: DOCKER_CREDENTIALS_ID]){
      withEnv(["INTAKE_IMAGE_VERSION=intakeaccelerator${BUILD_NUMBER}_app"]) {
        sh './scripts/ci/acceptance_test.rb'
      }
    }
  }
}

def publish() {
  stage('Publish') {
    withDockerRegistry([credentialsId: DOCKER_CREDENTIALS_ID]) {
      curStage = 'Publish'
      withEnv(["VERSION=${VERSION}"]){
        sh './scripts/ci/publish.rb'
      }
    }
  }
}

def triggerSecurityScan() {
  stage('Trigger Security scan') {
    curStage = 'Trigger Security scan'
    build job: 'tenable-scan', parameters: [
      [$class: 'StringParameterValue', name: 'CONTAINER_NAME', value: 'intake'],
      [$class: 'StringParameterValue', name: 'CONTAINER_VERSION', value: VERSION]
    ]
  }
}

def triggerReleasePipeline() {
  stage('Trigger Release Pipeline') {
    curStage = 'Trigger Release Pipeline'
    def mgmtJobParams = "cause=Caused%20by%20Build%20${env.BUILD_ID}\nAPP_VERSION=${VERSION}\nversion=${VERSION}"
    def handle = triggerRemoteJob abortTriggeredJob: true, enhancedLogging: true, job: 'PreInt-Integration/deploy-intake-app', maxConn: 5, pollInterval: 20, parameters: "${mgmtJobParams}", remoteJenkinsName: "deploy-jenkins", useCrumbCache: true, useJobInfoCache: true
    echo 'Remote Status: ' + handle.getBuildStatus().toString()    
  }
}

def reports() {
  stage ('Reports') {
    step([$class: 'JUnitResultArchiver', testResults: '**/reports/*.xml'])

    publishHTML (target: [
      allowMissing: false,
      alwaysLinkToLastBuild: false,
      keepAll: true,
      reportDir: 'reports/coverage/js',
      reportFiles: 'index.html',
      reportName: 'JS Code Coverage'
    ])

    publishHTML (target: [
      allowMissing: false,
      alwaysLinkToLastBuild: false,
      keepAll: true,
      reportDir: 'reports/coverage/ruby',
      reportFiles: 'index.html',
      reportName: 'Ruby Code Coverage'
    ])
  }
}

def cleanUpStage(pipelineStatus) {
  stage('Clean') {
    withEnv(["GIT_BRANCH=${branch}"]){
      archiveArtifacts artifacts: 'tmp/*', excludes: '*/.keep', allowEmptyArchive: true
      sh './scripts/ci/clean.rb'
      echo 'Cleaning workspace'
      cleanWs()
    }
    if(pipelineStatus == 'SUCCESS') {
      slackNotification(pipelineStatus)
    }
  }
}

def slackNotification(pipelineStatus) {
  slackAlertColor = successColor
  slackMessage = "${pipelineStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' completed for branch '${branch}' (${env.BUILD_URL})"

  if(pipelineStatus == 'FAILED') {
    slackAlertColor = failureColor
    slackMessage = "${pipelineStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' in stage '${curStage}' for branch '${branch}' (${env.BUILD_URL})"
  }

  slackSend channel: "#tech-intake", baseUrl: 'https://hooks.slack.com/services/', tokenCredentialId: 'slackmessagetpt2', color: slackAlertColor, message: slackMessage
}

def checkOutStage() {
  stage('Check Out Stage') {
    git branch: 'master', credentialsId: GITHUB_CREDENTIALS_ID, url: 'git@github.com:ca-cwds/acceptance_testing.git'
  }
}

def deployToStage(environment, version) {
  stage("Deploy to $environment") {
    ws {
      git branch: "master", credentialsId: GITHUB_CREDENTIALS_ID, url: 'git@github.com:ca-cwds/de-ansible.git'
      sh ansibleCommand(environment, version)
    }
  }
}

def updateManifestStage(environment, version) {
  stage('Update Manifest Version') {
    updateManifest("intake", environment, GITHUB_CREDENTIALS_ID, version)
  }
}

def buildDocker() {
  stage('Build Docker'){
    sh 'docker-compose build'
  }
}

def smokeTest(environment) {
  stage("Smoke Test on $environment") {
      withCredentials([
        string(credentialsId: 'c24b6659-fd2c-4d31-8433-835528fce0d7', variable: 'ACCEPTANCE_TEST_USER'),
        string(credentialsId: '48619eb9-4a74-4c84-bc25-81557ed9dd7d', variable: 'ACCEPTANCE_TEST_PASSWORD'),
        string(credentialsId: 'f75da5fa-b2c8-4ca5-896a-b8a85fa30572', variable: 'VERIFICATION_CODE')
      ]) {
        withEnv(["APP_URL=https://web.${environment}.cwds.io",
             "ACCEPTANCE_TEST_USER=${ACCEPTANCE_TEST_USER}",
             "ACCEPTANCE_TEST_PASSWORD=${ACCEPTANCE_TEST_PASSWORD}",
             "VERIFICATION_CODE=${VERIFICATION_CODE}"]) {
          sh 'docker-compose run acceptance_test'
        }
      }
  }
}

def deployWithSmoke(environment) {
  node(environment) {
    checkOutStage()
    rollbackDeployOnFailure('intake', environment, GITHUB_CREDENTIALS_ID, ansibleCommand(environment, env.APP_VERSION)) {
      deployToStage(environment, env.APP_VERSION)
      updateManifestStage(environment, env.APP_VERSION)
      buildDocker()
      smokeTest(environment)
    }
    cleanWs()
  }
}

def ansibleCommand(environment, version){
  "ansible-playbook -e NEW_RELIC_AGENT=true -e INTAKE_APP_VERSION=$version -i inventories/$environment/hosts.yml deploy-intake.yml --vault-password-file ~/.ssh/vault.txt -vv"
}

def githubConfig() {
  githubConfigProperties('https://github.com/ca-cwds/snapshot')
}
