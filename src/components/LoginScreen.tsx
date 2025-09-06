import React from 'react'
import { Zap } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { api } from '../lib/api'

interface LoginScreenProps {
  onLogin: (user: any, token: string) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isSignUp, setIsSignUp] = React.useState(false)
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit() {
    setError(null)
    setLoading(true)
    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/login'
      if (isSignUp && password !== confirm) throw new Error('Passwords do not match')
      const data = await api.post(endpoint, isSignUp ? { name, email, password } : { email, password })
      onLogin(data.user, data.token)
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl text-gray-900">SynergySphere</h1>
              <p className="text-gray-500">Team Collaboration Platform</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp ? 'Sign up to get started with your team' : 'Sign in to your account to continue'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="Enter your full name" value={name} onChange={e=>setName(e.target.value)} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm your password" value={confirm} onChange={e=>setConfirm(e.target.value)} />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
            
            {!isSignUp && (
              <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                Forgot Password?
              </Button>
            )}
            
            <div className="text-center text-sm text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto text-green-600 hover:text-green-700"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}