'use client'

import Loader from '@/components/Loader'
import { TableContent, TableHead } from '@/components/TinyComponents'
import Button from '@/components/ui/Button'
import { OVERVIEW, PAYPAL_CHART } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import '../../../../i18n'

const Box = ({ title, children, className }) => (
  <div className={`bg-card text-text p-4 rounded-lg shadow-sm ${className}`}>
    <h1 className="text-xl font-semibold  mb-6">{title}</h1>
    <div className="flex gap-2">{children}</div>
  </div>
)

const InnerBox = ({ caption, value }) => (
  <div className="flex-1 border border-slate-200 rounded-lg p-4">
    <h2 className="font-medium text-lg text-slate-400">{caption}</h2>
    <p className="text-2xl font-semibold">{value}</p>
  </div>
)

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null

  const containerStyle = {
    backgroundColor: 'var(--background)',
    color: 'var(--text)',
    padding: '8px 12px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    fontSize: '14px',
  }

  return (
    <div style={containerStyle}>
      <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ margin: 0 }}>
          {entry.name === 'Total USD'
            ? `${entry.name}: $${entry.value}`
            : `${entry.name}: ${entry.value}`}
        </p>
      ))}
    </div>
  )
}

export default function AdminOverview() {
  const { t } = useTranslation()

  const [overviewReq, overviewLoader] = useRequest({
    url: OVERVIEW,
    method: 'GET',
    loaderInitState: true,
  })
  const [overview, setOverview] = useState({})
  const getOverview = () => {
    overviewReq().then((r) => {
      setOverview(r)
    })
  }

  useEffect(() => {
    getOverview()
  }, [])

  const [raw, setRaw] = useState([])
  const [chartReq, chartLoader] = useRequest({
    url: PAYPAL_CHART,
    method: 'GET',
  })

  useEffect(() => {
    chartReq().then((r) => {
      setRaw(r)
    })
  }, [])

  function monthLabel(year, month1to12) {
    const abbr = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ][month1to12 - 1]
    return `${abbr} ${year}`
  }

  function fillMissingMonths(rows) {
    if (!rows.length) return []
    const firstY = rows[0].year,
      firstM = rows[0].monthIndex
    const last = rows[rows.length - 1]
    const lastY = last.year,
      lastM = last.monthIndex

    const out = []
    let y = firstY,
      m = firstM
    const key = (Y, M) => `${Y}-${M}`

    const map = new Map(rows.map((r) => [key(r.year, r.monthIndex), r]))
    while (y < lastY || (y === lastY && m <= lastM)) {
      const r = map.get(key(y, m))
      out.push({
        month: monthLabel(y, m),
        sales: r?.sales ?? 0,
        totalUSD: r?.totalUSD ?? 0,
      })
      m++
      if (m === 13) {
        m = 1
        y++
      }
    }
    return out
  }
  const data = fillMissingMonths(raw)

  const totals = useMemo(() => {
    return (data ?? []).reduce(
      (acc, row) => {
        acc.sales += Number(row.sales || 0)
        acc.totalUSD += Number(row.totalUSD || 0)
        return acc
      },
      { sales: 0, totalUSD: 0 }
    )
  }, [data])

  const money = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  }).format(totals.totalUSD)

  return overviewLoader ? (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader size={20} />
    </div>
  ) : (
    <div>
      <Box title={t('Overview')}>
        <InnerBox
          caption={t('Total Customers')}
          value={overview.numberOfUsers}
        />
        <InnerBox caption={t('Total Sales')} value={money + 'USD'} />
      </Box>
      <Box title={t('Last Signups')} className="mt-4">
        <div className="flex flex-col overflow-hidden w-full">
          <div className="overflow-auto">
            <div className="grid grid-cols-3 flex-1 min-w-[800px]">
              <TableHead>{t('Name')}</TableHead>
              <TableHead>{t('Email')}</TableHead>
              <TableHead>{t('Join Date')}</TableHead>
              {overview.lastThreeUser.map((user, index) => (
                <React.Fragment key={index}>
                  <TableContent>
                    {user.firstName} {user.lastName}
                  </TableContent>
                  <TableContent>{user.email}</TableContent>
                  <TableContent>
                    {moment(user.createdAt).format('YYYY/MM/DD')}
                  </TableContent>
                </React.Fragment>
              ))}
            </div>
          </div>
          <Button
            href="/dashboard/admin/users"
            caption={t('See All Users')}
            className="mt-10"
          />
        </div>
      </Box>
      <Box title={t('Sales')} className="mt-4">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="sales"
              fill={
                localStorage.getItem('theme') === 'dark' ? '#6366F1' : '#A5B4FC'
              }
              name="Sales"
            />
            <Bar
              dataKey="totalUSD"
              fill={
                localStorage.getItem('theme') === 'dark' ? '#10B981' : '#6EE7B7'
              }
              name="Total USD"
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </div>
  )
}
