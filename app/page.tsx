"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/ui/button"
import { 
  Shield, 
  Smartphone, 
  Users, 
  Building, 
  CheckCircle, 
  ArrowRight,
  Star,
  Zap,
  Globe,
  Lock,
  Smartphone as PhoneIcon,
  Monitor,
  Tablet
} from "lucide-react"

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [statsCounts, setStatsCounts] = useState([0, 0, 0, 0])

  useEffect(() => {
    setIsVisible(true)
    
    // Animate stats counters
    const animateCounters = () => {
      const targets = [10000, 500, 99.9, 24]
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps
      
      let step = 0
      const timer = setInterval(() => {
        step++
        setStatsCounts(targets.map(target => {
          const progress = step / steps
          const easeOut = 1 - Math.pow(1 - progress, 3)
          return Math.floor(target * easeOut)
        }))
        
        if (step >= steps) {
          clearInterval(timer)
          setStatsCounts(targets)
        }
      }, stepDuration)
    }
    
    const timer = setTimeout(animateCounters, 1000)
    return () => clearTimeout(timer)
  }, [])

  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Advanced security protocols with end-to-end encryption",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100"
    },
    {
      icon: Smartphone,
      title: "Device Management",
      description: "Complete control over Android devices and applications",
      color: "text-green-500",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100"
    },
    {
      icon: Users,
      title: "User Management",
      description: "Streamlined user onboarding and role-based access",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100"
    },
    {
      icon: Building,
      title: "Enterprise Ready",
      description: "Scalable solution for organizations of any size",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      hoverColor: "hover:bg-orange-100"
    }
  ]

  const stats = [
    { number: statsCounts[0] >= 1000 ? `${(statsCounts[0]/1000).toFixed(0)}K+` : `${statsCounts[0]}+`, label: "Devices Managed" },
    { number: `${statsCounts[1]}+`, label: "Enterprises" },
    { number: `${statsCounts[2]}%`, label: "Uptime" },
    { number: `${statsCounts[3]}/7`, label: "Support" }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "IT Director",
      company: "TechCorp",
      content: "AMAPI transformed our device management. The interface is intuitive and the security features are top-notch.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "CTO",
      company: "StartupXYZ",
      content: "Best investment we made for our mobile infrastructure. Setup was seamless and support is excellent.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Security Manager",
      company: "FinanceFirst",
      content: "The security compliance features saved us months of manual work. Highly recommended!",
      rating: 5
    }
  ]

    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-primary-600">AMAPI</span>
                <p className="text-xs text-slate-500">Management Hub</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-600 hover:text-primary-600">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200/30 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-200/30 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-green-200/30 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full text-sm font-medium mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Zap className="w-4 h-4 animate-pulse" />
              Trusted by 500+ Enterprises
            </div>
            
            <h1 className={`text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Manage Android Devices
              <span className="block bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent animate-gradient-x">
                Like Never Before
              </span>
            </h1>
            
            <p className={`text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              AMAPI provides enterprise-grade Android device management with advanced security, 
              seamless deployment, and comprehensive monitoring capabilities.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Link href="/register">
                <Button size="lg" className="bg-primary-500 hover:bg-primary-600 text-white shadow-xl px-8 py-4 text-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="ghost" className="border-2 border-primary-200 text-primary-600 hover:bg-primary-50 px-8 py-4 text-lg transform hover:scale-105 transition-all duration-300">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className={`relative max-w-6xl mx-auto transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Mobile Devices Card */}
              <div className={`group relative bg-white rounded-3xl p-8 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: '900ms'}}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <PhoneIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    Mobile Devices
                  </h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    Comprehensive management for smartphones and tablets with advanced security protocols
                  </p>
                  <div className="flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300"></div>
              </div>

              {/* Kiosk Mode Card */}
              <div className={`group relative bg-white rounded-3xl p-8 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: '1100ms'}}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <Monitor className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
                    Kiosk Mode
                  </h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    Transform devices into dedicated digital signage and interactive kiosks
                  </p>
                  <div className="flex items-center text-green-600 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300"></div>
              </div>

              {/* Point of Sale Card */}
              <div className={`group relative bg-white rounded-3xl p-8 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: '1300ms'}}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <Tablet className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                    Point of Sale
                  </h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    Complete retail solutions with secure payment processing and inventory management
                  </p>
                  <div className="flex items-center text-purple-600 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-3 h-3 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Manage Devices
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful features designed to simplify device management and enhance security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 hover:transform hover:scale-105 hover:-translate-y-2 ${feature.hoverColor} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{transitionDelay: `${index * 100}ms`}}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color} group-hover:animate-pulse`} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                  {feature.description}
                </p>
                {hoveredFeature === index && (
                  <div className="absolute top-4 right-4 animate-bounce">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                )}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary-500 to-purple-500 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className={`text-white transform transition-all duration-1000 hover:scale-110 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: `${index * 200}ms`}}>
                <div className="text-4xl md:text-5xl font-bold mb-2 animate-pulse">
                  {stat.number}
                </div>
                <div className="text-primary-100 text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-slate-600">
              See what our customers have to say about AMAPI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl hover:shadow-primary-200/50 transition-all duration-500 hover:transform hover:scale-105 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay: `${index * 150}ms`}}>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current animate-pulse" style={{animationDelay: `${i * 100}ms`}} />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-semibold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-500">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary-500/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-500/10 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-500/10 rounded-full animate-float"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className={`text-4xl font-bold text-white mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Ready to Transform Your Device Management?
          </h2>
          <p className={`text-xl text-slate-300 mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Join thousands of enterprises already using AMAPI to streamline their Android device management
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link href="/register">
              <Button size="lg" className="bg-primary-500 hover:bg-primary-600 text-white shadow-xl px-8 py-4 text-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl animate-shimmer">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="ghost" className="border-2 border-white/20 px-8 py-4 text-lg transform hover:scale-105 transition-all duration-300 hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className={`flex items-center gap-3 mb-6 md:mb-0 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-white">AMAPI</span>
                <p className="text-xs text-slate-400">Management Hub</p>
              </div>
            </div>
            
            <div className={`text-center md:text-right transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <p className="text-slate-400 text-sm">
                © 2024 AMAPI. All rights reserved.
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Made with ❤️ for enterprise teams
              </p>
            </div>
          </div>
        </div>
      </footer>
      </div>
    )
}