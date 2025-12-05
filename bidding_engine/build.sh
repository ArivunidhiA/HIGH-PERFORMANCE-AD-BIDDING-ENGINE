#!/bin/bash

# Build script for C++ bidding engine

set -e

echo "Building C++ Bidding Engine..."

# Create build directory
mkdir -p build
cd build

# Configure with CMake
cmake -DCMAKE_BUILD_TYPE=Release ..

# Build
cmake --build . -j$(nproc)

echo "Build complete! Binary: ./build/bidding_engine"

