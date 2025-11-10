import { ResumeFormData } from "@/components/resume/ResumeDataForm";
import sparkyPreview from "@/assets/resume-templates/sparky-sundevil-preview.png";

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  isATS: boolean;
  isMostRecommended?: boolean;
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'rendercv',
    name: 'RenderCV Classic',
    description: 'Clean, professional format with centered header and clear section hierarchy',
    preview: '/images/resume-templates/rendercv-preview.png',
    isATS: true,
  },
  {
    id: 'modern-centered',
    name: 'Modern Centered',
    description: 'Contemporary design with centered header and social icons',
    preview: '/images/resume-templates/modern-centered-preview.png',
    isATS: true,
  },
  {
    id: 'jake',
    name: 'Jake Professional',
    description: 'Traditional ATS-friendly layout with bold section headers',
    preview: '/images/resume-templates/jake-preview.png',
    isATS: true,
  },
  {
    id: 'sparky-sundevil',
    name: 'Sparky Sundevil',
    description: 'Academic-focused format with summary, technical skills, and project sections',
    preview: sparkyPreview,
    isATS: true,
  },
  {
    id: 'classic-latex',
    name: 'Classic LaTeX',
    description: 'Clean academic-style format with section-based layout and minimal design',
    preview: '/images/resume-templates/classic-latex-preview.png',
    isATS: true,
  },
  {
    id: 'faangpath',
    name: 'FAANG Path',
    description: 'Optimized for tech roles at top companies - efficient layout with objective, skills table, and compact sections',
    preview: '/images/resume-templates/faangpath-preview.png',
    isATS: true,
    isMostRecommended: true,
  },
  {
    id: 'detailed-professional',
    name: 'Detailed Professional',
    description: 'Comprehensive format with underlined sections, ideal for experienced professionals with publications and multiple projects',
    preview: '/images/resume-templates/detailed-professional-preview.png',
    isATS: true,
  },
  {
    id: 'infographic-modern',
    name: 'Infographic Modern',
    description: 'Creative design with colored headers, arrow graphics, and timeline layout - perfect for creative tech roles',
    preview: '/images/resume-templates/infographic-modern-preview.png',
    isATS: false,
  },
  {
    id: 'creative-boxed',
    name: 'Creative Boxed',
    description: 'Unique sectioned layout with colored boxes, vertical labels, and modern design - stands out from traditional resumes',
    preview: '/images/resume-templates/creative-boxed-preview.png',
    isATS: false,
  },
  {
    id: 'sidebar-infographic',
    name: 'Sidebar Infographic',
    description: 'Two-column design with colored sidebar containing contact and skills with icons - modern and visually appealing',
    preview: '/images/resume-templates/sidebar-infographic-preview.png',
    isATS: false,
  },
  {
    id: 'academic-two-column',
    name: 'Academic Two-Column',
    description: 'Clean academic format with two columns, table layouts, and sections for education, publications, and research',
    preview: '/images/resume-templates/academic-two-column-preview.png',
    isATS: true,
  },
  {
    id: 'minimal-sidebar',
    name: 'Minimal Sidebar',
    description: 'Ultra-clean minimalist design with gray sidebar and structured table format - perfect for academic and professional CVs',
    preview: '/images/resume-templates/minimal-sidebar-preview.png',
    isATS: true,
  },
];

export const sampleResumeData: ResumeFormData = {
  personalInfo: {
    name: 'John Doe',
    location: 'Your Location',
    email: 'youremail@yourdomain.com',
    phone: '0541 999 99 99',
    website: 'https://yourwebsite.com',
    linkedin: 'https://linkedin.com/in/yourusername',
    github: 'https://github.com/yourusername',
  },
  summary: 'RenderCV is a LaTeX-based CV/resume version-control and maintenance app. It allows you to create a high-quality CV or resume as a PDF file from a YAML file, with Markdown syntax support and complete control over the LaTeX code.',
  education: [
    {
      degree: 'BS in Computer Science',
      institution: 'University of Pennsylvania',
      startDate: 'Sept 2000',
      endDate: 'May 2005',
      gpa: '3.9/4.0',
      coursework: ['Computer Architecture', 'Comparison of Learning Algorithms', 'Computational Theory'],
    },
  ],
  experience: [
    {
      title: 'Software Engineer',
      company: 'Apple',
      location: 'Cupertino, CA',
      startDate: 'June 2005',
      endDate: 'Aug 2007',
      highlights: [
        'Reduced time to render user buddy lists by 75% by implementing a prediction algorithm',
        'Integrated iChat with Spotlight Search by creating a tool to extract metadata from saved chat transcripts and provide metadata to a system-wide search database',
        'Redesigned chat file format and implemented backward compatibility for search',
      ],
    },
    {
      title: 'Software Engineer Intern',
      company: 'Microsoft',
      location: 'Redmond, WA',
      startDate: 'June 2003',
      endDate: 'Aug 2003',
      highlights: [
        'Designed a UI for the VS open file switcher (Ctrl-Tab) and extended it to tool windows',
        'Created a service to provide gradient across VS and VS add-ins, optimizing its performance via caching',
        'Built an app to compute the similarity of all methods in a codebase, reducing the time complexity',
        'Created a test case generation tool that creates random XML docs from XML Schema',
      ],
    },
  ],
  publications: [
    {
      title: '3D Finite Element Analysis of No-Insulation Coils',
      authors: ['Frodo Baggins', 'John Doe', 'Samwise Gamgee'],
      date: 'Jan 2004',
      doi: '10.1109/TASC.2023.3340648',
    },
  ],
  projects: [
    {
      title: 'Multi-User Drawing Tool',
      link: 'https://github.com/sinaatalay/rendercv',
      highlights: [
        'Developed an electronic classroom where multiple users can simultaneously view and draw on a "chalkboard" with each person\'s edits synchronized',
        'Tools Used: C++, MFC',
      ],
    },
    {
      title: 'Synchronized Desktop Calendar',
      link: 'https://github.com/sinaatalay/rendercv',
      highlights: [
        'Developed a desktop calendar with globally shared and synchronized calendars, allowing users to schedule meetings with other users',
        'Tools Used: C#, .NET, SQL, XML',
      ],
    },
    {
      title: 'Custom Operating System',
      date: '2002',
      highlights: [
        'Built a UNIX-style OS with a scheduler, file system, text editor, and calculator',
        'Tools Used: C',
      ],
    },
  ],
  skills: {
    languages: ['C++', 'C', 'Java', 'Objective-C', 'C#', 'SQL', 'JavaScript'],
    technologies: ['.NET', 'Microsoft SQL Server', 'XCode', 'Interface Builder'],
  },
};