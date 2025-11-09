'use client'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { SUBSCRIPTIONS } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import { safeParseJSON } from '@/utils/utils'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import '../../../../../i18n'

const SubscriptionCard = ({
  cardTitle,
  title,
  setTitle,
  description,
  setDescription,
  price,
  setPrice,
  options,
  setOptions,
}) => {
  const { t } = useTranslation()
  return (
    <div className="bg-card text-text p-4 shadow-lg rounded-lg flex flex-col gap-4">
      <div className="text-lg font-medium mb-4">{cardTitle}</div>
      <Input
        label={t('Title')}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Plan Title"
      />
      <Input
        label={t('Description')}
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Plan Description"
      />
      <Input
        label={t('Price')}
        type="text"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Plan Price"
      />
      <label className="mt-6">{t('Options')}</label>
      <div className="flex flex-col gap-4">
        {options?.length === 0 ? (
          <span className="text-xs italic">{t('Click to add options')}</span>
        ) : (
          options?.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="text"
                value={option}
                onChange={(e) =>
                  setOptions(
                    options.map((o, i) => (i === index ? e.target.value : o))
                  )
                }
              />
              <Button
                caption="x"
                outlined
                size="small"
                onClick={() =>
                  setOptions(options.filter((_, i) => i !== index))
                }
              />
            </div>
          ))
        )}
      </div>
      <Button
        size="small"
        caption={t('Add new option')}
        onClick={() => setOptions([...options, ''])}
      />
    </div>
  )
}

export default function Subscription() {
  const { t } = useTranslation()

  const [subscriptions, setSubscriptions] = useState({
    bronze: {
      title: '',
      description: '',
      price: '',
      options: [],
    },
    silver: {
      title: '',
      description: '',
      price: '',
      options: [],
    },
    gold: {
      title: '',
      description: '',
      price: '',
      options: [],
    },
  })

  const [subscriptionsReq, subscriptionsLoader] = useRequest({
    url: SUBSCRIPTIONS,
    method: 'GET',
  })

  const [subscriptionsSaveReq, subscriptionsSaveLoader] = useRequest({
    url: SUBSCRIPTIONS,
    method: 'POST',
  })

  const getSubscriptions = () => {
    subscriptionsReq().then((r) => {
      setSubscriptions({
        bronze: {
          title: r?.[0].bronzeTitle,
          description: r?.[0].bronzeDescription,
          price: r?.[0].bronzePrice,
          options: safeParseJSON(r?.[0].bronzeOptions),
        },
        silver: {
          title: r?.[0].silverTitle,
          description: r?.[0].silverDescription,
          price: r?.[0].silverPrice,
          options: safeParseJSON(r?.[0].silverOptions),
        },
        gold: {
          title: r?.[0].goldTitle,
          description: r?.[0].goldDescription,
          price: r?.[0].goldPrice,
          options: safeParseJSON(r?.[0].goldOptions),
        },
      })
    })
  }

  useEffect(() => {
    getSubscriptions()
  }, [])

  const submitData = () => {
    subscriptionsSaveReq({
      bronzeTitle: subscriptions.bronze.title,
      bronzeDescription: subscriptions.bronze.description,
      bronzePrice: subscriptions.bronze.price,
      bronzeOptions: subscriptions.bronze.options,

      silverTitle: subscriptions.silver.title,
      silverDescription: subscriptions.silver.description,
      silverPrice: subscriptions.silver.price,
      silverOptions: subscriptions.silver.options,

      goldTitle: subscriptions.gold.title,
      goldDescription: subscriptions.gold.description,
      goldPrice: subscriptions.gold.price,
      goldOptions: subscriptions.gold.options,
    })
      .then((r) => {
        toast.success(t('Saved Successfully'))
      })
      .catch((e) => toast.error(t('there is an error')))
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="font-semibold text-xl text-text">
          {t('Subscriptions')}
        </div>
        <div>
          <Button caption={t('Save Changes')} onClick={submitData} />
        </div>
      </div>
      <div className="grid grid-cols-1 mt-8 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <SubscriptionCard
          cardTitle={t('Free Options')}
          title={subscriptions.bronze?.title}
          description={subscriptions.bronze?.description}
          price={subscriptions.bronze?.price}
          options={subscriptions.bronze?.options}
          setTitle={(e) => {
            const temp = { ...subscriptions }
            temp.bronze.title = e
            setSubscriptions(temp)
          }}
          setDescription={(e) => {
            const temp = { ...subscriptions }
            temp.bronze.description = e
            setSubscriptions(temp)
          }}
          setPrice={(e) => {
            const temp = { ...subscriptions }
            temp.bronze.price = e
            setSubscriptions(temp)
          }}
          setOptions={(e) => {
            const temp = { ...subscriptions }
            temp.bronze.options = e
            setSubscriptions(temp)
          }}
        />
        <SubscriptionCard
          cardTitle={t('Premium Options')}
          title={subscriptions.silver?.title}
          description={subscriptions.silver?.description}
          price={subscriptions.silver?.price}
          options={subscriptions.silver?.options}
          setTitle={(e) => {
            const temp = { ...subscriptions }
            temp.silver.title = e
            setSubscriptions(temp)
          }}
          setDescription={(e) => {
            const temp = { ...subscriptions }
            temp.silver.description = e
            setSubscriptions(temp)
          }}
          setPrice={(e) => {
            const temp = { ...subscriptions }
            temp.silver.price = e
            setSubscriptions(temp)
          }}
          setOptions={(e) => {
            const temp = { ...subscriptions }
            temp.silver.options = e
            setSubscriptions(temp)
          }}
        />
        {/* <SubscriptionCard
          cardTitle={t("Gold Options")}
          title={subscriptions.gold?.title}
          description={subscriptions.gold?.description}
          price={subscriptions.gold?.price}
          options={subscriptions.gold?.options}
          setTitle={(e) => {
            const temp = { ...subscriptions };
            temp.gold.title = e;
            setSubscriptions(temp);
          }}
          setDescription={(e) => {
            const temp = { ...subscriptions };
            temp.gold.description = e;
            setSubscriptions(temp);
          }}
          setPrice={(e) => {
            const temp = { ...subscriptions };
            temp.gold.price = e;
            setSubscriptions(temp);
          }}
          setOptions={(e) => {
            const temp = { ...subscriptions };
            temp.gold.options = e;
            setSubscriptions(temp);
          }}
        /> */}
      </div>
    </div>
  )
}
