"use client"
import { 
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import { Button } from './ui/button'
import { ModeToggle } from './ModeToggle'

export function Appbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo Section */}
                <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <span className="text-sm font-bold">D</span>
                    </div>
                    <span className="text-xl font-bold text-foreground">
                        DPin Uptime
                    </span>
                </div>

                {/* Navigation & Auth Section */}
                <div className="flex items-center space-x-4">
                    <SignedIn>
                        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                            <a 
                                href="/dashboard" 
                                className="text-foreground/60 transition-colors hover:text-foreground"
                            >
                                Dashboard
                            </a>
                            <a 
                                href="/monitors" 
                                className="text-foreground/60 transition-colors hover:text-foreground"
                            >
                                Monitors
                            </a>
                            <a 
                                href="/status" 
                                className="text-foreground/60 transition-colors hover:text-foreground"
                            >
                                Status
                            </a>
                        </nav>
                        <div className="flex items-center space-x-3">
                            <ModeToggle />
                            <UserButton 
                                afterSignOutUrl='/' 
                                appearance={{
                                    elements: {
                                        avatarBox: "h-8 w-8"
                                    }
                                }}
                            />
                        </div>
                    </SignedIn>
                    
                    <SignedOut>
                        <div className="flex items-center space-x-3">
                            <ModeToggle />
                            <SignInButton>
                                <Button variant="ghost" size="sm">
                                    Sign In
                                </Button>
                            </SignInButton>
                            <SignUpButton>
                                <Button size="sm">
                                    Sign Up
                                </Button>
                            </SignUpButton>
                        </div>
                    </SignedOut>
                </div>
            </div>
        </header>
    )
}