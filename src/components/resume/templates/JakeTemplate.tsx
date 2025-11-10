import { ResumeFormData } from "@/components/resume/ResumeDataForm";

interface JakeTemplateProps {
  data: ResumeFormData;
  fontFamily?: string;
}

export const JakeTemplate = ({ data, fontFamily = 'charter' }: JakeTemplateProps) => {
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
    <div style={{ fontFamily: selectedFontFamily }} className="bg-white text-black p-12 max-w-[21cm] mx-auto" id="resume-preview">
      {/* Header - Name Only */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold tracking-wide uppercase">{data.personalInfo.name || "FIRST NAME LAST NAME"}</h1>
      </div>

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-lg font-bold uppercase mb-3 pb-1 border-b-2 border-black">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="font-bold text-[11pt]">{edu.institution}</p>
                  <p className="text-[11pt] italic">{edu.degree}</p>
                </div>
                <div className="text-right text-[11pt] italic">
                  <p>{edu.startDate} - {edu.endDate}</p>
                  {edu.gpa && <p>{edu.gpa} GPA</p>}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Professional Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-lg font-bold uppercase mb-3 pb-1 border-b-2 border-black">Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="font-bold text-[11pt]">{exp.company}</p>
                  <p className="text-[11pt] italic">{exp.title}</p>
                </div>
                <div className="text-right text-[11pt] italic">
                  <p>{exp.location}</p>
                  <p>{exp.startDate} - {exp.endDate}</p>
                </div>
              </div>
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="list-disc ml-5 space-y-1 mt-2">
                  {exp.highlights.map((highlight, hIndex) => (
                    <li key={hIndex} className="text-[11pt]">{highlight}</li>
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
          <h2 className="text-lg font-bold uppercase mb-3 pb-1 border-b-2 border-black">Academic Projects</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <p className="font-bold text-[11pt]">{project.title}</p>
                {project.date && <p className="text-[11pt] italic">{project.date}</p>}
              </div>
              <p className="text-[11pt] mb-1">{project.description}</p>
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

      {/* Publications/Awards */}
      {data.publications && data.publications.length > 0 && (
        <section className="mb-5">
          <h2 className="text-lg font-bold uppercase mb-3 pb-1 border-b-2 border-black">Awards</h2>
          {data.publications.map((pub, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <p className="font-bold text-[11pt]">{pub.title}</p>
                <span className="text-[11pt] italic">{pub.date}</span>
              </div>
              <p className="text-[11pt] -mt-3">{pub.authors.join(", ")}</p>
            </div>
          ))}
        </section>
      )}

      {/* Courses/Coursework */}
      {data.education && data.education.some(edu => edu.coursework && edu.coursework.length > 0) && (
        <section className="mb-5">
          <h2 className="text-lg font-bold uppercase mb-3 pb-1 border-b-2 border-black">Classes</h2>
          {data.education.map((edu, index) => (
            edu.coursework && edu.coursework.length > 0 && (
              <div key={index} className="mb-2">
                <p className="text-[11pt]">
                  <span className="font-bold">Courses: </span>
                  {edu.coursework.join(", ")}
                </p>
              </div>
            )
          ))}
        </section>
      )}

      {/* Skills & Interests */}
      {data.skills && (data.skills.languages?.length > 0 || data.skills.technologies?.length > 0) && (
        <section className="mb-5">
          <h2 className="text-lg font-bold uppercase mb-3 pb-1 border-b-2 border-black">Skills & Interests</h2>
          <div className="space-y-2">
            {data.skills.languages && data.skills.languages.length > 0 && (
              <p className="text-[11pt]">
                <span className="font-bold">Skills: </span>
                {data.skills.languages.join(", ")}
              </p>
            )}
            {data.skills.technologies && data.skills.technologies.length > 0 && (
              <p className="text-[11pt]">
                <span className="font-bold">Interests: </span>
                {data.skills.technologies.join(", ")}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Footer - Contact Info */}
      <div className="text-center mt-8 border-t pt-4">
        <p className="text-[11pt]">
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.phone && data.personalInfo.email && <span> | </span>}
          {data.personalInfo.email && (
            <span>
              <a href={`mailto:${data.personalInfo.email}`} className="underline">
                {data.personalInfo.email}
              </a>
            </span>
          )}
          {data.personalInfo.linkedin && (
            <>
              <span> | </span>
              <a href={data.personalInfo.linkedin} className="underline">
                {data.personalInfo.linkedin.replace(/^https?:\/\//, '')}
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
};
