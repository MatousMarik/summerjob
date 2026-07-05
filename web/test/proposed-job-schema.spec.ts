import { describe, it, expect } from 'vitest'
import {
  ProposedJobUpdateSchema,
  ProposedJobCreateSchema,
} from '../lib/types/proposed-job'

// Regression: partial job updates (color tags, completed/hidden toggles, ...)
// must NOT reset worker counts / priority to defaults. See proposed-job.ts.
describe('ProposedJobUpdateSchema', function () {
  it('does not inject worker/priority defaults on a partial update', function () {
    const parsed = ProposedJobUpdateSchema.parse({ colorTags: [] })
    expect(parsed).not.toHaveProperty('minWorkers')
    expect(parsed).not.toHaveProperty('maxWorkers')
    expect(parsed).not.toHaveProperty('strongWorkers')
    expect(parsed).not.toHaveProperty('priority')
  })

  it('keeps worker counts and priority when they are provided', function () {
    const parsed = ProposedJobUpdateSchema.parse({
      minWorkers: 3,
      maxWorkers: 5,
      strongWorkers: 2,
      priority: 4,
    })
    expect(parsed.minWorkers).toBe(3)
    expect(parsed.maxWorkers).toBe(5)
    expect(parsed.strongWorkers).toBe(2)
    expect(parsed.priority).toBe(4)
  })
})

// Create still relies on the defaults, so keep them there.
describe('ProposedJobCreateSchema', function () {
  it('still applies worker/priority defaults on create', function () {
    const parsed = ProposedJobCreateSchema.parse({
      areaId: null,
      allergens: [],
      privateDescription: '',
      publicDescription: '',
      name: 'Job',
      address: 'Somewhere',
      contact: 'contact',
      requiredDays: 1,
      hasFood: false,
      hasShower: false,
      availability: ['2026-07-05'],
      jobType: '00000000-0000-0000-0000-000000000000',
    })
    expect(parsed.minWorkers).toBe(1)
    expect(parsed.maxWorkers).toBe(1)
    expect(parsed.strongWorkers).toBe(0)
    expect(parsed.priority).toBe(1)
  })
})
