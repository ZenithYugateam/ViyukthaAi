import { ResumeFormData } from "@/components/resume/ResumeDataForm";
import { Github, Linkedin, Globe, Mail, Phone } from "lucide-react";

interface ModernCenteredTemplateProps {
  data: ResumeFormData;
  fontFamily?: string;
}

export const ModernCenteredTemplate = ({ data, fontFamily = 'sans' }: ModernCenteredTemplateProps) => {
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
  
  const selectedFontFamily = fontStyleMap[fontFamily] || fontStyleMap['sans'];
  
  return (
    <div style={{ fontFamily: selectedFontFamily }} className="bg-white text-black p-16 max-w-[21cm] mx-auto leading-relaxed">
      {/* Centered Header */}
      <header className="text-center mb-8">
        <h1 className="text-5xl font-normal mb-4 tracking-wide">{data.personalInfo.name}</h1>
        <div className="flex justify-center items-center gap-3 text-sm text-gray-600 flex-wrap">
          {data.personalInfo.github && (
            <>
              <a href={data.personalInfo.github} className="flex items-center gap-1 hover:text-blue-600">
                <Github className="w-4 h-4" />
                <span>{data.personalInfo.github.split('/').pop()}</span>
              </a>
              <span>|</span>
            </>
          )}
          {data.personalInfo.linkedin && (
            <>
              <a href={data.personalInfo.linkedin} className="flex items-center gap-1 hover:text-blue-600">
                <Linkedin className="w-4 h-4" />
                <span>{data.personalInfo.linkedin.split('/').pop()}</span>
              </a>
              <span>|</span>
            </>
          )}
          {data.personalInfo.website && (
            <>
              <a href={data.personalInfo.website} className="flex items-center gap-1 hover:text-blue-600">
                <Globe className="w-4 h-4" />
                <span>{data.personalInfo.website.replace(/^https?:\/\//, '')}</span>
              </a>
              <span>|</span>
            </>
          )}
          {data.personalInfo.email && (
            <>
              <a href={`mailto:${data.personalInfo.email}`} className="flex items-center gap-1 hover:text-blue-600">
                <Mail className="w-4 h-4" />
                <span>{data.personalInfo.email}</span>
              </a>
              <span>|</span>
            </>
          )}
          {data.personalInfo.phone && (
            <a href={`tel:${data.personalInfo.phone}`} className="flex items-center gap-1 hover:text-blue-600">
              <Phone className="w-4 h-4" />
              <span>{data.personalInfo.phone}</span>
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold uppercase tracking-wider mb-2 pb-1 border-b border-gray-400">
            Summary
          </h2>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold uppercase tracking-wider mb-2 pb-1 border-b border-gray-400">
            Work Experience
          </h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <strong className="text-base">{exp.title}</strong>
                <span className="text-sm text-gray-700">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              {exp.highlights && exp.highlights.length > 0 && (
                <div className="text-sm leading-relaxed">
                  {exp.highlights.length === 1 ? (
                    <p className="text-gray-800">{exp.highlights[0]}</p>
                  ) : (
                    <ul className="list-none space-y-1">
                      {exp.highlights.map((highlight, hIndex) => (
                        <li key={hIndex} className="text-gray-800">
                          – {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold uppercase tracking-wider mb-2 pb-1 border-b border-gray-400">
            Projects
          </h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <strong className="text-base">{project.title}</strong>
                {project.link && (
                  <a 
                    href={project.link} 
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Link to Demo
                  </a>
                )}
              </div>
              {project.highlights && project.highlights.length > 0 && (
                <p className="text-sm text-gray-800 leading-relaxed">
                  {project.highlights.join(' ')}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold uppercase tracking-wider mb-2 pb-1 border-b border-gray-400">
            Education
          </h2>
          <div className="space-y-2">
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-baseline text-sm">
                <div>
                  <span>{edu.startDate} - {edu.endDate}</span>
                  <span className="mx-2">•</span>
                  <span>{edu.degree} at <strong>{edu.institution}</strong></span>
                </div>
                {edu.gpa && (
                  <span className="text-gray-700">(GPA: {edu.gpa})</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications */}
      {data.publications && data.publications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold uppercase tracking-wider mb-2 pb-1 border-b border-gray-400">
            Publications
          </h2>
          {data.publications.map((pub, index) => (
            <div key={index} className="mb-3 text-sm">
              <div>
                {pub.authors.map((author, aIndex) => (
                  <span key={aIndex}>
                    {author === data.personalInfo.name ? (
                      <strong>{author}</strong>
                    ) : (
                      author
                    )}
                    {aIndex < pub.authors.length - 1 && ", "}
                  </span>
                ))}
                {" "}({pub.date}). "{pub.title}". 
                {pub.doi && (
                  <>
                    {" "}URL:{" "}
                    <a 
                      href={`https://doi.org/${pub.doi}`} 
                      className="text-blue-600 hover:underline font-mono text-xs"
                    >
                      https://doi.org/{pub.doi}
                    </a>
                  </>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {data.skills && (data.skills.languages?.length > 0 || data.skills.technologies?.length > 0) && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold uppercase tracking-wider mb-2 pb-1 border-b border-gray-400">
            Skills
          </h2>
          <div className="space-y-2 text-sm">
            {data.skills.languages && data.skills.languages.length > 0 && (
              <div className="flex">
                <strong className="w-40">Languages:</strong>
                <span className="flex-1">{data.skills.languages.join(", ")}</span>
              </div>
            )}
            {data.skills.technologies && data.skills.technologies.length > 0 && (
              <div className="flex">
                <strong className="w-40">Technologies:</strong>
                <span className="flex-1">{data.skills.technologies.join(", ")}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 mt-12">
        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </footer>
    </div>
  );
};
