import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

interface AddEducationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (education: any) => void;
}

export const AddEducationDialog = ({
  open,
  onOpenChange,
  onAdd,
}: AddEducationDialogProps) => {
  const [formData, setFormData] = useState({
    institution: "",
    location: "",
    degree: "",
    field: "",
    gpa: "",
    startDate: "",
    endDate: "",
    currentlyStudying: false,
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onOpenChange(false);
    setFormData({
      institution: "",
      location: "",
      degree: "",
      field: "",
      gpa: "",
      startDate: "",
      endDate: "",
      currentlyStudying: false,
      description: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Education</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Institution Name <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g. Stanford University"
                value={formData.institution}
                onChange={(e) =>
                  setFormData({ ...formData, institution: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="e.g. Stanford, CA"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Degree <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g. Bachelor of Science"
                value={formData.degree}
                onChange={(e) =>
                  setFormData({ ...formData, degree: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Field of Study</Label>
              <Input
                placeholder="e.g. Computer Science"
                value={formData.field}
                onChange={(e) =>
                  setFormData({ ...formData, field: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>GPA (Optional)</Label>
              <Input
                placeholder="e.g. 3.8/4.0"
                value={formData.gpa}
                onChange={(e) =>
                  setFormData({ ...formData, gpa: e.target.value })
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
              id="currentlyStudying"
              checked={formData.currentlyStudying}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  currentlyStudying: checked as boolean,
                })
              }
            />
            <Label htmlFor="currentlyStudying" className="cursor-pointer">
              I currently study here
            </Label>
          </div>

          <div className="space-y-2">
            <Label>Description (Optional)</Label>
            <Textarea
              placeholder="Describe relevant coursework, honors, or achievements..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
            />
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
              Add Education
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
