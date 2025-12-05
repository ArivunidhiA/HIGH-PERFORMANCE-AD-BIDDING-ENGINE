#include "bid_handler.h"
#include "tcp_server.h"
#include "metrics.h"
#include <iostream>
#include <signal.h>
#include <yaml-cpp/yaml.h>
#include <thread>
#include <chrono>
#include <sstream>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>

std::atomic<bool> g_running(true);
TCPServer* g_tcp_server = nullptr;
BidHandler* g_bid_handler = nullptr;
MetricsCollector* g_metrics = nullptr;

void signalHandler(int signal) {
    std::cout << "Received signal " << signal << ", shutting down..." << std::endl;
    g_running.store(false);
}

void startMetricsServer(int port) {
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd < 0) {
        return;
    }
    
    int opt = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
    
    struct sockaddr_in address;
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(port);
    
    if (bind(server_fd, (struct sockaddr*)&address, sizeof(address)) < 0) {
        close(server_fd);
        return;
    }
    
    if (listen(server_fd, 10) < 0) {
        close(server_fd);
        return;
    }
    
    while (g_running.load()) {
        struct sockaddr_in client_address;
        socklen_t addr_len = sizeof(client_address);
        int client_fd = accept(server_fd, (struct sockaddr*)&client_address, &addr_len);
        
        if (client_fd >= 0 && g_metrics) {
            std::string metrics = g_metrics->getPrometheusFormat();
            std::string response = "HTTP/1.1 200 OK\r\n"
                                 "Content-Type: text/plain\r\n"
                                 "Content-Length: " + std::to_string(metrics.size()) + "\r\n"
                                 "\r\n" + metrics;
            
            send(client_fd, response.c_str(), response.size(), 0);
            close(client_fd);
        }
    }
    
    close(server_fd);
}

int main(int argc, char* argv[]) {
    signal(SIGINT, signalHandler);
    signal(SIGTERM, signalHandler);
    
    // Load config
    YAML::Node config;
    try {
        config = YAML::LoadFile("config/config.yaml");
    } catch (...) {
        std::cerr << "Failed to load config, using defaults" << std::endl;
    }
    
    std::string host = config["server"]["host"] ? config["server"]["host"].as<std::string>() : "0.0.0.0";
    int port = config["server"]["port"] ? config["server"]["port"].as<int>() : 5000;
    int metrics_port = config["server"]["metrics_port"] ? config["server"]["metrics_port"].as<int>() : 9090;
    size_t thread_pool_size = config["thread_pool"]["size"] ? config["thread_pool"]["size"].as<size_t>() : 8;
    
    std::cout << "Starting Bidding Engine..." << std::endl;
    std::cout << "Host: " << host << std::endl;
    std::cout << "Port: " << port << std::endl;
    std::cout << "Thread Pool Size: " << thread_pool_size << std::endl;
    
    // Initialize components
    g_metrics = new MetricsCollector();
    g_bid_handler = new BidHandler(thread_pool_size);
    g_tcp_server = new TCPServer(host, port);
    
    // Set up bid handler callback
    g_bid_handler->setBidCallback([&](const bidding::BidResponse& response) {
        if (g_metrics) {
            g_metrics->recordRequest(response.latency_ms(), response.status() == "success");
        }
    });
    
    // Set up TCP server request handler
    g_tcp_server->setRequestHandler([&](const bidding::BidRequest& request) {
        return g_bid_handler->processBid(request);
    });
    
    // Start services
    g_bid_handler->start();
    g_tcp_server->start();
    
    // Start metrics server
    std::thread metrics_thread(startMetricsServer, metrics_port);
    metrics_thread.detach();
    
    std::cout << "Bidding Engine started successfully!" << std::endl;
    
    // Main loop
    while (g_running.load()) {
        std::this_thread::sleep_for(std::chrono::seconds(1));
    }
    
    // Cleanup
    std::cout << "Shutting down..." << std::endl;
    g_tcp_server->stop();
    g_bid_handler->stop();
    
    delete g_tcp_server;
    delete g_bid_handler;
    delete g_metrics;
    
    return 0;
}

