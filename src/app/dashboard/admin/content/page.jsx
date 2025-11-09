'use client'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { CONTENT } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import { convertToBase64, groupFeedbacks } from '@/utils/utils'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import '../../../../../i18n'

export default function Content() {
  const { t } = useTranslation()
  const [aboutUs, setAboutUs] = useState([])

  const [content, setContent] = useState([])
  const [files, setFiles] = useState([])

  const [contentReq, contentLoader] = useRequest({
    url: CONTENT,
    method: 'GET',
  })

  const [submitContent, submitContentLoader] = useRequest({
    url: CONTENT,
    method: 'POST',
    multipart: true,
  })

  const getContent = () => {
    contentReq()
      .then((r) => {
        const pair = r.reduce((acc, { key, value }) => {
          acc[key] = value
          return acc
        }, {})
        setContent(pair)
        console.log(groupFeedbacks(r))
        setAboutUs(groupFeedbacks(r))
      })
      .catch((e) => {
        toast.error(t('There is an error getting content.'))
      })
  }

  useEffect(() => {
    getContent()
  }, [])

  const submitContentHandle = () => {
    let data = Object.entries(content).map(([key, value]) => ({ key, value }))

    submitContent({ data, ...files })
      .then((r) => {
        toast.success(t('Saved Successfully.'))
      })
      .catch(() => {
        toast.error(t('And Error occurred.'))
      })
  }

  return (
    <div>
      <div className="flex justify-between items-center text-text">
        <h1 className="text-lg font-semibold">{t('Manage Content')}</h1>
        <Button caption={t('Save Changes')} onClick={submitContentHandle} />
      </div>
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-[200px_auto] items-center gap-6 p-4 mb-10 text-text">
        <div>{t('Hero Text')}</div>
        <div>
          <Input
            value={content.heroText}
            onChange={(e) =>
              setContent({ ...content, heroText: e.target.value })
            }
          />
        </div>
        <div>{t('Hero Description')}</div>
        <div>
          <Input
            multiLine
            value={content.heroDescription}
            onChange={(e) =>
              setContent({ ...content, heroDescription: e.target.value })
            }
          />
        </div>
        <div>{t('Video File')}</div>
        <div>
          <label className="text-white font-medium bg-primary h-10 gap-4 cursor-pointer rounded-full flex justify-center items-center w-fit px-6 hover:bg-primary-dark transition-all">
            <span>{t('Upload')}</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) =>
                setFiles({ ...files, videoFile: e.target.files[0] })
              }
            />
          </label>
        </div>
        <div>{t('Features Text')}</div>
        <div>
          <Input
            value={content.featuresText}
            onChange={(e) =>
              setContent({ ...content, featuresText: e.target.value })
            }
          />
        </div>
        <div>{t('Features Description')}</div>
        <div>
          <Input
            multiLine
            value={content.featuresDescription}
            onChange={(e) =>
              setContent({ ...content, featuresDescription: e.target.value })
            }
          />
        </div>
      </div>
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="mt-4 grid grid-cols-1 lg:grid-cols-[200px_auto] items-center gap-6 bg-card text-text p-4 rounded-md"
          >
            <div>
              {t('Feature')} {index + 1} {t('Header')}
            </div>
            <div>
              <Input
                value={content[`featureHeader_${index + 1}`]}
                onChange={(e) => {
                  let key = `featureHeader_${index + 1}`
                  setContent({ ...content, [key]: e.target.value })
                }}
              />
            </div>
            <div>
              {t('Feature')} {index + 1} {t('Description')}
            </div>
            <div>
              <Input
                multiLine
                value={content[`featureDescription_${index + 1}`]}
                onChange={(e) => {
                  let key = `featureDescription_${index + 1}`
                  setContent({ ...content, [key]: e.target.value })
                }}
              />
            </div>
            <div>
              {t('Feature')} {index + 1} {t('Image')}
            </div>
            <div>
              <label className="text-white font-medium bg-primary h-10 gap-4 cursor-pointer rounded-full flex justify-center items-center w-fit px-6 hover:bg-primary-dark transition-all">
                <span>{t('Upload')}</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    let key = `featureImage_${index + 1}`
                    setFiles({ ...files, [key]: e.target.files[0] })
                  }}
                />
              </label>
            </div>
          </div>
        ))}
      <div className="mt-10 grid grid-cols-[200px_auto] items-center gap-6 p-4 mb-10 text-text">
        <div>{t('About us Text')}</div>
        <div>
          <Input
            value={content.aboutText}
            onChange={(e) =>
              setContent({ ...content, aboutText: e.target.value })
            }
          />
        </div>
      </div>
      {aboutUs.map((about, index) => (
        <div className="mt-4 grid grid-cols-[200px_auto] items-center gap-6 bg-card text-text p-4 rounded-md">
          <div>{t('Person Name')}</div>
          <div>
            <Input
              value={content[`personName_${index + 1}`]}
              onChange={(e) => {
                let key = `personName_${index + 1}`
                setContent({ ...content, [key]: e.target.value })
              }}
            />
          </div>
          <div>{t('Person Tag')}</div>
          <div>
            <Input
              value={content[`personTag_${index + 1}`]}
              onChange={(e) => {
                let key = `personTag_${index + 1}`
                setContent({ ...content, [key]: e.target.value })
              }}
            />
          </div>
          <div>{t('Feedback')}</div>
          <div>
            <Input
              multiLine
              value={content[`personFeedback_${index + 1}`]}
              onChange={(e) => {
                let key = `personFeedback_${index + 1}`
                setContent({ ...content, [key]: e.target.value })
              }}
            />
          </div>
          <div>{t('Profile picture')}</div>
          <div>
            <label className="text-white font-medium bg-primary h-10 gap-4 cursor-pointer rounded-full flex justify-center items-center w-fit px-6 hover:bg-primary-dark transition-all">
              <span>{t('Upload')}</span>
              <input
                type="file"
                className="hidden"
                onChange={async (e) => {
                  let key = `personProfile_${index + 1}`
                  setContent({
                    ...content,
                    [key]: await convertToBase64(e.target.files[0]),
                  })
                }}
              />
            </label>
          </div>
        </div>
      ))}
      <Button
        caption={t('Add more feedback')}
        className="mt-10"
        onClick={() =>
          setAboutUs([
            ...aboutUs,
            {
              personName: '',
              personTag: '',
              personFeedback: '',
              personProfile: '',
            },
          ])
        }
      />
    </div>
  )
}
