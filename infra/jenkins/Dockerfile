FROM docker:29-cli AS docker_cli
FROM jenkins/jenkins:lts-jdk21
USER root
COPY --from=docker_cli /usr/local/bin/docker /usr/local/bin/docker
COPY start-with-network-ca.sh /usr/local/bin/start-with-network-ca.sh
ENTRYPOINT ["/usr/bin/tini", "--", "/bin/sh", "/usr/local/bin/start-with-network-ca.sh"]
USER jenkins
