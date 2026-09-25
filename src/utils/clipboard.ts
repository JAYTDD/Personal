/**
 * Copy text to the clipboard, falling back to a hidden textarea +
 * execCommand when the async Clipboard API is unavailable (non-secure
 * contexts) or the permission is denied.
 */
export async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    textarea.remove()
  }
}
