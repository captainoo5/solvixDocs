import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield, Sparkles, Check, ArrowRight, Zap, RefreshCcw } from 'lucide-react';

export const Landing = () => {
  const features = [
    {
      title: 'Instant PDF Generation',
      description: 'Generate client-ready PDF quotes and receipts in a single click. No formatting delays.',
      icon: Zap,
      color: 'text-orange bg-orange/10',
    },
    {
      title: 'Custom Branding',
      description: 'Upload your logo, set your phone numbers, and display payment QR codes instantly.',
      icon: Sparkles,
      color: 'text-green-600 bg-green-50',
    },
    {
      title: 'Secure Document History',
      description: 'Save, filter, search, and recall every invoice and receipt generated for your clients.',
      icon: Shield,
      color: 'text-blue-600 bg-blue-50',
    },
  ];

  const steps = [
    { num: '01', title: 'Register Account', desc: 'Sign up in under 60 seconds with your email.' },
    { num: '02', title: 'Add Business Info', desc: 'Enter address, banking info, and upload your logo.' },
    { num: '03', title: 'Input Client Details', desc: 'Add items and price details. Totals calculate instantly.' },
    { num: '04', title: 'Download PDF', desc: 'Get clean, professionally styled documents instantly.' },
  ];

  const plans = [
    {
      name: 'Free Plan',
      price: '₦0',
      period: 'forever',
      desc: 'Perfect for single-proprietor business testing.',
      features: ['Up to 5 documents / month', 'Classic document template', 'Standard PDF downloads'],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Starter Pro',
      price: '₦5,000',
      period: 'month',
      desc: 'Ideal for growing local shops and service firms.',
      features: ['Unlimited documents', 'All 4 premium templates', 'Custom logo uploads', 'Payment QR code integration', 'Priority email support'],
      cta: 'Choose Pro (Deferred)',
      popular: true,
    },
    {
      name: 'Business Pro',
      price: '₦12,500',
      period: 'month',
      desc: 'For small enterprise teams and logistics hubs.',
      features: ['Everything in Starter Pro', 'Custom document serial formats', 'Pre-filled recurring client directory', '24/7 dedicated telephone support'],
      cta: 'Choose Business (Deferred)',
      popular: false,
    },
  ];

  const templates = [
    {
      id: 'classic',
      name: 'Classic Layout',
      desc: 'Based on formal corporate structures with double borders and bold headers.',
      colors: 'from-orange/20 to-orange/5 border-orange',
      badge: 'Popular',
    },
    {
      id: 'modern',
      name: 'Modern Accent',
      desc: 'Features a sleek vertical orange left-border strip with light gray row cards.',
      colors: 'from-blue-50 to-blue-100/50 border-blue-500',
      badge: 'Premium',
    },
    {
      id: 'bold',
      name: 'Corporate Bold',
      desc: 'Features a solid navy horizontal header band with high contrast grids.',
      colors: 'from-navy/10 to-navy/5 border-navy',
      badge: 'Formal',
    },
    {
      id: 'minimal',
      name: 'Scandinavian Minimalist',
      desc: 'Clean typographic layout with subtle gray rule lines and colored totals.',
      colors: 'from-slate-100 to-slate-200/50 border-slate-400',
      badge: 'Sleek',
    },
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="sticky top-0 bg-white border-b border-[#E0E0E0] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-black text-navy tracking-tight">
              Solvix<span className="text-orange">Docs</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-orange transition-colors">Features</a>
            <a href="#templates" className="hover:text-orange transition-colors">Templates</a>
            <a href="#pricing" className="hover:text-orange transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-navy hover:text-orange transition-colors">
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-orange hover:bg-orange-dark text-white px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 shadow-sm"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-navy text-white py-20 lg:py-28 overflow-hidden">
        {/* Decorative Grid Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,123,0,0.15),transparent)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange/20 text-orange border border-orange/20 mb-6 uppercase tracking-wider animate-pulse">
            <Sparkles size={12} />
            Professional Documents. Zero Design Skills.
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Create Professional Invoices & Quotations in <span className="text-orange">Minutes</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto font-medium">
            Designed specifically for African SMEs. Instant PDF generation, bank details rendering, custom branding, and automatic number sequencing.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-orange hover:bg-orange-dark text-white px-8 py-4 rounded-lg text-base font-bold transition-all duration-150 hover:shadow-lg flex items-center justify-center gap-2 group"
            >
              Start Creating Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#templates"
              className="border border-white/20 hover:border-white bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-lg text-base font-bold transition-all duration-150 flex items-center justify-center"
            >
              See Templates
            </a>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50 border-b border-[#E0E0E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-black text-navy tracking-tight">
              Streamline Your Small Business Workflows
            </h2>
            <p className="mt-4 text-base text-slate-500 font-medium">
              Eliminate manually designed Word documents. SolvixDocs automates document creation, layouts, numbering, and currency translations in seconds.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="bg-white p-8 rounded-2xl border border-[#E0E0E0] shadow-sm hover:shadow-md transition-all duration-200">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feat.color}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3">{feat.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 border-b border-[#E0E0E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-black text-navy tracking-tight">
              How It Works
            </h2>
            <p className="mt-4 text-base text-slate-500 font-medium">
              Zero learning curve. Follow four simple steps to professional billing.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="relative group">
                <div className="bg-slate-50 border border-[#E0E0E0] p-6 rounded-2xl h-full flex flex-col hover:border-orange/30 transition-colors">
                  <span className="text-3xl font-black text-orange/30 group-hover:text-orange transition-colors">
                    {step.num}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-navy">{step.title}</h3>
                  <p className="mt-2 text-slate-500 text-xs leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview Section */}
      <section id="templates" className="py-20 bg-slate-50 border-b border-[#E0E0E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-navy tracking-tight">
              Beautiful, Industry-Standard Templates
            </h2>
            <p className="mt-4 text-base text-slate-500 font-medium">
              Switch layouts instantly without re-typing any customer invoice details. Your business logo, banking fields, and amounts translate seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((temp) => (
              <div key={temp.id} className="bg-white border border-[#E0E0E0] rounded-xl overflow-hidden shadow-sm flex flex-col justify-between h-full group hover:border-orange/20 transition-all duration-200">
                {/* Visual representation of document style */}
                <div className={`h-40 bg-gradient-to-br ${temp.colors} p-4 flex flex-col justify-between relative`}>
                  <span className="absolute top-2 right-2 bg-navy text-white text-xxs font-bold px-2 py-0.5 rounded-full">
                    {temp.badge}
                  </span>
                  
                  {/* Decorative Document Structure mockup */}
                  <div className="space-y-1.5 opacity-60 mt-4">
                    <div className="h-3 w-16 bg-navy rounded"></div>
                    <div className="h-2 w-32 bg-slate-400 rounded"></div>
                    <div className="h-6 w-full bg-white rounded border border-slate-300 mt-2 flex items-center justify-between px-2">
                      <div className="h-1.5 w-10 bg-slate-300 rounded"></div>
                      <div className="h-1.5 w-6 bg-orange rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="p-5 border-t border-[#E0E0E0] flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-navy text-base">{temp.name}</h3>
                    <p className="text-slate-500 text-xs mt-2 font-medium leading-relaxed">
                      {temp.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-black text-navy tracking-tight">
              Transparent, Simple Plans
            </h2>
            <p className="mt-4 text-base text-slate-500 font-medium">
              Start for free. Upgrade to Pro when you need unlimited documents and all templates. (Self-serve billing is deferred for MVP).
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white border rounded-2xl p-8 flex flex-col justify-between relative shadow-sm hover:shadow-md transition-shadow ${
                  plan.popular ? 'border-orange ring-2 ring-orange/10' : 'border-[#E0E0E0]'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-bold text-navy">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 font-medium">{plan.desc}</p>
                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl font-black text-navy tracking-tight">{plan.price}</span>
                    <span className="text-sm font-semibold text-slate-500 ml-1">/{plan.period}</span>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold">
                        <Check size={16} className="text-orange shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8">
                  <Link
                    to={plan.price === '₦0' ? '/register' : '/register'}
                    className={`w-full block text-center py-3 px-4 rounded-lg text-sm font-bold transition-all duration-150 ${
                      plan.popular
                        ? 'bg-orange hover:bg-orange-dark text-white shadow-sm'
                        : 'bg-navy hover:bg-navy-dark text-white'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-navy text-white py-12 mt-auto border-t border-navy-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="text-2xl font-black tracking-tight">
              Solvix<span className="text-orange">Docs</span>
            </span>
            <p className="mt-2 text-xs text-slate-400 font-medium">
              Professional Documents. Zero Design Skills.
            </p>
          </div>
          <div className="flex gap-8 text-xs text-slate-400 font-medium">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#templates" className="hover:text-white transition-colors">Templates</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            &copy; 2026 SolvixDocs. A product of Solvix Innovations.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
