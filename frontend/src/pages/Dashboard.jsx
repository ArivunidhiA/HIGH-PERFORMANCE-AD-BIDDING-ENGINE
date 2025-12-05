import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import Overview from '../tabs/Overview';
import LiveBidding from '../tabs/LiveBidding';
import Architecture from '../tabs/Architecture';
import Analytics from '../tabs/Analytics';
import Campaigns from '../tabs/Campaigns';
import Settings from '../tabs/Settings';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8 relative">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/live-bidding" element={<LiveBidding />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
