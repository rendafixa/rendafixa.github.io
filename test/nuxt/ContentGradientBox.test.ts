import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ContentGradientBox from '~/components/ContentGradientBox.vue'

describe('ContentGradientBox Component', () => {
  describe('Rendering', () => {
    it('should render as a paragraph element with all required styling classes', async () => {
      const wrapper = await mountSuspended(ContentGradientBox)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.element.tagName).toBe('P')

      const element = wrapper.element as HTMLElement
      const classList = element.className

      // Verify all styling classes
      expect(classList).toContain('p-4')
      expect(classList).toContain('shadow')
      expect(classList).toContain('rounded-lg')
      expect(classList).toContain('bg-linear-to-r')
      expect(classList).toContain('from-orange-')
      expect(classList).toContain('to-amber-')
    })
  })

  describe('Slot Content', () => {
    it('should render text content in slot', async () => {
      const wrapper = await mountSuspended(ContentGradientBox, {
        slots: {
          default: 'Test content',
        },
      })
      expect(wrapper.text()).toContain('Test content')
    })

    it('should render HTML elements in slot', async () => {
      const wrapper = await mountSuspended(ContentGradientBox, {
        slots: {
          default: '<strong>Bold text</strong>',
        },
      })
      expect(wrapper.find('strong').exists()).toBe(true)
      expect(wrapper.find('strong').text()).toBe('Bold text')
    })

    it('should render multiple elements in slot', async () => {
      const wrapper = await mountSuspended(ContentGradientBox, {
        slots: {
          default: '<span>First</span> <span>Second</span>',
        },
      })
      const spans = wrapper.findAll('span')
      expect(spans).toHaveLength(2)
      expect(spans[0].text()).toBe('First')
      expect(spans[1].text()).toBe('Second')
    })

    it('should handle empty slot', async () => {
      const wrapper = await mountSuspended(ContentGradientBox)
      expect(wrapper.text()).toBe('')
    })
  })
})
