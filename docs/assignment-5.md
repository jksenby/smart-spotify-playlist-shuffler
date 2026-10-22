# Assignment 5: Docker and Jenkins

Research topic: reproducible evaluation of playlist shuffling algorithms.
Scope: the existing Python algorithm layer. Spotify responses are mocked in tests;
PostgreSQL, OAuth credentials and the frontend are not required for unit tests.

## What has been prepared

- 16 unittest tests (including parameterized subtests) for track preservation,
  duplicate tracks, artist balancing, date/tempo ordering, batching Spotify calls,
  missing features, API failures and zero popularity weights.
- Two fixes: import List from typing; use uniform selection when remaining
  popularity weights sum to zero.
- A multi-stage backend Dockerfile: test stage and runtime stage, both Python 3.11.
- Jenkinsfile: Checkout -> Unit tests -> Build Docker image -> Smoke test.
- The existing GitHub Actions backend workflow now also runs unit tests.
- Local Jenkins configuration in infra/jenkins.

Verification so far: all 16 tests passed locally. Docker image builds and Jenkins
execution have NOT been verified yet. Do not present this file as proof of a
successful Jenkins run.

## 1. Local tests

From the repository root in PowerShell:

```powershell
cd backend
python -m unittest discover -s tests -v
cd ..
```

Python 3.11 or newer is required. The tests use only the Python standard library.
They do not prove that the complete API, database and Spotify OAuth work.

## 2. Install and start Docker Desktop

Follow https://docs.docker.com/desktop/setup/install/windows-install/ .
Use Linux containers with the WSL 2 backend. Start Docker Desktop, then open a
new PowerShell terminal and verify both the client and server are available:

```powershell
docker version
docker compose version
```

## 3. Verify images

Run from the repository root:

```powershell
docker build --target test -t smart-spotify-tests:local backend
docker run --rm smart-spotify-tests:local
docker build --target runtime -t smart-spotify-backend:local backend
docker run --rm smart-spotify-backend:local python -c "from app.internal.shuffle_algorithms import reverse_pairs; assert reverse_pairs([1, 2, 3]) == [2, 1, 3]; print('Runtime smoke test passed')"
```

The smoke test verifies the algorithm module in the runtime image. Starting the
full API still requires the existing database settings and HTTPS certificates.
The assignment CI does not start the full application or claim automatic CD.

## 4. Start Jenkins

From the repository root:

```powershell
docker compose -f infra/jenkins/compose.yaml up -d --build
docker compose -f infra/jenkins/compose.yaml exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Open http://localhost:8080 and enter the initial password locally. Do not put the
password into a report or screenshot. Install suggested plugins, including Git
and Pipeline; Pipeline: Stage View is useful for the assignment screenshots.
Create your own administrator account.

This configuration runs Jenkins as root with the Docker socket mounted, for a
local classroom environment. Only execute trusted repositories with it. The web
port is bound to localhost. Jenkins data survives container recreation in a named
volume; shutting down without deleting the volume preserves jobs and settings.

## 5. Publish changes and create a job

The repository changes must be committed and pushed before Jenkins can fetch the
new Jenkinsfile. Review the changes first; no commit or push was made automatically.

1. New Item -> enter spotify-assignment5 -> Pipeline -> OK.
2. Under Pipeline choose Pipeline script from SCM.
3. SCM: Git.
4. Repository URL: https://github.com/jksenby/smart-spotify-playlist-shuffler.git
5. Branch Specifier: */main (or the exact branch to which you pushed the changes).
6. Script Path: Jenkinsfile.
7. Save -> Build Now.

The Jenkins container supplies a Linux shell, Git and Docker CLI. No Docker
Pipeline plugin is required: the Jenkinsfile uses ordinary shell commands.
The job must execute on a Linux node with access to the Docker daemon; the local
container above provides that environment.

After the first successful run, Jenkins checks SCM roughly every two minutes and
builds when it detects a new pushed revision. Local commits that have not been
pushed cannot trigger it. Several commits pushed together may share a build.
For immediate triggers, configure a GitHub webhook and reachable Jenkins endpoint
separately; the localhost setup does not require exposing Jenkins to the internet.

## 6. Evidence to collect

- Successful pipeline view showing all four stages.
- Console Output showing the tests passing and runtime image build succeeding.
- The unit-tests.log artifact attached to the Jenkins build.
- A second successful run triggered by a pushed commit; record its commit SHA.
- Repository URL, branch and commit containing Dockerfile, tests and Jenkinsfile.

A failed test stops the pipeline before the runtime build stage. Test logs are
archived even when the test run fails.

Stop Jenkins after working:

```powershell
docker compose -f infra/jenkins/compose.yaml down
```

## Remaining assignment deliverables

- Analytical report: 3-5 pages, about DevOps/CI/CD and reproducible algorithm
  experiments; include Docker, Jenkins and Kubernetes examples.
- Practical report: 1-2 pages, actual steps, difficulties and conclusions,
  supported by screenshots from your real Jenkins runs.
- Reports: PDF or DOCX, 12 pt font and 1.5 line spacing as specified.
- Docker Hub upload and deployment/Kubernetes are optional. GitHub Actions as a
  substitute for Jenkins requires instructor approval; this setup uses Jenkins.

References:
- https://www.jenkins.io/doc/book/installing/docker/
- https://docs.docker.com/desktop/setup/install/windows-install/

## One-command Windows verification

After Docker Desktop is running, open ordinary PowerShell at the repository root:

```powershell
powershell -File .\scripts\verify-assignment5.ps1
```

The script checks Linux container mode, builds/runs the test image, builds/checks
the runtime image, and starts Jenkins. It stops immediately if a Docker step fails.
Use -SkipJenkins to run just the Docker checks. The script does not commit or push
code, create a Jenkins job, or claim that the pipeline has already succeeded.
If your execution policy blocks local scripts, use the individual Docker commands
in sections 3 and 4 above instead.

The Jenkins image copies Docker CLI 29 from the official Docker image to avoid an
old distribution-packaged client being incompatible with the host daemon.

## HTTPS certificate failure while downloading packages

If pip reports CERTIFICATE_VERIFY_FAILED for files.pythonhosted.org, your network
may inspect HTTPS using a CA trusted by Windows but absent from the Linux image.
On this computer, the verified chain terminates in the existing Windows-trusted
Unified State Internet Access Gateway root (SHA-1 thumbprint
25D54593985C423F63C23733DDEA8A16705CC8A4). A public PEM export is stored locally at
backend/certs/network-ca.pem and is excluded from Git and the Docker build context.

The verification script detects this file and passes it through a BuildKit secret.
The Dockerfile combines it with the image's system CA bundle for pip installation
only, then removes the temporary bundle in the same layer. Certificate validation
remains enabled. The runtime image does not retain the local CA.

The local Jenkins Compose service mounts the certificate folder read-only and the
Jenkinsfile supplies the same optional build secret. On networks without HTTPS
inspection, the image builds normally without this local file. On another
inspected network, obtain its approved public CA instead of copying this one.

Rerun the same verification command after the change. An HTTP 200 metadata download
with the added CA was verified from Windows; the complete Docker rebuild still
needs to be run from ordinary PowerShell because this chat cannot access the
Docker named pipe.

## Jenkins plugin downloads fail with a certificate error

The Jenkins startup wrapper also imports the mounted local CA into a copy of
Java's default truststore under JENKINS_HOME/network-cacerts. The original public
truststore remains unchanged. Jenkins uses the copy through JAVA_OPTS, preserving
HTTPS certificate validation for update-center and plugin downloads.

To apply an updated startup wrapper, run from the repository root:

```powershell
docker compose -f infra/jenkins/compose.yaml up -d --build
```

This recreates the container using its existing Jenkins home volume, preserving
setup progress and jobs. Wait for startup, reload http://localhost:8080 and choose
Retry for the failed plugins. If downloads still fail, inspect their error details
or run docker compose -f infra/jenkins/compose.yaml logs --tail 100 jenkins.
