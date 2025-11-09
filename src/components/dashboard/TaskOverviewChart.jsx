'use client'

import Box from '@/components/ui/Box'
import '@/styles/recharts.css'
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfWeek,
  format,
  getDaysInMonth,
  startOfWeek,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns'
import { ChevronLeft, ChevronRight, ListCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

// ---------- Custom Tooltip ----------
function CustomTooltip({ active, payload, label, isDark }) {
  if (!active || !payload?.length) return null
  return (
    <div
      className={`custom-tooltip ${
        isDark ? 'dark' : 'light'
      } p-2 rounded shadow`}
    >
      <p className="font-semibold">{label}</p>
      <p className="text-primary">Done: {payload[0]?.value ?? 0}</p>
      <p>Undone: {payload[1]?.value ?? 0}</p>
    </div>
  )
}

// ---------- helpers ----------
const monthNamesShort = [
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
]
// helper: given year string like "2025" return the corresponding object or undefined
const findYearData = (taskOverview, year) =>
  Array.isArray(taskOverview)
    ? taskOverview.find((y) => String(y.year) === String(year))
    : undefined

// safe getter for monthly/day keys (normalize keys to lowercase)
const getMonthlyEntry = (yearData, monthIdx) => {
  if (!yearData?.data?.monthly) return { done: 0, undone: 0 }
  const key = monthNamesShort[monthIdx].toLowerCase() // e.g. 'nov'
  return yearData.data.monthly[key] || { done: 0, undone: 0 }
}

const getDailyEntry = (yearData, date) => {
  if (!yearData?.data?.daily) return { done: 0, undone: 0 }
  const key = format(date, 'yyyy-MM-dd') // مثلاً "2025-11-03"
  return yearData.data.daily[key] || { done: 0, undone: 0 }
}

const getWeeklyEntryFromDaily = (yearData, date) => {
  // date is a JS Date -> use date.getDate() to index into daily
  const dayNum = date.getDate()
  return getDailyEntry(yearData, dayNum)
}

export default function TaskOverviewChart({ taskOverview = [], isDark }) {
  const { t } = useTranslation?.() || { t: (s) => s }
  const today = new Date()
  const [viewMode, setViewMode] = useState('Monthly') // Monthly | Weekly | Daily
  const [currentDate, setCurrentDate] = useState(today)

  console.log('taskOverview', taskOverview)

  // navigation handlers (same UX you had)
  const handlePrev = () => {
    if (viewMode === 'Monthly') setCurrentDate((d) => subYears(d, 1))
    else if (viewMode === 'Weekly') setCurrentDate((d) => subWeeks(d, 1))
    else if (viewMode === 'Daily') setCurrentDate((d) => subMonths(d, 1))
  }
  const handleNext = () => {
    if (viewMode === 'Monthly') setCurrentDate((d) => addYears(d, 1))
    else if (viewMode === 'Weekly') setCurrentDate((d) => addWeeks(d, 1))
    else if (viewMode === 'Daily') setCurrentDate((d) => addMonths(d, 1))
  }

  // header label
  const headerLabel = useMemo(() => {
    if (viewMode === 'Monthly') {
      return currentDate.getFullYear()
    }
    if (viewMode === 'Weekly') {
      const s = startOfWeek(currentDate, { weekStartsOn: 1 })
      const e = endOfWeek(currentDate, { weekStartsOn: 1 })
      const startDay = format(s, 'd LLL')
      const endDay = format(e, 'd LLL yyyy')
      return `${startDay} - ${endDay}`
    }
    return format(currentDate, 'LLL yyyy')
  }, [viewMode, currentDate])

  // choose yearData for the current year shown (important!)
  const yearData = useMemo(() => {
    const y = currentDate.getFullYear()
    return findYearData(taskOverview, y)
  }, [taskOverview, currentDate])

  // compute the start/end date for filtering (inclusive)
  const { rangeStart, rangeEnd } = useMemo(() => {
    if (viewMode === 'Monthly') {
      const y = currentDate.getFullYear()
      const start = new Date(y, 0, 1, 0, 0, 0)
      const end = new Date(y, 11, 31, 23, 59, 59)
      return { rangeStart: start, rangeEnd: end }
    }
    if (viewMode === 'Weekly') {
      const s = startOfWeek(currentDate, { weekStartsOn: 1 })
      const e = endOfWeek(currentDate, { weekStartsOn: 1 })
      s.setHours(0, 0, 0, 0)
      e.setHours(23, 59, 59, 999)
      return { rangeStart: s, rangeEnd: e }
    }
    // Daily: show current month days
    const start = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
      0,
      0,
      0
    )
    const lastDay = getDaysInMonth(start)
    const end = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      lastDay,
      23,
      59,
      59,
      999
    )
    return { rangeStart: start, rangeEnd: end }
  }, [viewMode, currentDate])

  // بالای فایل یا حداقل قبل از useMemo(chartData)
  const inferredDailyMonthIdx = useMemo(() => {
    if (!yearData?.data) return null
    const dailyMap = yearData.data.daily || {}
    let dailyTotal = 0
    for (const key of Object.keys(dailyMap)) {
      const e = dailyMap[key] || {}
      dailyTotal += (Number(e.done) || 0) + (Number(e.undone) || 0)
    }
    if (dailyTotal === 0) return null

    const monthlyObj = yearData.data.monthly || {}
    for (let m = 0; m < 12; m++) {
      const monKey = monthNamesShort[m].toLowerCase()
      const monEntry = monthlyObj[monKey] || { done: 0, undone: 0 }
      const monTotal =
        (Number(monEntry.done) || 0) + (Number(monEntry.undone) || 0)
      if (monTotal === dailyTotal && monTotal > 0) {
        return m
      }
    }

    let bestIdx = null
    let bestDiff = Infinity
    for (let m = 0; m < 12; m++) {
      const monKey = monthNamesShort[m].toLowerCase()
      const monEntry = monthlyObj[monKey] || { done: 0, undone: 0 }
      const monTotal =
        (Number(monEntry.done) || 0) + (Number(monEntry.undone) || 0)
      const diff = Math.abs(monTotal - dailyTotal)
      if (diff < bestDiff) {
        bestDiff = diff
        bestIdx = m
      }
    }
    if (bestIdx !== null && dailyTotal > 0 && bestDiff / dailyTotal <= 0.25) {
      return bestIdx
    }

    return null
  }, [yearData])

  // build chart data based on viewMode and aggregated taskOverview
  const chartData = useMemo(() => {
    if (!yearData) {
      // No data fallback
      if (viewMode === 'Monthly') {
        const base = monthNamesShort.map((m) => ({
          name: m,
          done: 0,
          undone: 0,
        }))
        return [{ name: '', done: 0, undone: 0 }, ...base]
      }
      if (viewMode === 'Weekly') {
        const s = new Date(rangeStart)
        const days = []
        for (let i = 0; i < 7; i++) {
          const d = addDays(s, i)
          days.push({ name: format(d, 'EEE'), done: 0, undone: 0 })
        }
        return [{ name: '', done: 0, undone: 0 }, ...days]
      }
      // Daily
      const start = new Date(rangeStart)
      const last = getDaysInMonth(start)
      const daysArr = Array.from({ length: last }, (_, i) => ({
        name: String(i + 1),
        done: 0,
        undone: 0,
      }))
      return [{ name: '', done: 0, undone: 0 }, ...daysArr]
    }

    // --- Monthly ---
    if (viewMode === 'Monthly') {
      const months = monthNamesShort.map((m, idx) => {
        const entry = getMonthlyEntry(yearData, idx)
        return { name: m, done: entry.done || 0, undone: entry.undone || 0 }
      })
      return [{ name: '', done: 0, undone: 0 }, ...months]
    }

    // --- Weekly ---
    if (viewMode === 'Weekly') {
      const s = new Date(rangeStart)
      const days = []

      for (let i = 0; i < 7; i++) {
        const d = addDays(s, i)
        const y = d.getFullYear()
        const dailyYearData = findYearData(taskOverview, y)

        // استفاده از getDailyEntry با تاریخ کامل
        const entry = getDailyEntry(dailyYearData, d)

        days.push({
          name: format(d, 'EEE'),
          done: entry.done || 0,
          undone: entry.undone || 0,
        })
      }

      return [{ name: '', done: 0, undone: 0 }, ...days]
    }

    // --- Daily ---
    if (viewMode === 'Daily') {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()
      const daysInMonth = getDaysInMonth(currentDate)

      const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
        const dayNum = i + 1
        const date = new Date(year, month, dayNum)
        const entry = getDailyEntry(yearData, date)
        return {
          name: String(dayNum),
          done: entry.done || 0,
          undone: entry.undone || 0,
        }
      })

      return [{ name: '', done: 0, undone: 0 }, ...dailyData]
    }

    return []
  }, [viewMode, yearData, rangeStart, taskOverview])

  const chartKey = `${viewMode}-${format(rangeStart, 'yyyy-MM-dd')}-${
    isDark ? 'dark' : 'light'
  }`

  // count total filtered tasks (sum of done+undone inside the shown range)
  const totalCount = useMemo(() => {
    return chartData
      .slice(1)
      .reduce((acc, cur) => acc + (cur.done || 0) + (cur.undone || 0), 0)
  }, [chartData])

  return (
    <Box>
      {/* header */}
      <div className="flex justify-between items-center mb-3">
        <h1 className={`flex items-center gap-1 text-primary font-semibold`}>
          <ListCheck size={22} className="stroke-3" />
          <span>{t('Task Overview')}</span>
        </h1>

        <div className="flex items-center text-primary gap-3">
          <button onClick={handlePrev} className="cursor-pointer p-1">
            <ChevronLeft />
          </button>

          <span className="font-bold text-lg whitespace-nowrap">
            {headerLabel}
          </span>

          <button onClick={handleNext} className="cursor-pointer p-1">
            <ChevronRight />
          </button>
        </div>

        <select
          className="ml-2 text-sm bg-input border border-[--border] rounded-md px-2 py-1 text-[--text]"
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
        >
          <option>Monthly</option>
          <option>Weekly</option>
          <option>Daily</option>
        </select>
      </div>

      {/* chart */}
      <div className="h-[300px]">
        <ResponsiveContainer key={chartKey} width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              vertical={false}
            />

            <XAxis
              dataKey="name"
              type="category"
              stroke="#a3a3a3"
              tickLine={{ stroke: '#a3a3a3', strokeWidth: 2, length: 6 }}
              axisLine={{ stroke: '#a3a3a3', strokeWidth: 2 }}
              padding={{ left: 0, right: 0 }}
              tick={{ fill: '#a3a3a3', fontSize: 12, fontWeight: 500, dy: 2 }}
              interval={viewMode === 'Daily' ? 1 : 0}
              allowDuplicatedCategory
            />

            <YAxis
              stroke="#a3a3a3"
              tickLine={{ stroke: '#a3a3a3', strokeWidth: 2, length: 12 }}
              axisLine={{ stroke: '#a3a3a3', strokeWidth: 3 }}
              tick={{ fill: '#a3a3a3', fontSize: 12, fontWeight: 500, dx: -2 }}
              allowDecimals={false}
              domain={[0, viewMode === 'Monthly' ? 100 : 8]}
              ticks={
                viewMode === 'Monthly'
                  ? [20, 40, 60, 80, 100]
                  : [1, 2, 3, 4, 5, 6, 7, 8]
              }
              tickFormatter={(value) => (value === 0 ? '' : value)}
            />

            <Tooltip
              content={<CustomTooltip isDark={isDark} />}
              cursor={{ strokeDasharray: '3 3' }}
            />

            <Line
              type="monotone"
              dataKey="done"
              stroke="var(--primary)"
              strokeWidth={3}
              dot={{
                r: 3,
                strokeWidth: 2,
                stroke: 'var(--primary)',
                fill: '#fff',
              }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="undone"
              stroke="var(--primary)"
              strokeWidth={2}
              strokeOpacity={0.3}
              dot={{
                r: 2,
                strokeWidth: 1.5,
                stroke: 'var(--primary)',
                fill: '#fff',
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* summary */}
      <div className="mt-3 text-sm text-muted-foreground">
        Showing <strong>{totalCount}</strong> tasks in selected range.
      </div>
    </Box>
  )
}
