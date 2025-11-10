export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_interview_results: {
        Row: {
          application_id: string
          areas_to_improve: string[]
          confidence: number
          created_at: string
          flagged: boolean
          id: string
          overall_score: number
          raw_explanation: string | null
          sections: Json
          strengths: string[]
          transcript: string | null
        }
        Insert: {
          application_id: string
          areas_to_improve?: string[]
          confidence: number
          created_at?: string
          flagged?: boolean
          id?: string
          overall_score: number
          raw_explanation?: string | null
          sections: Json
          strengths?: string[]
          transcript?: string | null
        }
        Update: {
          application_id?: string
          areas_to_improve?: string[]
          confidence?: number
          created_at?: string
          flagged?: boolean
          id?: string
          overall_score?: number
          raw_explanation?: string | null
          sections?: Json
          strengths?: string[]
          transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_interview_results_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          company_name: string
          company_size: string | null
          created_at: string
          id: string
          industry: string | null
          logo_url: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          company_name: string
          company_size?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          logo_url?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          company_name?: string
          company_size?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          logo_url?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      company_jobs: {
        Row: {
          company_id: string
          created_at: string
          deadline: string
          department: string | null
          description: string
          employment_type: string
          id: string
          interview_config: Json | null
          interview_type: string
          job_type: string
          location: string
          salary_max: number | null
          salary_min: number | null
          skills: string[]
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          deadline: string
          department?: string | null
          description: string
          employment_type: string
          id?: string
          interview_config?: Json | null
          interview_type?: string
          job_type: string
          location: string
          salary_max?: number | null
          salary_min?: number | null
          skills?: string[]
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          deadline?: string
          department?: string | null
          description?: string
          employment_type?: string
          id?: string
          interview_config?: Json | null
          interview_type?: string
          job_type?: string
          location?: string
          salary_max?: number | null
          salary_min?: number | null
          skills?: string[]
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_reports: {
        Row: {
          ai_summary: string
          communication_skills: number
          confidence_level: number
          conversation_history: Json
          created_at: string
          id: string
          improvements: string[] | null
          overall_score: number
          problem_solving: number
          session_id: string
          strengths: string[] | null
          technical_knowledge: number
        }
        Insert: {
          ai_summary: string
          communication_skills: number
          confidence_level: number
          conversation_history: Json
          created_at?: string
          id?: string
          improvements?: string[] | null
          overall_score: number
          problem_solving: number
          session_id: string
          strengths?: string[] | null
          technical_knowledge: number
        }
        Update: {
          ai_summary?: string
          communication_skills?: number
          confidence_level?: number
          conversation_history?: Json
          created_at?: string
          id?: string
          improvements?: string[] | null
          overall_score?: number
          problem_solving?: number
          session_id?: string
          strengths?: string[] | null
          technical_knowledge?: number
        }
        Relationships: [
          {
            foreignKeyName: "interview_reports_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "interview_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_sessions: {
        Row: {
          category: string
          completed_at: string | null
          created_at: string
          id: string
          level: string | null
          total_questions: number
          user_id: string
        }
        Insert: {
          category: string
          completed_at?: string | null
          created_at?: string
          id?: string
          level?: string | null
          total_questions: number
          user_id: string
        }
        Update: {
          category?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          level?: string | null
          total_questions?: number
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applicant_email: string
          applicant_name: string
          applicant_phone: string | null
          application_answers: Json | null
          cover_letter: string | null
          id: string
          job_id: string
          resume_url: string | null
          status: string
          submitted_at: string
          updated_at: string
        }
        Insert: {
          applicant_email: string
          applicant_name: string
          applicant_phone?: string | null
          application_answers?: Json | null
          cover_letter?: string | null
          id?: string
          job_id: string
          resume_url?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          applicant_email?: string
          applicant_name?: string
          applicant_phone?: string | null
          application_answers?: Json | null
          cover_letter?: string | null
          id?: string
          job_id?: string
          resume_url?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "company_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_matches: {
        Row: {
          created_at: string | null
          dedup_group_id: string | null
          id: string
          job_id: string
          match_score: number
          recency_score: number | null
          resume_id: string
          semantic_score: number | null
          title_match_score: number | null
        }
        Insert: {
          created_at?: string | null
          dedup_group_id?: string | null
          id?: string
          job_id: string
          match_score: number
          recency_score?: number | null
          resume_id: string
          semantic_score?: number | null
          title_match_score?: number | null
        }
        Update: {
          created_at?: string | null
          dedup_group_id?: string | null
          id?: string
          job_id?: string
          match_score?: number
          recency_score?: number | null
          resume_id?: string
          semantic_score?: number | null
          title_match_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "job_matches_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "scraped_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_matches_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "parsed_resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      parsed_resumes: {
        Row: {
          certifications: string[] | null
          created_at: string | null
          education: string[] | null
          emails: string[] | null
          experience_years: number | null
          file_name: string
          file_path: string
          id: string
          job_titles: string[] | null
          locations: string[] | null
          parsed_at: string | null
          phones: string[] | null
          raw_text: string | null
          skills: string[] | null
          user_id: string
        }
        Insert: {
          certifications?: string[] | null
          created_at?: string | null
          education?: string[] | null
          emails?: string[] | null
          experience_years?: number | null
          file_name: string
          file_path: string
          id?: string
          job_titles?: string[] | null
          locations?: string[] | null
          parsed_at?: string | null
          phones?: string[] | null
          raw_text?: string | null
          skills?: string[] | null
          user_id: string
        }
        Update: {
          certifications?: string[] | null
          created_at?: string | null
          education?: string[] | null
          emails?: string[] | null
          experience_years?: number | null
          file_name?: string
          file_path?: string
          id?: string
          job_titles?: string[] | null
          locations?: string[] | null
          parsed_at?: string | null
          phones?: string[] | null
          raw_text?: string | null
          skills?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      scraped_jobs: {
        Row: {
          application_url: string | null
          company: string
          created_at: string | null
          date_posted: string | null
          id: string
          job_description: string | null
          job_title: string
          job_url: string
          location: string | null
          raw_html_hash: string | null
          scraped_at: string | null
          source: string
        }
        Insert: {
          application_url?: string | null
          company: string
          created_at?: string | null
          date_posted?: string | null
          id?: string
          job_description?: string | null
          job_title: string
          job_url: string
          location?: string | null
          raw_html_hash?: string | null
          scraped_at?: string | null
          source: string
        }
        Update: {
          application_url?: string | null
          company?: string
          created_at?: string | null
          date_posted?: string | null
          id?: string
          job_description?: string | null
          job_title?: string
          job_url?: string
          location?: string | null
          raw_html_hash?: string | null
          scraped_at?: string | null
          source?: string
        }
        Relationships: []
      }
      scraping_jobs_queue: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          resume_id: string
          search_queries: Json | null
          started_at: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          resume_id: string
          search_queries?: Json | null
          started_at?: string | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          resume_id?: string
          search_queries?: Json | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "scraping_jobs_queue_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "parsed_resumes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
