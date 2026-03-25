import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

interface PageSection {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
  cta?: {
    text: string;
    href: string;
  };
}

interface Stat {
  number: string;
  label: string;
}

interface CTA {
  text: string;
  href: string;
}

interface Breadcrumb {
  label: string;
  href: string;
}

interface NarrativePageProps {
  title: string;
  subtitle?: string;
  sections: PageSection[];
  heroImage?: string;
  backLink?: string;
  breadcrumb?: Breadcrumb;
  stats?: Stat[];
  cta?: CTA;
}

export function NarrativePage({
  title,
  subtitle,
  sections,
  heroImage,
  backLink = "/",
  breadcrumb,
  stats,
  cta,
}: NarrativePageProps) {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-12 pb-8">
        <Link
          href={breadcrumb?.href || backLink}
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-12"
        >
          <FiArrowLeft className="w-4 h-4" />
          {breadcrumb?.label || "Back"}
        </Link>
      </div>

      {/* Hero Section */}
      <section className="w-full mb-20">
        {heroImage ? (
          <div className="relative h-96 md:h-[500px] w-full">
            <Image
              src={heroImage}
              alt={title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-20 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">{title}</h1>
            {subtitle && (
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto">
        {sections.map((section, idx) => (
          <section
            key={section.id}
            className={`mb-32 px-4 md:px-8 ${idx % 2 === 0 ? "bg-black" : "bg-gray-950"}`}
          >
            {section.image ? (
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center ${
                  section.imagePosition === "left" ? "md:direction-rtl" : ""
                }`}
              >
                {/* Text Content */}
                <div className={section.imagePosition === "left" ? "md:order-2" : ""}>
                  {section.title && (
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                      {section.title}
                    </h2>
                  )}
                  <div className="space-y-4 md:space-y-6 text-gray-300 text-base md:text-lg leading-relaxed">
                    {section.content.split("\n\n").map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                  {section.cta && (
                    <Link href={section.cta.href} className="inline-block mt-8">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
                        {section.cta.text}
                      </button>
                    </Link>
                  )}
                </div>

                {/* Image */}
                <div className={`relative h-96 md:h-full min-h-[400px] rounded-lg overflow-hidden ${
                  section.imagePosition === "left" ? "md:order-1" : ""
                }`}>
                  <Image
                    src={section.image}
                    alt={section.imageAlt || section.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="max-w-3xl">
                {section.title && (
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    {section.title}
                  </h2>
                )}
                <div className="space-y-4 md:space-y-6 text-gray-300 text-base md:text-lg leading-relaxed">
                  {section.content.split("\n\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                {section.cta && (
                  <Link href={section.cta.href} className="inline-block mt-8">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
                      {section.cta.text}
                    </button>
                  </Link>
                )}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Stats Section */}
      {stats && stats.length > 0 && (
        <section className="bg-gray-950 py-20 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900 border border-gray-700 rounded-lg p-8 text-center hover:border-blue-600 transition duration-300"
                >
                  <h3 className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">
                    {stat.number}
                  </h3>
                  <p className="text-gray-300 text-lg">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="bg-linear-to-r from-blue-900 to-purple-900 py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {cta ? "Ready to Continue Your Journey?" : "Ready to Start Your Adventure?"}
          </h2>
          <p className="text-lg text-gray-200 mb-10">
            {cta
              ? "Take the next step in your adventure today."
              : "Join thousands of adventurers and create unforgettable memories in the mountains."}
          </p>
          <Link href={cta?.href || "/all"}>
            <button className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-4 px-10 rounded-lg transition duration-300 text-lg inline-flex items-center gap-2">
              {cta?.text || "Explore Treks"}
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
