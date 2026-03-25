import Link from "next/link";
import Accordion from "@/components/accordion";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/databaseAvailability";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  order: number;
}

export const revalidate = 3600;

async function getFaqs(): Promise<FAQItem[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    return await prisma.fAQ.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }],
      select: {
        id: true,
        question: true,
        answer: true,
        category: true,
        order: true,
      },
    });
  } catch (error) {
    console.warn("Skipping FAQs page data during prerender:", error);
    return [];
  }
}

function groupFaqs(faqs: FAQItem[]) {
  return faqs.reduce<Record<string, FAQItem[]>>((acc, faq) => {
    const category = faq.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {});
}

export default async function FAQPage() {
  const faqs = await getFaqs();
  const groupedFAQs = groupFaqs(faqs);

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Header Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find answers to common questions about our treks, expeditions, and
            courses. Don't see your question? Contact us anytime!
          </p>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        {faqs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No FAQs available at the moment.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {Object.entries(groupedFAQs).map(([category, categoryFaqs]) => (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {category}
                </h2>
                <div className="space-y-3">
                  {categoryFaqs.map((faq) => (
                    <Accordion
                      key={faq.id}
                      question={faq.question}
                      answer={faq.answer}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="px-4 py-12 sm:px-6 lg:px-8 bg-blue-50 dark:bg-gray-800 mt-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Our team is here to help. Contact us directly for any inquiries.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
