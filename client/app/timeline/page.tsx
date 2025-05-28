import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import React from 'react'

const timelineData = [
  {
    date: '2025-01-01',
    title: 'Project Kickoff',
    description: 'Initial project kickoff and team alignment.',
  },
  {
    date: '2025-01-15',
    title: 'MVP Design',
    description: 'Design and wireframes for MVP completed.',
  },
  {
    date: '2025-02-01',
    title: 'Development Start',
    description: 'Development of core features begins.',
  },
  {
    date: '2025-03-01',
    title: 'Beta Release',
    description: 'First beta release for internal testing.',
  },
  {
    date: '2025-04-01',
    title: 'Public Launch',
    description: 'Official public launch of the product.',
  },
]

export default function TimelinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-orange-600">
        Project Timeline
      </h1>
      <div className="w-full max-w-2xl space-y-6">
        {timelineData.map((item, idx) => (
          <Card
            key={item.date}
            className={cn(
              'p-6 flex flex-col gap-2 border-l-4',
              idx === 0 ? 'border-orange-600' : 'border-gray-200'
            )}
          >
            <span className="text-xs text-gray-400">{item.date}</span>
            <span className="text-lg font-semibold text-orange-700">
              {item.title}
            </span>
            <span className="text-gray-700">{item.description}</span>
          </Card>
        ))}
      </div>
    </div>
  )
}
