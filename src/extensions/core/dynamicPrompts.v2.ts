/**
 * DynamicPrompts — rewritten with the v2 extension API.
 *
 * v1: reads node.widgets, assigns widget.serializeValue
 * v2: same logic, uses WidgetHandle instead of raw widget
 */

import {
  defineNode,
  type NodeHandle,
  type WidgetBeforeSerializeEvent
} from '@/extension-api'
import { useExtensionStore } from '@/stores/extensionStore'
import { processDynamicPrompt } from '@/utils/formatUtil'

defineNode({
  name: 'Comfy.DynamicPrompts.V2',

  nodeCreated(node: NodeHandle) {
    // RFR-12144-1 strangler-fig guard (D6): v1 + v2 coexist as Phase A demos,
    // but only one path runs per node. v1 wraps widget.serializeValue, so if
    // v1 is registered we no-op to avoid double-processing on serialize.
    if (useExtensionStore().isExtensionInstalled('Comfy.DynamicPrompts')) return

    for (const widget of node.getWidgets()) {
      if (widget.getOption('dynamicPrompts')) {
        widget.on('beforeSerialize', (e: WidgetBeforeSerializeEvent) => {
          if (e.context === 'prompt') {
            const value = widget.getValue()
            e.setSerializedValue(
              typeof value === 'string' ? processDynamicPrompt(value) : value
            )
          }
        })
      }
    }
  }
})
