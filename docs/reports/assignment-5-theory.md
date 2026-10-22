# The Role of DevOps and CI/CD in Automating Research Projects

Reproducible Evaluation of Playlist Shuffling Algorithms | Assignment 5 | 22 October 2026

## 1. Research context and DevOps principles

This project studies the reliability of playlist transformation algorithms in Super Shuffler, a Python and Angular application integrated with Spotify. The backend supports random shuffling, artist balancing, popularity weighting, chronological ordering, and transformations based on tempo, mood, or genre. A useful evaluation must establish that these operations preserve the input tracks and behave correctly for incomplete metadata, duplicate songs, and unavailable external services. This report examines how DevOps practices support that evaluation.

DevOps connects software development with operation through shared responsibility, automation, small changes, and rapid feedback. In a research team, the same principles connect algorithm implementation, experiment execution, and maintenance of the experimental environment. Developers and researchers benefit from a common definition of a successful run: the source revision is known, required checks pass, the environment can be recreated, and evidence is retained for inspection.

Version control makes changes reviewable and connects results to their implementation. Automated checks reduce the chance that an apparently minor modification silently changes an algorithm. A repeatable environment reduces differences between a student laptop and a CI worker. Preserving logs makes failures visible and allows another team member to understand which checks ran. These practices make research software easier to maintain and hand over.

For this project, the experimental unit is the Python algorithm layer. Its tests use synthetic playlists and mocked Spotify responses, so they can run without OAuth credentials, a PostgreSQL server, or the Angular interface. This narrow boundary gives fast feedback on algorithm correctness. Separate integration tests would still be needed to validate database access, HTTP endpoints, authentication, and real Spotify behavior.

The central benefit is traceability: a researcher can connect a Git revision to a container build and a recorded test result. This supports reproducible evaluation, while recognizing that a passing correctness suite alone does not demonstrate statistical quality or user satisfaction.

---

## 2. Continuous integration and delivery

Continuous integration means integrating changes frequently and checking them automatically. For this repository, Jenkins retrieves the source, runs the algorithm tests, builds a runtime image, and executes a smoke test. The Jenkinsfile stores these stages with the application code, making the workflow visible and reviewable. Jenkins documents this approach as Pipeline as Code [1]. A failed unit test stops execution before the runtime build.

Continuous delivery extends successful integration toward a release that can be deployed through a controlled decision. Continuous deployment goes further by automatically releasing qualifying changes. The implemented workflow establishes CI and produces a local runtime image. It does not upload an image to a registry or deploy the full application automatically. Those activities would be additional delivery stages rather than results demonstrated by the current run.

The pipeline has four stages: Checkout, Unit tests, Build Docker image, and Smoke test. Checkout identifies the source revision. The test stage builds and runs an isolated Python test image. The build stage installs the backend dependencies and packages the application. The smoke test imports the algorithm module from that runtime image and checks a small transformation. Together these stages check both source behavior and basic usability of the packaged module.

The configuration also archives unit-tests.log, limits each run to twenty minutes, prevents concurrent builds of the same job, and retains a bounded history. Image tags combine the build number with a short Git revision. These choices help identify outputs and reduce confusion between experiments. However, a mutable local image tag is weaker evidence than a recorded immutable image digest retained alongside the build results.

Jenkins polls the repository approximately every two minutes. This allows a local installation to detect pushed changes without a publicly reachable webhook. Polling can group several commits into one build, so it does not guarantee an individual run for every commit. A manually started successful build proves the workflow executes; a separate pushed-change experiment is needed to demonstrate the automatic trigger. A webhook or branch workflow can provide more immediate feedback when required.

Fast failure is especially valuable in research: an invalid implementation should be detected before expensive experiments or deployment. CI therefore protects an experiment from known defects, while human review remains necessary to decide whether the tests represent the intended scientific question.

---

## 3. Docker and reproducible environments

Docker packages the application with its operating-system environment and dependencies. The backend Dockerfile uses Python 3.11 and separates a test stage from a runtime stage. The tests rely on the standard library, while the runtime stage installs requirements.txt. This separation avoids requiring production services for algorithm tests and allows the same repository to provide both a lightweight verification environment and an application image.

Reproducibility requires more than placing code in a container. The source revision, dependency versions, input data, configuration, and random state must also be recorded. Python package versions are listed explicitly, but the python:3.11-slim base tag can change, and transitive dependencies may still vary. A stronger research setup would pin the base-image digest, lock all dependencies, and retain dataset checksums and execution parameters.

For random algorithms, repeated runs may legitimately produce different orders. Correctness tests should therefore verify invariants such as preserving track multiplicities rather than expect one arbitrary shuffled sequence. Comparative experiments should record seeds and repeat runs across many playlists. Possible measures include adjacent tracks by the same artist, artist spacing, runtime, and track-position distributions. These are proposed extensions; the current suite does not claim to measure them.

The practical work also illustrates a difference between application dependencies and build infrastructure. The runtime Dockerfile uses a BuildKit secret mount for an optional network certificate during package installation. The first Jenkins run passed all unit tests but failed because its Docker installation lacked Buildx and used the legacy builder. Adding the Buildx plugin and enabling BuildKit corrected the build environment. Docker documents BuildKit as its builder backend [2].

Certificate handling matters when an institution inspects HTTPS traffic. The repository supports an optional locally trusted CA without disabling certificate verification. The public CA file is supplied as a build secret rather than embedded in the runtime image. A team should document environment-specific requirements so that another researcher can recreate the process on a different network.

A typical scientific example is a CSV analysis script whose dependencies are packaged in an image and whose expected outputs are checked by CI. In this project, synthetic playlist fixtures play an analogous role: they provide controlled inputs that can be reused across algorithm changes.

---

## 4. Jenkins and Kubernetes in research workflows

Jenkins coordinates repeatable work after a source change and retains logs for review. In an engineering project, it can run numerical regression tests before publishing a simulator image. In this playlist project, it checks track preservation, boundary cases, and mocked service failures before packaging the backend. A common pipeline makes the acceptance procedure visible to collaborators and reduces dependence on undocumented commands executed on one laptop.

Kubernetes addresses execution across a cluster. Its Job resource manages finite tasks and tracks completion [3], making it suitable for batch data processing or repeated experiment workers. For example, a future evaluation could run several seeded playlist experiments as separate Jobs, collect metrics in durable storage, and aggregate results after completion. That design would need explicit resource limits, input versions, output locations, and retry-aware experiment identifiers.

A cluster does not automatically make results reproducible. Retrying a nondeterministic task may change its output, and parallel workloads may compete for resources and distort timing measurements. Researchers must control seeds, hardware assumptions, and measurement conditions. For this small assignment, local Docker and Jenkins are sufficient to demonstrate CI; Kubernetes deployment remains a possible extension rather than an implemented result.

## 5. Conclusion

DevOps helps research teams reduce environment drift, detect regressions earlier, and connect results to versioned code. Docker describes an execution environment, Jenkins automates verification, and Kubernetes can coordinate larger batches of work. Their value depends on clear experiment boundaries and meaningful tests. The project demonstrates automated checks of playlist algorithms and a successful Jenkins build. Further work should verify the pushed-change trigger, retain image digests, and add seeded statistical evaluation and integration tests.

## References

[1] Jenkins. Pipeline. https://www.jenkins.io/doc/book/pipeline/ (accessed 22 October 2026).

[2] Docker. BuildKit. https://docs.docker.com/build/buildkit/ (accessed 22 October 2026).

[3] Kubernetes. Jobs. https://kubernetes.io/docs/concepts/workloads/controllers/job/ (accessed 22 October 2026).

Project repository: https://github.com/jksenby/smart-spotify-playlist-shuffler