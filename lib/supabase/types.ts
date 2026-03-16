export type Role = "member" | "mentor" | "business" | "admin";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: Role;
          full_name: string;
          email: string;
          phone: string | null;
          location: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          role: Role;
          full_name: string;
          email: string;
          phone?: string | null;
          location?: string | null;
          avatar_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      branches: {
        Row: {
          id: string;
          church_name: string;
          branch_name: string;
          city: string;
          state: string;
          country: string;
          code: string;
          admin_id: string;
          created_at: string;
        };
        Insert: {
          church_name: string;
          branch_name: string;
          city: string;
          state: string;
          country: string;
          code: string;
          admin_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["branches"]["Insert"]>;
      };
      members: {
        Row: {
          id: string;
          branch_id: string;
          branch_code: string;
          skills: string[];
          sector_interests: string[];
          job_categories: string[];
          bio: string | null;
        };
        Insert: {
          id: string;
          branch_id?: string;
          branch_code: string;
          skills?: string[];
          sector_interests?: string[];
          job_categories?: string[];
          bio?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["members"]["Insert"]>;
      };
      businesses: {
        Row: {
          id: string;
          company_name: string;
          industry: string | null;
          description: string | null;
          website: string | null;
          size: string | null;
        };
        Insert: {
          id: string;
          company_name: string;
          industry?: string | null;
          description?: string | null;
          website?: string | null;
          size?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["businesses"]["Insert"]>;
      };
      mentors: {
        Row: {
          id: string;
          sector_expertise: string | null;
          years_experience: number | null;
          bio: string | null;
          preferred_contact: string | null;
        };
        Insert: {
          id: string;
          sector_expertise?: string | null;
          years_experience?: number | null;
          bio?: string | null;
          preferred_contact?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["mentors"]["Insert"]>;
      };
      jobs: {
        Row: {
          id: string;
          business_id: string;
          title: string;
          description: string | null;
          location: string | null;
          type: string | null;
          sector: string | null;
          skills_required: string[];
          status: "open" | "closed";
          created_at: string;
        };
        Insert: {
          business_id: string;
          title: string;
          description?: string | null;
          location?: string | null;
          type?: string | null;
          sector?: string | null;
          skills_required?: string[];
          status?: "open" | "closed";
        };
        Update: Partial<Database["public"]["Tables"]["jobs"]["Insert"]>;
      };
      applications: {
        Row: {
          id: string;
          job_id: string;
          member_id: string;
          status: "pending" | "viewed" | "interview" | "accepted" | "rejected";
          message: string | null;
          created_at: string;
        };
        Insert: {
          job_id: string;
          member_id: string;
          status?: "pending" | "viewed" | "interview" | "accepted" | "rejected";
          message?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["applications"]["Insert"]>;
      };
      mentorship_requests: {
        Row: {
          id: string;
          mentor_id: string;
          member_id: string;
          status: "pending" | "accepted" | "rejected";
          message: string | null;
          created_at: string;
        };
        Insert: {
          mentor_id: string;
          member_id: string;
          status?: "pending" | "accepted" | "rejected";
          message?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["mentorship_requests"]["Insert"]>;
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          recipient_id: string;
          content: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          sender_id: string;
          recipient_id: string;
          content: string;
          read_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      announcements: {
        Row: {
          id: string;
          author_id: string;
          branch_id: string | null;
          title: string;
          content: string;
          created_at: string;
        };
        Insert: {
          author_id: string;
          branch_id?: string | null;
          title: string;
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["announcements"]["Insert"]>;
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      role: "member" | "mentor" | "business" | "admin";
    };
  };
};
