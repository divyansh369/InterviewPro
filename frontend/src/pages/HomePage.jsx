import { Link } from "react-router";
import {
  ArrowRightIcon,
  Waypoints,
  CheckIcon,
  Code2Icon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
} from "lucide-react";

import { SignInButton } from "@clerk/react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-[#E0D9CF] bg-[#F5F0E8]/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Waypoints
              className="size-5 text-[#1A1A1A]"
              strokeWidth={2.2}
            />

            <span className="text-[21px] font-semibold tracking-tight text-[#1A1A1A]">
              InterviewPro
            </span>
          </Link>

          {/* CTA BUTTON */}
          <SignInButton mode="modal">
            <button className="group flex items-center gap-2 px-5 py-2.5 border border-black text-black text-sm font-medium rounded-full hover:bg-black hover:text-white transition-all duration-200">
              <span>Get Started</span>

              <ArrowRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-8">
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EBC8C4] text-[#7A3E36] text-sm font-medium">
              <ZapIcon className="size-4" />
              Real-time Collaboration
            </div>

            {/* HEADING */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                <span className="text-[#1A1A1A]">
                  Code Together,
                </span>

                <br />

                <span className="text-[#9B5D2E]">
                  Learn Together
                </span>
              </h1>

              <p className="text-lg text-[#6B665C] leading-relaxed max-w-xl">
                The ultimate platform for collaborative coding interviews and
                pair programming. Connect face-to-face, code in real-time, and
                ace your technical interviews.
              </p>
            </div>

            {/* FEATURE PILLS */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 border border-[#D8CCBC] rounded-full text-sm text-[#4A443D] bg-white/40">
                <CheckIcon className="size-4 text-[#9B5D2E]" />
                Live Video Chat
              </div>

              <div className="flex items-center gap-2 px-4 py-2 border border-[#D8CCBC] rounded-full text-sm text-[#4A443D] bg-white/40">
                <CheckIcon className="size-4 text-[#9B5D2E]" />
                Code Editor
              </div>

              <div className="flex items-center gap-2 px-4 py-2 border border-[#D8CCBC] rounded-full text-sm text-[#4A443D] bg-white/40">
                <CheckIcon className="size-4 text-[#9B5D2E]" />
                Multi-Language
              </div>
            </div>

            {/* CTA BUTTONS */}
            <div className="flex flex-wrap gap-4">
              <SignInButton mode="modal">
                <button className="group flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-full font-medium hover:bg-[#333] transition-all">
                  Start Coding Now

                  <ArrowRightIcon className="size-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </SignInButton>

              <button className="flex items-center gap-2 px-6 py-3 border border-[#1A1A1A] text-[#1A1A1A] rounded-full font-medium hover:bg-[#1A1A1A] hover:text-white transition-all">
                <VideoIcon className="size-5" />
                Watch Demo
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 bg-[#EFE5D6] rounded-2xl overflow-hidden shadow-sm border border-[#E0D5C6] max-w-md">
              <div className="p-5 text-center border-r border-[#DDCFBE]">
                <h3 className="text-3xl font-bold text-[#1A1A1A]">10K+</h3>
                <p className="text-sm text-[#6B665C] mt-1">
                  Active Users
                </p>
              </div>

              <div className="p-5 text-center border-r border-[#DDCFBE]">
                <h3 className="text-3xl font-bold text-[#9B5D2E]">50K+</h3>
                <p className="text-sm text-[#6B665C] mt-1">
                  Sessions
                </p>
              </div>

              <div className="p-5 text-center">
                <h3 className="text-3xl font-bold text-[#1A1A1A]">99.9%</h3>
                <p className="text-sm text-[#6B665C] mt-1">
                  Uptime
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#E9DDCD] rounded-[32px] blur-3xl opacity-50" />

            <img
              src="/hero.png"
              alt="Collaborative coding platform"
              className="relative w-full rounded-[32px] border border-[#E5D9CA] shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        {/* SECTION HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4 tracking-tight">
            Everything You Need to{" "}
            <span className="text-[#9B5D2E]">
              Succeed
            </span>
          </h2>

          <p className="text-lg text-[#6B665C] max-w-2xl mx-auto leading-relaxed">
            Powerful features designed to make your coding interviews seamless
            and productive.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* CARD 1 */}
          <div className="bg-white/50 border border-[#E5D9CA] rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
            <div className="size-16 bg-[#F3E5D7] rounded-2xl flex items-center justify-center mb-6">
              <VideoIcon className="size-8 text-[#9B5D2E]" />
            </div>

            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">
              HD Video Call
            </h3>

            <p className="text-[#6B665C] leading-relaxed">
              Crystal clear video and audio for seamless communication during
              technical interviews.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="bg-white/50 border border-[#E5D9CA] rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
            <div className="size-16 bg-[#F3E5D7] rounded-2xl flex items-center justify-center mb-6">
              <Code2Icon className="size-8 text-[#9B5D2E]" />
            </div>

            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">
              Live Code Editor
            </h3>

            <p className="text-[#6B665C] leading-relaxed">
              Collaborate in real-time with syntax highlighting and multi-language support.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="bg-white/50 border border-[#E5D9CA] rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
            <div className="size-16 bg-[#F3E5D7] rounded-2xl flex items-center justify-center mb-6">
              <UsersIcon className="size-8 text-[#9B5D2E]" />
            </div>

            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">
              Easy Collaboration
            </h3>

            <p className="text-[#6B665C] leading-relaxed">
              Share screens, discuss solutions, and solve problems together in real-time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;