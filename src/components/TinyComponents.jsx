export const TableHead = ({ children }) => (
  <div className="text-sm font-semibold  p-2 border-y border-slate-400 border-opacity-30 text-text">
    {children}
  </div>
)

export const TableContent = ({ children }) => (
  <div className="text-sm font-medium text-text p-2 ">
    {children}
  </div>
)
