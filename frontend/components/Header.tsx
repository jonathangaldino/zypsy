export default function Header() {
  return (
    <header className="border-b border-border/50 bg-card shadow-sm">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground md:text-6xl text-balance">
          Posts
        </h1>
        <p className="mt-3 text-lg text-muted-foreground md:text-xl">Explore articles across various topics</p>
      </div>
    </header>
  )
}
