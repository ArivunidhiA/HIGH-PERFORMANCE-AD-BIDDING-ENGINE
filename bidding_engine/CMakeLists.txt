cmake_minimum_required(VERSION 3.15)
project(BiddingEngine VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Build options
option(BUILD_TESTS "Build tests" ON)
option(BUILD_BENCHMARKS "Build benchmarks" OFF)

# Include directories
include_directories(${CMAKE_SOURCE_DIR}/include)
include_directories(${CMAKE_SOURCE_DIR}/src)

# Find packages
find_package(Threads REQUIRED)
find_package(Boost REQUIRED COMPONENTS system filesystem)
find_package(Protobuf REQUIRED)
find_package(yaml-cpp REQUIRED)

# Source files
set(SOURCES
    src/main.cpp
    src/bid_handler.cpp
    src/auction.cpp
    src/metrics.cpp
    src/tcp_server.cpp
    src/data_structures/lockfree_queue.cpp
    src/data_structures/bid_cache.cpp
    src/data_structures/memory_pool.cpp
    src/data_structures/circuit_breaker.cpp
    src/proto/bid.pb.cc
)

# Headers
set(HEADERS
    include/bid_handler.h
    include/auction.h
    include/metrics.h
    include/tcp_server.h
    include/data_structures/lockfree_queue.h
    include/data_structures/bid_cache.h
    include/data_structures/memory_pool.h
    include/data_structures/circuit_breaker.h
)

# Executable
add_executable(bidding_engine ${SOURCES} ${HEADERS})

# Link libraries
target_link_libraries(bidding_engine
    PRIVATE
    Threads::Threads
    Boost::system
    Boost::filesystem
    protobuf::libprotobuf
    yaml-cpp
)

# Compiler flags for optimization
if(CMAKE_BUILD_TYPE STREQUAL "Release")
    target_compile_options(bidding_engine PRIVATE
        -O3
        -march=native
        -mtune=native
        -flto
    )
    # Enable AVX2 for SIMD
    target_compile_options(bidding_engine PRIVATE -mavx2)
endif()

# Tests
if(BUILD_TESTS)
    enable_testing()
    find_package(GTest REQUIRED)
    add_subdirectory(tests)
endif()

# Install
install(TARGETS bidding_engine DESTINATION bin)

