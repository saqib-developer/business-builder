"use client";

import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  FiAward,
  FiShare2,
  FiGlobe,
  FiArrowRight,
  FiCheckCircle,
  FiZap,
  FiLayout,
  FiShoppingBag,
  FiPackage,
  FiTrendingUp,
} from "react-icons/fi";
import { BsFillLightbulbFill } from "react-icons/bs";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/sign-up");
    }
  };

  const heroSteps = [
    {
      icon: <BsFillLightbulbFill className="w-12 h-12" />,
      number: "1",
      title: "Your Idea",
      description: "Start with your brilliant business concept",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <FiAward className="w-12 h-12" />,
      number: "2",
      title: "Brand Identity",
      description: "Create a stunning logo and visual identity",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <FiShare2 className="w-12 h-12" />,
      number: "3",
      title: "Social Presence",
      description: "Establish your presence across all platforms",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: <FiGlobe className="w-12 h-12" />,
      number: "4",
      title: "Your Website",
      description: "Launch a professional online storefront",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  const benefits = [
    "No technical skills required",
    "Professional results in minutes",
    "All-in-one platform",
    "Mobile-optimized designs",
    "Free to get started",
    "Expert guidance every step",
  ];

  //   return (
  //     <div className="min-h-screen">
  //       {/* Hero Section */}
  //       <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
  //         <div className="absolute inset-0 bg-black/10"></div>
  //         <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

  //         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
  //           <div className="text-center mb-16">
  //             <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
  //               <FiZap className="w-4 h-4 text-yellow-300" />
  //               <span className="text-sm font-medium">Transform Your Business Idea Into Reality</span>
  //             </div>

  //             <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
  //               From <span className="text-yellow-300">Zero to Hero</span>
  //               <br />
  //               In Four Simple Steps
  //             </h1>

  //             <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
  //               Take your business idea from concept to a complete digital presence.
  //               No coding, no design skills, no problem.
  //             </p>

  //             <button
  //               onClick={handleGetStarted}
  //               className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg text-lg font-bold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-2xl"
  //             >
  //               Get Started Free
  //               <FiArrowRight className="w-5 h-5" />
  //             </button>

  //             <p className="mt-4 text-blue-200 text-sm">
  //               Join thousands of entrepreneurs building their dreams ✨
  //             </p>
  //           </div>

  //           {/* Zero to Hero Flow */}
  //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
  //             {heroSteps.map((step, index) => (
  //               <div
  //                 key={index}
  //                 className="relative group"
  //               >
  //                 <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:scale-105 h-full">
  //                   <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} mb-4 text-white`}>
  //                     {step.icon}
  //                   </div>

  //                   <div className="absolute -top-3 -right-3 w-10 h-10 bg-yellow-400 text-blue-900 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
  //                     {step.number}
  //                   </div>

  //                   <h3 className="text-xl font-bold mb-2">{step.title}</h3>
  //                   <p className="text-blue-100 text-sm">{step.description}</p>
  //                 </div>

  //                 {index < heroSteps.length - 1 && (
  //                   <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
  //                     <FiArrowRight className="w-6 h-6 text-yellow-300" />
  //                   </div>
  //                 )}
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       </section>

  //       {/* Benefits Section */}
  //       <section className="py-20 bg-gray-50">
  //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  //           <div className="text-center mb-12">
  //             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
  //               Why Business Builder?
  //             </h2>
  //             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
  //               Everything you need to launch your business, all in one place
  //             </p>
  //           </div>

  //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
  //             {benefits.map((benefit, index) => (
  //               <div
  //                 key={index}
  //                 className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-200"
  //               >
  //                 <FiCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
  //                 <span className="font-medium text-gray-800">{benefit}</span>
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       </section>

  //       {/* CTA Section */}
  //       <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
  //         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
  //           <h2 className="text-3xl md:text-5xl font-bold mb-6">
  //             Ready to Build Your Empire?
  //           </h2>
  //           <p className="text-xl text-blue-100 mb-8">
  //             Start your journey from idea to successful business today.
  //           </p>
  //           <button
  //             onClick={handleGetStarted}
  //             className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
  //           >
  //             Launch Your Business Now
  //             <FiArrowRight className="w-5 h-5" />
  //           </button>
  //         </div>
  //       </section>

  //       {/* Testimonial Quote */}
  //       <section className="py-16 bg-white">
  //         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
  //           <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 italic mb-4">
  //             "The secret of getting ahead is getting started."
  //           </blockquote>
  //           <p className="text-gray-600 font-medium">— Mark Twain</p>
  //         </div>
  //       </section>
  //     </div>
  //   );
  // }

  const features = [
    {
      icon: <FiLayout className="w-8 h-8" />,
      title: "Pre-Made Templates",
      description:
        "Choose from professionally designed website templates tailored for e-commerce success.",
    },
    {
      icon: <FiShoppingBag className="w-8 h-8" />,
      title: "Easy Product Management",
      description:
        "Add, edit, and organize your products with our intuitive interface.",
    },
    {
      icon: <FiPackage className="w-8 h-8" />,
      title: "Brand Builder",
      description:
        "Create stunning logos and build your brand identity with built-in design tools.",
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: "Business Resources",
      description:
        "Access guides, tips, and resources to grow your online business effectively.",
    },
  ];

  const steps = [
    {
      step: "1",
      title: "Sign Up",
      description: "Create your free account in seconds",
    },
    {
      step: "2",
      title: "Build Your Store",
      description: "Choose a template and customize it",
    },
    {
      step: "3",
      title: "Add Products",
      description: "Upload your products with ease",
    },
    {
      step: "4",
      title: "Launch & Grow",
      description: "Go live and start selling",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50/30 to-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Launch Your Online Store
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {" "}
              Without the Hassle
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
            All-in-one platform to build, design, and manage your e-commerce
            business. No technical skills required.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>Start Free Today</span>
              <FiArrowRight />
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="bg-gray-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600">
            Powerful tools designed for entrepreneurs, not developers
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="text-blue-600 mb-5 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Four simple steps to launch your online business
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {steps.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-16 text-center text-white shadow-premium-lg hover:shadow-premium transition-all duration-300">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Your Business?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Join thousands of entrepreneurs who trust Business Builder
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center space-x-2 px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            <span>Create Your Account</span>
            <FiCheckCircle className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}
