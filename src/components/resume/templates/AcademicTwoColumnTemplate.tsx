import { ResumeFormData } from "../ResumeDataForm";
import { Phone, Home, MapPin, Mail, Globe } from "lucide-react";

interface AcademicTwoColumnTemplateProps {
  data: ResumeFormData;
  fontFamily?: string;
}

export const AcademicTwoColumnTemplate = ({ data, fontFamily = 'charter' }: AcademicTwoColumnTemplateProps) => {
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
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return (
    <div className="bg-white text-black p-8 min-h-[1056px]" style={{ width: '816px', fontFamily: selectedFontFamily }}>
      {/* Name Header */}
      <div className="mb-4">
        <h1 className="text-5xl font-bold uppercase tracking-wide">
          {firstName} <span className="font-normal">{lastName}</span>
        </h1>
        <div className="w-full h-1.5 bg-cyan-500 mt-2"></div>
      </div>

      {/* Photo and Contact Box */}
      <div className="border-2 border-black p-4 mb-6 flex gap-4">
        <div className="w-32 h-32 bg-gray-200 flex-shrink-0 flex items-center justify-center">
          <span className="text-gray-400 text-xs">Photo</span>
        </div>
        
        <div className="flex-1">
          <table className="w-full text-xs">
            <tbody>
              {data.personalInfo.phone && (
                <tr>
                  <td className="pr-2 py-1 border-r border-black align-top">
                    <Phone className="w-3 h-3" />
                  </td>
                  <td className="pl-2 py-1">{data.personalInfo.phone}</td>
                </tr>
              )}
              {data.personalInfo.location && (
                <tr>
                  <td className="pr-2 py-1 border-r border-black align-top">
                    <MapPin className="w-3 h-3" />
                  </td>
                  <td className="pl-2 py-1">{data.personalInfo.location}</td>
                </tr>
              )}
              {data.personalInfo.email && (
                <tr>
                  <td className="pr-2 py-1 border-r border-black align-top">
                    <Mail className="w-3 h-3" />
                  </td>
                  <td className="pl-2 py-1 font-mono">{data.personalInfo.email}</td>
                </tr>
              )}
              {data.personalInfo.website && (
                <tr>
                  <td className="pr-2 py-1 border-r border-black align-top">
                    <Globe className="w-3 h-3" />
                  </td>
                  <td className="pl-2 py-1 font-mono">{data.personalInfo.website.replace('https://', '').replace('http://', '')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Education Section */}
          {data.education && data.education.length > 0 && (
            <>
              <div>
                <h3 className="text-sm font-bold uppercase mb-2">Education</h3>
                <table className="w-full text-xs">
                  <tbody>
                    {data.education.map((edu, index) => (
                      <tr key={index}>
                        <td className="pr-2 py-1 border-r border-black italic align-top whitespace-nowrap">
                          {edu.startDate}
                        </td>
                        <td className="pl-2 py-1">
                          <div className="font-semibold">{edu.degree}</div>
                          <div>{edu.institution}</div>
                          {edu.gpa && <div className="text-gray-600">GPA: {edu.gpa}</div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="w-full h-0.5 bg-black"></div>
            </>
          )}

          {/* Summary/Bio Section */}
          {data.summary && (
            <>
              <div>
                <p className="text-xs leading-relaxed font-sans">
                  {data.summary}
                </p>
              </div>
              <div className="w-full h-0.5 bg-black"></div>
            </>
          )}

          {/* Publications Section */}
          {data.publications && data.publications.length > 0 && (
            <>
              <div>
                <h3 className="text-sm font-bold uppercase mb-2">Publications</h3>
                <table className="w-full text-xs">
                  <tbody>
                    {data.publications.map((pub, index) => (
                      <tr key={index}>
                        <td className="pr-2 py-1 border-r border-black font-bold align-top whitespace-nowrap">
                          [{pub.date || '2024'}]
                        </td>
                        <td className="pl-2 py-1">
                          <span className="italic">{pub.title}</span>
                          {pub.authors && pub.authors.length > 0 && (
                            <span>, by {pub.authors.join(', ')}</span>
                          )}
                          {pub.doi && <div className="text-gray-600 text-xs">DOI: {pub.doi}</div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="w-full h-0.5 bg-black"></div>
            </>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Work Experience Section */}
          {data.experience && data.experience.length > 0 && (
            <>
              <div>
                <h3 className="text-sm font-bold uppercase mb-2">Work Experience</h3>
                <table className="w-full text-xs">
                  <tbody>
                    {data.experience.map((exp, index) => (
                      <tr key={index}>
                        <td className="pr-2 py-2 border-r border-black align-top whitespace-nowrap">
                          <div className="font-semibold">{exp.startDate}–</div>
                          <div className="font-semibold">{exp.endDate || 'Present'}</div>
                        </td>
                        <td className="pl-2 py-2">
                          <div className="font-bold">{exp.title}</div>
                          <div className="italic">{exp.company}</div>
                          <div className="text-cyan-600">{exp.location}</div>
                          {exp.highlights && exp.highlights.length > 0 && (
                            <div className="mt-1 text-gray-700">{exp.highlights[0]}</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="w-full h-0.5 bg-black"></div>
            </>
          )}

          {/* Projects Section */}
          {data.projects && data.projects.length > 0 && (
            <>
              <div>
                <h3 className="text-sm font-bold uppercase mb-2">Projects</h3>
                <table className="w-full text-xs">
                  <tbody>
                    {data.projects.map((project, index) => (
                      <tr key={index}>
                        <td className="pr-2 py-2 border-r border-black align-top whitespace-nowrap">
                          <div className="font-semibold">{project.date || '2024'}</div>
                        </td>
                        <td className="pl-2 py-2">
                          <div className="font-bold">{project.title}</div>
                          {project.highlights && project.highlights.length > 0 && (
                            <div className="mt-1 text-gray-700">{project.highlights[0]}</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="w-full h-0.5 bg-black"></div>
            </>
          )}

          {/* Skills Section */}
          {(data.skills?.languages?.length || data.skills?.technologies?.length) && (
            <>
              <div>
                <h3 className="text-sm font-bold uppercase mb-2">Skills</h3>
                <div className="text-xs space-y-2">
                  {data.skills.languages && data.skills.languages.length > 0 && (
                    <div>
                      <span className="font-bold">Languages: </span>
                      <span>{data.skills.languages.join(', ')}</span>
                    </div>
                  )}
                  {data.skills.technologies && data.skills.technologies.length > 0 && (
                    <div>
                      <span className="font-bold">Technologies: </span>
                      <span>{data.skills.technologies.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full h-0.5 bg-black"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
