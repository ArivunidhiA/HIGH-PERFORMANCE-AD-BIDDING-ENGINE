import { motion } from 'framer-motion';
import { ArrowRight, Zap, Activity, Shield, TrendingUp, Code, Database, Network, BarChart3, CheckCircle, Play, Users, Building2, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Code,
      title: 'C++17 Core Engine',
      description: 'SIMD & lock-free queues for ultra low-latency bidding with sub-5ms decision time',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Activity,
      title: 'Real-Time Dashboard',
      description: 'WebSocket-powered live updates showing bid metrics, latency, and system health',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Network,
      title: 'Microservices Architecture',
      description: 'Scalable, production-ready infrastructure with Docker orchestration',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: BarChart3,
      title: 'Monitoring & Observability',
      description: 'Comprehensive metrics, alerting, and Grafana dashboards for enterprise operations',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const useCases = [
    {
      icon: Building2,
      title: 'Ad Networks',
      pain: 'Need to process millions of bids with sub-10ms latency',
      solution: 'Our C++ engine handles 100K+ bids/sec with consistent performance',
    },
    {
      icon: Rocket,
      title: 'DSPs (Demand-Side Platforms)',
      pain: 'Real-time bidding requires zero-downtime and high availability',
      solution: '99.99% uptime with circuit breakers and auto-scaling infrastructure',
    },
    {
      icon: Users,
      title: 'Agencies & Ad Ops Teams',
      pain: 'Need visibility into campaign performance and bid outcomes',
      solution: 'Live dashboard with real-time metrics, analytics, and campaign management',
    },
  ];

  const metrics = [
    { value: '100K+', label: 'Bids/Second', icon: Zap },
    { value: 'Sub-5ms', label: 'Decision Latency', icon: Activity },
    { value: '99.99%', label: 'Uptime SLA', icon: Shield },
    { value: 'Docker', label: 'Microservices', icon: Network },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BidEngine</span>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center gap-2"
          >
            View Dashboard
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-700">Production-Ready SaaS Platform</span>
              </motion.div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                High-Performance Ad Bidding Engine for{' '}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Enterprise Advertisers
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Real-time bidding platform with C++17 core engine, processing 100K+ bids/second with sub-5ms latency. Built for ad networks, DSPs, and agencies who demand enterprise-grade performance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold text-lg shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  See It in Action
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all"
                >
                  Request Demo
                </motion.button>
              </div>

              {/* Metrics */}
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="bg-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="ml-4 text-gray-400 text-sm">BidEngine Dashboard</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                  {/* Mock metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Requests/sec</div>
                      <div className="text-2xl font-bold text-cyan-400">847</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">P99 Latency</div>
                      <div className="text-2xl font-bold text-purple-400">8.3ms</div>
                    </div>
                  </div>
                  {/* Mock chart */}
                  <div className="h-32 bg-gradient-to-t from-blue-900/50 to-transparent rounded-lg flex items-end justify-around p-2">
                    {[60, 75, 80, 70, 85, 90, 75].map((height, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t w-8"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Live updates via WebSocket</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Enterprise-Grade Capabilities</h2>
            <p className="text-xl text-gray-600">Built for high-traffic, latency-sensitive ad bidding at scale</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-xl transition-all group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Scalable microservices architecture designed for performance</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Architecture Diagram */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200"
            >
              <div className="space-y-6">
                {/* Load Balancer */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Network className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">NGINX Load Balancer</div>
                    <div className="text-sm text-gray-600">Routes requests, handles SSL, rate limiting</div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />
                </div>
                {/* API Gateway */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Node.js API Gateway</div>
                    <div className="text-sm text-gray-600">WebSocket server, authentication, Redis caching</div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />
                </div>
                {/* C++ Engine */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">C++ Bidding Engine</div>
                    <div className="text-sm text-gray-600">Lock-free queues, SIMD, {'<5ms'} latency</div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />
                </div>
                {/* Data Layer */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">PostgreSQL + Redis</div>
                    <div className="text-sm text-gray-600">Persistent storage & high-speed caching</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Explanation */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">High-Level Flow</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p><strong>Bid Request</strong> arrives at load balancer, distributed across API gateway instances</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p><strong>API Gateway</strong> checks Redis cache, authenticates, then forwards to C++ engine via TCP</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p><strong>C++ Engine</strong> processes bid in {'<5ms'} using lock-free queues and SIMD optimizations</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p><strong>Response</strong> cached in Redis, stored in PostgreSQL, and pushed to dashboard via WebSocket</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built For</h2>
            <p className="text-xl text-gray-600">Designed for teams who need real-time performance at scale</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-500 hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <useCase.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
                <div className="space-y-2">
                  <p className="text-sm text-red-600 font-medium">Pain: {useCase.pain}</p>
                  <p className="text-gray-700">Solution: {useCase.solution}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Metrics */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Performance Benchmarks</h2>
            <p className="text-xl text-blue-100">Enterprise-grade metrics you can count on</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: '100K+', label: 'Bids/Second', desc: 'Sustained throughput' },
              { value: 'Sub-5ms', label: 'P99 Latency', desc: 'Decision time' },
              { value: '99.99%', label: 'Uptime SLA', desc: 'Availability guarantee' },
              { value: 'Docker', label: 'Microservices', desc: 'Scalable architecture' },
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <div className="text-4xl font-bold mb-2">{metric.value}</div>
                <div className="text-lg font-semibold mb-1">{metric.label}</div>
                <div className="text-sm text-blue-100">{metric.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to See It in Action?</h2>
            <p className="text-xl text-gray-600 mb-8">Explore the live dashboard and experience real-time bidding performance</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold text-lg shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                View Live Dashboard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all"
              >
                Request Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">BidEngine</span>
          </div>
          <p className="text-sm">High-Performance Ad Bidding Engine • Production-Ready SaaS Platform</p>
        </div>
      </footer>
    </div>
  );
}

