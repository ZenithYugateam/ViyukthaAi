import { ResumeFormData } from "../ResumeDataForm";

interface ClassicLatexTemplateProps {
  data: ResumeFormData;
  fontFamily?: string;
}

export const ClassicLatexTemplate = ({ data, fontFamily = 'charter' }: ClassicLatexTemplateProps) => {
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
    <div className="bg-white text-black p-12 min-h-[1056px]" style={{ width: '816px', fontFamily: selectedFontFamily }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-3">{data.personalInfo.name}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {data.personalInfo.phone && (
            <span>{data.personalInfo.phone}</span>
          )}
          {data.personalInfo.email && (
            <span>{data.personalInfo.email}</span>
          )}
          {data.personalInfo.github && (
            <span>{data.personalInfo.github.replace('https://', '')}</span>
          )}
          {data.personalInfo.linkedin && (
            <span>{data.personalInfo.linkedin.replace('https://', '')}</span>
          )}
        </div>
      </div>

      {/* Skills Section */}
      {(data.skills?.languages?.length || data.skills?.technologies?.length) && (
        <div className="mb-6">
          <h2 className="text-xl font-bold uppercase mb-3 border-b border-black pb-1">Skills</h2>
          
          {data.skills.languages?.length > 0 && (
            <div className="mb-3">
              <p className="text-sm">
                <span className="font-bold">Engineering</span> - {data.skills.languages.join(', ')}
                {data.skills.technologies?.length > 0 && `, ${data.skills.technologies.join(', ')}`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold uppercase mb-3 border-b border-black pb-1">Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-bold">{exp.company}</span>
                  {exp.location && <span className="text-sm ml-2">({exp.location})</span>}
                </div>
                <span className="text-sm whitespace-nowrap ml-4">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </span>
              </div>
              {exp.title && (
                <p className="text-sm italic mb-2">{exp.title}</p>
              )}
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="list-disc ml-6 text-sm space-y-1">
                  {exp.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education Section */}
      {data.education && data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold uppercase mb-3 border-b border-black pb-1">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold">{edu.institution}</span>
                <span className="text-sm whitespace-nowrap ml-4">
                  {edu.startDate} - {edu.endDate || 'Present'}
                </span>
              </div>
              <p className="text-sm italic mb-1">{edu.degree}</p>
              {edu.gpa && (
                <p className="text-sm">GPA: {edu.gpa}</p>
              )}
              {edu.coursework && edu.coursework.length > 0 && (
                <p className="text-sm mt-1">
                  Relevant Coursework: {edu.coursework.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold uppercase mb-3 border-b border-black pb-1">Projects</h2>
          <ul className="list-disc ml-6 text-sm space-y-2">
            {data.projects.map((project, index) => (
              <li key={index}>
                <span className="font-bold">{project.title}</span>
                {project.date && <span className="italic ml-2 text-xs">({project.date})</span>}
                {project.highlights && project.highlights.length > 0 && (
                  <ul className="list-none ml-4 mt-1 space-y-1">
                    {project.highlights.map((highlight, idx) => (
                      <li key={idx}>• {highlight}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Publications Section */}
      {data.publications && data.publications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold uppercase mb-3 border-b border-black pb-1">Publications</h2>
          {data.publications.map((pub, index) => (
            <div key={index} className="mb-2 text-sm">
              <p>
                {pub.authors?.join(', ')}. <span className="italic">{pub.title}</span>
                {pub.date && ` (${pub.date})`}
                {pub.doi && `. DOI: ${pub.doi}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
