#!/bin/sh
set -eu

# Keep Java's original public CA store intact. Refresh a local copy on startup.
if [ -n "${NETWORK_CA_FILE:-}" ] && [ -f "$NETWORK_CA_FILE" ]; then
    network_store="${JENKINS_HOME}/network-cacerts"
    cp "${JAVA_HOME}/lib/security/cacerts" "$network_store"
    "${JAVA_HOME}/bin/keytool" -importcert -noprompt \
        -alias assignment-network-ca -file "$NETWORK_CA_FILE" \
        -keystore "$network_store" -storepass changeit
    export JAVA_OPTS="${JAVA_OPTS:-} -Djavax.net.ssl.trustStore=$network_store -Djavax.net.ssl.trustStorePassword=changeit"
fi

exec /usr/local/bin/jenkins.sh "$@"
