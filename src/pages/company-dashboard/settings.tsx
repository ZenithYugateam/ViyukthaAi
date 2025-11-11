import React from "react";
import Sidebar from "@/components/company-dashboard/Sidebar";
import TopNav from "@/components/company-dashboard/TopNav";
import { PageTransition } from "@/components/company-dashboard/PageTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Upload, Moon, Sun } from "lucide-react";
import { toast } from "sonner";

type SettingsForm = {
  companyName: string;
  email: string;
  description: string;
  logo: string;
  theme: "light" | "dark";
  autoGenerateQuestions: boolean;
  aiScoring: boolean;
  emailNotifications: boolean;
};

const STORAGE_KEY = "companyDashboard.settings.v1";

const SettingsPage: React.FC = () => {
  const [form, setForm] = React.useState<SettingsForm>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw
        ? JSON.parse(raw)
        : {
            companyName: "Acme Corp",
            email: "contact@acme.com",
            description: "",
            logo: "",
            theme: "light",
            autoGenerateQuestions: true,
            aiScoring: true,
            emailNotifications: true,
          };
    } catch {
      return {
        companyName: "Acme Corp",
        email: "contact@acme.com",
        description: "",
        logo: "",
        theme: "light",
        autoGenerateQuestions: true,
        aiScoring: true,
        emailNotifications: true,
      };
    }
  });
  const [saved, setSaved] = React.useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((f) => ({ ...f, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setSaved(true);
    toast.success("Settings updated successfully!");
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleTheme = () => {
    setForm((f) => ({ ...f, theme: f.theme === "light" ? "dark" : "light" }));
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopNav />
        <main className="p-4 md:p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your company dashboard preferences</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>Update your company information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <div className="flex items-center gap-4">
                    {form.logo ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-20 w-20 rounded-lg border overflow-hidden"
                      >
                        <img src={form.logo} alt="Logo" className="h-full w-full object-cover" />
                      </motion.div>
                    ) : (
                      <div className="h-20 w-20 rounded-lg border border-dashed flex items-center justify-center bg-muted">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={form.companyName}
                      onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-email">Contact Email</Label>
                    <Input
                      id="company-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Tell us about your company..."
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      {form.theme === "light" ? "Light mode" : "Dark mode"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleTheme}
                    className="h-10 w-10"
                  >
                    {form.theme === "light" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>AI Settings</CardTitle>
                <CardDescription>Configure AI interview and evaluation preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-generate questions</Label>
                    <p className="text-sm text-muted-foreground">Automatically suggest questions for new jobs</p>
                  </div>
                  <Switch
                    checked={form.autoGenerateQuestions}
                    onCheckedChange={(checked) =>
                      setForm((f) => ({ ...f, autoGenerateQuestions: checked }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>AI scoring</Label>
                    <p className="text-sm text-muted-foreground">Enable automatic candidate evaluation</p>
                  </div>
                  <Switch
                    checked={form.aiScoring}
                    onCheckedChange={(checked) => setForm((f) => ({ ...f, aiScoring: checked }))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about interviews and candidates</p>
                  </div>
                  <Switch
                    checked={form.emailNotifications}
                    onCheckedChange={(checked) =>
                      setForm((f) => ({ ...f, emailNotifications: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive">Delete Company Account</Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button onClick={handleSave} size="lg">
              Save Changes
            </Button>
            {saved && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-sm text-emerald-600 font-medium"
              >
                ✓ Saved
              </motion.div>
            )}
          </motion.div>
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default SettingsPage;
