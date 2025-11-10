import { ResumeFormData } from "../ResumeDataForm";
import { ArrowRight } from "lucide-react";

interface InfographicModernTemplateProps {
  data: ResumeFormData;
  fontFamily?: string;
}

export const InfographicModernTemplate = ({ data, fontFamily = 'charter' }: InfographicModernTemplateProps) => {
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
      <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold text-white uppercase tracking-wide">{data.personalInfo.name}</h1>
          <div className="w-1 h-16 bg-orange-500"></div>
          <div className="text-2xl font-bold text-white uppercase">Resume</div>
        </div>
      </div>

      {/* Sub-header with contact info */}
      <div className="bg-gray-600 px-8 py-3 text-center">
        <div className="text-xs text-gray-200">
          {data.personalInfo.name} · {data.summary || 'Consultant and Software Engineer'} · {data.personalInfo.location || 'Location'} · 
          <span className="text-orange-400 font-semibold"> {data.personalInfo.email}</span> · {data.personalInfo.phone}
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Meta Section */}
        <div className="mb-6 space-y-3">
          {data.summary && (
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <ArrowRight className="w-4 h-4 text-orange-500" />
                <span className="font-bold text-orange-500 min-w-[100px]">Summary:</span>
              </div>
              <span className="text-sm">{data.summary}</span>
            </div>
          )}
          
          {data.skills?.languages && data.skills.languages.length > 0 && (
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <ArrowRight className="w-4 h-4 text-orange-500" />
                <span className="font-bold text-orange-500 min-w-[100px]">Tech:</span>
              </div>
              <span className="text-sm">{data.skills.languages.join(', ')}</span>
            </div>
          )}

          {data.skills?.technologies && data.skills.technologies.length > 0 && (
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <ArrowRight className="w-4 h-4 text-orange-500" />
                <span className="font-bold text-orange-500 min-w-[100px]">Tools:</span>
              </div>
              <span className="text-sm">{data.skills.technologies.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Experience Section */}
        {data.experience && data.experience.length > 0 && (
          <div className="mb-6">
            <div className="bg-orange-500 px-4 py-2 mb-4">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-white" />
                <ArrowRight className="w-5 h-5 text-white -ml-4" />
                <ArrowRight className="w-5 h-5 text-white -ml-4" />
                <h2 className="text-lg font-bold text-white uppercase ml-2">Experience</h2>
              </div>
            </div>
            
            {data.experience.map((exp, index) => (
              <div key={index} className="mb-6">
                <div className="grid grid-cols-[180px_1fr_150px] gap-4 mb-2">
                  <span className="text-sm text-gray-600">{exp.startDate}</span>
                  <span className="font-bold">{exp.title}</span>
                  <span className="text-orange-500 font-semibold text-right">{exp.company}</span>
                </div>
                <div className="border-t border-gray-300 mb-3"></div>
                {exp.highlights && exp.highlights.length > 0 && (
                  <div className="grid grid-cols-[180px_1fr] gap-4">
                    <div></div>
                    <div className="space-y-2">
                      {exp.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex gap-2">
                          <ArrowRight className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education Section */}
        {data.education && data.education.length > 0 && (
          <div className="mb-6">
            <div className="bg-orange-500 px-4 py-2 mb-4">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-white" />
                <ArrowRight className="w-5 h-5 text-white -ml-4" />
                <ArrowRight className="w-5 h-5 text-white -ml-4" />
                <h2 className="text-lg font-bold text-white uppercase ml-2">Education</h2>
              </div>
            </div>
            
            {data.education.map((edu, index) => (
              <div key={index} className="mb-6">
                <div className="grid grid-cols-[180px_1fr_150px] gap-4 mb-2">
                  <span className="text-sm text-gray-600">{edu.startDate}</span>
                  <span className="font-bold">{edu.degree}</span>
                  <span className="text-orange-500 font-semibold text-right">{edu.institution}</span>
                </div>
                <div className="border-t border-gray-300 mb-3"></div>
                {edu.coursework && edu.coursework.length > 0 && (
                  <div className="grid grid-cols-[180px_1fr] gap-4">
                    <div></div>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <ArrowRight className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Coursework: {edu.coursework.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                )}
                {edu.gpa && (
                  <div className="grid grid-cols-[180px_1fr] gap-4 mt-2">
                    <div></div>
                    <span className="text-sm">GPA: {edu.gpa}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects Section */}
        {data.projects && data.projects.length > 0 && (
          <div className="mb-6">
            <div className="bg-orange-500 px-4 py-2 mb-4">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-white" />
                <ArrowRight className="w-5 h-5 text-white -ml-4" />
                <ArrowRight className="w-5 h-5 text-white -ml-4" />
                <h2 className="text-lg font-bold text-white uppercase ml-2">Projects</h2>
              </div>
            </div>
            
            {data.projects.map((project, index) => (
              <div key={index} className="mb-4">
                <div className="grid grid-cols-[180px_1fr] gap-4">
                  <span className="text-sm text-gray-600">{project.date || ''}</span>
                  <div>
                    <span className="font-bold">{project.title}</span>
                    {project.highlights && project.highlights.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {project.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex gap-2">
                            <ArrowRight className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full bg-gradient-to-r from-gray-600 to-gray-700 px-8 py-3 text-center">
        <div className="text-xs text-white">
          {data.personalInfo.website && data.personalInfo.website.replace('https://', '').replace('http://', '')}
          {data.personalInfo.github && ` · ${data.personalInfo.github.replace('https://', '').replace('http://', '')}`}
          {data.personalInfo.linkedin && ` · ${data.personalInfo.linkedin.replace('https://', '').replace('http://', '')}`}
        </div>
      </div>
    </div>
  );
};
