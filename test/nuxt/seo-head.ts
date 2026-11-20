import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import type { Component } from 'vue'

/**
 * Mounts a page and settles unhead's DOM side effects.
 *
 * unhead applies head tags on a timer; without the extra flush the page's
 * meta tags are not yet in document.head when the test asserts.
 */
export async function mountPageAndSettleHead(page: Component) {
  const wrapper = await mountSuspended(page)
  await flushPromises()
  await new Promise(resolve => setTimeout(resolve, 0))
  await flushPromises()
  return wrapper
}
