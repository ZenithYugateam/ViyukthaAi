import { ResumeFormData } from "../ResumeDataForm";

interface FaangPathTemplateProps {
  data: ResumeFormData;
  fontFamily?: string;
}

export const FaangPathTemplate = ({ data, fontFamily = 'charter' }: FaangPathTemplateProps) => {
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
    <div className="bg-white text-black p-8 min-h-[1056px]" style={{ width: '816px', fontFamily: selectedFontFamily }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-3">{data.personalInfo.name}</h1>
        <div className="flex justify-between text-sm">
          <div>
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.location && <span> • {data.personalInfo.location}</span>}
          </div>
          <div className="text-right">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.linkedin && (
              <span> • {data.personalInfo.linkedin.replace('https://', '').replace('http://', '')}</span>
            )}
            {data.personalInfo.website && (
              <span> • {data.personalInfo.website.replace('https://', '').replace('http://', '')}</span>
            )}
          </div>
        </div>
      </div>

      {/* Objective/Summary Section */}
      {data.summary && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase mb-2">Objective</h2>
          <p className="text-sm">{data.summary}</p>
        </div>
      )}

      {/* Education Section */}
      {data.education && data.education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase mb-2">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold">{edu.degree}</span>
                  <span>, {edu.institution}</span>
                </div>
                <span className="text-sm">
                  {edu.startDate} - {edu.endDate || 'Expected'}
                </span>
              </div>
              {edu.coursework && edu.coursework.length > 0 && (
                <p className="text-sm mt-1">
                  Relevant Coursework: {edu.coursework.join(', ')}
                </p>
              )}
              {edu.gpa && (
                <p className="text-sm">GPA: {edu.gpa}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills Section */}
      {(data.skills?.languages?.length || data.skills?.technologies?.length) && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase mb-2">Skills</h2>
          <div className="text-sm">
            {data.skills.languages?.length > 0 && (
              <div className="flex mb-2">
                <span className="font-bold min-w-[140px]">Technical Skills</span>
                <span>{data.skills.languages.join(', ')}</span>
              </div>
            )}
            {data.skills.technologies?.length > 0 && (
              <div className="flex mb-2">
                <span className="font-bold min-w-[140px]">Technologies</span>
                <span>{data.skills.technologies.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase mb-2">Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold">{exp.title}</span>
                <span className="text-sm">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </span>
              </div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm italic">{exp.company}</span>
                {exp.location && <span className="text-sm italic">{exp.location}</span>}
              </div>
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="list-disc ml-6 text-sm space-y-1">
                  {exp.highlights.map((highlight, idx) => (
                    <li key={idx} className="leading-tight">{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase mb-2">Projects</h2>
          <ul className="text-sm space-y-2">
            {data.projects.map((project, index) => (
              <li key={index} className="leading-tight">
                <span className="font-bold">{project.title}.</span>
                {project.highlights && project.highlights.length > 0 && (
                  <span> {project.highlights.join(' ')}</span>
                )}
                {project.link && (
                  <span className="ml-1">
                    (<a href={project.link} className="underline">Link</a>)
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Publications as Extra-Curricular Activities */}
      {data.publications && data.publications.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase mb-2">Extra-Curricular Activities</h2>
          <ul className="list-disc ml-6 text-sm space-y-2">
            {data.publications.map((pub, index) => (
              <li key={index} className="leading-tight">
                Published "{pub.title}" ({pub.date})
                {pub.authors && pub.authors.length > 0 && ` with ${pub.authors.join(', ')}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
