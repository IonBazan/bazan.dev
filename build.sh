#!/usr/bin/env bash

set -euo pipefail

: ${DART_SASS_VERSION:="1.97.2"}

echo "Installing Dart Sass ${DART_SASS_VERSION}..."
curl -sLJO "https://github.com/sass/dart-sass/releases/download/${DART_SASS_VERSION}/dart-sass-${DART_SASS_VERSION}-linux-x64.tar.gz"
tar -C "${HOME}/.local" -xf "dart-sass-${DART_SASS_VERSION}-linux-x64.tar.gz"
rm "dart-sass-${DART_SASS_VERSION}-linux-x64.tar.gz"
export PATH="${HOME}/.local/dart-sass:${PATH}"

hugo -D --gc --minify
