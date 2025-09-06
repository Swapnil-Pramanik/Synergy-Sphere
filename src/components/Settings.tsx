import React from 'react'
import { User, Bell, Shield, Palette, Globe, Mail, Lock, Camera, Save } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Separator } from './ui/separator'

interface SettingsProps {
  user: any
}

export function Settings({ user }: SettingsProps) {
  const [profile, setProfile] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    timezone: 'UTC-8',
    language: 'en',
  })

  const [notifications, setNotifications] = React.useState({
    emailNotifications: true,
    pushNotifications: true,
    taskUpdates: true,
    projectUpdates: true,
    weeklyDigest: false,
    marketingEmails: false,
  })

  const [privacy, setPrivacy] = React.useState({
    profileVisible: true,
    activityVisible: true,
    emailVisible: false,
    twoFactorEnabled: false,
  })

  const [preferences, setPreferences] = React.useState({
    theme: 'light',
    compactMode: false,
    showAvatars: true,
    autoSave: true,
  })

  const [isUpdating, setIsUpdating] = React.useState(false)
  const [profileImage, setProfileImage] = React.useState<File | null>(null)
  const [previewImage, setPreviewImage] = React.useState<string | null>(null)

  const handleProfileUpdate = async () => {
    try {
      setIsUpdating(true)
      // Here you would normally update the profile via API
      console.log('Updating profile:', profile)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // await api.put('/api/user/profile', profile)
      // if (profileImage) {
      //   const formData = new FormData()
      //   formData.append('avatar', profileImage)
      //   await api.post('/api/user/avatar', formData)
      // }
      
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setProfileImage(null)
    setPreviewImage(null)
  }

  const handleNotificationUpdate = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
    // Here you would normally update notifications via API
    console.log('Updating notifications:', { [key]: value })
  }

  const handlePrivacyUpdate = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }))
    // Here you would normally update privacy settings via API
    console.log('Updating privacy:', { [key]: value })
  }

  const handlePreferenceUpdate = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
    // Here you would normally update preferences via API
    console.log('Updating preferences:', { [key]: value })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>Preferences</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
              <CardTitle className="flex items-center text-green-800">
                <User className="w-5 h-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Avatar Section */}
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 p-6 bg-gray-50 rounded-xl">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    {previewImage ? (
                      <AvatarImage src={previewImage} alt={profile.name} className="object-cover" />
                    ) : (
                      <AvatarImage src="" alt={profile.name} />
                    )}
                    <AvatarFallback className="bg-gradient-to-br from-green-400 to-green-600 text-white text-xl font-bold">
                      {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {previewImage && (
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{profile.name || 'Your Name'}</h3>
                    <p className="text-gray-600">{profile.email}</p>
                    <p className="text-sm text-gray-500 mt-1">{profile.bio || 'Add a bio to tell others about yourself'}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      className="flex items-center space-x-2"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    >
                      <Camera className="w-4 h-4" />
                      <span>Change Photo</span>
                    </Button>
                    <Button variant="outline" size="sm">
                      Remove Photo
                    </Button>
                  </div>
                </div>
              </div>


              {/* Profile Form */}
              <div className="grid gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name *</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      placeholder="your.email@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="bio" className="text-sm font-semibold text-gray-700">Bio</Label>
                  <textarea
                    id="bio"
                    className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm focus:border-green-500 focus:ring-green-500 focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    placeholder="Tell your colleagues about yourself, your role, interests, and what you're working on..."
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {profile.bio.length}/500 characters
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="timezone" className="text-sm font-semibold text-gray-700 flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      Timezone
                    </Label>
                    <Select value={profile.timezone} onValueChange={(value) => setProfile(prev => ({ ...prev, timezone: value }))}>
                      <SelectTrigger className="h-11 border-gray-300 focus:border-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-12">UTC-12 (Baker Island)</SelectItem>
                        <SelectItem value="UTC-11">UTC-11 (American Samoa)</SelectItem>
                        <SelectItem value="UTC-10">UTC-10 (Hawaii)</SelectItem>
                        <SelectItem value="UTC-9">UTC-9 (Alaska)</SelectItem>
                        <SelectItem value="UTC-8">UTC-8 (Pacific Time)</SelectItem>
                        <SelectItem value="UTC-7">UTC-7 (Mountain Time)</SelectItem>
                        <SelectItem value="UTC-6">UTC-6 (Central Time)</SelectItem>
                        <SelectItem value="UTC-5">UTC-5 (Eastern Time)</SelectItem>
                        <SelectItem value="UTC+0">UTC+0 (London)</SelectItem>
                        <SelectItem value="UTC+1">UTC+1 (Paris, Berlin)</SelectItem>
                        <SelectItem value="UTC+8">UTC+8 (Singapore, Beijing)</SelectItem>
                        <SelectItem value="UTC+9">UTC+9 (Tokyo, Seoul)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="language" className="text-sm font-semibold text-gray-700">Language</Label>
                    <Select value={profile.language} onValueChange={(value) => setProfile(prev => ({ ...prev, language: value }))}>
                      <SelectTrigger className="h-11 border-gray-300 focus:border-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">🇺🇸 English</SelectItem>
                        <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                        <SelectItem value="fr">🇫🇷 French</SelectItem>
                        <SelectItem value="de">🇩🇪 German</SelectItem>
                        <SelectItem value="ja">🇯🇵 Japanese</SelectItem>
                        <SelectItem value="ko">🇰🇷 Korean</SelectItem>
                        <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="my-8" />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 bg-gray-50 p-6 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Save your changes</h4>
                    <p className="text-sm text-gray-600">Make sure all information is correct before saving.</p>
                  </div>
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setProfile({
                          name: user?.name || '',
                          email: user?.email || '',
                          bio: '',
                          timezone: 'UTC-8',
                          language: 'en',
                        })
                        setPreviewImage(null)
                        setProfileImage(null)
                      }}
                      disabled={isUpdating}
                    >
                      Reset
                    </Button>
                    <Button 
                      onClick={handleProfileUpdate} 
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <h4 className="text-sm font-medium">Email Notifications</h4>
                    </div>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationUpdate('emailNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Push Notifications</h4>
                    <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationUpdate('pushNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Notification Types</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h5 className="text-sm">Task Updates</h5>
                      <p className="text-xs text-gray-500">When tasks are assigned, updated, or completed</p>
                    </div>
                    <Switch
                      checked={notifications.taskUpdates}
                      onCheckedChange={(checked) => handleNotificationUpdate('taskUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h5 className="text-sm">Project Updates</h5>
                      <p className="text-xs text-gray-500">When project status changes or deadlines approach</p>
                    </div>
                    <Switch
                      checked={notifications.projectUpdates}
                      onCheckedChange={(checked) => handleNotificationUpdate('projectUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h5 className="text-sm">Weekly Digest</h5>
                      <p className="text-xs text-gray-500">Weekly summary of your activity and achievements</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) => handleNotificationUpdate('weeklyDigest', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h5 className="text-sm">Marketing Emails</h5>
                      <p className="text-xs text-gray-500">Product updates, tips, and feature announcements</p>
                    </div>
                    <Switch
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) => handleNotificationUpdate('marketingEmails', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Public Profile</h4>
                    <p className="text-sm text-gray-500">Make your profile visible to other team members</p>
                  </div>
                  <Switch
                    checked={privacy.profileVisible}
                    onCheckedChange={(checked) => handlePrivacyUpdate('profileVisible', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Activity Status</h4>
                    <p className="text-sm text-gray-500">Show when you're active or away</p>
                  </div>
                  <Switch
                    checked={privacy.activityVisible}
                    onCheckedChange={(checked) => handlePrivacyUpdate('activityVisible', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Email Visibility</h4>
                    <p className="text-sm text-gray-500">Allow team members to see your email address</p>
                  </div>
                  <Switch
                    checked={privacy.emailVisible}
                    onCheckedChange={(checked) => handlePrivacyUpdate('emailVisible', checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Security</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4" />
                        <h5 className="text-sm">Two-Factor Authentication</h5>
                      </div>
                      <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={privacy.twoFactorEnabled}
                      onCheckedChange={(checked) => handlePrivacyUpdate('twoFactorEnabled', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full">
                      Download Account Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                App Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={preferences.theme} onValueChange={(value) => handlePreferenceUpdate('theme', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Compact Mode</h4>
                    <p className="text-sm text-gray-500">Use less space for interface elements</p>
                  </div>
                  <Switch
                    checked={preferences.compactMode}
                    onCheckedChange={(checked) => handlePreferenceUpdate('compactMode', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Show Avatars</h4>
                    <p className="text-sm text-gray-500">Display profile pictures in lists and cards</p>
                  </div>
                  <Switch
                    checked={preferences.showAvatars}
                    onCheckedChange={(checked) => handlePreferenceUpdate('showAvatars', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Auto-save</h4>
                    <p className="text-sm text-gray-500">Automatically save changes as you type</p>
                  </div>
                  <Switch
                    checked={preferences.autoSave}
                    onCheckedChange={(checked) => handlePreferenceUpdate('autoSave', checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Data & Storage</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      Clear Cache
                    </Button>
                    <Button variant="outline" className="w-full">
                      Reset All Preferences
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
