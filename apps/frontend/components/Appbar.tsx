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
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between px-4 max-w-5xl mx-auto">
                {/* Logo Section */}
                <div className="flex items-center space-x-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-background">
                        <span className="text-xs font-bold">U</span>
                    </div>
                    <span className="text-lg font-semibold text-foreground">
                        Uptime
                    </span>
                </div>

                {/* Navigation & Auth Section */}
                <div className="flex items-center space-x-2">
                    <SignedIn>
                        <div className="flex items-center space-x-2">
                            <ModeToggle />
                            <UserButton 
                                afterSignOutUrl='/' 
                                appearance={{
                                    elements: {
                                        avatarBox: "h-7 w-7"
                                    }
                                }}
                            />
                        </div>
                    </SignedIn>
                    
                    <SignedOut>
                        <div className="flex items-center space-x-2">
                            <ModeToggle />
                            <SignInButton>
                                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                                    Sign In
                                </Button>
                            </SignInButton>
                            <SignUpButton>
                                <Button size="sm" className="h-8 px-3 text-xs">
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