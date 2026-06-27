import { describe, it, expect } from 'vitest'
import { fadeUp, fadeIn, stagger, staggerFast, scaleIn, VIEWPORT } from '@/lib/motion'

describe('motion variants', () => {
  describe('fadeUp', () => {
    it('has a hidden state with zero opacity and positive y offset', () => {
      expect(fadeUp.hidden).toMatchObject({ opacity: 0, y: 28 })
    })
    it('has a visible state with full opacity and no y offset', () => {
      expect(fadeUp.visible).toMatchObject({ opacity: 1, y: 0 })
    })
  })

  describe('fadeIn', () => {
    it('has hidden and visible opacity states', () => {
      expect(fadeIn.hidden).toMatchObject({ opacity: 0 })
      expect(fadeIn.visible).toMatchObject({ opacity: 1 })
    })
  })

  describe('stagger', () => {
    it('has empty hidden state and stagger transition in visible', () => {
      expect(stagger.hidden).toEqual({})
      const visible = stagger.visible as Record<string, unknown>
      expect(visible.transition).toMatchObject({ staggerChildren: 0.1 })
    })
  })

  describe('staggerFast', () => {
    it('staggers children faster than stagger', () => {
      const fastVisible = staggerFast.visible as Record<string, unknown>
      const normalVisible = stagger.visible as Record<string, unknown>
      const fast = fastVisible.transition as Record<string, unknown>
      const normal = normalVisible.transition as Record<string, unknown>
      expect((fast.staggerChildren as number)).toBeLessThan((normal.staggerChildren as number))
    })
  })

  describe('scaleIn', () => {
    it('starts at less than full scale', () => {
      expect((scaleIn.hidden as Record<string, unknown>).scale).toBeLessThan(1)
    })
    it('ends at full scale', () => {
      expect((scaleIn.visible as Record<string, unknown>).scale).toBe(1)
    })
  })

  describe('VIEWPORT', () => {
    it('is configured to animate once with a negative margin', () => {
      expect(VIEWPORT.once).toBe(true)
      expect(VIEWPORT.margin).toContain('-')
    })
  })
})
