#pragma once

#include <queue>
#include <vector>
#include <algorithm>
#include "proto/bid.pb.h"

struct Bid {
    std::string id;
    std::string campaign_id;
    double amount;
    double floor_price;
    
    bool operator<(const Bid& other) const {
        return amount < other.amount;
    }
};

class AuctionEngine {
public:
    AuctionEngine();
    
    bidding::BidResponse runSecondPriceAuction(
        const std::vector<Bid>& bids,
        double floor_price
    );
    
    double calculateBidScore(const bidding::BidRequest& request);

private:
    std::priority_queue<Bid> bid_queue_;
};

