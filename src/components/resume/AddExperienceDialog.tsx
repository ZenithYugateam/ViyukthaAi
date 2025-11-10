import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus, Minus } from "lucide-react";

interface AddExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (experience: any) => void;
}

export const AddExperienceDialog = ({
  open,
  onOpenChange,
  onAdd,
}: AddExperienceDialogProps) => {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: "",
    achievements: [""],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onOpenChange(false);
    setFormData({
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: "",
      achievements: [""],
    });
  };

  const addAchievement = () => {
    setFormData({
      ...formData,
      achievements: [...formData.achievements, ""],
    });
  };

  const removeAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, i) => i !== index),
    });
  };

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...formData.achievements];
    newAchievements[index] = value;
    setFormData({ ...formData, achievements: newAchievements });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Experience</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Company/Organization <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g. Google Inc."
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>
                Position/Title <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g. Senior Software Engineer"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="e.g. Mountain View, CA"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>
                Start Date <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="currentlyWorking"
              checked={formData.currentlyWorking}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  currentlyWorking: checked as boolean,
                })
              }
            />
            <Label htmlFor="currentlyWorking" className="cursor-pointer">
              I currently work here
            </Label>
          </div>

          <div className="space-y-2">
            <Label>Job Description</Label>
            <Textarea
              placeholder="Briefly describe your role and responsibilities..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Key Achievements</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addAchievement}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Achievement
              </Button>
            </div>
            {formData.achievements.map((achievement, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="e.g. Increased revenue by 20% through optimization"
                  value={achievement}
                  onChange={(e) => updateAchievement(index, e.target.value)}
                />
                {formData.achievements.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAchievement(index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <p className="text-sm text-muted-foreground">
              Add specific, measurable achievements. Use action verbs and
              quantify results when possible.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary text-white hover:opacity-90">
              Add Experience
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
