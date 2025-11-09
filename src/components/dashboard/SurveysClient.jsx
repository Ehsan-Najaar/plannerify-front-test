'use client'

import AddEditSurveyModal from '@/app/dashboard/surveys/AddEditSurveyModal'
import Loader from '@/components/Loader'
import Button from '@/components/ui/Button'
import { SURVEY } from '@/data/api'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const SurveyBox = ({ title, description, onCreate }) => {
  const { t } = useTranslation()

  return (
    <div className="bg-card text-text p-6 rounded-md shadow-md flex-1">
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="font-medium text-text opacity-70">{description}</p>
      <Button
        caption={t('Take survey')}
        size="small"
        className="mt-8"
        onClick={onCreate}
      />
    </div>
  )
}

export default function SurveysClient({ surveys = [] }) {
  const { t } = useTranslation()
  const [surveyModalShow, setSurveyModalShow] = useState(false)
  const [surveysState, setSurveysState] = useState(
    Array.isArray(surveys) ? surveys : []
  )

  const [loading, setLoading] = useState(false)

  const about = [
    null,
    t('Customer Satisfaction Survey'),
    t('Product Feedback Survey'),
    t('Employee Engagement Survey'),
  ]

  const reloadSurveys = async () => {
    setLoading(true)
    try {
      const res = await fetch(SURVEY, {
        credentials: 'include',
      })
      const data = await res.json()
      setSurveysState(
        Array.isArray(data) ? data : data.data || data.surveys || []
      )
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <AddEditSurveyModal
        open={!!surveyModalShow}
        category={surveyModalShow}
        onClose={() => setSurveyModalShow(false)}
        reload={reloadSurveys}
      />
      <div className="overflow-auto">
        <div className="flex gap-4 min-w-[1000px]">
          <SurveyBox
            title={t('Customer Satisfaction Survey')}
            description={t(
              'Help us improve our services by sharing your feedback'
            )}
            onCreate={() => setSurveyModalShow('1')}
          />
          <SurveyBox
            title={t('Product Feedback Survey')}
            description={t('Share your thoughts on our latest products')}
            onCreate={() => setSurveyModalShow('2')}
          />
          <SurveyBox
            title={t('Employee Engagement Survey')}
            description={t('We value your input on workplace satisfaction')}
            onCreate={() => setSurveyModalShow('3')}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {loading ? (
          <Loader size={20} />
        ) : surveysState.length === 0 ? (
          <div className="mt-10 text-sm italic text-text">
            {t('No Surveys have been created.')}
          </div>
        ) : (
          surveysState.map((survey, index) => (
            <div key={index} className="bg-card rounded-md p-4 shadow-md">
              <h1 className="text-lg font-semibold text-text">{survey.name}</h1>
              <p className="font-medium text-text">{survey.description}</p>
              <span className="font-normal text-xs bg-slate-200 text-black rounded-full px-1">
                {t('About')} {about[survey.category]}
              </span>
              {survey.answer && (
                <div className="mt-4 bg-slate-300 bg-opacity-20 text-text rounded-md p-4">
                  <h1 className="font-semibold">{t('Admin Answer')}</h1>
                  <p className="font-medium text-text opacity-70 text-sm">
                    {survey.answer}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
