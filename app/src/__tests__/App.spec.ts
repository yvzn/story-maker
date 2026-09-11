import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { mount, flushPromises } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
    mockFetch.mockImplementation(async (input: RequestInfo | URL) => {
      const url = String(input)
      const chapter = Number(new URL(url).searchParams.get('c')) || 1
      const language = new URL(url).searchParams.get('l') || 'en'

      return {
        ok: true,
        json: async () => ({
          options: [
            { id: chapter * 10 + 1, name: `${language} chapter ${chapter} option 1`, description: ['first'] },
            { id: chapter * 10 + 2, name: `${language} chapter ${chapter} option 2`, description: ['second'] },
          ],
        }),
      }
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    mockFetch.mockReset()
  })

  it('loads feature options and allows story setup without an account', async () => {
    const wrapper = mount(App)

    await flushPromises()

    expect(wrapper.text()).toContain('New Story')
    expect(wrapper.text()).toContain('Chapter 1')
    expect(wrapper.text()).toContain('en chapter 1 option 1')

    const startButton = wrapper.get('[data-test="start-story-button"]')
    expect(startButton.attributes('disabled')).toBe('')

    await wrapper.get('[data-test="story-mode-button"]').trigger('click')
    await wrapper.get('[data-test="language-fr"]').trigger('click')
    await wrapper.get('[data-test="chapter-length-250"]').trigger('click')

    for (const chapter of [1, 2, 3, 4, 5, 6]) {
      const optionButton = wrapper.get(`[data-test="chapter-${chapter}-option-${chapter * 10 + 1}"]`)
      await optionButton.trigger('click')
    }

    await flushPromises()

    expect(wrapper.get('[data-test="start-story-button"]').attributes('disabled')).toBeUndefined()
    expect(wrapper.text()).toContain('Story ready to begin')
  })

  it('shows retry and exit actions when the API fails to load', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Failed to load feature options'))

    const wrapper = mount(App)

    await flushPromises()

    expect(wrapper.text()).toContain('Could not load story setup')
    expect(wrapper.text()).toContain('Retry')
    expect(wrapper.text()).toContain('Exit')

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        options: [{ id: 11, name: 'Forest', description: ['woodland'] }],
      }),
    })

    await wrapper.get('[data-test="retry-button"]').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Forest')
  })
})
