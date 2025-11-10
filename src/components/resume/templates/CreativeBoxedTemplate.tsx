import { ResumeFormData } from "../ResumeDataForm";
import { ArrowRight } from "lucide-react";

interface CreativeBoxedTemplateProps {
  data: ResumeFormData;
  fontFamily?: string;
}

export const CreativeBoxedTemplate = ({ data, fontFamily = 'charter' }: CreativeBoxedTemplateProps) => {
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
    <div className="bg-white text-black min-h-[1056px]" style={{ width: '816px', fontFamily: selectedFontFamily }}>
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-8 py-6">
        <div className="text-xs text-gray-300 text-center mb-3">
          {data.summary || 'Consultant and Software Engineer'} · {data.personalInfo.location || 'Location'} · {data.personalInfo.email} · {data.personalInfo.phone}
        </div>
        <div className="flex items-center justify-center gap-4">
          <h1 className="text-5xl font-bold text-white uppercase tracking-wide">{data.personalInfo.name}</h1>
          <div className="w-1 h-16 bg-orange-500"></div>
          <div className="text-5xl font-bold text-white uppercase tracking-wide">Resume</div>
        </div>
      </div>

      {/* Summary Banner */}
      {data.summary && (
        <div className="bg-orange-500 px-8 py-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex gap-1">
              <ArrowRight className="w-5 h-5 text-gray-700" />
              <ArrowRight className="w-5 h-5 text-gray-700" />
            </div>
            <p className="text-white font-semibold text-center max-w-3xl">{data.summary}</p>
            <div className="flex gap-1">
              <ArrowRight className="w-5 h-5 text-gray-700 rotate-180" />
              <ArrowRight className="w-5 h-5 text-gray-700 rotate-180" />
            </div>
          </div>
        </div>
      )}

      {/* Meta Section */}
      <div className="bg-white px-8 py-6 border-b-4 border-gray-200">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
            <div className="text-gray-400 text-xs text-center">Photo</div>
          </div>
          <div className="space-y-2 flex-1">
            {data.skills?.languages && data.skills.languages.length > 0 && (
              <div className="flex gap-2">
                <ArrowRight className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="flex gap-2">
                  <span className="font-bold text-orange-500 min-w-[80px]">Stack:</span>
                  <span className="text-sm">{data.skills.languages.join(', ')}</span>
                </div>
              </div>
            )}
            {data.skills?.technologies && data.skills.technologies.length > 0 && (
              <div className="flex gap-2">
                <ArrowRight className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="flex gap-2">
                  <span className="font-bold text-orange-500 min-w-[80px]">Tools:</span>
                  <span className="text-sm">{data.skills.technologies.join(', ')}</span>
                </div>
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex gap-2">
                <ArrowRight className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="flex gap-2">
                  <span className="font-bold text-orange-500 min-w-[80px]">LinkedIn:</span>
                  <span className="text-sm">{data.personalInfo.linkedin.replace('https://', '').replace('http://', '')}</span>
                </div>
              </div>
            )}
            {data.personalInfo.github && (
              <div className="flex gap-2">
                <ArrowRight className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="flex gap-2">
                  <span className="font-bold text-orange-500 min-w-[80px]">GitHub:</span>
                  <span className="text-sm">{data.personalInfo.github.replace('https://', '').replace('http://', '')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <div className="bg-gray-100 px-8 py-6 relative">
          <div className="flex gap-6">
            <div className="flex-1 pr-12">
              {data.experience.map((exp, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-base">{exp.title}</span>
                      <span className="text-gray-600"> ({exp.company})</span>
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                      {exp.startDate}
                    </span>
                  </div>
                  <div className="border-t border-gray-300 mb-3"></div>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <div className="space-y-2">
                      {exp.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex gap-2">
                          <ArrowRight className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-0.5 h-48 bg-orange-500"></div>
              <div 
                className="text-4xl font-bold text-gray-700 whitespace-nowrap"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                EXPERIENCE
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GitHub/Portfolio Banner */}
      {data.personalInfo.github && (
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-8 py-3 text-center">
          <span className="text-white">Check out my open source projects at - </span>
          <span className="text-orange-400 font-bold">{data.personalInfo.github.replace('https://', '').replace('http://', '')}</span>
        </div>
      )}

      {/* Education Section */}
      {data.education && data.education.length > 0 && (
        <div className="bg-white px-8 py-6 relative">
          <div className="flex gap-6">
            <div className="flex-1 pr-12">
              {data.education.map((edu, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-base">{edu.degree}</span>
                      <span className="text-gray-600"> ({edu.institution})</span>
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                      {edu.startDate}
                    </span>
                  </div>
                  <div className="border-t border-gray-300 mb-3"></div>
                  {edu.coursework && edu.coursework.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <ArrowRight className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Courses: {edu.coursework.join(', ')}</span>
                      </div>
                    </div>
                  )}
                  {edu.gpa && (
                    <div className="flex gap-2 mt-2">
                      <ArrowRight className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">GPA: {edu.gpa}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-0.5 h-48 bg-orange-500"></div>
              <div 
                className="text-4xl font-bold text-gray-700 whitespace-nowrap"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                EDUCATION
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Section if exists */}
      {data.projects && data.projects.length > 0 && (
        <div className="bg-gray-100 px-8 py-6">
          <h3 className="font-bold text-orange-500 mb-4">Notable Projects</h3>
          <div className="space-y-3">
            {data.projects.map((project, index) => (
              <div key={index} className="flex gap-2">
                <ArrowRight className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold">{project.title}</span>
                  {project.highlights && project.highlights.length > 0 && (
                    <span className="text-sm ml-2">{project.highlights[0]}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-8 py-3 text-center mt-auto">
        <span className="text-white text-sm">
          {data.personalInfo.website && data.personalInfo.website.replace('https://', '').replace('http://', '')}
          {data.personalInfo.linkedin && ` · ${data.personalInfo.linkedin.replace('https://', '').replace('http://', '')}`}
        </span>
      </div>
    </div>
  );
};
