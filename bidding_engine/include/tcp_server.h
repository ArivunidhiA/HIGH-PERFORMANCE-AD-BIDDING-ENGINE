#pragma once

#include <string>
#include <functional>
#include <thread>
#include <atomic>
#include <vector>
#include "proto/bid.pb.h"

class TCPServer {
public:
    TCPServer(const std::string& host, int port);
    ~TCPServer();
    
    void start();
    void stop();
    
    void setRequestHandler(std::function<bidding::BidResponse(const bidding::BidRequest&)> handler);

private:
    void acceptConnections();
    void handleClient(int client_fd);
    
    std::string host_;
    int port_;
    int server_fd_;
    std::atomic<bool> running_;
    std::vector<std::thread> client_threads_;
    
    std::function<bidding::BidResponse(const bidding::BidRequest&)> request_handler_;
};

