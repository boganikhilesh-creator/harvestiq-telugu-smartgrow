import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  district: string | null;
  farm_size: string | null;
  soil_type: string | null;
  preferred_language: string | null;
  // stored in auth user_metadata (no schema change needed)
  phone_number?: string | null;
  preferred_crops?: string[] | null;
  state?: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]       = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (currentUser: User) => {
    let { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', currentUser.id)
      .single();

    // Auto-create the profile row if it doesn't exist yet
    if (!data) {
      const meta = currentUser.user_metadata ?? {};
      const { data: created } = await supabase
        .from('profiles')
        .upsert({
          user_id:   currentUser.id,
          full_name: meta.full_name ?? null,
        }, { onConflict: 'user_id' })
        .select()
        .single();
      data = created;
    }

    if (data) {
      const meta = currentUser.user_metadata ?? {};
      setProfile({
        ...data,
        phone_number:    meta.phone_number    ?? null,
        preferred_crops: meta.preferred_crops ?? null,
        state:           meta.state           ?? 'Telangana',
      });
    }
  };

  const refreshProfile = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser) await fetchProfile(currentUser);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => fetchProfile(session.user), 0);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
