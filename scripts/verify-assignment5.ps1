param([switch]$SkipJenkins)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot

function Invoke-DockerStep {
    param([string]$Title, [string[]]$DockerArguments)
    Write-Host "`n$Title" -ForegroundColor Cyan
    & docker @DockerArguments
    if ($LASTEXITCODE -ne 0) {
        throw "$Title failed (exit code $LASTEXITCODE). Fix the error above and rerun this script."
    }
}

Push-Location -LiteralPath $projectRoot
try {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        throw 'Docker CLI was not found. Start Docker Desktop and open a new PowerShell window.'
    }
    Invoke-DockerStep -Title 'Checking Docker server' -DockerArguments @('info')
    $serverOs = (& docker info --format '{{.OSType}}').Trim()
    if ($LASTEXITCODE -ne 0 -or $serverOs -ne 'linux') {
        throw 'Switch Docker Desktop to Linux containers and rerun this script.'
    }
    Invoke-DockerStep -Title 'Checking Compose' -DockerArguments @('compose', 'version')
    Invoke-DockerStep -Title 'Building test image' -DockerArguments @(
        'build', '--target', 'test', '-t', 'smart-spotify-tests:local', 'backend')
    Invoke-DockerStep -Title 'Running unit tests' -DockerArguments @(
        'run', '--rm', 'smart-spotify-tests:local')
    $runtimeBuildArguments = @('build', '--target', 'runtime', '-t', 'smart-spotify-backend:local')
    if (Test-Path -LiteralPath 'backend/certs/network-ca.pem' -PathType Leaf) {
        $runtimeBuildArguments += @('--secret', 'id=network_ca,src=backend/certs/network-ca.pem')
        Write-Host 'Using the local network CA for package downloads during this build.'
    }
    $runtimeBuildArguments += 'backend'
    Invoke-DockerStep -Title 'Building runtime image' -DockerArguments $runtimeBuildArguments
    $smokeCode = 'from app.internal.shuffle_algorithms import reverse_pairs; assert reverse_pairs([1, 2, 3]) == [2, 1, 3]; print(123)'
    Invoke-DockerStep -Title 'Checking runtime image' -DockerArguments @(
        'run', '--rm', 'smart-spotify-backend:local', 'python', '-c', $smokeCode)
    if (-not $SkipJenkins) {
        Invoke-DockerStep -Title 'Starting Jenkins' -DockerArguments @(
            'compose', '-f', 'infra/jenkins/compose.yaml', 'up', '-d', '--build')
        Write-Host "`nJenkins is starting. Open http://localhost:8080 after initialization."
        Write-Host 'Follow docs/assignment-5.md to unlock Jenkins and create the pipeline job.'
    }
    Write-Host "`nLocal Docker checks passed. Jenkins pipeline execution is a separate step." -ForegroundColor Green
}
finally {
    Pop-Location
}
