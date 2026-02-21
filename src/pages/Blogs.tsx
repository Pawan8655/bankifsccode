import React, { useState, useMemo, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Breadcrumbs } from '../components/Breadcrumbs';
import blogs from './blogsData';

const BLOGS_PER_PAGE = 10;

export default function Blogs() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBlogs = useMemo(() => {
    if (!searchTerm) return blogs;
    return blogs.filter(blog =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.questions.some(q =>
        q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.a.toLowerCase().includes(searchTerm.toLowerCase())
      )
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
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Blogs' }]} />

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center gradient-text animate-fade-in">
          Banking & Finance Blogs
        </h1>

        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg glass-effect border border-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
          />
        </div>

        <div className="grid gap-6 md:gap-8">
          {currentBlogs.map((blog, index) => (
            <div
              key={blog.id}
              className="gradient-border glass-effect rounded-lg p-6 md:p-8 animate-fade-in hover:animate-pulse-glow transition-all duration-300 max-w-4xl mx-auto w-full"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 gradient-text">{blog.title}</h2>
                <p className="text-muted-foreground mb-6 text-base md:text-lg max-w-2xl mx-auto">
                  {blog.description}
                </p>

                <h3 className="font-semibold mb-4 text-xl inline-block border-b-2 border-primary/30 pb-1">Frequently Asked Questions</h3>
                <div className="space-y-4 text-left">
                  {blog.questions.map((item, qIndex) => (
                    <div key={qIndex} className="border-2 border-primary/10 pl-6 pr-6 py-4 bg-card/30 rounded-xl hover:border-primary/30 transition-colors">
                      <div className="font-semibold text-primary text-base md:text-lg mb-2 flex gap-2">
                        <span className="shrink-0 font-bold">Q:</span>
                        <span>{item.q}</span>
                      </div>
                      <div className="text-foreground/80 text-sm md:text-base ml-8">
                        {item.a}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 gap-2 flex-wrap">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 md:px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${currentPage === i + 1
                ? 'bg-primary text-white shadow-lg animate-pulse-glow'
                : 'bg-secondary/20 hover:bg-secondary/40 glass-effect'
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
