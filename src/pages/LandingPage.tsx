import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  BarChart3, 
  Package, 
  CreditCard, 
  TrendingUp, 
  MessageCircle,
  Receipt,
  Zap,
  CheckCircle2,
  Store,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Business Analytics',
    description: 'Get real-time insights into your business performance with detailed analytics and reporting.',
  },
  {
    icon: Package,
    title: 'Inventory Management',
    description: 'Track your stock levels, manage orders, and automate reordering processes.',
  },
  {
    icon: CreditCard,
    title: 'Payment Processing',
    description: 'Accept payments through M-Pesa and other popular payment methods in Kenya.',
  },
  {
    icon: TrendingUp,
    title: 'Growth Tools',
    description: 'Access tools and insights to help grow your business and increase revenue.',
  },
];

const pricingPlans = [
  {
    name: 'Pro',
    price: '500',
    description: 'Best for small businesses starting out.',
    features: [
      '500 WhatsApp messages per month',
      '200 payment STK pushes per month',
      '100 payment links per month',
      'Basic analytics',
      'Email support',
      '2 team members'
    ]
  },
  {
    name: 'Enterprise',
    price: '850',
    description: 'Designed for growing businesses with higher needs.',
    features: [
      '1,500 WhatsApp messages per month',
      '750 payment STK pushes per month',
      '500 payment links per month',
      'Advanced analytics',
      'Priority support',
      '5 team members'
    ],
    popular: true
  },
  {
    name: 'Enterprise Pro',
    price: '1,500',
    description: 'Ideal for businesses requiring unlimited access.',
    features: [
      'Unlimited WhatsApp messages',
      'Unlimited payment STK pushes',
      'Unlimited payment links',
      'Custom analytics',
      '24/7 dedicated support',
      'Unlimited team members'
    ]
  }
];

const testimonials = [
  {
    quote: "GigMan has transformed how I run my shop. The inventory management is a game-changer!",
    author: "Sarah Njeri",
    role: "Shop Owner, Nairobi",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100"
  },
  {
    quote: "Since using GigMan, I've seen a 40% increase in my daily sales. It's amazing!",
    author: "James Omondi",
    role: "Market Vendor",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100"
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative isolate">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-blue-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="pt-32 sm:pt-40 lg:pt-48 pb-24 text-center">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-gray-900 sm:text-7xl">
            Run your business{' '}
            <span className="relative whitespace-nowrap text-primary">
              <span className="relative">smarter</span>
            </span>
            {' '}with GigMan
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            The all-in-one platform for small businesses in Kenya to manage inventory, 
            track sales, and grow their customer base.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <Link
              to="/register"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Get started for free
            </Link>
            <a
              href="#features"
              className="rounded-lg px-6 py-3 text-sm font-semibold text-gray-900 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to run your business</h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful tools to help you manage and grow your business efficiently.
            </p>
          </div>
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="relative flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-3 bg-primary/10 rounded-xl">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Simple, transparent pricing</h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose the plan that best fits your business needs
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl ${
                  plan.popular 
                    ? 'border-2 border-primary shadow-lg' 
                    : 'border border-gray-200 shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  <p className="mt-2 text-gray-600">{plan.description}</p>
                  <p className="mt-6">
                    <span className="text-4xl font-bold text-gray-900">KES {plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </p>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="ml-3 text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/register"
                    className={`mt-8 block w-full rounded-lg px-4 py-2 text-center text-sm font-semibold ${
                      plan.popular
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                  >
                    Get started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Loved by businesses across Kenya</h2>
            <p className="mt-4 text-lg text-gray-600">
              Here's what our customers have to say about GigMan
            </p>
          </div>
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {testimonials.map((testimonial) => (
              <div key={testimonial.author} className="bg-white p-8 rounded-2xl shadow-sm">
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <Store className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold">GigMan</span>
              </div>
              <p className="mt-4 text-gray-400">
                Empowering small businesses with modern tools for growth and success.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Product</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white">Testimonials</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Support</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 GigMan. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}