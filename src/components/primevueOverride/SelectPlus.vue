<script>
import Select from 'primevue/select'

export default {
  name: 'SelectPlus',
  extends: Select,
  emits: ['hide'],
  methods: {
    onFilterChange(event) {
      Select.methods.onFilterChange.call(this, event)
      if (event.isComposing) return

      const optionIndex = this.findFirstOptionIndex()
      this.focusedOptionIndex = optionIndex
      this.scrollInView(optionIndex)
    },
    onOverlayLeave() {
      this.unbindOutsideClickListener()
      this.unbindScrollListener()
      this.unbindResizeListener()

      this.$emit('hide')
      this.overlay = null
    }
  }
}
</script>
