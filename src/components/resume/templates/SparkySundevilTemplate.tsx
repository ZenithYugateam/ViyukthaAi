import { ResumeFormData } from "@/components/resume/ResumeDataForm";

interface SparkySundevilTemplateProps {
  data: ResumeFormData;
  fontFamily?: string;
}

export const SparkySundevilTemplate = ({ data, fontFamily = 'charter' }: SparkySundevilTemplateProps) => {
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
    <div style={{ fontFamily: selectedFontFamily }} className="bg-white text-black p-12 max-w-[21cm] mx-auto leading-relaxed" id="resume-preview">
      {/* Header - Name and Contact */}
      <div className="mb-6">
        <div className="text-center mb-1">
          <h1 className="text-3xl font-bold tracking-wider">{data.personalInfo.name || "FIRST NAME LAST NAME"}</h1>
        </div>
        <div className="text-center text-[11pt] mb-3">
          <p>
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.phone && data.personalInfo.email && <span> • </span>}
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.linkedin && <span> • {data.personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>}
            {data.personalInfo.github && <span> • {data.personalInfo.github.replace(/^https?:\/\//, '')}</span>}
          </p>
        </div>
        <hr className="border-t border-black" />
      </div>

      {/* Summary Section */}
      {data.summary && (
        <section className="mb-5">
          <h2 className="text-[11pt] font-bold underline mb-2">SUMMARY</h2>
          <p className="text-[11pt] leading-relaxed">{data.summary}</p>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11pt] font-bold underline mb-2">EDUCATION</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-bold text-[11pt]">{edu.degree}</p>
                  <p className="text-[11pt]">{edu.institution}</p>
                  {edu.coursework && edu.coursework.length > 0 && (
                    <p className="text-[11pt]">Relevant coursework: {edu.coursework.join(", ")}</p>
                  )}
                </div>
                <div className="text-right text-[11pt] ml-4 whitespace-nowrap">
                  <p>Graduating {edu.endDate}</p>
                  {edu.gpa && <p>{edu.gpa} GPA</p>}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Technical Skills */}
      {data.skills && (data.skills.languages?.length > 0 || data.skills.technologies?.length > 0) && (
        <section className="mb-5">
          <h2 className="text-[11pt] font-bold underline mb-2">TECHNICAL SKILLS</h2>
          <div className="space-y-1">
            {data.skills.languages && data.skills.languages.length > 0 && (
              <p className="text-[11pt]">
                <span className="font-bold">Programming:</span> {data.skills.languages.join(", ")}
              </p>
            )}
            {data.skills.technologies && data.skills.technologies.length > 0 && (
              <p className="text-[11pt]">
                <span className="font-bold">Technologies:</span> {data.skills.technologies.join(", ")}
              </p>
            )}
            {data.skills.tools && data.skills.tools.length > 0 && (
              <p className="text-[11pt]">
                <span className="font-bold">Tools:</span> {data.skills.tools.join(", ")}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11pt] font-bold underline mb-2">PROFESSIONAL EXPERIENCE</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="font-bold text-[11pt]">{exp.company}{exp.location && `, ${exp.location}`}: {exp.title}</p>
                </div>
                <p className="text-[11pt] whitespace-nowrap ml-4">
                  {exp.startDate} – {exp.endDate}
                </p>
              </div>
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="list-disc ml-5 space-y-1">
                  {exp.highlights.map((highlight, hIndex) => (
                    <li key={hIndex} className="text-[11pt] leading-relaxed">{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Academic Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11pt] font-bold underline mb-2">ACADEMIC PROJECTS</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <p className="font-bold text-[11pt]">{project.title}</p>
                {project.date && <p className="text-[11pt] whitespace-nowrap ml-4">{project.date}</p>}
              </div>
              {project.description && (
                <p className="text-[11pt] leading-relaxed mb-1">{project.description}</p>
              )}
              {project.highlights && project.highlights.length > 0 && (
                <ul className="list-disc ml-5 space-y-1">
                  {project.highlights.map((highlight, hIndex) => (
                    <li key={hIndex} className="text-[11pt]">{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Publications */}
      {data.publications && data.publications.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11pt] font-bold underline mb-2">PUBLICATIONS</h2>
          {data.publications.map((pub, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <p className="font-bold text-[11pt]">{pub.title}</p>
                <span className="text-[11pt] whitespace-nowrap ml-4">{pub.date}</span>
              </div>
              <p className="text-[11pt]">{pub.authors.join(", ")}</p>
              {pub.doi && (
                <p className="text-[11pt]">DOI: {pub.doi}</p>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
