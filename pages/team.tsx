import React, { useState } from 'react';

const TeamPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState<string>('');

  const addMember = () => {
    if (newMember.trim() !== '') {
      setTeamMembers([...teamMembers, newMember.trim()]);
      setNewMember('');
    }
  };

  const removeMember = (index: number) => {
    const updatedTeam = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(updatedTeam);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">Team Management</div>
          <h1 className="block mt-1 text-lg leading-tight font-medium text-black">Compose Your Team</h1>
          <div className="mt-4">
            <input
              type="text"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              placeholder="Enter team member name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              onClick={addMember}
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Member
            </button>
          </div>
          <div className="mt-6">
            <h2 className="text-gray-600 text-xs font-semibold mb-2 uppercase tracking-wide">Team Members</h2>
            <ul className="divide-y divide-gray-200">
              {teamMembers.map((member, index) => (
                <li key={index} className="py-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{member}</span>
                  <button
                    onClick={() => removeMember(index)}
                    className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs focus:outline-none focus:shadow-outline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;