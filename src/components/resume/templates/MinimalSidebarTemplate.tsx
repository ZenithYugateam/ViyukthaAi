import { ResumeFormData } from "../ResumeDataForm";
import { Phone, MapPin, Mail, Globe, Github, Linkedin, Calendar, Flag } from "lucide-react";

interface MinimalSidebarTemplateProps {
  data: ResumeFormData;
  fontFamily?: string;
}

export const MinimalSidebarTemplate = ({ data, fontFamily = 'charter' }: MinimalSidebarTemplateProps) => {
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

  const nameParts = data.personalInfo.name.split(' ');
  const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0];
  const lastName = nameParts[nameParts.length - 1] || '';

  return (
    <div className="bg-white flex flex-col min-h-[1056px]" style={{ width: '816px', fontFamily: selectedFontFamily }}>
      {/* Header */}
      <div className="bg-gray-900 px-8 py-6 text-center">
        <h1 className="text-4xl font-bold text-white uppercase tracking-widest mb-2">
          {firstName} {lastName}
        </h1>
        <div className="w-32 h-0.5 bg-white mx-auto mb-3"></div>
        <p className="text-lg text-white uppercase tracking-wide">
          {data.summary || 'Professional Title'}
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-[35%] bg-gray-100 p-6 text-xs">
          {/* Photo */}
          <div className="w-24 h-24 bg-gray-300 mx-auto mb-6 flex items-center justify-center">
            <span className="text-gray-500 text-xs">Photo</span>
          </div>

          {/* Contact Section */}
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase mb-3 text-center">Contact</h3>
            <div className="border-t border-gray-900 mb-3"></div>
            
            <div className="space-y-3">
              {data.personalInfo.location && (
                <div className="flex gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Address</div>
                    <div>{data.personalInfo.location}</div>
                  </div>
                </div>
              )}
              
              {data.personalInfo.phone && (
                <div className="flex gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Phone</div>
                    <div>{data.personalInfo.phone}</div>
                  </div>
                </div>
              )}
              
              {data.personalInfo.email && (
                <div className="flex gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">E-Mail</div>
                    <div className="break-all">{data.personalInfo.email}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Platforms Section */}
          {(data.personalInfo.github || data.personalInfo.linkedin) && (
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase mb-3 text-center">Platforms</h3>
              <div className="border-t border-gray-900 mb-3"></div>
              
              <div className="space-y-3">
                {data.personalInfo.github && (
                  <div className="flex gap-2">
                    <Github className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">GitHub</div>
                      <div className="break-all">{data.personalInfo.github.replace('https://', '').replace('http://', '').split('/').pop()}</div>
                    </div>
                  </div>
                )}
                
                {data.personalInfo.linkedin && (
                  <div className="flex gap-2">
                    <Linkedin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">LinkedIn</div>
                      <div className="break-all">{data.personalInfo.name}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills/Languages Section */}
          {data.skills?.languages && data.skills.languages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase mb-3 text-center">Skills</h3>
              <div className="border-t border-gray-900 mb-3"></div>
              
              <div className="space-y-3">
                {data.skills.languages.slice(0, 3).map((lang, index) => (
                  <div key={index} className="flex gap-2">
                    <Flag className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">{lang}</div>
                      <div>Professional</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="w-[65%] bg-white p-6">
          <table className="w-full text-xs">
            <tbody>
              {/* Education Section */}
              {data.education && data.education.length > 0 && (
                <>
                  <tr>
                    <td></td>
                    <td className="pt-2 pb-3">
                      <h3 className="text-sm font-bold uppercase">Education</h3>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <div className="border-t border-gray-900 mb-3"></div>
                    </td>
                  </tr>
                  {data.education.map((edu, index) => (
                    <tr key={index}>
                      <td className="align-top pr-4 pb-3 whitespace-nowrap text-right" style={{ width: '120px' }}>
                        {edu.startDate} - {edu.endDate || 'Present'}
                      </td>
                      <td className="pb-3">
                        <div className="font-bold">{edu.institution}</div>
                        <div>{edu.degree}</div>
                        {edu.gpa && <div>GPA: {edu.gpa}</div>}
                        {edu.coursework && edu.coursework.length > 0 && (
                          <div className="text-gray-600">{edu.coursework[0]}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr><td colSpan={2} className="pb-4"></td></tr>
                </>
              )}

              {/* Work Experience Section */}
              {data.experience && data.experience.length > 0 && (
                <>
                  <tr>
                    <td></td>
                    <td className="pt-2 pb-3">
                      <h3 className="text-sm font-bold uppercase">Work Experience</h3>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <div className="border-t border-gray-900 mb-3"></div>
                    </td>
                  </tr>
                  {data.experience.map((exp, index) => (
                    <tr key={index}>
                      <td className="align-top pr-4 pb-3 whitespace-nowrap text-right" style={{ width: '120px' }}>
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </td>
                      <td className="pb-3">
                        <div className="font-bold">{exp.company}</div>
                        <div>{exp.title}</div>
                        {exp.location && <div className="text-gray-600">{exp.location}</div>}
                        {exp.highlights && exp.highlights.length > 0 && (
                          <div className="mt-1 text-gray-700">{exp.highlights[0]}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr><td colSpan={2} className="pb-4"></td></tr>
                </>
              )}

              {/* Publications Section */}
              {data.publications && data.publications.length > 0 && (
                <>
                  <tr>
                    <td></td>
                    <td className="pt-2 pb-3">
                      <h3 className="text-sm font-bold uppercase">Selected Publications</h3>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <div className="border-t border-gray-900 mb-3"></div>
                    </td>
                  </tr>
                  {data.publications.map((pub, index) => (
                    <tr key={index}>
                      <td className="align-top pr-4 pb-2 text-right" style={{ width: '120px' }}>
                        {pub.date || '2024'}
                      </td>
                      <td className="pb-2">
                        <div className="font-bold">{pub.title}</div>
                      </td>
                    </tr>
                  ))}
                  <tr><td colSpan={2} className="pb-4"></td></tr>
                </>
              )}

              {/* Projects Section */}
              {data.projects && data.projects.length > 0 && (
                <>
                  <tr>
                    <td></td>
                    <td className="pt-2 pb-3">
                      <h3 className="text-sm font-bold uppercase">Projects</h3>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <div className="border-t border-gray-900 mb-3"></div>
                    </td>
                  </tr>
                  {data.projects.map((project, index) => (
                    <tr key={index}>
                      <td className="align-top pr-4 pb-3 text-right" style={{ width: '120px' }}>
                        {project.date || '2024'}
                      </td>
                      <td className="pb-3">
                        <div className="font-bold">{project.title}</div>
                        {project.highlights && project.highlights.length > 0 && (
                          <div className="text-gray-700">{project.highlights[0]}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 h-2"></div>
    </div>
  );
};
