
import { Button } from "@/components/ui/button"
import { SignUpButton, SignedOut, SignedIn } from "@clerk/nextjs"
import { CheckCircle, Clock, Shield, Zap, Bell, BarChart3, Globe, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
              <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
              99.9% Uptime Guaranteed
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Monitor Your Websites
              <span className="block text-primary">Like Never Before</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              Keep your digital presence strong with real-time monitoring, instant alerts, 
              and comprehensive analytics. DPin ensures your websites stay online when it matters most.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <SignedOut>
                <SignUpButton>
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </SignedIn>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to monitor
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Comprehensive monitoring tools designed to keep your websites running smoothly
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 mt-4 text-xl font-semibold text-card-foreground">
                Real-time Monitoring
              </h3>
              <p className="text-muted-foreground">
                Track your website performance 24/7 with checks every 30 seconds from multiple global locations.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 mt-4 text-xl font-semibold text-card-foreground">
                Instant Alerts
              </h3>
              <p className="text-muted-foreground">
                Get notified immediately via email, SMS, Slack, or webhook when your site goes down.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 mt-4 text-xl font-semibold text-card-foreground">
                Detailed Analytics
              </h3>
              <p className="text-muted-foreground">
                Comprehensive reports with response times, uptime statistics, and performance insights.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 mt-4 text-xl font-semibold text-card-foreground">
                Global Network
              </h3>
              <p className="text-muted-foreground">
                Monitor from 15+ locations worldwide to ensure accurate performance data across regions.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 mt-4 text-xl font-semibold text-card-foreground">
                SSL Monitoring
              </h3>
              <p className="text-muted-foreground">
                Track SSL certificate expiration dates and get alerts before certificates expire.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 mt-4 text-xl font-semibold text-card-foreground">
                Fast Setup
              </h3>
              <p className="text-muted-foreground">
                Get started in under 2 minutes. Simply add your URL and start monitoring immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-4xl gap-8 text-center lg:grid-cols-4">
            <div>
              <div className="text-3xl font-bold text-foreground">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">30s</div>
              <div className="text-sm text-muted-foreground">Check Frequency</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">15+</div>
              <div className="text-sm text-muted-foreground">Global Locations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of businesses that trust DPin to monitor their websites
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <SignedOut>
                <SignUpButton>
                  <Button size="lg">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button size="lg">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </SignedIn>
              <p className="text-sm text-muted-foreground">
                No credit card required • 14-day free trial
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-4">
            <div>
              <div className="flex items-center space-x-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                  <span className="text-xs font-bold">D</span>
                </div>
                <span className="font-bold">DPin Uptime</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Reliable website monitoring for modern businesses.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/features" className="hover:text-foreground">Features</a></li>
                <li><a href="/pricing" className="hover:text-foreground">Pricing</a></li>
                <li><a href="/integrations" className="hover:text-foreground">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/about" className="hover:text-foreground">About</a></li>
                <li><a href="/blog" className="hover:text-foreground">Blog</a></li>
                <li><a href="/contact" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/help" className="hover:text-foreground">Help Center</a></li>
                <li><a href="/status" className="hover:text-foreground">System Status</a></li>
                <li><a href="/privacy" className="hover:text-foreground">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © 2025 DPin Uptime. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
