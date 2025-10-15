import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="shadow-md hover:shadow-lg transition-shadow w-full max-w-md">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <span className="text-3xl font-bold text-red-600 dark:text-red-400">404</span>
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Page Not Found
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or doesn't exist.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  asChild
                >
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </div>
              <div className="text-center pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  Looking for something specific?
                </p>
                <Button variant="ghost" className="text-blue-500 hover:text-blue-600" asChild>
                  <Link to="/explore">
                    <Search className="h-4 w-4 mr-2" />
                    Explore Content
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}