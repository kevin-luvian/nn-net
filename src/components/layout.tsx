import '../app/globals.css'
import '../app/ruleset.scss'

export default function RootLayout({
  className = '',
  children,
}: {
  className?: string,
  children: React.ReactNode
}) {
  return (
    <div className={className} style={{ minHeight: '100vh' }}>
      {children}
    </div>
  )
}
