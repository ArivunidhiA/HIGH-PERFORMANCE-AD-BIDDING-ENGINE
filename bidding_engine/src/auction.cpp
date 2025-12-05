#include "auction.h"
#include <cmath>

AuctionEngine::AuctionEngine() {
}

bidding::BidResponse AuctionEngine::runSecondPriceAuction(
    const std::vector<Bid>& bids,
    double floor_price
) {
    if (bids.empty()) {
        bidding::BidResponse response;
        response.set_won(false);
        return response;
    }
    
    // Find highest bid
    auto max_bid = std::max_element(bids.begin(), bids.end(),
        [](const Bid& a, const Bid& b) {
            return a.amount < b.amount;
        });
    
    if (max_bid->amount < floor_price) {
        bidding::BidResponse response;
        response.set_won(false);
        return response;
    }
    
    // Find second highest bid (or floor price if only one bid)
    double second_price = floor_price;
    if (bids.size() > 1) {
        std::vector<Bid> sorted_bids = bids;
        std::sort(sorted_bids.begin(), sorted_bids.end(),
            [](const Bid& a, const Bid& b) {
                return a.amount > b.amount;
            });
        second_price = sorted_bids[1].amount;
    }
    
    bidding::BidResponse response;
    response.set_id(max_bid->id);
    response.set_campaign_id(max_bid->campaign_id);
    response.set_winning_bid(max_bid->amount);
    response.set_price(std::max(second_price, floor_price));
    response.set_won(true);
    
    return response;
}

double AuctionEngine::calculateBidScore(const bidding::BidRequest& request) {
    double score = request.floor_price();
    
    // Apply targeting multipliers
    for (const auto& [key, value] : request.targeting()) {
        if (key == "premium_user" && value == "true") {
            score *= 1.5;
        }
        if (key == "high_value_region" && value == "true") {
            score *= 1.3;
        }
        if (key == "mobile" && value == "true") {
            score *= 1.2;
        }
    }
    
    return score;
}

