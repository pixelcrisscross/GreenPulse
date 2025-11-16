import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, User, Globe, MapPin, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-earth p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Settings */}
        <Card className="p-6 shadow-soft bg-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">Profile Information</h2>
              <p className="text-sm text-muted-foreground">Update your personal details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Sanskruti Patil" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue="+91 98765 43210" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="sanskruti@example.com" />
            </div>
          </div>
        </Card>

        {/* Language Settings */}
        <Card className="p-6 shadow-soft bg-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Globe className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">Language & Region</h2>
              <p className="text-sm text-muted-foreground">Choose your preferred language</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">App Language</Label>
              <Select defaultValue="en">
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                  <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                  <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                  <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                  <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <div className="flex gap-2">
                <MapPin className="h-5 w-5 text-primary mt-2" />
                <Input id="region" defaultValue="Pune, Maharashtra" className="flex-1" />
              </div>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 shadow-soft bg-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
              <Bell className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">Notifications</h2>
              <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <div>
                <p className="font-medium text-foreground">New Government Schemes</p>
                <p className="text-sm text-muted-foreground">Get notified about new schemes</p>
              </div>
              <Button size="sm" variant="outline">Enable</Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <div>
                <p className="font-medium text-foreground">Sensor Alerts</p>
                <p className="text-sm text-muted-foreground">Alerts for critical moisture levels</p>
              </div>
              <Button size="sm" variant="outline">Enable</Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <div>
                <p className="font-medium text-foreground">Service Updates</p>
                <p className="text-sm text-muted-foreground">Updates on requested services</p>
              </div>
              <Button size="sm" variant="outline">Enable</Button>
            </div>
          </div>
        </Card>

        {/* Device Settings */}
        <Card className="p-6 shadow-soft bg-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <SettingsIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">Device Configuration</h2>
              <p className="text-sm text-muted-foreground">ESP32 sensor settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Device ID:</span>
                <code className="text-sm bg-white px-2 py-1 rounded">ESP32-001</code>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Status:</span>
                <span className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Last Sync:</span>
                <span className="text-sm text-muted-foreground">2 minutes ago</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex gap-3">
          <Button onClick={handleSave} className="flex-1 bg-gradient-primary">
            Save Changes
          </Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
