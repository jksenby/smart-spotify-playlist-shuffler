FROM python:3.11-slim AS base
WORKDIR /code
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

# Offline unit tests exercise the algorithm layer without API credentials or a DB.
FROM base AS test
COPY ./app /code/app
COPY ./tests /code/tests
CMD ["python", "-m", "unittest", "discover", "-s", "tests", "-v"]

FROM base AS runtime
COPY ./requirements.txt /code/requirements.txt
# Optional local HTTPS inspection CA. BuildKit does not store the mounted file.
RUN --mount=type=secret,id=network_ca \
    if [ -f /run/secrets/network_ca ]; then \
        cat /etc/ssl/certs/ca-certificates.crt /run/secrets/network_ca > /tmp/pip-ca.pem; \
        PIP_CERT=/tmp/pip-ca.pem pip install --no-cache-dir -r /code/requirements.txt \
        && rm /tmp/pip-ca.pem; \
    else \
        pip install --no-cache-dir -r /code/requirements.txt; \
    fi
COPY ./app /code/app
COPY ./log.ini /code/log.ini
EXPOSE 8000
CMD ["python", "-m", "app.main"]
