import html2canvas from 'html2canvas'

export async function downloadPreview(
  elementId: string,
  filename: string
): Promise<void> {
  const el = document.getElementById(elementId)
  if (!el) return
  const canvas = await html2canvas(el, {
    useCORS: true,
    backgroundColor: null,
    scale: 2,
  })
  canvas.toBlob(blob => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}
