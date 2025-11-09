'use client'

import Loader from '@/components/Loader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { SURVEY } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import '../../../../../i18n'

const SurveyCard = ({ survey }) => {
  const [answer, setAnswer] = useState(survey.answer)
  const { t } = useTranslation()
  const about = [
    null,
    t('Customer Satisfaction Survey'),
    t('Product Feedback Survey'),
    t('Employee Engagement Survey'),
  ]

  const [answerReq, answerLoader] = useRequest({
    url: SURVEY + '/' + survey.id,
    method: 'PATCH',
  })

  const submitAnswer = () => {
    answerReq({ answer })
      .then((r) => {
        toast.success(t('Answer submitted successfully'))
      })
      .catch(() => {
        toast.error(t('An error occurred.'))
      })
  }

  return (
    <div className="p-4 bg-card rounded-lg shadow-md border border-slate-400 border-opacity-20 text-text border-solid">
      <div className="flex md:flex-row flex-col justify-between md:items-center">
        <div>
          {survey.user.firstName} {survey.user.lastName}
        </div>
        <span className="font-normal text-xs bg-slate-300 bg-opacity-20 rounded-full px-1">
          {t('About')} {about[survey.category]}
        </span>
      </div>
      <div className="mt-4 font-semibold">{survey.name}</div>
      <div>{survey.description}</div>
      <div className="mt-4 flex flex-col gap-4">
        <Input
          multiLine
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <Button
          caption={t('Submit answer')}
          onClick={submitAnswer}
          loading={answerLoader}
        />
      </div>
    </div>
  )
}

export default function AdminSurveyPage() {
  const [surveys, setSurveys] = useState()
  const { t } = useTranslation()

  const [surveysReq, surveysLoader] = useRequest({
    url: SURVEY + '/admin',
    method: 'GET',
  })

  const getSurveys = () => {
    surveysReq().then((r) => {
      setSurveys(r)
    })
  }

  useEffect(() => {
    getSurveys()
  }, [])

  return (
    <div className="flex flex-col gap-2">
      {surveysLoader ? (
        <Loader size={30} />
      ) : surveys?.length === 0 ? (
        <div className="text-slate-500 text-sm italic">
          {t('Nothing is here.')}
        </div>
      ) : (
        surveys?.map((survey, index) => (
          <SurveyCard key={index} survey={survey} />
        ))
      )}
    </div>
  )
}
