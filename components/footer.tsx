import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold mb-2">EventMaster</h3>
            <p className="text-muted-foreground">Making event planning simple and stress-free.</p>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/events/public" className="text-muted-foreground hover:text-primary transition-colors">
              All Events
            </Link>
            <Link href="/events/create/new" className="text-muted-foreground hover:text-primary transition-colors">
              Create Event
            </Link>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EventMaster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

