import React, { useState, useMemo, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Breadcrumbs } from '../components/Breadcrumbs';
import blogs from './blogsData';
import { SEO } from '@/components/SEO';
import { Link } from 'react-router-dom';

const BLOGS_PER_PAGE = 5;

export default function Blogs() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBlogs = useMemo(() => {
    if (!searchTerm) return blogs;
    return blogs.filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.sections.some((section) => section.heading.toLowerCase().includes(searchTerm.toLowerCase()) || section.body.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
  const currentBlogs = filteredBlogs.slice(startIndex, startIndex + BLOGS_PER_PAGE);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="High Traffic Banking Blog India | IFSC, MICR, NEFT, EMI Guides"
        description="SEO-focused blog hub: IFSC code finder guides, MICR knowledge, NEFT RTGS IMPS comparison, EMI calculator India and personal finance tips."
        path="/blogs"
        keywords="IFSC code finder, bank IFSC search, MICR code India, NEFT RTGS IMPS difference, EMI calculator India"
      />
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Blogs' }]} />

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-center">Banking Guides, IFSC & Finance Blog</h1>
        <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-6">Categories: Banking Guides, IFSC & MICR Knowledge, Online Transactions, Personal Finance, Loan & EMI Guides, Investment Tips, Credit Cards & Banking Tips.</p>

        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search blog topic, keyword, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-lg px-4 py-2 rounded-lg glass-effect border border-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="grid gap-6 md:gap-8">
          {currentBlogs.map((blog) => (
            <article key={blog.id} className="gradient-border glass-effect rounded-lg p-6 md:p-8 max-w-5xl mx-auto w-full">
              <Badge text={blog.category} />
              <h2 className="text-2xl md:text-3xl font-bold mt-3">{blog.title}</h2>
              <p className="text-muted-foreground mt-2">{blog.description}</p>

              {blog.sections.map((section, index) => (
                <section key={`${blog.id}-${section.heading}`} className="mt-5">
                  {index === 0 ? <h3 className="text-xl font-semibold">{section.heading}</h3> : <h4 className="text-lg font-semibold">{section.heading}</h4>}
                  <p className="mt-2 text-sm md:text-base text-foreground/90">{section.body}</p>
                  {section.points && (
                    <ul className="list-disc pl-6 mt-2 text-sm text-foreground/85 space-y-1">
                      {section.points.map((point) => <li key={point}>{point}</li>)}
                    </ul>
                  )}
                </section>
              ))}

              <section className="mt-6">
                <h3 className="text-xl font-semibold">FAQ</h3>
                <div className="space-y-3 mt-3">
                  {blog.faqs.map((faq) => (
                    <div key={faq.q} className="border rounded-lg p-3 bg-card/40">
                      <p className="font-semibold">Q. {faq.q}</p>
                      <p className="text-sm mt-1 text-muted-foreground">A. {faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-6 text-sm text-muted-foreground">
                <p><strong>Internal Links:</strong> <Link to="/banks" className="text-primary underline">IFSC Finder</Link> · <Link to="/tools" className="text-primary underline">Calculator Tools</Link> · <Link to="/" className="text-primary underline">Homepage</Link></p>
                <p className="mt-2"><strong>Keywords:</strong> {blog.keywords.join(', ')}</p>
                <p className="mt-2"><strong>Conclusion:</strong> Sahi IFSC/MICR aur transaction knowledge se aap fast, safe aur error-free banking kar sakte ho. Search tools + calculators + guides ka combined use best result deta hai.</p>
              </section>
            </article>
          ))}
        </div>

        <div className="flex justify-center mt-8 gap-2 flex-wrap">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 md:px-4 py-2 rounded-lg ${currentPage === i + 1 ? 'bg-primary text-white' : 'bg-secondary/20 hover:bg-secondary/40'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return <span className="inline-flex rounded-full border px-3 py-1 text-xs font-medium">{text}</span>;
}
