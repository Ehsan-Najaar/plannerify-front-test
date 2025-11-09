'use client'

import AddEditIdeasModal from '@/app/dashboard/ideas/AddEditIdeasModal'
import ConfirmationModal from '@/components/ConfirmationModal'
import Button from '@/components/ui/Button'
import { IDEA } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import '../../../i18n'

const IdeaCard = ({ idea, editIdea, removeIdea, removeLoading }) => {
  const { t } = useTranslation()
  return (
    <div className="bg-card p-4 flex flex-col gap-1 rounded-lg shadow">
      <h1 className="text-xl text-text font-semibold">{idea.title}</h1>
      <p className="font-medium text-text opacity-70 line-clamp-1">
        {idea.description}
      </p>
      <div className="flex gap-1 justify-end">
        <Button
          caption={t('Edit')}
          className="h-8 mt-6"
          onClick={() => editIdea(idea.id)}
        />
        <ConfirmationModal
          title={t('Delete Idea')}
          message={t('Do you want to delete this idea?')}
          yesCaption={t('Delete')}
          noCaption={t('Cancel')}
          confirmHandle={() => removeIdea(idea.id)}
          loading={removeLoading}
        >
          <Button outlined caption={t('Remove')} className="h-8 mt-6" />
        </ConfirmationModal>
      </div>
    </div>
  )
}

export default function IdeasClient({ initialIdeas }) {
  const { t } = useTranslation()
  const [ideaModalShow, setIdeaModalShow] = useState(false)
  const [editMode, setEditMode] = useState()
  const [ideas, setIdeas] = useState(initialIdeas)
  console.log('ideas', ideas)

  const [getIdeasReq] = useRequest({ url: IDEA, method: 'GET' })
  const [ideaDeleteReq, ideaDeleteLoader] = useRequest({
    url: IDEA,
    method: 'DELETE',
  })

  const getIdeas = async () => {
    const r = await getIdeasReq()
    setIdeas(r)
  }

  const deleteIdea = (id) => {
    return ideaDeleteReq({ id })
      .then(() => getIdeas())
      .catch(() => toast.error(t('There was an error. Please try again.')))
  }

  return (
    <div>
      <div className="flex items-center justify-between text-text">
        <h1 className="text-2xl font-semibold">{t('My Ideas')}</h1>
        <Button
          caption={t('Add new Idea')}
          onClick={() => {
            setEditMode(undefined)
            setIdeaModalShow(true)
          }}
        />
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] justify-start gap-4 mt-6">
        {Array.isArray(ideas)
          ? ideas.map((idea, index) => (
              <IdeaCard
                key={index}
                idea={idea}
                editIdea={(id) => {
                  setEditMode(ideas.find((idea) => idea.id === id))
                  setIdeaModalShow(true)
                }}
                removeIdea={(id) => deleteIdea(id)}
                removeLoading={ideaDeleteLoader}
              />
            ))
          : null}
      </div>
      <AddEditIdeasModal
        open={ideaModalShow}
        onClose={() => setIdeaModalShow(false)}
        reload={getIdeas}
        editMode={editMode}
      />
    </div>
  )
}
