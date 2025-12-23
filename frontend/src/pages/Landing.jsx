import { Link } from 'react-router-dom';
import { Gift, TrendingUp, Award, Smartphone, ShoppingBag, Users } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/images/bango-PrA-150x150.png" 
                alt="BangoPoints" 
                className="h-10 w-10"
              />
              <span className="text-2xl font-bold text-white">BangoPoints</span>
            </Link>

            {/* Auth Links - Top Right */}
            <div className="flex items-center space-x-4">
              <Link 
                to="/auth/login" 
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                Login
              </Link>
              <Link 
                to="/auth/register" 
                className="px-6 py-2 bg-gradient-to-r from-silver-500 to-silver-600 text-gray-900 font-semibold rounded-lg hover:from-silver-400 hover:to-silver-500 transition-all duration-200 shadow-lg shadow-silver-500/50"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Earn <span className="text-transparent bg-clip-text bg-gradient-to-r from-silver-400 to-silver-200">Rewards</span> 
            <br />Every Time You Shop
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join Kenya's leading loyalty platform and transform your shopping into valuable rewards
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/auth/register" 
              className="px-8 py-4 bg-gradient-to-r from-silver-500 to-silver-600 text-gray-900 text-lg font-bold rounded-lg hover:from-silver-400 hover:to-silver-500 transition-all duration-200 shadow-2xl shadow-silver-500/50 transform hover:scale-105"
            >
              Get Started Free
            </Link>
            <a 
              href="#features" 
              className="px-8 py-4 border-2 border-silver-500 text-silver-300 text-lg font-semibold rounded-lg hover:bg-silver-500/10 transition-all duration-200"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-silver-400 mb-2">50+</div>
              <div className="text-gray-400">Partner Brands</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-silver-400 mb-2">10K+</div>
              <div className="text-gray-400">Active Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-silver-400 mb-2">16</div>
              <div className="text-gray-400">Store Locations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-silver-400 mb-2">1M+</div>
              <div className="text-gray-400">Points Awarded</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Three simple steps to start earning rewards
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-silver-500 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-silver-500 to-silver-600 rounded-xl flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">1. Shop</h3>
              <p className="text-gray-400">
                Purchase your favorite brands at any of our partner stores across Kenya
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-silver-500 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-silver-500 to-silver-600 rounded-xl flex items-center justify-center mb-6">
                <Smartphone className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">2. Snap</h3>
              <p className="text-gray-400">
                Take a photo of your receipt using our mobile app or upload it on the web
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-silver-500 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-silver-500 to-silver-600 rounded-xl flex items-center justify-center mb-6">
                <Gift className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">3. Earn</h3>
              <p className="text-gray-400">
                Collect points automatically and redeem them for airtime, data, or shopping vouchers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose BangoPoints?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
              <TrendingUp className="w-6 h-6 text-silver-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Progressive Tiers</h3>
                <p className="text-gray-400">Unlock Bronze, Silver, and Gold tiers for bonus multipliers</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
              <Award className="w-6 h-6 text-silver-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Instant Rewards</h3>
                <p className="text-gray-400">Redeem points immediately for airtime, data, and vouchers</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
              <Users className="w-6 h-6 text-silver-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Trusted by Thousands</h3>
                <p className="text-gray-400">Join over 10,000 satisfied members across Kenya</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
              <Smartphone className="w-6 h-6 text-silver-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Mobile First</h3>
                <p className="text-gray-400">Easy receipt capture with camera and OCR technology</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
              <Gift className="w-6 h-6 text-silver-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Multiple Brands</h3>
                <p className="text-gray-400">Earn from 50+ popular Kenyan brands you already buy</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
              <ShoppingBag className="w-6 h-6 text-silver-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Wide Coverage</h3>
                <p className="text-gray-400">Available at major stores: Carrefour, Naivas, Quickmart & more</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of Kenyans who are already earning rewards on every purchase
          </p>
          <Link 
            to="/auth/register" 
            className="inline-block px-10 py-4 bg-gradient-to-r from-silver-500 to-silver-600 text-gray-900 text-lg font-bold rounded-lg hover:from-silver-400 hover:to-silver-500 transition-all duration-200 shadow-2xl shadow-silver-500/50 transform hover:scale-105"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/images/bango-PrA-150x150.png" 
                  alt="BangoPoints" 
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold text-white">BangoPoints</span>
              </div>
              <p className="text-gray-400 text-sm">
                Kenya's leading loyalty rewards platform
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/auth/login" className="hover:text-silver-400">Login</Link></li>
                <li><Link to="/auth/register" className="hover:text-silver-400">Sign Up</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-silver-400">About Us</a></li>
                <li><a href="#" className="hover:text-silver-400">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-silver-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-silver-400">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 BangoPoints. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
