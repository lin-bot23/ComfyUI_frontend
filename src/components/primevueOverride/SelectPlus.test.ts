import { fireEvent, render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import PrimeVue from 'primevue/config'
import { defineComponent, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import SelectPlus from './SelectPlus.vue'

function renderFilteredSelect() {
  const value = ref('euler')
  const options = ['euler', 'uni_pc', 'uni_pc_bh2']
  const Harness = defineComponent({
    components: { SelectPlus },
    setup: () => ({ options, value }),
    template: `
      <SelectPlus
        v-model="value"
        filter
        auto-filter-focus
        :options
      />
    `
  })

  const user = userEvent.setup()
  const utils = render(Harness, {
    global: {
      plugins: [PrimeVue]
    }
  })

  return { ...utils, user, value }
}

describe('SelectPlus', () => {
  it('selects the top filtered option when Enter is pressed in the filter input', async () => {
    const { user, value } = renderFilteredSelect()

    await user.click(screen.getByRole('combobox'))
    const searchbox = screen.getByRole('searchbox', { hidden: true })
    await fireEvent.update(searchbox, 'uni')
    expect(value.value).toBe('euler')

    await user.type(searchbox, '{Enter}', { skipClick: true })
    expect(value.value).toBe('uni_pc')
  })
})
