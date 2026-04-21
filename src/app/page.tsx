import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, ShieldCheck, Clock, Zap, Phone, Mail, MapPin, ChevronRight, CheckCircle2, BadgeCheck, Users, TrendingUp } from 'lucide-react'
import { MouseTrail } from '@/components/MouseTrail'

const services = [
  {
    emoji: '⚡', title: 'Electrician', desc: 'Wiring, fuse box, installations',
    color: 'from-yellow-500/15 to-amber-500/5', border: 'border-yellow-500/20',
    hover: 'hover:border-yellow-400/40', tag: 'Most Booked', tagColor: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    img: '/images/service_electrician.png',
  },
  {
    emoji: '🔧', title: 'Plumber', desc: 'Pipes, leaks, drainage repair',
    color: 'from-blue-500/15 to-cyan-500/5', border: 'border-blue-500/20',
    hover: 'hover:border-blue-400/40', tag: '', tagColor: '',
    img: '/images/service_plumber.png',
  },
  {
    emoji: '🪚', title: 'Carpenter', desc: 'Furniture, doors & woodwork',
    color: 'from-orange-500/15 to-amber-500/5', border: 'border-orange-500/20',
    hover: 'hover:border-orange-400/40', tag: '', tagColor: '',
    img: '/images/service_carpenter.png',
  },
  {
    emoji: '🎨', title: 'Painter', desc: 'Interior, exterior, waterproof',
    color: 'from-purple-500/15 to-pink-500/5', border: 'border-purple-500/20',
    hover: 'hover:border-purple-400/40', tag: '', tagColor: '',
    img: '/images/service_painter.png',
  },
  {
    emoji: '🧱', title: 'Mason', desc: 'Tiles, walls, construction',
    color: 'from-stone-500/15 to-slate-500/5', border: 'border-stone-500/20',
    hover: 'hover:border-stone-400/40', tag: '', tagColor: '',
    img: '/images/service_mason.png',
  },
  {
    emoji: '🧹', title: 'Cleaner', desc: 'Deep cleaning, maid services',
    color: 'from-teal-500/15 to-green-500/5', border: 'border-teal-500/20',
    hover: 'hover:border-teal-400/40', tag: 'Popular', tagColor: 'bg-teal-500/15 text-teal-400 border-teal-500/20',
    img: '/images/service_cleaner.png',
  },
  {
    emoji: '🚗', title: 'Driver', desc: 'Personal, goods, chauffeur',
    color: 'from-indigo-500/15 to-violet-500/5', border: 'border-indigo-500/20',
    hover: 'hover:border-indigo-400/40', tag: '', tagColor: '',
    img: '/images/service_driver.png',
  },
  {
    emoji: '🔌', title: 'Technician', desc: 'AC, appliances, electronics',
    color: 'from-emerald-500/15 to-cyan-500/5', border: 'border-emerald-500/20',
    hover: 'hover:border-emerald-400/40', tag: 'Fast Response', tagColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    img: '/images/service_technician.png',
  },
]

const testimonials = [
  {
    name: 'Priya Sharma', role: 'Homeowner, Pune', rating: 5, initials: 'PS', color: 'from-blue-500 to-indigo-500',
    text: 'Found an excellent electrician within 30 minutes. He was professional, cleaned up after himself, and the price was totally fair. KamgarConnect is my go-to app now!',
  },
  {
    name: 'Rahul Mehta', role: 'Office Manager, Mumbai', rating: 5, initials: 'RM', color: 'from-violet-500 to-purple-500',
    text: 'We urgently needed plumbing help at our office. The worker arrived fast, was highly skilled, resolved the issue in under an hour. Absolutely impressed with this platform.',
  },
  {
    name: 'Anjali Desai', role: 'Builder, Nagpur', rating: 5, initials: 'AD', color: 'from-emerald-500 to-teal-500',
    text: 'Reliable carpenters and masons available instantly. The verification badge gives my clients confidence. Very professional, would recommend to every contractor.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#06080F] text-slate-300 relative overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Background gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-60 -left-60 w-[700px] h-[700px] bg-blue-600/8 rounded-full blur-3xl" />
        <div className="absolute top-[40%] -right-60 w-[600px] h-[600px] bg-indigo-600/6 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      {/* ── NAVBAR ── */}
      <header className="fixed top-0 w-full z-50 bg-[#06080F]/85 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <div className="text-2xl font-black tracking-tight text-white shrink-0">
            Kamgar<span className="text-blue-400">Connect</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
            {['Services', 'How It Works', 'Testimonials', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="hover:text-white transition-colors duration-200">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/login" className="hidden sm:block text-sm font-semibold text-slate-400 hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition-all">
              Log in
            </Link>
            <Link href="/register" className="text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:-translate-y-0.5">
              Get Started →
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative z-10 pt-28 pb-0 px-4 overflow-hidden">
        <MouseTrail />
        <div className="max-w-7xl mx-auto">

          {/* Top pill badge */}
          <div className="flex justify-center mb-8 pt-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5 fill-current" /> India&apos;s #1 Verified Blue-Collar Platform
            </div>
          </div>

          {/* Headline centered */}
          <div className="text-center mb-6">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-tight mb-6">
              Home services<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
                at your doorstep.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Book verified plumbers, electricians, carpenters, cleaners & more —
              background-checked, rated, and available in your city right now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-2xl shadow-blue-600/30 hover:-translate-y-1 text-lg">
                Book a Service <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-white/6 hover:bg-white/10 border border-white/10 text-white font-bold px-10 py-4 rounded-2xl transition-all text-lg">
                Join as a Worker <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-slate-400 mb-12">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Aadhar Verified Workers</span>
              <span className="w-1 h-1 bg-slate-600 rounded-full hidden sm:block" />
              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-400" /> Secure & Transparent</span>
              <span className="w-1 h-1 bg-slate-600 rounded-full hidden sm:block" />
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-violet-400" /> On-Time Guarantee</span>
              <span className="w-1 h-1 bg-slate-600 rounded-full hidden sm:block" />
              <span className="flex items-center gap-2"><BadgeCheck className="w-4 h-4 text-yellow-400" /> Rated 4.9 / 5 Stars</span>
            </div>
          </div>

          {/* Hero Worker Cards */}
          <div className="w-full max-w-6xl mx-auto bg-[#0A0D14] border border-[#1A2235] rounded-[2rem] p-3 shadow-2xl relative z-20">
            {/* Two Cards Container */}
            <div className="grid md:grid-cols-2 gap-3 mb-3">
              
              {/* Left Card - Electrician */}
              <div className="relative h-[400px] md:h-[500px] rounded-[1.5rem] overflow-hidden bg-[#1e293b]">
                 <div className="absolute inset-4 border-[1.5px] border-white/30 rounded-xl z-20 pointer-events-none" />
                 
                 <Image src="/images/hero_electrician.png" alt="Ajay Kumar - Electrician" fill className="object-cover object-top z-0 opacity-90" />
                 
                 <div className="absolute top-8 md:top-10 left-8 md:left-10 z-10">
                   <h3 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase">AJAY<br />KUMAR</h3>
                   <p className="text-xl md:text-2xl text-white/80 font-medium mt-1">(40s)</p>
                 </div>
                 
                 <div className="absolute bottom-8 md:bottom-10 left-8 md:left-10 right-8 md:right-10 flex items-end justify-between z-10">
                   <p className="text-white/70 font-bold tracking-widest text-sm uppercase">ELECTRICIAN</p>
                   <div className="text-center">
                     <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                     <p className="text-[9px] font-black tracking-wider text-slate-300 leading-tight uppercase">POWERGUARD<br />ELECTRICAL SERVICES</p>
                   </div>
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent z-0 opacity-80" />
              </div>

              {/* Right Card - Plumber */}
              <div className="relative h-[400px] md:h-[500px] rounded-[1.5rem] overflow-hidden bg-[#1e293b]">
                 <div className="absolute inset-4 border-[1.5px] border-white/30 rounded-xl z-20 pointer-events-none" />
                 
                 <Image src="/images/service_plumber.png" alt="Sandeep Singh - Plumber" fill className="object-cover object-top z-0 opacity-90" />
                 
                 <div className="absolute top-8 md:top-10 left-8 md:left-10 z-10">
                   <h3 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase">SANDEEP<br />SINGH</h3>
                   <p className="text-xl md:text-2xl text-white/80 font-medium mt-1">(35)</p>
                 </div>
                 
                 <div className="absolute bottom-8 md:bottom-10 left-8 md:left-10 right-8 md:right-10 flex items-end justify-between z-10">
                   <p className="text-white/70 font-bold tracking-widest text-sm uppercase">PLUMBER</p>
                   <div className="text-center">
                     <span className="text-2xl inline-block mx-auto mb-1 text-cyan-400">💧</span>
                     <p className="text-[9px] font-black tracking-wider text-slate-300 leading-tight uppercase">PLUMBSURE<br />SOLUTIONS</p>
                   </div>
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent z-0 opacity-80" />
              </div>

            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { icon: Users, val: '10,000+', label: 'Active Workers', color: 'text-blue-400' },
                { icon: Star, val: '4.9 / 5', label: 'Avg Rating', color: 'text-yellow-400' },
                { icon: TrendingUp, val: '50k+', label: 'Jobs Completed', color: 'text-green-400' },
                { icon: BadgeCheck, val: '100%', label: 'Verified Profiles', color: 'text-violet-400' },
              ].map((s, i) => (
                <div key={i} className="bg-[#05060A] border border-white/5 rounded-2xl p-4 flex items-center justify-center gap-4 py-6">
                  <s.icon className={`w-6 h-6 shrink-0 ${s.color}`} />
                  <div>
                    <div className={`text-xl md:text-2xl font-black ${s.color}`}>{s.val}</div>
                    <div className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section id="services" className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">All Categories</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">What are you looking for?</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Trusted professionals for every home and office need, available near you.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((s, i) => (
              <Link
                key={i}
                href="/register"
                className={`group relative bg-gradient-to-br ${s.color} border ${s.border} ${s.hover} rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                {/* Photo bg if available */}
                {s.img && (
                  <div className="relative h-32 overflow-hidden">
                    <Image src={s.img} alt={s.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
                  </div>
                )}

                <div className={`p-4 ${!s.img ? 'pt-6' : ''}`}>
                  {!s.img && <div className="text-3xl mb-2">{s.emoji}</div>}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-white font-bold text-sm">{s.title}</h3>
                      <p className="text-slate-400 text-xs mt-0.5 leading-snug">{s.desc}</p>
                    </div>
                    {s.tag && (
                      <span className={`shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full border ${s.tagColor}`}>
                        {s.tag}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST / WHY US ── */}
      <section className="relative z-10 py-20 px-4 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* Photo */}
          <div className="relative h-[420px] rounded-3xl overflow-hidden border border-white/8 shadow-2xl order-2 md:order-1">
            <Image
              src="/images/trust_handshake.png"
              alt="Worker and customer shaking hands"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06080F]/60 to-transparent" />

            {/* Floating badge */}
            <div className="absolute bottom-6 left-6 bg-[#06080F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 max-w-[220px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Job Verified ✓</p>
                  <p className="text-slate-400 text-xs">Electrician • Mumbai</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(n => <Star key={n} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                <span className="text-xs text-slate-400 ml-1">5.0 • Just now</span>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 md:order-2">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Why Trust Us</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
              Every worker is<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                verified & rated.
              </span>
            </h2>
            <p className="text-slate-400 mb-8 text-lg leading-relaxed">
              We don&apos;t just list workers — we vet them. Aadhar-verified identity,
              skill certificates checked, and community ratings publicly visible
              so you always know who&apos;s coming to your door.
            </p>

            <div className="space-y-4">
              {[
                { icon: BadgeCheck, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', title: 'Aadhar & Background Verified', desc: 'Every worker\'s identity is confirmed before they can take jobs.' },
                { icon: Star, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', title: 'Community Ratings', desc: 'Real reviews from real customers — full transparency.' },
                { icon: ShieldCheck, color: 'text-green-400 bg-green-500/10 border-green-500/20', title: 'Skill Certificates Checked', desc: 'Workers upload certificates that customers can view before hiring.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-10 h-10 ${item.color} border rounded-xl flex items-center justify-center shrink-0`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm mb-0.5">{item.title}</p>
                    <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/register" className="inline-flex items-center gap-2 mt-8 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-600/25 hover:-translate-y-0.5">
              Browse Workers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Simple & Fast</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">How it works</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">Post a job, choose your worker, get it done — usually within the same day.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-14 left-[calc(16.6%+60px)] right-[calc(16.6%+60px)] h-px bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-violet-500/30" />

            {[
              { step: '01', emoji: '📋', title: 'Post a Job', desc: 'Describe the task, set your budget, choose profession & location. Our form takes under 60 seconds.', color: 'from-blue-500/15', border: 'border-blue-500/20', glow: 'shadow-blue-500/10' },
              { step: '02', emoji: '👷', title: 'Pick a Worker', desc: 'Review applicants with star ratings, years of experience, and verified certificates. Accept the best fit.', color: 'from-indigo-500/15', border: 'border-indigo-500/20', glow: 'shadow-indigo-500/10' },
              { step: '03', emoji: '✅', title: 'Job Done!', desc: 'Worker completes the task. Mark it done and leave a rating. Your history is tracked automatically.', color: 'from-violet-500/15', border: 'border-violet-500/20', glow: 'shadow-violet-500/10' },
            ].map((item, i) => (
              <div key={i} className={`relative bg-gradient-to-br ${item.color} to-transparent border ${item.border} rounded-3xl p-8 text-center hover:shadow-2xl ${item.glow} transition-all duration-300 hover:-translate-y-1 group`}>
                <div className="w-20 h-20 mx-auto mb-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  {item.emoji}
                </div>
                <div className="text-xs font-black text-blue-400 mb-2 tracking-widest">STEP {item.step}</div>
                <h3 className="text-2xl font-black text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="relative z-10 py-24 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Customer Stories</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Trusted by thousands</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">Real reviews from customers across India who found their perfect professional here.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/3 border border-white/7 rounded-3xl p-8 hover:border-white/15 hover:bg-white/5 transition-all duration-300 flex flex-col">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="text-xs text-slate-500 ml-2 font-semibold">5.0</span>
                </div>
                {/* Quote */}
                <p className="text-slate-300 text-sm leading-relaxed mb-8 flex-1">&ldquo;{t.text}&rdquo;</p>
                {/* Author */}
                <div className="flex items-center gap-3 border-t border-white/5 pt-5">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-black text-sm shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                  <div className="ml-auto">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-blue-500/20 shadow-2xl shadow-blue-900/30">
            {/* Photo background */}
            <div className="relative h-[340px] md:h-[300px]">
              <Image src="/images/hero_electrician.png" alt="Professional worker" fill className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#06080F] via-[#06080F]/80 to-[#06080F]/40" />
            </div>

            <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-16 py-10">
              <p className="text-blue-400 text-xs font-black uppercase tracking-widest mb-3">Get Started Today</p>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight max-w-lg">
                Ready to get your <span className="text-blue-400">job done?</span>
              </h2>
              <p className="text-slate-300 mb-8 max-w-md text-base">
                Join thousands of satisfied customers. Post your first job in under 60 seconds — no credit card needed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/30 hover:-translate-y-0.5">
                  Book a Service Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold px-8 py-4 rounded-2xl transition-all">
                  Register as Worker
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="relative z-10 py-24 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">24/7 Support</p>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">We&apos;re here to help</h2>
            <p className="text-slate-400 text-lg">Reach our dedicated support team any time.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-5">
              {[
                { icon: Mail, label: 'Email Us', value: 'support@kamgarconnect.com', sub: 'We reply within 2 hours', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                { icon: Phone, label: 'Call Center', value: '+91 1800-123-4567', sub: 'Mon–Sat, 8AM to 8PM', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                { icon: MapPin, label: 'Headquarters', value: 'Mumbai IT Park, Maharashtra', sub: 'Phase 2, Andheri East', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5 group cursor-pointer p-4 rounded-2xl hover:bg-white/3 transition-all">
                  <div className={`w-14 h-14 ${item.bg} border rounded-2xl flex items-center justify-center shrink-0`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">{item.label}</p>
                    <p className="text-white font-bold">{item.value}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/3 border border-white/8 rounded-3xl p-8">
              <h3 className="text-white font-bold text-xl mb-6">Send us a message</h3>
              <form className="space-y-4">
                <input type="text" placeholder="Your Full Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm" />
                <input type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm" />
                <textarea placeholder="How can we help you?" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm min-h-[120px] resize-none" />
                <button type="button" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 hover:shadow-blue-500/30">
                  Send Message →
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-2xl font-black text-white mb-1">
              Kamgar<span className="text-blue-400">Connect</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Connecting workers with the world.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-slate-500">
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors">Sign Up</Link>
          </div>
          <p className="text-slate-600 text-sm font-medium">
            © {new Date().getFullYear()} KamgarConnect
          </p>
        </div>
      </footer>

    </div>
  )
}
