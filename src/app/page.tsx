import Link from 'next/link'
import { Briefcase, MapPin, Users, Star, ArrowRight, Phone, Mail, MessageSquare, ShieldCheck, Clock8 } from 'lucide-react'
import { MouseTrail } from '@/components/MouseTrail'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-600 relative overflow-x-hidden">

      {/* Navigation */}
      <header className="fixed top-0 w-full p-6 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-2xl font-black tracking-tight text-slate-900">
            Kamgar<span className="text-blue-600">Connect</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end">
            <Link href="/login" className="text-sm font-semibold hover:text-blue-600 px-4 py-2 transition-colors text-slate-700">
              Log in
            </Link>
            <Link href="/register" className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="about" className="pt-48 pb-20 px-4 relative z-10 w-full overflow-hidden bg-white/40">
        <MouseTrail />
        <div className="max-w-4xl mx-auto text-center relative z-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-8 shadow-sm">
            <SparkleIcon className="w-4 h-4" />
            Empowering verified professionals locally
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
            Quality talent, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              on demand.
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect instantly with trusted, highly-rated professionals for your home, office, or specialized tasks safely and securely.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
              Find a Professional <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/register" className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-full font-bold hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm">
              Join as a Worker
            </Link>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="max-w-5xl mx-auto mt-24 bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/80 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-200">
          <div>
            <div className="text-4xl font-black text-slate-900 mb-1">10k+</div>
            <div className="text-sm font-semibold text-slate-500">Active Workers</div>
          </div>
          <div>
            <div className="text-4xl font-black text-slate-900 mb-1">4.9/5</div>
            <div className="text-sm font-semibold text-slate-500">Average Rating</div>
          </div>
          <div>
            <div className="text-4xl font-black text-slate-900 mb-1">50+</div>
            <div className="text-sm font-semibold text-slate-500">Service Categories</div>
          </div>
          <div>
            <div className="text-4xl font-black text-slate-900 mb-1">100%</div>
            <div className="text-sm font-semibold text-slate-500">Verified Profiles</div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-4 relative z-10 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Expert Services Directory</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Everything you need, handled by specialists.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Briefcase, title: 'Skilled Trades', desc: 'Expert electricians, plumbers, and carpenters for complex setups.' },
              { icon: Users, title: 'General Labor', desc: 'Reliable muscle for moving, cleaning, and construction support.' },
              { icon: MapPin, title: 'Local Providers', desc: 'Professionals living right in your neighborhood for rapid dispatch.' },
              { icon: ShieldCheck, title: 'Verified Security', desc: 'Every worker undergoes thorough background checks.' },
              { icon: Clock8, title: 'On-Demand Setup', desc: 'Schedule standard tasks instantly using our smart matching engine.' },
              { icon: Star, title: 'Premium Quality', desc: 'Satisfaction guaranteed by our top-rated veteran workers.' },
            ].map((service, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-slate-200 hover:border-blue-400 transition-all hover:shadow-xl group">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 shadow-inner group-hover:scale-110 transition-transform">
                  <service.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm font-medium">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 relative z-10 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How KamgarConnect Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">A seamless experience from posting a job to payment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative text-center">
            {/* Desktop connecting line */}
            <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-[3px] bg-slate-200" />

            {[
              { step: '01', title: 'Post a detailed Job', desc: 'Specify task size, time, and budget. Our form guides you.' },
              { step: '02', title: 'Review Proposals', desc: 'Get competitive offers from available, interested professionals.' },
              { step: '03', title: 'Hire & Relax', desc: 'Track progress securely and enjoy a job beautifully done.' },
            ].map((item, i) => (
              <div key={i} className="relative z-10">
                <div className="w-24 h-24 mx-auto bg-slate-900 border-8 border-white rounded-full flex items-center justify-center text-3xl font-black text-white mb-6 shadow-xl">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 font-medium px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback and Contact Us */}
      <section id="contact" className="py-24 px-4 relative z-10 w-full mb-10">
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[3rem] p-12 md:p-16 shadow-2xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">We&apos;re here to help</h2>
            <p className="text-lg text-slate-600">Get in touch with our dedicated support team.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Connect Directly</h3>
              <div className="flex items-center gap-5 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer group">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200 group-hover:bg-blue-50 transition-colors">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 drop-shadow-sm">Email Us</h4>
                  <p className="font-medium text-slate-500">support@kamgarconnect.com</p>
                </div>
              </div>
              <div className="flex items-center gap-5 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer group">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200 group-hover:bg-blue-50 transition-colors">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 drop-shadow-sm">Call Center</h4>
                  <p className="font-medium text-slate-500">+91 1800-123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-5 text-slate-700 group">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200 group-hover:bg-blue-50 transition-colors">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 drop-shadow-sm">Headquarters</h4>
                  <p className="font-medium text-slate-500">Mumbai IT Park, Phase 2<br />Maharashtra, India</p>
                </div>
              </div>
            </div>

            <div>
              <form className="space-y-5">
                <div>
                  <input type="text" className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium placeholder-slate-400" placeholder="Your Name" />
                </div>
                <div>
                  <input type="email" className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium placeholder-slate-400" placeholder="Email Address" />
                </div>
                <div>
                  <textarea className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium placeholder-slate-400 min-h-[140px]" placeholder="How can we assist you?"></textarea>
                </div>
                <button type="button" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 text-center text-slate-400 text-sm font-medium relative z-10 w-full border-t border-slate-800">
        <p>&copy; {new Date().getFullYear()} KamgarConnect. Built with Next.js & Supabase.</p>
      </footer>
    </div>
  )
}

function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  )
}
