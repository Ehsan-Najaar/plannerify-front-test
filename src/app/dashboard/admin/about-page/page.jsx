'use client'

import CKEditorHtml from '@/components/CKEditorHtnl'
import Button from '@/components/ui/Button'
import { ABOUT, LANGUAGE } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function AboutAdminPage() {
  const [langsReq, langsLoading] = useRequest({
    url: LANGUAGE,
    method: 'GET',
  })
  const [listReq, listLoading] = useRequest({ url: ABOUT, method: 'GET' })
  const [saveReq, saving] = useRequest({ url: ABOUT, method: 'POST' })
  const [deleteReq, deleting] = useRequest({ url: ABOUT, method: 'DELETE' })

  const [languages, setLanguages] = useState([])
  const [activeLangId, setActiveLangId] = useState(null)
  const [contentHtml, setContentHtml] = useState('')
  const [aboutMap, setAboutMap] = useState(new Map())
  const [err, setErr] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        setErr(null)
        const langs = await langsReq()
        setLanguages(langs || [])
        if (langs?.[0]?.id) setActiveLangId(langs[0].id)

        const res = await listReq({ params: { offset: 0, limit: 100 } })
        const items = res?.items ?? res ?? []
        const m = new Map()
        items.forEach((it) => m.set(it.languageId, it))
        setAboutMap(m)
      } catch (e) {
        setErr(e?.message || 'Load failed')
      }
    })()
  }, []) // eslint-disable-line

  useEffect(() => {
    if (!activeLangId) return
    const rec = aboutMap.get(activeLangId)
    setContentHtml(rec?.contentHtml || '')
  }, [activeLangId, aboutMap])

  async function handleSave() {
    if (!activeLangId) return

    try {
      setErr(null)

      // 🔹 فراخوانی save
      const saved = await saveReq({
        languageId: activeLangId,
        contentHtml,
      })

      setAboutMap((prev) => {
        const m = new Map(prev)
        m.set(activeLangId, saved)
        return m
      })

      // 🔹 toast موفقیت
      toast.success('Content saved successfully!')
    } catch (e) {
      setErr(e?.message || 'Save failed')
      // 🔹 toast خطا
      toast.error('Failed to save content!')
    }
  }

  const busy = langsLoading || listLoading || saving || deleting

  return (
    <div className="text-text">
      <div className="text-xl font-bold mb-4">About Us (per language)</div>

      {err && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700">
          {err}
        </div>
      )}

      <div className="mb-3">
        <label className="text-sm mr-2">Language</label>
        <select
          value={activeLangId || ''}
          onChange={(e) => setActiveLangId(Number(e.target.value))}
          className="rounded-md border px-3 py-2 bg-transparent"
        >
          {languages.map((l) => (
            <option key={l.id} value={l.id} className="text-black">
              {l.languageCode} {l.direction === 'rtl' ? '(RTL)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div
        className={
          languages.find((l) => l.id === activeLangId)?.direction === 'rtl'
            ? 'rtl'
            : ''
        }
      >
        <CKEditorHtml value={contentHtml} onChange={setContentHtml} />
      </div>

      <div className="flex gap-2 mt-3">
        <Button caption={busy ? 'Saving...' : 'Save'} onClick={handleSave} />
      </div>
    </div>
  )
}
