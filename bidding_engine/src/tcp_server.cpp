#include "tcp_server.h"
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <fcntl.h>
#include <iostream>
#include <cstring>

TCPServer::TCPServer(const std::string& host, int port)
    : host_(host)
    , port_(port)
    , server_fd_(-1)
    , running_(false)
{
}

TCPServer::~TCPServer() {
    stop();
}

void TCPServer::start() {
    server_fd_ = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd_ < 0) {
        throw std::runtime_error("Failed to create socket");
    }
    
    int opt = 1;
    setsockopt(server_fd_, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
    
    struct sockaddr_in address;
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = inet_addr(host_.c_str());
    address.sin_port = htons(port_);
    
    if (bind(server_fd_, (struct sockaddr*)&address, sizeof(address)) < 0) {
        close(server_fd_);
        throw std::runtime_error("Failed to bind socket");
    }
    
    if (listen(server_fd_, 128) < 0) {
        close(server_fd_);
        throw std::runtime_error("Failed to listen");
    }
    
    running_.store(true);
    std::thread accept_thread(&TCPServer::acceptConnections, this);
    accept_thread.detach();
}

void TCPServer::stop() {
    if (!running_.load()) {
        return;
    }
    
    running_.store(false);
    if (server_fd_ >= 0) {
        close(server_fd_);
        server_fd_ = -1;
    }
    
    for (auto& thread : client_threads_) {
        if (thread.joinable()) {
            thread.join();
        }
    }
    client_threads_.clear();
}

void TCPServer::setRequestHandler(std::function<bidding::BidResponse(const bidding::BidRequest&)> handler) {
    request_handler_ = handler;
}

void TCPServer::acceptConnections() {
    while (running_.load()) {
        struct sockaddr_in client_address;
        socklen_t addr_len = sizeof(client_address);
        
        int client_fd = accept(server_fd_, (struct sockaddr*)&client_address, &addr_len);
        if (client_fd < 0) {
            if (running_.load()) {
                std::cerr << "Failed to accept connection" << std::endl;
            }
            continue;
        }
        
        client_threads_.emplace_back(&TCPServer::handleClient, this, client_fd);
    }
}

void TCPServer::handleClient(int client_fd) {
    char buffer[4096];
    
    while (running_.load()) {
        // Read message length (4 bytes)
        uint32_t message_length = 0;
        ssize_t bytes_read = recv(client_fd, &message_length, 4, MSG_WAITALL);
        if (bytes_read != 4) {
            break;
        }
        
        message_length = ntohl(message_length);
        if (message_length > sizeof(buffer)) {
            break;
        }
        
        // Read message
        bytes_read = recv(client_fd, buffer, message_length, MSG_WAITALL);
        if (bytes_read != message_length) {
            break;
        }
        
        // Parse protobuf
        bidding::BidRequest request;
        if (!request.ParseFromArray(buffer, message_length)) {
            break;
        }
        
        // Process request
        if (request_handler_) {
            bidding::BidResponse response = request_handler_(request);
            
            // Serialize response
            std::string response_data;
            response.SerializeToString(&response_data);
            
            // Send length + data
            uint32_t response_length = htonl(response_data.size());
            send(client_fd, &response_length, 4, 0);
            send(client_fd, response_data.data(), response_data.size(), 0);
        }
    }
    
    close(client_fd);
}

