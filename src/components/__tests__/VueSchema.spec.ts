import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import VueSchema from '../VueSchema.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(VueSchema, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
