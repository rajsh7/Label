import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Careers - LabelPro',
  description: 'Join our team and help build the future of e-commerce label management.',
}

const openPositions = [
  {
    title: 'Senior Full Stack Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build scalable features for our label management platform using Next.js, React, and Supabase.',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    description: 'Design intuitive user experiences for our drag-and-drop label editor and dashboard.',
  },
  {
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Remote',
    type: 'Full-time',
    description: 'Help e-commerce businesses succeed with our label management solutions.',
  },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Join Our Team</h1>
          <p className="text-xl text-muted-foreground">
            Help us build the future of e-commerce label management
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Company Culture */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6">Why LabelPro?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Growth</h3>
              <p className="text-muted-foreground">Join a rapidly growing SaaS platform serving thousands of e-commerce businesses.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Remote First</h3>
              <p className="text-muted-foreground">Work from anywhere with flexible hours and a focus on work-life balance.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Impact</h3>
              <p className="text-muted-foreground">Build features that directly help businesses streamline their operations.</p>
            </div>
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Open Positions</h2>
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">{position.department}</span>
                      <span className="bg-accent/10 text-accent px-2 py-1 rounded">{position.location}</span>
                      <span className="bg-green-500/10 text-green-600 px-2 py-1 rounded">{position.type}</span>
                    </div>
                  </div>
                  <button className="mt-4 md:mt-0 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    Apply Now
                  </button>
                </div>
                <p className="text-muted-foreground">{position.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Benefits & Perks</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Competitive Salary</h3>
                <p className="text-muted-foreground">Market-rate compensation with equity options</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Health Insurance</h3>
                <p className="text-muted-foreground">Comprehensive medical, dental, and vision coverage</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Unlimited PTO</h3>
                <p className="text-muted-foreground">Take time off when you need it</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Learning Budget</h3>
                <p className="text-muted-foreground">$2,000 annual budget for courses and conferences</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Home Office Setup</h3>
                <p className="text-muted-foreground">$1,500 budget for your ideal workspace</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Team Retreats</h3>
                <p className="text-muted-foreground">Annual company retreats and team building events</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Don't see a perfect fit?</h2>
          <p className="text-muted-foreground mb-6">
            We're always looking for talented people. Send us your resume and tell us how you'd like to contribute.
          </p>
          <Link href="/contact" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  )
}