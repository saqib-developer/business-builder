"use client";

import { FiMail, FiLinkedin, FiGithub, FiAward } from "react-icons/fi";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Muhammad Talha",
      role: "Team Lead / Front-End Developer",
      email: "talha@businessbuilder.com",
      photo: "/team/talha.jpg",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Muhammad Noman",
      role: "UI/UX Designer",
      email: "noman@businessbuilder.com",
      photo: "/team/noman.jpg",
      color: "from-purple-500 to-purple-600",
    },
    {
      name: "Ehtisham Akram",
      role: "Front-End Developer",
      email: "ehtisham@businessbuilder.com",
      photo: "/team/ehtisham.jpg",
      color: "from-pink-500 to-pink-600",
    },
    {
      name: "Jafar Hussain",
      role: "Business Analyst / Tester",
      email: "jafar@businessbuilder.com",
      photo: "/team/jafar.jpg",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Business Builder
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Empowering entrepreneurs to transform their ideas into thriving
              digital businesses
            </p>
          </div>
        </div>
      </section>

      {/* Project Context */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
              <FiAward className="w-5 h-5" />
              <span className="font-semibold">Final Year Project</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Business Builder is a comprehensive Final Year Project developed
              under the organization{" "}
              <span className="font-bold text-blue-600">Doxfen</span>. Our
              mission is to democratize entrepreneurship by providing a
              complete, user-friendly platform that guides non-technical users
              from having a simple business idea to establishing a full digital
              presence.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe that everyone deserves the opportunity to bring their
              business dreams to life, regardless of their technical expertise.
              Business Builder removes the barriers and complexity, making the
              journey from idea to launch simple, exciting, and achievable.
            </p>
          </div>

          {/* Supervisor */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 mb-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Project Supervisor
              </h3>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Muhammad Saqib
              </p>
              <p className="text-gray-600">
                Guiding our team with expertise and mentorship throughout this
                journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              Passionate students building solutions for tomorrow's
              entrepreneurs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-200"
              >
                {/* Avatar Placeholder */}
                <div
                  className={`h-48 bg-gradient-to-br ${member.color} flex items-center justify-center`}
                >
                  <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                    <span className="text-5xl font-bold text-white">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                </div>

                {/* Member Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                    {member.role}
                  </p>

                  {/* Contact */}
                  <div className="space-y-2">
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <FiMail className="w-4 h-4" />
                      <span className="truncate">{member.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built With Modern Tech
            </h2>
            <p className="text-xl text-gray-600">
              Leveraging cutting-edge technologies to deliver the best
              experience
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              "Next.js 16",
              "TypeScript",
              "Tailwind CSS",
              "Firebase",
              "React 19",
              "Framer Motion",
            ].map((tech, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 text-center border border-gray-200 hover:border-blue-400 transition-all"
              >
                <p className="font-bold text-gray-800">{tech}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organization */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Proud Member Of
          </h2>
          <p className="text-5xl md:text-6xl font-bold mb-6">Doxfen</p>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Innovating and creating solutions that make a difference in the
            digital world
          </p>
        </div>
      </section>
    </div>
  );
}
