import React from 'react';
import { Plus, Search, Filter, Mail, Phone, MoreVertical, UserPlus, UserMinus, Settings, X } from 'lucide-react';
import { useTeamStore } from '../store/teamStore';
import { useAuth } from '../contexts/AuthContext';
import InviteMemberModal from '../components/team/InviteMemberModal';

export default function Team() {
  const { members, invites, loading, error, fetchTeam } = useTeamStore();
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const filteredMembers = members?.filter(member =>
    member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Management</h1>
          <p className="mt-1 text-text-secondary">Manage your team members and their roles</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Team Member
        </button>
      </div>

      <div className="bg-card rounded-xl border border-gray-800 mb-6">
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-gray-800 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
            />
          </div>
          <button className="flex items-center px-4 py-2 text-text-secondary border border-gray-800 rounded-lg hover:bg-gray-800">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-900 text-red-300 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Error Loading Team</h3>
          <p>{error.message}</p>
          <button 
            onClick={() => fetchTeam()}
            className="mt-4 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-900 rounded-lg"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Current User/Admin Card */}
          {profile && (
            <div className="bg-card rounded-xl border border-primary/50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xl font-semibold text-primary">
                      {profile.full_name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{profile.full_name}</h3>
                    <p className="text-sm text-text-secondary capitalize">Owner</p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-green-900/30 text-green-300">
                      Active
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <a href={`mailto:${profile.email}`} className="flex items-center text-sm text-text-secondary hover:text-white">
                  <Mail className="w-4 h-4 mr-2" />
                  {profile.email}
                </a>
                {profile.phone && (
                  <a href={`tel:${profile.phone}`} className="flex items-center text-sm text-text-secondary hover:text-white">
                    <Phone className="w-4 h-4 mr-2" />
                    {profile.phone}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Other Team Members */}
          {filteredMembers.map((member) => (
            <div key={member.id} className="bg-card rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xl font-semibold text-primary">
                      {member.full_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{member.full_name}</h3>
                    <p className="text-sm text-text-secondary">{member.role}</p>
                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                      member.status === 'active' 
                        ? 'bg-green-900/30 text-green-300' 
                        : 'bg-gray-900/30 text-gray-300'
                    }`}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="relative group">
                  <button className="p-2 text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <button className="w-full px-4 py-2 text-left text-text-secondary hover:text-white hover:bg-gray-800 flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Change Role
                    </button>
                    <button className="w-full px-4 py-2 text-left text-error hover:bg-gray-800 flex items-center">
                      <UserMinus className="w-4 h-4 mr-2" />
                      Remove Member
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <a href={`mailto:${member.email}`} className="flex items-center text-sm text-text-secondary hover:text-white">
                  <Mail className="w-4 h-4 mr-2" />
                  {member.email}
                </a>
                {member.phone && (
                  <a href={`tel:${member.phone}`} className="flex items-center text-sm text-text-secondary hover:text-white">
                    <Phone className="w-4 h-4 mr-2" />
                    {member.phone}
                  </a>
                )}
              </div>
            </div>
          ))}

          {/* Pending Invites */}
          {invites?.map((invite) => (
            <div key={invite.id} className="bg-card rounded-xl border border-gray-800 p-6 opacity-75">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                    <UserPlus className="w-8 h-8 text-text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Pending Invitation</h3>
                    <p className="text-sm text-text-secondary">{invite.email}</p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-yellow-900/30 text-yellow-300 rounded-full">
                      Invited as {invite.role}
                    </span>
                  </div>
                </div>
                <button className="text-text-secondary hover:text-error">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <InviteMemberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}