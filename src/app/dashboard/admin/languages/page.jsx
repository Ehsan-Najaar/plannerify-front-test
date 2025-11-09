'use client'

import LanguageModal from '@/app/dashboard/admin/languages/LanguageModal'
import ConfirmationModal from '@/components/ConfirmationModal'
import Loader from '@/components/Loader'
import { TableContent, TableHead } from '@/components/TinyComponents'
import Button from '@/components/ui/Button'
import { LANGUAGE } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

export default function AdminUsers() {
  const { t } = useTranslation()

  const [languagesReq, languagesLoader] = useRequest({
    url: LANGUAGE,
    method: 'GET',
  })

  const [languages, setLanguages] = useState([])

  const getLanguages = () => {
    languagesReq()
      .then((r) => setLanguages(r))
      .catch(() => {
        toast.error(t('There is an error getting users.'))
      })
  }

  useEffect(() => {
    getLanguages()
  }, [])

  const [languageModalShow, setLanguageModalShow] = useState(false)

  const [deleteLanguageReq, deleteLanguageLoader] = useRequest({
    url: LANGUAGE,
    method: 'DELETE',
  })

  const deleteLanguage = (languageCode) => {
    return deleteLanguageReq({ languageCode })
      .then((r) => {
        toast.success(t('Language deleted successfully.'))
        getLanguages()
      })
      .catch(() => {
        toast.error(t('An error occurred'))
      })
  }

  return (
    <div>
      <LanguageModal
        open={languageModalShow}
        onClose={() => setLanguageModalShow(false)}
        reload={getLanguages}
      />
      <div className="flex justify-between">
        <h1 className="text-lg font-semibold text-text">
          {t('Manage Languages')}
        </h1>
        <div className="flex gap-2">
          <Button
            caption={t('Upload')}
            onClick={() => setLanguageModalShow(true)}
          />
          <Button
            caption={t('Get Template File')}
            href="/locales/en/common.json"
            download
          />
        </div>
      </div>
      <div className="grid grid-cols-3 mt-8">
        <TableHead>{t('Language Code')}</TableHead>
        <TableHead>{t('Direction')}</TableHead>
        <TableHead>{t('Options')}</TableHead>
        {languagesLoader ? (
          <div className="col-span-2">
            <Loader size={30} />
          </div>
        ) : languages.length === 0 ? (
          <div className="col-span-3 text-center text-sm italic p-4">
            {t('Not found!')}
          </div>
        ) : (
          languages.map((language, index) => (
            <React.Fragment key={index}>
              <TableContent>{language.languageCode}</TableContent>
              <TableContent>{language.direction}</TableContent>
              <TableContent>
                <div className="flex gap-2">
                  <ConfirmationModal
                    title={t('Deleting a language')}
                    message={t(
                      'Are you sure you want to delete this language?'
                    )}
                    yesCaption={t('Delete')}
                    noCaption={t('Cancel')}
                    confirmHandle={() => deleteLanguage(language.languageCode)}
                    loading={deleteLanguageLoader}
                  >
                    <Button
                      caption={t('Delete')}
                      size="small"
                      outlined
                      className="whitespace-nowrap"
                    />
                  </ConfirmationModal>
                </div>
              </TableContent>
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  )
}
