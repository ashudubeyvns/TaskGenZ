#!/usr/bin/env bash
set -euo pipefail

echo "Checking required production files..."
for f in vercel.json backend/Dockerfile.vercel backend/pom.xml backend/src/main/resources/application-prod.yml; do
  test -f "$f" || { echo "Missing: $f"; exit 1; }
done

grep -q '"/api/health"' backend/src/main/java/com/sprintdesk/config/SecurityConfig.java
grep -q 'destination.*service.*backend' vercel.json

echo "Production structure checks passed."
echo "Runtime deployment still requires your Vercel project and production database credentials."
