import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ResumeTemplateCard } from "@/components/resume/ResumeTemplateCard";
import { ResumeBuilder } from "@/components/resume/ResumeBuilder";
import { ResumeATSAnalyzer } from "@/components/resume/ResumeATSAnalyzer";
import { ResumeMatchBuilder } from "@/components/resume/ResumeMatchBuilder";
import { RenderCVTemplate } from "@/components/resume/templates/RenderCVTemplate";
import { ModernCenteredTemplate } from "@/components/resume/templates/ModernCenteredTemplate";
import { JakeTemplate } from "@/components/resume/templates/JakeTemplate";
import { SparkySundevilTemplate } from "@/components/resume/templates/SparkySundevilTemplate";
import { ClassicLatexTemplate } from "@/components/resume/templates/ClassicLatexTemplate";
import { FaangPathTemplate } from "@/components/resume/templates/FaangPathTemplate";
import { DetailedProfessionalTemplate } from "@/components/resume/templates/DetailedProfessionalTemplate";
import { InfographicModernTemplate } from "@/components/resume/templates/InfographicModernTemplate";
import { CreativeBoxedTemplate } from "@/components/resume/templates/CreativeBoxedTemplate";
import { SidebarInfographicTemplate } from "@/components/resume/templates/SidebarInfographicTemplate";
import { AcademicTwoColumnTemplate } from "@/components/resume/templates/AcademicTwoColumnTemplate";
import { MinimalSidebarTemplate } from "@/components/resume/templates/MinimalSidebarTemplate";
import { ResumeDataForm, ResumeFormData } from "@/components/resume/ResumeDataForm";
import { FileText, Bot, LayoutTemplate, Briefcase, ArrowLeft, Download, Eye, Type } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { resumeTemplates, sampleResumeData } from "@/data/resumeTemplates";
import { useToast } from "@/hooks/use-toast";
import { generateResumePDF } from "@/utils/pdfGenerator";

const Resume = () => {
  const { toast } = useToast();
  const [showBuilder, setShowBuilder] = useState(false);
  const [showMatchBuilder, setShowMatchBuilder] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [showDataForm, setShowDataForm] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeFormData | null>(null);
  const [previewData, setPreviewData] = useState<ResumeFormData | null>(null);
  const [selectedFont, setSelectedFont] = useState<string>("charter");

  const handleFormSubmit = (data: ResumeFormData) => {
    setResumeData(data);
    toast({
      title: "Resume Created!",
      description: "Your resume has been generated successfully.",
    });
  };

  const handlePreview = (data: ResumeFormData) => {
    setPreviewData(data);
  };

  if (showDataForm) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-background sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <Button
              variant="ghost"
              onClick={() => setShowDataForm(false)}
              className="mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 gradient-primary rounded flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Create Your Resume</h1>
                <p className="text-sm text-muted-foreground">
                  Fill in your details to generate an ATS-optimized resume
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
              <ResumeDataForm
                initialData={resumeData || undefined}
                onSubmit={handleFormSubmit}
                onPreview={handlePreview}
              />
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <Card className="p-6">
                <div className="space-y-4 mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Live Preview</h3>
                    {resumeData && (
                      <Button
                        onClick={async () => {
                          try {
                            await generateResumePDF('resume-data-preview', 'my-resume.pdf');
                            toast({
                              title: "Success!",
                              description: "Resume downloaded as PDF",
                            });
                          } catch (error) {
                            toast({
                              title: "Error",
                              description: "Failed to download PDF",
                              variant: "destructive",
                            });
                          }
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      Font Style (Preview updates instantly)
                    </Label>
                    <Select value={selectedFont} onValueChange={setSelectedFont}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-white">
                        <SelectItem value="charter">Charter (Serif)</SelectItem>
                        <SelectItem value="times">Times New Roman</SelectItem>
                        <SelectItem value="merriweather">Merriweather (Serif)</SelectItem>
                        <SelectItem value="playfair">Playfair Display (Serif)</SelectItem>
                        <SelectItem value="lora">Lora (Serif)</SelectItem>
                        <SelectItem value="sans">Inter (Sans-serif)</SelectItem>
                        <SelectItem value="roboto">Roboto (Sans-serif)</SelectItem>
                        <SelectItem value="open-sans">Open Sans (Sans-serif)</SelectItem>
                        <SelectItem value="montserrat">Montserrat (Modern)</SelectItem>
                        <SelectItem value="raleway">Raleway (Modern)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white max-h-[calc(100vh-12rem)] overflow-y-auto">
                  <div id="resume-data-preview">
                    {selectedTemplate === 'modern-centered' ? (
                      <ModernCenteredTemplate data={previewData || sampleResumeData} fontFamily={selectedFont} />
                    ) : selectedTemplate === 'jake' ? (
                      <JakeTemplate data={previewData || sampleResumeData} fontFamily={selectedFont} />
                    ) : selectedTemplate === 'sparky-sundevil' ? (
                      <SparkySundevilTemplate data={previewData || sampleResumeData} fontFamily={selectedFont} />
                    ) : selectedTemplate === 'classic-latex' ? (
                      <ClassicLatexTemplate data={previewData || sampleResumeData} fontFamily={selectedFont} />
                    ) : selectedTemplate === 'faangpath' ? (
                      <FaangPathTemplate data={previewData || sampleResumeData} fontFamily={selectedFont} />
                    ) : selectedTemplate === 'detailed-professional' ? (
                      <DetailedProfessionalTemplate data={previewData || sampleResumeData} fontFamily={selectedFont} />
                    ) : selectedTemplate === 'infographic-modern' ? (
                      <InfographicModernTemplate data={previewData || sampleResumeData} fontFamily={selectedFont} />
                    ) : selectedTemplate === 'creative-boxed' ? (
                      <CreativeBoxedTemplate data={previewData || sampleResumeData} fontFamily={selectedFont} />
                    ) : selectedTemplate === 'sidebar-infographic' ? (
                      <SidebarInfographicTemplate data={previewData || sampleResumeData} fontFamily={selectedFont} />
                    ) : selectedTemplate === 'academic-two-column' ? (
                      <AcademicTwoColumnTemplate data={previewData || sampleResumeData} fontFamily={selectedFont} />
                    ) : selectedTemplate === 'minimal-sidebar' ? (
                      <MinimalSidebarTemplate data={previewData || sampleResumeData} fontFamily={selectedFont} />
                    ) : (
                      <RenderCVTemplate data={previewData || sampleResumeData} fontFamily={selectedFont} />
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showMatchBuilder) {
    return <ResumeMatchBuilder onBack={() => setShowMatchBuilder(false)} />;
  }

  if (showBuilder) {
    return <ResumeBuilder onBack={() => setShowBuilder(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 gradient-primary rounded flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Resume Builder</h1>
              <p className="text-sm font-semibold text-muted-foreground">Create and optimize your resume with AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="match-builder" className="w-full">
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-3 mb-8 h-14">
              <TabsTrigger value="match-builder" className="flex items-center gap-3 text-base md:text-lg px-6">
                <Briefcase className="w-5 h-5 md:w-6 md:h-6" />
                Job Match Builder
              </TabsTrigger>
              <TabsTrigger value="ai-coach" className="flex items-center gap-3 text-base md:text-lg px-6">
                <Bot className="w-5 h-5 md:w-6 md:h-6" />
                ATS Analyzer
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-3 text-base md:text-lg px-6">
                <LayoutTemplate className="w-5 h-5 md:w-6 md:h-6" />
                Templates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="match-builder" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-3">Job-Matched Resume Builder</h2>
                <p className="text-muted-foreground">
                  Upload your resume, get matched with jobs, and optimize for better results
                </p>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={() => setShowMatchBuilder(true)}
                  size="lg"
                  className="gradient-primary hover:gradient-primary-hover px-8 h-14 text-lg font-semibold"
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  Start Resume Builder
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="ai-coach" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-3">ATS Resume Analysis</h2>
                <p className="text-muted-foreground">
                  Upload your resume and get instant ATS compatibility score with improvement suggestions
                </p>
              </div>
              <ResumeATSAnalyzer />
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-3">ATS-Optimized Resume Templates</h2>
                <p className="text-muted-foreground">
                  Choose from our professionally designed, ATS-friendly templates
                </p>
              </div>

              {/* Templates Grid */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  All templates ({resumeTemplates.length}) - Optimized for Applicant Tracking Systems
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {resumeTemplates.map((template) => (
                  <ResumeTemplateCard
                    key={template.id}
                    name={template.name}
                    image={template.preview}
                    isRecommended={template.isATS}
                    isMostRecommended={template.isMostRecommended}
                    onSelect={() => setSelectedTemplate(template.id)}
                    onPreview={() => setPreviewTemplate(template.id)}
                  />
                ))}
              </div>

              {/* Template Preview */}
              {selectedTemplate && (
                <Card className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">Template Preview</h3>
                    <p className="text-muted-foreground">
                      This is how your resume will look with the selected template
                    </p>
                  </div>
                  <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white">
                    {selectedTemplate === 'modern-centered' ? (
                      <ModernCenteredTemplate data={sampleResumeData} fontFamily={selectedFont} />
                    ) : selectedTemplate === 'jake' ? (
                      <JakeTemplate data={sampleResumeData} fontFamily={selectedFont} />
                    ) : selectedTemplate === 'sparky-sundevil' ? (
                      <SparkySundevilTemplate data={sampleResumeData} fontFamily={selectedFont} />
                    ) : selectedTemplate === 'classic-latex' ? (
                      <ClassicLatexTemplate data={sampleResumeData} fontFamily={selectedFont} />
                    ) : selectedTemplate === 'faangpath' ? (
                      <FaangPathTemplate data={sampleResumeData} fontFamily={selectedFont} />
                    ) : selectedTemplate === 'detailed-professional' ? (
                      <DetailedProfessionalTemplate data={sampleResumeData} fontFamily={selectedFont} />
                    ) : selectedTemplate === 'infographic-modern' ? (
                      <InfographicModernTemplate data={sampleResumeData} fontFamily={selectedFont} />
                    ) : selectedTemplate === 'creative-boxed' ? (
                      <CreativeBoxedTemplate data={sampleResumeData} fontFamily={selectedFont} />
                    ) : selectedTemplate === 'sidebar-infographic' ? (
                      <SidebarInfographicTemplate data={sampleResumeData} fontFamily={selectedFont} />
                    ) : selectedTemplate === 'academic-two-column' ? (
                      <AcademicTwoColumnTemplate data={sampleResumeData} fontFamily={selectedFont} />
                    ) : selectedTemplate === 'minimal-sidebar' ? (
                      <MinimalSidebarTemplate data={sampleResumeData} fontFamily={selectedFont} />
                    ) : (
                      <RenderCVTemplate data={sampleResumeData} fontFamily={selectedFont} />
                    )}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Button
                      onClick={() => setSelectedTemplate("")}
                      variant="outline"
                      className="flex-1"
                    >
                      Choose Different Template
                    </Button>
                    <Button
                      onClick={() => setShowDataForm(true)}
                      className="flex-1 gradient-primary hover:gradient-primary-hover"
                    >
                      Fill Your Information
                    </Button>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Live Preview Modal */}
      <Dialog open={previewTemplate !== null} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {previewTemplate && resumeTemplates.find(t => t.id === previewTemplate)?.name} - Live Preview
            </DialogTitle>
            <DialogDescription>
              This is how your resume will look with this template using sample data
            </DialogDescription>
          </DialogHeader>
          <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white">
            {previewTemplate === 'modern-centered' ? (
              <ModernCenteredTemplate data={sampleResumeData} fontFamily={selectedFont} />
            ) : previewTemplate === 'jake' ? (
              <JakeTemplate data={sampleResumeData} fontFamily={selectedFont} />
            ) : previewTemplate === 'sparky-sundevil' ? (
              <SparkySundevilTemplate data={sampleResumeData} fontFamily={selectedFont} />
            ) : previewTemplate === 'classic-latex' ? (
              <ClassicLatexTemplate data={sampleResumeData} fontFamily={selectedFont} />
            ) : previewTemplate === 'faangpath' ? (
              <FaangPathTemplate data={sampleResumeData} fontFamily={selectedFont} />
            ) : previewTemplate === 'detailed-professional' ? (
              <DetailedProfessionalTemplate data={sampleResumeData} fontFamily={selectedFont} />
            ) : previewTemplate === 'infographic-modern' ? (
              <InfographicModernTemplate data={sampleResumeData} fontFamily={selectedFont} />
            ) : previewTemplate === 'creative-boxed' ? (
              <CreativeBoxedTemplate data={sampleResumeData} fontFamily={selectedFont} />
            ) : previewTemplate === 'sidebar-infographic' ? (
              <SidebarInfographicTemplate data={sampleResumeData} fontFamily={selectedFont} />
            ) : previewTemplate === 'academic-two-column' ? (
              <AcademicTwoColumnTemplate data={sampleResumeData} fontFamily={selectedFont} />
            ) : previewTemplate === 'minimal-sidebar' ? (
              <MinimalSidebarTemplate data={sampleResumeData} fontFamily={selectedFont} />
            ) : previewTemplate === 'rendercv' ? (
              <RenderCVTemplate data={sampleResumeData} fontFamily={selectedFont} />
            ) : null}
          </div>
          <div className="flex gap-3 justify-end mt-4">
            <Button
              onClick={() => setPreviewTemplate(null)}
              variant="outline"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                if (previewTemplate) {
                  setSelectedTemplate(previewTemplate);
                  setPreviewTemplate(null);
                }
              }}
              className="gradient-primary text-white"
            >
              Choose This Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Resume;
