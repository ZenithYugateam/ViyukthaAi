import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Briefcase, Bell, Lock, Globe } from "lucide-react";
import femaleAvatar from "@/assets/female-avatar.jpg";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account information and preferences</p>
      </div>

      {/* Profile Section */}
      <Card className="p-6 card-shadow">
        <h3 className="text-xl font-semibold text-foreground mb-6">Personal Information</h3>
        
        <div className="flex items-center gap-6 mb-6">
          <Avatar className="w-24 h-24 border-2 border-primary/20">
            <AvatarImage src={femaleAvatar} alt="Profile" />
            <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/20 text-primary-foreground font-semibold text-lg">
              PS
            </AvatarFallback>
          </Avatar>
          <div>
            <Button className="gradient-primary text-white">Change Photo</Button>
            <p className="text-sm text-muted-foreground mt-2">JPG, PNG or GIF. Max size 2MB</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input id="firstName" placeholder="Arjun" className="pl-10" defaultValue="Arjun" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input id="lastName" placeholder="Kumar" className="pl-10" defaultValue="Kumar" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input id="email" type="email" placeholder="arjun@example.com" className="pl-10" defaultValue="arjun@example.com" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input id="phone" placeholder="+91 98765 43210" className="pl-10" defaultValue="+91 98765 43210" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input id="location" placeholder="Bangalore, India" className="pl-10" defaultValue="Bangalore, India" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Professional Title</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input id="title" placeholder="Full Stack Developer" className="pl-10" defaultValue="Full Stack Developer" />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button className="gradient-primary text-white">Save Changes</Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6 card-shadow">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Notifications</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Job Recommendations</p>
              <p className="text-sm text-muted-foreground">Get notified about new job matches</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Interview Reminders</p>
              <p className="text-sm text-muted-foreground">Receive alerts before upcoming interviews</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Profile Views</p>
              <p className="text-sm text-muted-foreground">Know when recruiters view your profile</p>
            </div>
            <Switch />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Weekly Reports</p>
              <p className="text-sm text-muted-foreground">Receive weekly progress summaries</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6 card-shadow">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Security</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" placeholder="••••••••" className="mt-2" />
          </div>

          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" placeholder="••••••••" className="mt-2" />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" placeholder="••••••••" className="mt-2" />
          </div>

          <div className="flex justify-end mt-4">
            <Button className="gradient-primary text-white">Update Password</Button>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6 card-shadow">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Preferences</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
            </div>
            <Switch />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Public Profile</p>
              <p className="text-sm text-muted-foreground">Make your profile visible to recruiters</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Email Digest</p>
              <p className="text-sm text-muted-foreground">Receive daily job digest emails</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
