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
      const response = await axios.get('/api/v1/campaigns');
      return response.data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Campaigns
          </h1>
          <p className="text-text-secondary">Manage your ad campaigns</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          Create Campaign
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-text-secondary">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns?.map((campaign) => (
            <GlassCard key={campaign.id}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{campaign.name}</h3>
                  <p className="text-sm text-text-secondary">{campaign.status}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-surface-light rounded-lg">
                    <Edit className="w-4 h-4 text-text-secondary" />
                  </button>
                  <button className="p-2 hover:bg-surface-light rounded-lg">
                    <Trash2 className="w-4 h-4 text-error" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Budget</span>
                  <span className="text-text-primary">
                    ${campaign.spent?.toFixed(2)} / ${campaign.budget?.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-surface-light rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
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

