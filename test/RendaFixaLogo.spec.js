import { mount } from '@vue/test-utils'
import RendaFixaLogoVue from '@/components/RendaFixaLogo.vue'

describe('RendaFixaLogo', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(RendaFixaLogoVue)
    expect(wrapper.vm).toBeTruthy()
  })
})
