'use client'

import Button from '@/components/ui/Button'
import { SOCIAL } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import { useEffect, useState } from 'react'

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => resolve(fr.result)
    fr.onerror = reject
    fr.readAsDataURL(file)
  })
}

export default function SocialMediaPage() {
  const [listReq, listLoading] = useRequest({ url: SOCIAL, method: 'GET' })
  const [createReq, creating] = useRequest({ url: SOCIAL, method: 'POST' })
  const [updateReq, updating] = useRequest({ url: SOCIAL, method: 'PUT' })
  const [deleteReq, deleting] = useRequest({ url: SOCIAL, method: 'DELETE' })

  // ---- state ----
  const [items, setItems] = useState([])
  const [err, setErr] = useState(null)

  const [idEditing, setIdEditing] = useState(null)
  const [name, setName] = useState('')
  const [link, setLink] = useState('')
  const [logoBase64, setLogoBase64] = useState('')

  const resetForm = () => {
    setIdEditing(null)
    setName('')
    setLink('')
    setLogoBase64('')
  }

  useEffect(() => {
    ;(async () => {
      try {
        setErr(null)

        const data = await listReq({ params: { offset: 0, limit: 100 } })
        setItems(
          Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data)
            ? data
            : []
        )
      } catch (e) {
        setErr(e?.message || 'Failed to load')
      }
    })()
  }, [])

  async function handleSubmit(e) {
    setErr(null)
    const payload = { name, link, logoBase64 }

    try {
      if (idEditing) {
        const updated = await updateReq({
          ...payload,
          id: idEditing,
        })
        setItems((prev) =>
          prev.map((it) => (it.id === idEditing ? updated : it))
        )
      } else {
        const created = await createReq({ ...payload })
        setItems((prev) => [created, ...prev])
      }
      resetForm()
    } catch (e) {
      setErr(e?.message || 'Save failed')
    }
  }

  // ---- delete ----
  async function handleDelete(id) {
    if (!confirm('Delete this social link?')) return
    try {
      await deleteReq({ id })
      setItems((prev) => prev.filter((it) => it.id !== id))
      if (idEditing === id) resetForm()
    } catch (e) {
      setErr(e?.message || 'Delete failed')
    }
  }

  // ---- edit ----
  function startEdit(item) {
    setIdEditing(item.id)
    setName(item.name || '')
    setLink(item.link || '')
    setLogoBase64(item.logoBase64 || '')
    document
      .getElementById('social-form')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  // ---- file picker -> base64 ----
  async function handlePickFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await readFileAsDataURL(file)
      setLogoBase64(dataUrl)
    } catch {
      setErr('Failed to read file')
    }
  }

  const busy = listLoading || creating || updating || deleting

  return (
    <div className="text-text">
      <div className="text-xl font-bold mb-4">Social Media Settings Page</div>

      {err && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700">
          {err}
        </div>
      )}

      <form id="social-form" className="space-y-3 max-w-2xl">
        <div className="grid grid-cols-1 gap-3">
          <label className="flex flex-col">
            <span className="text-sm mb-1">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Twitter / Instagram / LinkedIn ..."
              className="rounded-md border px-3 py-2 bg-transparent"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm mb-1">Link</span>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              placeholder="https://example.com/your-handle"
              className="rounded-md border px-3 py-2 bg-transparent"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex flex-col">
            <span className="text-sm mb-1">Logo (Base64/Data URL)</span>
            <textarea
              value={logoBase64}
              onChange={(e) => setLogoBase64(e.target.value)}
              required
              placeholder="data:image/png;base64,iVBORw0K..."
              className="rounded-md border px-3 py-2 bg-transparent min-h-[110px]"
            />
          </label>

          <div className="flex flex-col">
            <span className="text-sm mb-1">Upload image (optional)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePickFile}
              className="rounded-md border px-3 py-2 bg-transparent"
            />
            <div className="mt-3">
              {logoBase64 ? (
                <img
                  src={logoBase64}
                  alt="preview"
                  className="h-20 w-20 object-contain rounded-md border"
                />
              ) : (
                <div className="h-20 w-20 rounded-md border flex items-center justify-center text-xs opacity-60">
                  Preview
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            caption={
              idEditing
                ? busy
                  ? 'Updating...'
                  : 'Update'
                : busy
                ? 'Saving...'
                : 'Add Social Media Link'
            }
            className="mt-2"
          />
          {idEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border px-4 py-2 mt-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-8">
        <div className="text-lg font-semibold mb-3">Your Social Links</div>

        {listLoading ? (
          <div>Loading…</div>
        ) : items.length === 0 ? (
          <div className="opacity-70">No items yet.</div>
        ) : (
          <ul className="space-y-3">
            {items.map((it) => (
              <li
                key={it.id}
                className="rounded-xl border p-3 flex items-center gap-3"
              >
                <img
                  src={it.logoBase64}
                  alt={it.name}
                  className="h-10 w-10 object-contain rounded-md border"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{it.name}</div>
                  <a
                    className="text-sm underline break-all opacity-80"
                    href={it.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {it.link}
                  </a>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(it)}
                    className="rounded-md border px-3 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(it.id)}
                    className="rounded-md border px-3 py-1 text-red-600 border-red-300"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
