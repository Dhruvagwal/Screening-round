import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h3 className="font-serif text-xl font-bold text-foreground mb-4 italic">
            katalyst
          </h3>
          
          <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
            Empowering ambitious builders with intelligent calendar management through 
            Model Context Protocol integration.
          </p>

          <div className="flex justify-center space-x-8 mb-8">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              tune in
            </Link>
            <Link href="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              join cohort
            </Link>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              dashboard
            </Link>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-xs text-muted-foreground">
              Built with Next.js, TypeScript, and shadcn/ui • MCP Integration Ready
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}