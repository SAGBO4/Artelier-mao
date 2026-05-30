import { ref, shallowRef } from 'vue'

export function useTweaks(defaults) {
  const values = ref({ ...defaults })

  function setTweak(keyOrEdits, val) {
    const edits =
      typeof keyOrEdits === 'object' && keyOrEdits !== null
        ? keyOrEdits
        : { [keyOrEdits]: val }
    values.value = { ...values.value, ...edits }
    if (window.parent !== window) {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*')
    }
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: edits }))
  }

  return { t: values, setTweak }
}
