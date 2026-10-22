const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', 'docs', 'reports');
fs.mkdirSync(root, { recursive: true });
const theory = [
[
['title', 'The Role of DevOps and CI/CD in Automating Research Projects'],
['subtitle', 'Reproducible Evaluation of Playlist Shuffling Algorithms | Assignment 5 | 22 October 2026'],
['heading', '1. Research context and DevOps principles'],
['text', 'This project studies the reliability of playlist transformation algorithms in Super Shuffler, a Python and Angular application integrated with Spotify. The backend supports random shuffling, artist balancing, popularity weighting, chronological ordering, and transformations based on tempo, mood, or genre. A useful evaluation must establish that these operations preserve the input tracks and behave correctly for incomplete metadata, duplicate songs, and unavailable external services. This report examines how DevOps practices support that evaluation.'],
['text', 'DevOps connects software development with operation through shared responsibility, automation, small changes, and rapid feedback. In a research team, the same principles connect algorithm implementation, experiment execution, and maintenance of the experimental environment. Developers and researchers benefit from a common definition of a successful run: the source revision is known, required checks pass, the environment can be recreated, and evidence is retained for inspection.'],
['text', 'Version control makes changes reviewable and connects results to their implementation. Automated checks reduce the chance that an apparently minor modification silently changes an algorithm. A repeatable environment reduces differences between a student laptop and a CI worker. Preserving logs makes failures visible and allows another team member to understand which checks ran. These practices make research software easier to maintain and hand over.'],
['text', 'For this project, the experimental unit is the Python algorithm layer. Its tests use synthetic playlists and mocked Spotify responses, so they can run without OAuth credentials, a PostgreSQL server, or the Angular interface. This narrow boundary gives fast feedback on algorithm correctness. Separate integration tests would still be needed to validate database access, HTTP endpoints, authentication, and real Spotify behavior.'],
['text', 'The central benefit is traceability: a researcher can connect a Git revision to a container build and a recorded test result. This supports reproducible evaluation, while recognizing that a passing correctness suite alone does not demonstrate statistical quality or user satisfaction.']
],
[
['heading', '2. Continuous integration and delivery'],
['text', 'Continuous integration means integrating changes frequently and checking them automatically. For this repository, Jenkins retrieves the source, runs the algorithm tests, builds a runtime image, and executes a smoke test. The Jenkinsfile stores these stages with the application code, making the workflow visible and reviewable. Jenkins documents this approach as Pipeline as Code [1]. A failed unit test stops execution before the runtime build.'],
['text', 'Continuous delivery extends successful integration toward a release that can be deployed through a controlled decision. Continuous deployment goes further by automatically releasing qualifying changes. The implemented workflow establishes CI and produces a local runtime image. It does not upload an image to a registry or deploy the full application automatically. Those activities would be additional delivery stages rather than results demonstrated by the current run.'],
['text', 'The pipeline has four stages: Checkout, Unit tests, Build Docker image, and Smoke test. Checkout identifies the source revision. The test stage builds and runs an isolated Python test image. The build stage installs the backend dependencies and packages the application. The smoke test imports the algorithm module from that runtime image and checks a small transformation. Together these stages check both source behavior and basic usability of the packaged module.'],
['text', 'The configuration also archives unit-tests.log, limits each run to twenty minutes, prevents concurrent builds of the same job, and retains a bounded history. Image tags combine the build number with a short Git revision. These choices help identify outputs and reduce confusion between experiments. However, a mutable local image tag is weaker evidence than a recorded immutable image digest retained alongside the build results.'],
['text', 'Jenkins polls the repository approximately every two minutes. This allows a local installation to detect pushed changes without a publicly reachable webhook. Polling can group several commits into one build, so it does not guarantee an individual run for every commit. A manually started successful build proves the workflow executes; a separate pushed-change experiment is needed to demonstrate the automatic trigger. A webhook or branch workflow can provide more immediate feedback when required.'],
['text', 'Fast failure is especially valuable in research: an invalid implementation should be detected before expensive experiments or deployment. CI therefore protects an experiment from known defects, while human review remains necessary to decide whether the tests represent the intended scientific question.']
],
[
['heading', '3. Docker and reproducible environments'],
['text', 'Docker packages the application with its operating-system environment and dependencies. The backend Dockerfile uses Python 3.11 and separates a test stage from a runtime stage. The tests rely on the standard library, while the runtime stage installs requirements.txt. This separation avoids requiring production services for algorithm tests and allows the same repository to provide both a lightweight verification environment and an application image.'],
['text', 'Reproducibility requires more than placing code in a container. The source revision, dependency versions, input data, configuration, and random state must also be recorded. Python package versions are listed explicitly, but the python:3.11-slim base tag can change, and transitive dependencies may still vary. A stronger research setup would pin the base-image digest, lock all dependencies, and retain dataset checksums and execution parameters.'],
['text', 'For random algorithms, repeated runs may legitimately produce different orders. Correctness tests should therefore verify invariants such as preserving track multiplicities rather than expect one arbitrary shuffled sequence. Comparative experiments should record seeds and repeat runs across many playlists. Possible measures include adjacent tracks by the same artist, artist spacing, runtime, and track-position distributions. These are proposed extensions; the current suite does not claim to measure them.'],
['text', 'The practical work also illustrates a difference between application dependencies and build infrastructure. The runtime Dockerfile uses a BuildKit secret mount for an optional network certificate during package installation. The first Jenkins run passed all unit tests but failed because its Docker installation lacked Buildx and used the legacy builder. Adding the Buildx plugin and enabling BuildKit corrected the build environment. Docker documents BuildKit as its builder backend [2].'],
['text', 'Certificate handling matters when an institution inspects HTTPS traffic. The repository supports an optional locally trusted CA without disabling certificate verification. The public CA file is supplied as a build secret rather than embedded in the runtime image. A team should document environment-specific requirements so that another researcher can recreate the process on a different network.'],
['text', 'A typical scientific example is a CSV analysis script whose dependencies are packaged in an image and whose expected outputs are checked by CI. In this project, synthetic playlist fixtures play an analogous role: they provide controlled inputs that can be reused across algorithm changes.']
],
[
['heading', '4. Jenkins and Kubernetes in research workflows'],
['text', 'Jenkins coordinates repeatable work after a source change and retains logs for review. In an engineering project, it can run numerical regression tests before publishing a simulator image. In this playlist project, it checks track preservation, boundary cases, and mocked service failures before packaging the backend. A common pipeline makes the acceptance procedure visible to collaborators and reduces dependence on undocumented commands executed on one laptop.'],
['text', 'Kubernetes addresses execution across a cluster. Its Job resource manages finite tasks and tracks completion [3], making it suitable for batch data processing or repeated experiment workers. For example, a future evaluation could run several seeded playlist experiments as separate Jobs, collect metrics in durable storage, and aggregate results after completion. That design would need explicit resource limits, input versions, output locations, and retry-aware experiment identifiers.'],
['text', 'A cluster does not automatically make results reproducible. Retrying a nondeterministic task may change its output, and parallel workloads may compete for resources and distort timing measurements. Researchers must control seeds, hardware assumptions, and measurement conditions. For this small assignment, local Docker and Jenkins are sufficient to demonstrate CI; Kubernetes deployment remains a possible extension rather than an implemented result.'],
['heading', '5. Conclusion'],
['text', 'DevOps helps research teams reduce environment drift, detect regressions earlier, and connect results to versioned code. Docker describes an execution environment, Jenkins automates verification, and Kubernetes can coordinate larger batches of work. Their value depends on clear experiment boundaries and meaningful tests. The project demonstrates automated checks of playlist algorithms and a successful Jenkins build. Further work should verify the pushed-change trigger, retain image digests, and add seeded statistical evaluation and integration tests.'],
['heading', 'References'],
['text', '[1] Jenkins. Pipeline. https://www.jenkins.io/doc/book/pipeline/ (accessed 22 October 2026).'],
['text', '[2] Docker. BuildKit. https://docs.docker.com/build/buildkit/ (accessed 22 October 2026).'],
['text', '[3] Kubernetes. Jobs. https://kubernetes.io/docs/concepts/workloads/controllers/job/ (accessed 22 October 2026).'],
['text', 'Project repository: https://github.com/jksenby/smart-spotify-playlist-shuffler']
]
];
const practical = [
[
['title', 'Practical Report: Docker and Jenkins CI'],
['subtitle', 'Super Shuffler | Assignment 5 | 22 October 2026'],
['heading', '1. Objective and implementation'],
['text', 'The objective was to automate verification and containerization of the Python playlist algorithm layer. The project is stored at https://github.com/jksenby/smart-spotify-playlist-shuffler, branch main. The verified Jenkins build used revision 692b59a82ac2ed3da77fddd0217b02adb7b185b6. Tests use synthetic inputs and mocked Spotify responses, allowing execution without database services or Spotify credentials.'],
['text', 'The backend Dockerfile provides test and runtime stages based on Python 3.11. Sixteen unittest tests cover track preservation, duplicates, artist balancing, ordering, invalid inputs, zero popularity weights, API request batching, and service failures. The runtime smoke test checks that reverse_pairs([1, 2, 3]) produces [2, 1, 3].'],
['text', 'Jenkins was deployed locally through infra/jenkins/compose.yaml with persistent home storage and access to the Docker daemon. A Pipeline job named spotify-assignment5 loads Jenkinsfile from Git, using branch */main. Its stages are Checkout, Unit tests, Build Docker image, and Smoke test. Test logs are archived even when a run fails.'],
['heading', '2. Execution and troubleshooting'],
['text', 'Local verification used scripts/verify-assignment5.ps1 to build the test image, run all sixteen tests, build the runtime image, check the packaged algorithm, and start Jenkins. In Jenkins build #1, checkout and tests succeeded, but the runtime build failed with “the --mount option requires BuildKit”. The Jenkins image contained Docker CLI without the Buildx plugin, causing a fallback to the legacy builder.'],
['text', 'The fix copies docker-buildx from the official Docker CLI image into the Jenkins image and sets DOCKER_BUILDKIT=1. Jenkins was rebuilt with docker compose -f infra/jenkins/compose.yaml up -d --build. Its existing home volume retained the job and settings. A runtime build executed from the Jenkins container then succeeded. The updated infrastructure Dockerfile must also be committed and pushed so that this fix is reproducible from the repository.']
],
[
['heading', '3. Observed result and evidence'],
['text', 'The supplied Jenkins screenshot shows build #3 completed successfully in 9.5 seconds. It identifies branch main, revision 692b59a82ac2ed3da77fddd0217b02adb7b185b6, and an archived unit-tests.log artifact of 2.43 KiB. The build was started manually by user admin. The earlier console log records sixteen passing tests; the successful build screenshot confirms the later pipeline completed.'],
['placeholder', '[Insert screenshot 1: supplied Jenkins build #3 page showing success, revision and unit-tests.log.]'],
['text', 'Figure 1. Successful Jenkins build #3 and retained test-log artifact.'],
['placeholder', '[Insert screenshot 2: build #3 Console Output showing “Ran 16 tests”, “OK”, the smoke-test result and “Finished: SUCCESS”; use Pipeline Steps as additional evidence if needed.]'],
['text', 'Figure 2. Console evidence of tests, packaging and the runtime smoke test.'],
['heading', '4. Automation, limitations and conclusion'],
['text', 'The Jenkinsfile configures SCM polling approximately every two minutes. Automatic detection of a new pushed commit still needs a separate observed run; the screenshot documents a manual run with no changes. To complete that evidence, push a reviewed change, wait for polling, and capture the build cause and new revision. Several commits pushed together may share one run.'],
['text', 'The implemented CI verifies the algorithm layer and produces a local runtime image. It does not validate the complete API, PostgreSQL integration, live Spotify OAuth, or the frontend. Docker Hub publishing and Kubernetes deployment were optional and were not performed. The practical result demonstrates a working Jenkins pipeline and shows why build tools must be included in the reproducible environment alongside application dependencies.'],
['text', 'Submission evidence: repository and Jenkinsfile at the URL above; successful build screenshot; console screenshot and unit-tests.log. Local build URL: http://localhost:8080/job/spotify-assignment5/3/ (accessible on the author’s computer).']
]
];
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function paragraph([type, value]) {
  const bold = ['title','heading'].includes(type);
  return `<w:p><w:pPr><w:spacing w:after="100" w:line="360" w:lineRule="auto"/>${['title','heading','subtitle'].includes(type)?'<w:keepNext/>':''}</w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/>${bold?'<w:b/>':''}${type==='placeholder'?'<w:color w:val="9C4800"/>':''}</w:rPr><w:t xml:space="preserve">${esc(value)}</w:t></w:r></w:p>`;
}
function make(name, pages) {
  const dir = path.join(root, name + '-package');
  fs.mkdirSync(path.join(dir,'_rels'),{recursive:true});
  fs.mkdirSync(path.join(dir,'word'),{recursive:true});
  const body = pages.map(p=>p.map(paragraph).join('')).join('<w:p><w:r><w:br w:type="page"/></w:r></w:p>');
  fs.writeFileSync(path.join(dir,'[Content_Types].xml'),'<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
  fs.writeFileSync(path.join(dir,'_rels','.rels'),'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
  fs.writeFileSync(path.join(dir,'word','document.xml'),`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1000" w:right="1000" w:bottom="1000" w:left="1000"/></w:sectPr></w:body></w:document>`);
  fs.writeFileSync(path.join(root,name+'.md'),pages.map(p=>p.map(([type,t])=>(type==='title'?'# ':type==='heading'?'## ':'')+t).join('\n\n')).join('\n\n---\n\n'));
  console.log(name, pages.map(p=>p.reduce((n,[,s])=>n+s.split(/\s+/).length,0)));
}
make('assignment-5-theory',theory);
make('assignment-5-practical',practical);
const combinedTheory = theory.map(page => page.map(entry => [...entry]));
const combinedPractical = practical.map(page => page.map(entry => [...entry]));
combinedTheory[0].unshift(['title', 'Part 1. Theoretical Report']);
combinedPractical[0].unshift(['title', 'Part 2. Practical Report']);
make('assignment-5-report', [...combinedTheory, ...combinedPractical]);
