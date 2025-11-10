import { ResumeFormData } from "../ResumeDataForm";

interface DetailedProfessionalTemplateProps {
  data: ResumeFormData;
  fontFamily?: string;
}

export const DetailedProfessionalTemplate = ({ data, fontFamily = 'charter' }: DetailedProfessionalTemplateProps) => {
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
    <div className="bg-white text-black p-10 min-h-[1056px]" style={{ width: '816px', fontFamily: selectedFontFamily }}>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-4xl font-bold mb-3">{data.personalInfo.name}</h1>
        <div className="grid grid-cols-2 gap-x-4 text-sm">
          <div>
            {data.personalInfo.email && (
              <div>Email: {data.personalInfo.email}</div>
            )}
            {data.personalInfo.website && (
              <div>Portfolio: {data.personalInfo.website.replace('https://', '').replace('http://', '')}</div>
            )}
            {data.personalInfo.github && (
              <div>Github: {data.personalInfo.github.replace('https://', '').replace('http://', '')}</div>
            )}
          </div>
          <div className="text-right">
            {data.personalInfo.phone && (
              <div>Mobile: {data.personalInfo.phone}</div>
            )}
            {data.personalInfo.location && (
              <div>{data.personalInfo.location}</div>
            )}
            {data.personalInfo.linkedin && (
              <div>LinkedIn: {data.personalInfo.linkedin.replace('https://', '').replace('http://', '')}</div>
            )}
          </div>
        </div>
      </div>

      {/* Education Section */}
      {data.education && data.education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase mb-2 pb-1 border-b-2 border-black">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-bold">{edu.institution}</div>
                  <div className="italic text-sm">{edu.degree}</div>
                </div>
                <div className="text-right">
                  <div className="italic text-sm">
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </div>
                </div>
              </div>
              {edu.gpa && (
                <div className="text-sm mt-1">GPA: {edu.gpa}</div>
              )}
              {edu.coursework && edu.coursework.length > 0 && (
                <div className="text-xs italic mt-1">
                  Courses: {edu.coursework.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills Summary Section */}
      {(data.skills?.languages?.length || data.skills?.technologies?.length) && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase mb-2 pb-1 border-b-2 border-black">Skills Summary</h2>
          <div className="space-y-1 text-sm">
            {data.skills.languages?.length > 0 && (
              <div className="flex">
                <span className="font-bold min-w-[140px]">Languages:</span>
                <span>{data.skills.languages.join(', ')}</span>
              </div>
            )}
            {data.skills.technologies?.length > 0 && (
              <div className="flex">
                <span className="font-bold min-w-[140px]">Technologies:</span>
                <span>{data.skills.technologies.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase mb-2 pb-1 border-b-2 border-black">Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="grid grid-cols-2 gap-4 mb-1">
                <div className="font-bold">{exp.company}</div>
                <div className="text-right">{exp.location || 'Remote'}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="italic text-sm">{exp.title}</div>
                <div className="text-right italic text-sm">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </div>
              </div>
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

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase mb-2 pb-1 border-b-2 border-black">Projects</h2>
          <ul className="space-y-2 text-sm">
            {data.projects.map((project, index) => (
              <li key={index}>
                <span className="font-bold">{project.title}</span>
                {project.highlights && project.highlights.length > 0 && (
                  <span> - {project.highlights.join(' ')}</span>
                )}
                {project.date && (
                  <span className="italic text-xs ml-2">({project.date})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Publications Section */}
      {data.publications && data.publications.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase mb-2 pb-1 border-b-2 border-black">Publications</h2>
          <ul className="space-y-2 text-sm">
            {data.publications.map((pub, index) => (
              <li key={index}>
                <span className="font-bold">{pub.title}</span>
                {pub.authors && pub.authors.length > 0 && (
                  <span> - {pub.authors.join(', ')}</span>
                )}
                {pub.date && (
                  <span className="italic ml-2">({pub.date})</span>
                )}
                {pub.doi && (
                  <span className="text-xs ml-2">DOI: {pub.doi}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary as Objective if present */}
      {data.summary && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase mb-2 pb-1 border-b-2 border-black">Additional Information</h2>
          <p className="text-sm">{data.summary}</p>
        </div>
      )}
    </div>
  );
};
