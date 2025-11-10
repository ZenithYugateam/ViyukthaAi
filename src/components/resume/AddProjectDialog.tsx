import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Code } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (project: any) => void;
}

export const AddProjectDialog = ({
  open,
  onOpenChange,
  onAdd,
}: AddProjectDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    link: "",
    description: "",
    technologies: [] as string[],
    techInput: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onOpenChange(false);
    setFormData({
      title: "",
      startDate: "",
      link: "",
      description: "",
      technologies: [],
      techInput: "",
    });
  };

  const addTechnology = () => {
    if (formData.techInput.trim()) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, formData.techInput.trim()],
        techInput: "",
      });
    }
  };

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>
              Project Title <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g. E-commerce Website"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Project Link</Label>
              <Input
                placeholder="e.g. https://myproject.com"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Project Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="Describe your project, including its purpose, your role, and key features..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={5}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Technologies Used</Label>
            <div className="flex gap-2">
              <div className="flex-1 flex gap-2">
                <Code className="w-5 h-5 text-muted-foreground mt-2" />
                <Input
                  placeholder="e.g. React, Node.js"
                  value={formData.techInput}
                  onChange={(e) =>
                    setFormData({ ...formData, techInput: e.target.value })
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTechnology();
                    }
                  }}
                />
              </div>
              <Button type="button" onClick={addTechnology}>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            {formData.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="pl-3 pr-1 py-1"
                  >
                    {tech}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 ml-1"
                      onClick={() => removeTechnology(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
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
              Add Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
