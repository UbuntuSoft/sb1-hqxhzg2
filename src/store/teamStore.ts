import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface TeamMember {
  id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'manager' | 'staff';
  full_name: string;
  email: string;
  phone: string | null;
  status: 'active' | 'inactive';
  created_at: string;
}

interface TeamInvite {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  created_at: string;
  expires_at: string;
}

interface TeamState {
  members: TeamMember[];
  invites: TeamInvite[];
  loading: boolean;
  error: Error | null;
  fetchTeam: () => Promise<void>;
  inviteMember: (email: string, role: TeamInvite['role']) => Promise<void>;
  updateMemberRole: (memberId: string, role: TeamMember['role']) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  cancelInvite: (inviteId: string) => Promise<void>;
}

export const useTeamStore = create<TeamState>((set, get) => ({
  members: [],
  invites: [],
  loading: false,
  error: null,

  fetchTeam: async () => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Get team members with their profiles using a simpler join
      const { data: members, error: membersError } = await supabase
        .from('team_members')
        .select(`
          id,
          user_id,
          role,
          status,
          created_at,
          profiles!team_members_user_id_fkey (
            full_name,
            email,
            phone
          )
        `)
        .eq('business_id', user.id);

      if (membersError) throw membersError;

      // Get pending invites
      const { data: invites, error: invitesError } = await supabase
        .from('team_invites')
        .select('*')
        .eq('business_id', user.id)
        .eq('status', 'pending');

      if (invitesError) throw invitesError;

      const formattedMembers: TeamMember[] = members?.map(member => ({
        id: member.id,
        user_id: member.user_id,
        role: member.role,
        status: member.status,
        created_at: member.created_at,
        full_name: member.profiles?.full_name || '',
        email: member.profiles?.email || '',
        phone: member.profiles?.phone || null
      })) || [];

      set({ 
        members: formattedMembers,
        invites: invites || [],
        loading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Error fetching team:', error);
      set({ 
        loading: false,
        error: new Error(error.message || 'Failed to fetch team members')
      });
    }
  },

  inviteMember: async (email: string, role: TeamInvite['role']) => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Generate a unique token and set expiry
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

      const { error } = await supabase
        .from('team_invites')
        .insert({
          business_id: user.id,
          email,
          role,
          token,
          expires_at: expiresAt.toISOString()
        });

      if (error) throw error;

      await get().fetchTeam();
    } catch (error: any) {
      console.error('Error inviting team member:', error);
      set({ 
        loading: false,
        error: new Error(error.message || 'Failed to invite team member')
      });
      throw error;
    }
  },

  updateMemberRole: async (memberId: string, role: TeamMember['role']) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ role })
        .eq('id', memberId);

      if (error) throw error;
      await get().fetchTeam();
    } catch (error: any) {
      console.error('Error updating member role:', error);
      set({ 
        loading: false,
        error: new Error(error.message || 'Failed to update member role')
      });
      throw error;
    }
  },

  removeMember: async (memberId: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
      await get().fetchTeam();
    } catch (error: any) {
      console.error('Error removing team member:', error);
      set({ 
        loading: false,
        error: new Error(error.message || 'Failed to remove team member')
      });
      throw error;
    }
  },

  cancelInvite: async (inviteId: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('team_invites')
        .update({ status: 'cancelled' })
        .eq('id', inviteId);

      if (error) throw error;
      await get().fetchTeam();
    } catch (error: any) {
      console.error('Error cancelling invite:', error);
      set({ 
        loading: false,
        error: new Error(error.message || 'Failed to cancel invite')
      });
      throw error;
    }
  }
}));