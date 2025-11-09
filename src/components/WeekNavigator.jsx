import { ArrowLeft, ArrowRight } from 'iconsax-react'

const WeekNavigator = ({ currentWeek, setCurrentWeek }) => {
  // Get Monday of the current week
  const weekStart = currentWeek.clone().startOf('isoWeek')
  // Get Sunday of the current week
  const weekEnd = currentWeek.clone().endOf('isoWeek')

  // Navigate to the previous week
  const handlePrevWeek = () => {
    setCurrentWeek((prev) => prev.clone().subtract(1, 'week'))
  }

  // Navigate to the next week
  const handleNextWeek = () => {
    setCurrentWeek((prev) => prev.clone().add(1, 'week'))
  }

  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg shadow mb-6">
      {/* Left arrow */}
      <button
        onClick={handlePrevWeek}
        className="p-2 rounded hover:bg-[--background]"
      >
        <ArrowLeft size={20} color="var(--text)" />
      </button>

      {/* Week range */}
      <h2 className="text-lg font-semibold text-[--text]">
        {weekStart.format('MMM D')} - {weekEnd.format('MMM D, YYYY')}
      </h2>

      {/* Right arrow */}
      <button
        onClick={handleNextWeek}
        className="p-2 rounded hover:bg-[--background]"
      >
        <ArrowRight size={20} color="var(--text)" />
      </button>
    </div>
  )
}

export default WeekNavigator
