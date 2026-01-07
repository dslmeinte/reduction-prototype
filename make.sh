#!/bin/sh

# Script to rebuild all packages from scratch, e.g. after cloning or after running `npm run clean`.
# It does so *in dependency order*.

# Have script exit after first failure is detected:
set -e

cd packages

echo "Running generation in package: build"
cd build
npm run generate
cd ..
echo "...done"
echo ""
echo ""

echo "Testing package: prototype"
cd prototype
npm test
cd ..
echo "...done"
echo ""
echo ""

cd .. # (/<root>)

# (doesn't bother with dependency order:)
npm run lint

