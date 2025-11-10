import { ResumeFormData } from "@/components/resume/ResumeDataForm";

interface RenderCVTemplateProps {
  data: ResumeFormData;
  fontFamily?: string;
}

export const RenderCVTemplate = ({ data, fontFamily = 'charter' }: RenderCVTemplateProps) => {
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
    <div style={{ fontFamily: selectedFontFamily }} className="bg-white text-black p-16 max-w-[21cm] mx-auto leading-relaxed">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-3">{data.personalInfo.name}</h1>
        <div className="text-sm text-gray-700 space-x-2">
          {data.personalInfo.location && (
            <>
              <span>{data.personalInfo.location}</span>
              <span>|</span>
            </>
          )}
          {data.personalInfo.email && (
            <>
              <a href={`mailto:${data.personalInfo.email}`} className="hover:underline">
                {data.personalInfo.email}
              </a>
              <span>|</span>
            </>
          )}
          {data.personalInfo.phone && (
            <>
              <span>{data.personalInfo.phone}</span>
              <span>|</span>
            </>
          )}
          {data.personalInfo.website && (
            <a href={data.personalInfo.website} className="hover:underline">
              {data.personalInfo.website.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
        <div className="text-sm text-gray-700 mt-1 space-x-2">
          {data.personalInfo.linkedin && (
            <>
              <a href={data.personalInfo.linkedin} className="hover:underline">
                {data.personalInfo.linkedin.replace(/^https?:\/\//, '')}
              </a>
              <span>|</span>
            </>
          )}
          {data.personalInfo.github && (
            <a href={data.personalInfo.github} className="hover:underline">
              {data.personalInfo.github.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
      </header>

      {/* Summary Section */}
      {data.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-400 mb-2 pb-1">
            Welcome to RenderCV!
          </h2>
          <p className="text-sm mb-3">{data.summary}</p>
          <p className="text-sm text-gray-700">
            The boilerplate content was inspired by Gayle McDowell.
          </p>
        </section>
      )}

      {/* Quick Guide Section */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-400 mb-2 pb-1">
          Quick Guide
        </h2>
        <ul className="list-disc ml-5 text-sm space-y-1">
          <li>Each section title is arbitrary and each section contains a list of entries.</li>
          <li>
            There are 7 unique entry types: <em>BulletEntry</em>, <em>TextEntry</em>,{" "}
            <em>EducationEntry</em>, <em>ExperienceEntry</em>, <em>NormalEntry</em>,{" "}
            <em>PublicationEntry</em>, and <em>OneLineEntry</em>.
          </li>
          <li>Select a section title, pick an entry type, and start writing your section!</li>
          <li>Here, you can find a comprehensive user guide for RenderCV.</li>
        </ul>
      </section>

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-400 mb-2 pb-1">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <strong>{edu.institution}</strong>, {edu.degree}
                </div>
                <div className="text-sm text-gray-700">
                  {edu.startDate} – {edu.endDate}
                </div>
              </div>
              <ul className="list-disc ml-5 text-sm space-y-1">
                {edu.gpa && <li>GPA: {edu.gpa}</li>}
                {edu.coursework && edu.coursework.length > 0 && (
                  <li>
                    <strong>Coursework:</strong> {edu.coursework.join(", ")}
                  </li>
                )}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-400 mb-2 pb-1">Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <strong>{exp.title}</strong>, {exp.company} – {exp.location}
                </div>
                <div className="text-sm text-gray-700">
                  {exp.startDate} – {exp.endDate}
                </div>
              </div>
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="list-disc ml-5 text-sm space-y-1">
                  {exp.highlights.map((highlight, hIndex) => (
                    <li key={hIndex}>{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Publications */}
      {data.publications && data.publications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-400 mb-2 pb-1">Publications</h2>
          {data.publications.map((pub, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <strong>{pub.title}</strong>
                <span className="text-sm text-gray-700">{pub.date}</span>
              </div>
              {pub.authors && pub.authors.length > 0 && (
                <div className="text-sm">
                  {pub.authors.map((author, aIndex) => (
                    <span key={aIndex}>
                      {author === data.personalInfo.name ? (
                        <strong className="italic">{author}</strong>
                      ) : (
                        author
                      )}
                      {aIndex < pub.authors.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              )}
              {pub.doi && (
                <div className="text-sm mt-1">
                  <a href={`https://doi.org/${pub.doi}`} className="hover:underline text-blue-600">
                    {pub.doi}
                  </a>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-400 mb-2 pb-1">Projects</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <strong>{project.title}</strong>
                {project.link && (
                  <a href={project.link} className="text-sm hover:underline text-blue-600">
                    {project.link.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {!project.link && project.date && (
                  <span className="text-sm text-gray-700">{project.date}</span>
                )}
              </div>
              {project.highlights && project.highlights.length > 0 && (
                <ul className="list-disc ml-5 text-sm space-y-1">
                  {project.highlights.map((highlight, hIndex) => (
                    <li key={hIndex}>{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills/Technologies */}
      {data.skills && (data.skills.languages?.length > 0 || data.skills.technologies?.length > 0) && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-400 mb-2 pb-1">Technologies</h2>
          {data.skills.languages && data.skills.languages.length > 0 && (
            <div className="text-sm mb-2">
              <strong>Languages:</strong> {data.skills.languages.join(", ")}
            </div>
          )}
          {data.skills.technologies && data.skills.technologies.length > 0 && (
            <div className="text-sm">
              <strong>Technologies:</strong> {data.skills.technologies.join(", ")}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
