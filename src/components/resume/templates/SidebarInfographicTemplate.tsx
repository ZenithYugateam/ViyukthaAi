import { ResumeFormData } from "../ResumeDataForm";
import { ArrowRight, MapPin, Phone, Mail, Globe, Github, Linkedin, Star, Code, Terminal, Gamepad, Headphones, Bike } from "lucide-react";

interface SidebarInfographicTemplateProps {
  data: ResumeFormData;
  fontFamily?: string;
}

export const SidebarInfographicTemplate = ({ data, fontFamily = 'charter' }: SidebarInfographicTemplateProps) => {
  const fontStyleMap: Record<string, string> = {
    'charter': 'Bitstream Charter, Charter, serif',
    'times': 'Times New Roman, Times, serif',
    'merriweather': 'Merriweather, serif',
    'playfair': 'Playfair Display, serif',
    'lora': 'Lora, serif',
    'sans': 'Inter, sans-serif',
    'roboto': 'Roboto, sans-serif',
    'open-sans': 'Open Sans, sans-serif',
    'montserrat': 'Montserrat, sans-serif',
    'raleway': 'Raleway, sans-serif',
  };
  
  const selectedFontFamily = fontStyleMap[fontFamily] || fontStyleMap['charter'];

  return (
    <div className="bg-white flex min-h-[1056px]" style={{ width: '816px', fontFamily: selectedFontFamily }}>
      {/* Main Content - Left Column */}
      <div className="w-[70%] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl font-bold text-white uppercase tracking-wide">{data.personalInfo.name}</h1>
            <div className="w-0.5 h-12 bg-teal-500"></div>
            <div className="text-3xl font-bold text-white uppercase tracking-wide">Resume</div>
          </div>
        </div>

        {/* Header Image with Overlay */}
        <div className="relative bg-gray-200 h-32 flex items-center justify-center">
          <div className="text-gray-400 text-xs">Header Image Area</div>
          
          {/* Summary Overlay */}
          {data.summary && (
            <div className="absolute right-4 top-4 bg-gray-700/90 p-4 max-w-[50%]">
              <div className="flex items-center gap-2 text-white text-xs">
                <ArrowRight className="w-3 h-3 text-teal-400" />
                <ArrowRight className="w-3 h-3 text-teal-400" />
                <span>{data.summary}</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="px-6 py-4 flex-1">
          {/* Status Section */}
          <div className="mb-4">
            <div className="bg-teal-600 px-3 py-2 mb-3">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-gray-700" />
                <ArrowRight className="w-4 h-4 text-gray-700 -ml-2" />
                <ArrowRight className="w-4 h-4 text-gray-700 -ml-2" />
                <h2 className="text-sm font-bold text-white uppercase ml-1">Status</h2>
              </div>
            </div>
            <p className="text-xs">
              {data.summary || 'Professional with expertise in software development and technology'}
            </p>
          </div>

          {/* Experience Section */}
          {data.experience && data.experience.length > 0 && (
            <div className="mb-4">
              <div className="bg-teal-600 px-3 py-2 mb-3">
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-gray-700" />
                  <ArrowRight className="w-4 h-4 text-gray-700 -ml-2" />
                  <ArrowRight className="w-4 h-4 text-gray-700 -ml-2" />
                  <h2 className="text-sm font-bold text-white uppercase ml-1">Experience</h2>
                </div>
              </div>
              
              {data.experience.slice(0, 3).map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-xs">{exp.title}</span>
                    <span className="text-xs text-orange-500">{exp.company}</span>
                  </div>
                  <span className="text-xs text-gray-600 block mb-2">{exp.startDate}</span>
                  <div className="border-t border-gray-300 mb-2"></div>
                  {exp.highlights && exp.highlights.slice(0, 2).map((highlight, idx) => (
                    <div key={idx} className="flex gap-2 mb-1">
                      <ArrowRight className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs">{highlight}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Education Section */}
          {data.education && data.education.length > 0 && (
            <div className="mb-4">
              <div className="bg-teal-600 px-3 py-2 mb-3">
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-gray-700" />
                  <ArrowRight className="w-4 h-4 text-gray-700 -ml-2" />
                  <ArrowRight className="w-4 h-4 text-gray-700 -ml-2" />
                  <h2 className="text-sm font-bold text-white uppercase ml-1">Education</h2>
                </div>
              </div>
              
              {data.education.slice(0, 2).map((edu, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-xs">{edu.degree}</span>
                    <span className="text-xs text-orange-500">{edu.institution}</span>
                  </div>
                  <span className="text-xs text-gray-600 block mb-2">{edu.startDate}</span>
                  <div className="border-t border-gray-300 mb-2"></div>
                  {edu.coursework && edu.coursework.length > 0 && (
                    <div className="flex gap-2">
                      <ArrowRight className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs">Courses: {edu.coursework.slice(0, 3).join(', ')}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-2 text-center mt-auto">
          <span className="text-white text-xs">{data.personalInfo.email}</span>
        </div>
      </div>

      {/* Sidebar - Right Column */}
      <div className="w-[30%] bg-teal-600 px-4 py-6 text-white">
        {/* Contact Section */}
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase text-center mb-3">Contact</h3>
          <div className="w-20 h-px bg-white mx-auto mb-4"></div>
          
          <div className="space-y-2 text-xs">
            {data.personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span>{data.personalInfo.location}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span className="break-all">{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3" />
                <span className="break-all">{data.personalInfo.website.replace('https://', '').replace('http://', '')}</span>
              </div>
            )}
            {data.personalInfo.github && (
              <div className="flex items-center gap-2">
                <Github className="w-3 h-3" />
                <span className="break-all">{data.personalInfo.github.replace('https://', '').replace('http://', '')}</span>
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="w-3 h-3" />
                <span className="break-all">LinkedIn</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills Section */}
        {data.skills?.languages && data.skills.languages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase text-center mb-3">Fields</h3>
            <div className="w-20 h-px bg-white mx-auto mb-4"></div>
            
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Code className="w-3 h-3" />
                  <span>Software Development</span>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(10)].map((_, i) => (
                    <Star key={i} className="w-2 h-2 fill-orange-400 text-orange-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Technologies Section */}
        {data.skills?.languages && data.skills.languages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase text-center mb-3">Technologies</h3>
            <div className="w-20 h-px bg-white mx-auto mb-4"></div>
            
            <div className="space-y-2 text-xs">
              {data.skills.languages.slice(0, 5).map((lang, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Code className="w-3 h-3" />
                  <span>{lang}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tools Section */}
        {data.skills?.technologies && data.skills.technologies.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase text-center mb-3">Tools</h3>
            <div className="w-20 h-px bg-white mx-auto mb-4"></div>
            
            <div className="space-y-2 text-xs">
              {data.skills.technologies.slice(0, 3).map((tech, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Terminal className="w-3 h-3" />
                  <span>{tech}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activities Section */}
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase text-center mb-3">Activities</h3>
          <div className="w-20 h-px bg-white mx-auto mb-4"></div>
          
          <div className="flex justify-center gap-4">
            <Gamepad className="w-6 h-6" />
            <Headphones className="w-6 h-6" />
            <Bike className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
