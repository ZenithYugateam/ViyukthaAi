-- Companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry TEXT,
  company_size TEXT,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Company jobs table
CREATE TABLE public.company_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  department TEXT,
  location TEXT NOT NULL,
  employment_type TEXT NOT NULL, -- full-time, part-time, contract, internship
  job_type TEXT NOT NULL, -- onsite, remote, hybrid
  salary_min INTEGER,
  salary_max INTEGER,
  description TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, active, expired, archived
  interview_type TEXT NOT NULL DEFAULT 'custom', -- custom, ai-generated
  interview_config JSONB, -- stores custom questions or AI config
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Job applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.company_jobs(id) ON DELETE CASCADE,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT NOT NULL DEFAULT 'applied', -- applied, interviewing, accepted, rejected
  application_answers JSONB, -- answers to custom questions
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI interview results table
CREATE TABLE public.ai_interview_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.job_applications(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  confidence DECIMAL NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  sections JSONB NOT NULL, -- [{name, score}]
  strengths TEXT[] NOT NULL DEFAULT '{}',
  areas_to_improve TEXT[] NOT NULL DEFAULT '{}',
  transcript TEXT,
  raw_explanation TEXT,
  flagged BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interview_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Users can view their own company"
ON public.companies FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own company"
ON public.companies FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own company"
ON public.companies FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for company_jobs
CREATE POLICY "Companies can view their own jobs"
ON public.company_jobs FOR SELECT
USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

CREATE POLICY "Companies can create jobs"
ON public.company_jobs FOR INSERT
WITH CHECK (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

CREATE POLICY "Companies can update their own jobs"
ON public.company_jobs FOR UPDATE
USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

CREATE POLICY "Companies can delete their own jobs"
ON public.company_jobs FOR DELETE
USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

-- RLS Policies for job_applications
CREATE POLICY "Companies can view applications for their jobs"
ON public.job_applications FOR SELECT
USING (job_id IN (
  SELECT id FROM public.company_jobs 
  WHERE company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
));

CREATE POLICY "Companies can update applications for their jobs"
ON public.job_applications FOR UPDATE
USING (job_id IN (
  SELECT id FROM public.company_jobs 
  WHERE company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
));

-- RLS Policies for ai_interview_results
CREATE POLICY "Companies can view AI results for their applications"
ON public.ai_interview_results FOR SELECT
USING (application_id IN (
  SELECT id FROM public.job_applications 
  WHERE job_id IN (
    SELECT id FROM public.company_jobs 
    WHERE company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
  )
));

CREATE POLICY "Companies can update AI results"
ON public.ai_interview_results FOR UPDATE
USING (application_id IN (
  SELECT id FROM public.job_applications 
  WHERE job_id IN (
    SELECT id FROM public.company_jobs 
    WHERE company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
  )
));

-- Indexes for performance
CREATE INDEX idx_company_jobs_company_id ON public.company_jobs(company_id);
CREATE INDEX idx_company_jobs_status ON public.company_jobs(status);
CREATE INDEX idx_company_jobs_deadline ON public.company_jobs(deadline);
CREATE INDEX idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX idx_job_applications_status ON public.job_applications(status);
CREATE INDEX idx_ai_interview_results_application_id ON public.ai_interview_results(application_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_jobs_updated_at
BEFORE UPDATE ON public.company_jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();