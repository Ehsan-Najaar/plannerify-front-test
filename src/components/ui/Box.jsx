export default function Box({ children }) {
  return (
    <div className="bg-card text-text shadow-lg rounded-lg p-4 flex flex-col">
      {children}
    </div>
  )
}
