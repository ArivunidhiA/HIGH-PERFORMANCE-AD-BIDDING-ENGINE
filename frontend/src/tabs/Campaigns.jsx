import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import GlassCard from '../components/ui/GlassCard';
import { Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

export default function Campaigns() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/v1/campaigns');
        return response.data;
      } catch (error) {
        // Return mock data if API fails
        return [
          { id: 1, name: 'Summer Campaign', status: 'active', spent: 5000, budget: 10000 },
          { id: 2, name: 'Holiday Special', status: 'active', spent: 2500, budget: 5000 },
          { id: 3, name: 'Product Launch', status: 'paused', spent: 1500, budget: 8000 },
        ];
      }
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black mb-4 text-blue-600" style={{ textShadow: '0 0 20px rgba(37, 99, 235, 0.6), 0 0 40px rgba(37, 99, 235, 0.3)' }}>
            Campaigns
          </h1>
          <p className="text-gray-700 text-lg font-bold">Manage your ad campaigns</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 border-2 border-blue-500 text-gray-900 rounded-lg font-black hover:bg-blue-200 transition-colors shadow-lg"
          style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}
        >
          <Plus className="w-4 h-4" />
          Create Campaign
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-600 font-bold">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns?.map((campaign) => (
            <GlassCard key={campaign.id}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-black text-gray-800">{campaign.name}</h3>
                  <p className="text-sm text-gray-600 font-bold">{campaign.status}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-bold">Budget</span>
                  <span className="text-gray-800 font-black">
                    ${campaign.spent?.toFixed(2)} / ${campaign.budget?.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${((campaign.spent || 0) / (campaign.budget || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
