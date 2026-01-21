import Link from 'next/link'
import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - LabelPro Tips, Guides, and E-commerce Insights',
  description:
    'Learn about label creation, batch processing, marketplace requirements, and optimization strategies from the LabelPro team and expert sellers.',
  openGraph: {
    title: 'LabelPro Blog - E-commerce Labeling Tips and Guides',
    description: 'Expert advice on label creation, batch processing, and e-commerce workflows',
  },
}

const blogPosts = [
  {
    id: '1',
    title: 'Getting Started with LabelPro: A Complete Guide for E-commerce Sellers',
    excerpt:
      'Learn how to create your first label, set up batch processing, and connect your printers in this comprehensive guide.',
    date: new Date('2024-01-15'),
    slug: 'getting-started-with-labelpro',
    readTime: 8,
  },
  {
    id: '2',
    title: '10 Tips for Efficient Batch Label Processing That Will Save You Hours',
    excerpt:
      'Maximize your productivity with these expert tips for processing large batches of labels. Learn from experienced sellers who process thousands of labels monthly.',
    date: new Date('2024-01-10'),
    slug: 'tips-for-batch-label-processing',
    readTime: 12,
  },
  {
    id: '3',
    title: 'Understanding Label Format Requirements by Marketplace: Complete Guide 2024',
    excerpt:
      'Navigate the complex world of marketplace label requirements. Learn exactly what each platform needs and how LabelPro makes compliance easy.',
    date: new Date('2024-01-05'),
    slug: 'label-format-requirements-by-marketplace',
    readTime: 15,
  },
  {
    id: '4',
    title: 'Optimizing Your Label Workflows: Advanced Strategies for High-Volume Sellers',
    excerpt:
      'Learn advanced strategies for managing high-volume labeling operations. From automation to team workflows, discover how to scale efficiently.',
    date: new Date('2024-01-20'),
    slug: 'optimizing-label-workflows',
    readTime: 10,
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="py-20 px-4 bg-gradient-to-b from-[var(--color-primary-50)] to-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-6">
              Blog
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Tips, tutorials, and insights for e-commerce sellers
            </p>
          </div>
        </div>

        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-8">
              {blogPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                        {post.title}
                      </h2>
                      <p className="text-[var(--color-text-secondary)] mb-4">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-[var(--color-text-tertiary)]">
                        <span>{format(post.date, 'MMMM d, yyyy')}</span>
                        {post.readTime && <span>{post.readTime} min read</span>}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
