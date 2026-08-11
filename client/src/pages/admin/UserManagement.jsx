import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { admin } from '../../lib/api';
import { 
  Users, 
  Search, 
  Trash2, 
  Shield, 
  UserPlus,
  Lock,
  Eye,
  ShieldCheck,
  ShieldAlert,
  Unlock,
  Key,
  RefreshCw
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await admin.getUsers();
      setUsers(data.users);
    } catch (err) {
      console.error('User Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('CRITICAL PROTOCOL: Permanently purge this operative from the global neural database? This action is irreversible.')) return;
    try {
      await admin.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Neural Purge Failed. Insufficient clearance or system error.');
    }
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const action = user.role === 'admin' ? 'Revoke Admin Clearance?' : 'Grant Admin Clearance?';
    if (!window.confirm(`CRITICAL PROTOCOL: ${action}`)) return;
    
    try {
      await admin.updateUserRole(user.id, newRole);
      fetchUsers();
    } catch (err) {
      alert('Clearance Modulation Failed.');
    }
  };
 
  const handleResetPassword = async (userId) => {
    const newPassword = prompt("ENTER NEW ENCRYPTED PASSWORD KEY FOR OPERATIVE:");
    if (!newPassword) return;
    try {
      await admin.resetUserPassword(userId, newPassword);
      alert("Operative password key rotated successfully.");
    } catch (err) {
      alert("Password rotation failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleResetMfa = async (userId) => {
    if (!window.confirm("CRITICAL PROTOCOL: Deactivate Speakeasy MFA shield for this operative?")) return;
    try {
      await admin.resetUserMfa(userId);
      alert("Operative Speakeasy MFA deactivated successfully.");
      fetchUsers();
    } catch (err) {
      alert("MFA reset failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleImpersonate = async (userId) => {
    if (!window.confirm("CRITICAL PROTOCOL: Shadows session connections? This acts as the operative.")) return;
    try {
      const { data } = await admin.impersonateUser(userId);
      if (data.token) {
        localStorage.setItem('genesis_token', data.token);
        localStorage.setItem('genesis_user', JSON.stringify(data.user));
        alert("Shadow connection established. Re-routing dashboard links...");
        window.location.href = '/dashboard';
      }
    } catch (err) {
      alert("Shadow linkage failed: " + (err.response?.data?.error || err.message));
    }
  };

  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [newOperative, setNewOperative] = useState({ full_name: '', email: '', password: '', role: 'user' });

  const handleProvision = async (e) => {
    e.preventDefault();
    try {
      // Use the existing register endpoint but as an admin tool
      await admin.provisionUser(newOperative);
      setIsProvisionModalOpen(false);
      setNewOperative({ full_name: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      alert('Provisioning Failed: ' + (err.response?.data?.error || 'Neural link error'));
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Improved role matching with case-insensitivity fallback
    const matchesRole = selectedRole === 'All' || 
                       (user.role || '').toLowerCase() === selectedRole.toLowerCase();
                       
    return matchesSearch && matchesRole;
  });

  const roleCounts = {
    All: users.length,
    User: users.filter(u => u.role === 'user').length,
    Admin: users.filter(u => u.role === 'admin').length
  };

  return (
    <div className="space-y-8">
      {/* Search & Control HUD */}
      <div className="flex flex-col xl:flex-row gap-6 items-center justify-between bg-[#070b14] p-8 rounded-3xl border border-white/5 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-brand-500/[0.03] to-transparent pointer-events-none" />
         
         <div className="relative w-full xl:w-[450px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500" />
            <input 
              type="text" 
              placeholder="SEARCH OPERATIVE MANIFEST..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-[10px] font-black text-white placeholder:text-slate-700 focus:outline-none focus:border-brand-500/50 transition-all uppercase tracking-widest bg-transparent"
            />
         </div>

         <div className="flex items-center gap-4 w-full xl:w-auto">
            <div className="flex items-center bg-white/[0.02] p-1 rounded-2xl border border-white/5 shadow-inner">
               {['All', 'User', 'Admin'].map(role => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`
                      px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 cursor-pointer
                      ${selectedRole === role 
                        ? 'bg-brand-500 text-black shadow-xl shadow-brand-500/20' 
                        : 'text-slate-600 hover:text-slate-400 hover:bg-white/5'}
                    `}
                  >
                     {role}
                     <span className={`px-2 py-0.5 rounded-md text-[7px] ${selectedRole === role ? 'bg-black/10 text-black' : 'bg-white/5 text-slate-700'}`}>
                        {roleCounts[role]}
                     </span>
                  </button>
               ))}
            </div>
            <button 
              onClick={() => setIsProvisionModalOpen(true)}
              className="flex-1 xl:flex-none flex items-center justify-center gap-3 px-8 py-3.5 bg-brand-500/10 border border-brand-500/30 rounded-2xl text-[10px] font-black text-brand-500 uppercase tracking-[0.2em] hover:bg-brand-500 hover:text-black transition-all active:scale-95 cursor-pointer"
            >
               <UserPlus className="w-4 h-4" />
               Provision
            </button>
         </div>
      </div>

      {/* Provision Modal */}
      <AnimatePresence>
        {isProvisionModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProvisionModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#070b14] border border-brand-500/20 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
               
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-brand-500/10 rounded-2xl flex items-center justify-center border border-brand-500/20">
                     <UserPlus className="w-6 h-6 text-brand-500" />
                  </div>
                  <div>
                     <h2 className="text-xl font-black text-white uppercase tracking-tighter">Provision Operative</h2>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inject New Identity into Neural Database</p>
                  </div>
               </div>

               <form onSubmit={handleProvision} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                     <input 
                       required
                       type="text" 
                       placeholder="OPERATIVE NAME..."
                       value={newOperative.full_name}
                       onChange={(e) => setNewOperative({...newOperative, full_name: e.target.value})}
                       className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-xs font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-brand-500/50 transition-all uppercase bg-transparent"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                     <input 
                       required
                       type="email" 
                       placeholder="EMAIL@PROTOCOL.COM"
                       value={newOperative.email}
                       onChange={(e) => setNewOperative({...newOperative, email: e.target.value})}
                       className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-xs font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-brand-500/50 transition-all lowercase bg-transparent"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Initialization Password</label>
                     <input 
                       required
                       type="password" 
                       placeholder="••••••••"
                       value={newOperative.password}
                       onChange={(e) => setNewOperative({...newOperative, password: e.target.value})}
                       className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-xs font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-brand-500/50 transition-all bg-transparent"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Clearance Level</label>
                     <select 
                       value={newOperative.role}
                       onChange={(e) => setNewOperative({...newOperative, role: e.target.value})}
                       className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-brand-500/50 transition-all uppercase appearance-none bg-transparent"
                     >
                        <option value="user" className="bg-[#070b14]">Standard Operative</option>
                        <option value="admin" className="bg-[#070b14]">Administrator</option>
                     </select>
                  </div>

                  <div className="flex gap-4 pt-4">
                     <button 
                       type="button"
                       onClick={() => setIsProvisionModalOpen(false)}
                       className="flex-1 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-all cursor-pointer"
                     >
                       Abort
                     </button>
                     <button 
                       type="submit"
                       className="flex-1 px-8 py-4 bg-brand-500 border border-brand-400/20 rounded-2xl text-[10px] font-black text-black uppercase tracking-widest hover:bg-brand-400 transition-all shadow-xl shadow-brand-500/20 cursor-pointer"
                     >
                       Initialize
                     </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global User Table */}
      <div className="bg-[#070b14] rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px]">
               <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                     <th className="pl-8 pr-4 py-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Operative Identity</th>
                     <th className="px-4 py-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Clearance Level</th>
                     <th className="px-4 py-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Neural Link</th>
                     <th className="px-4 py-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Initialization</th>
                     <th className="pl-4 pr-10 py-6 text-right text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                     {filteredUsers.map((user, i) => (
                        <motion.tr 
                          key={user.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ delay: i * 0.03 }}
                          className="group hover:bg-brand-500/[0.02] transition-all"
                        >
                           <td className="pl-8 pr-4 py-6">
                              <div className="flex items-center gap-4">
                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-md border ${user.role === 'admin' ? 'bg-brand-500 text-black border-brand-400' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                                    {user.full_name?.charAt(0) || 'U'}
                                 </div>
                                 <div>
                                    <span className="block text-[13px] font-black text-white tracking-tighter group-hover:text-brand-500 transition-colors leading-none mb-1">{user.full_name || 'Incognito User'}</span>
                                    <div className="flex items-center gap-1.5">
                                       <div className="w-1 h-1 bg-brand-500 rounded-full" />
                                       <span className="text-[9px] font-bold text-slate-600 tracking-widest">{user.email}</span>
                                    </div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-4 py-6">
                              <div className="flex items-center gap-3">
                                 {user.role === 'admin' ? (
                                   <div className="flex items-center gap-2.5 px-3 py-1 bg-brand-500 text-black rounded-full">
                                      <ShieldCheck className="w-2.5 h-2.5" />
                                      <span className="text-[8px] font-black uppercase tracking-[0.1em]">Admin</span>
                                   </div>
                                 ) : (
                                    <div className="flex items-center gap-2.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full">
                                      <Shield className="w-2.5 h-2.5 text-slate-400" />
                                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em]">Standard</span>
                                   </div>
                                 )}
                              </div>
                           </td>
                           <td className="px-4 py-6">
                              <div className="flex items-center gap-2.5">
                                 <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                 <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em]">Active</span>
                              </div>
                           </td>
                           <td className="px-4 py-6">
                              <div className="flex flex-col">
                                 <span className="text-[9px] font-black text-slate-400 tabular-nums uppercase">{new Date(user.created_at).toLocaleDateString()}</span>
                                 <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">Node Sync</span>
                              </div>
                           </td>
                           <td className="pl-4 pr-10 py-6 text-right">
                              <div className="flex items-center justify-end gap-2 transition-all">
                                 <button 
                                    onClick={() => handleImpersonate(user.id)}
                                    title="Shadow Session" 
                                    className="p-2.5 bg-white/5 rounded-lg border border-white/5 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all cursor-pointer"
                                  >
                                     <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => handleResetPassword(user.id)}
                                    title="Rotate Password Key" 
                                    className="p-2.5 bg-white/5 rounded-lg border border-white/5 text-slate-500 hover:text-brand-500 hover:bg-brand-500/10 transition-all cursor-pointer"
                                  >
                                     <Key className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => handleResetMfa(user.id)}
                                    title="Bypass MFA Shield" 
                                    className="p-2.5 bg-white/5 rounded-lg border border-white/5 text-slate-500 hover:text-amber-500 hover:bg-amber-500/10 transition-all cursor-pointer"
                                  >
                                     <Unlock className="w-3.5 h-3.5" />
                                  </button>
                                 <button 
                                   onClick={() => handleToggleRole(user)}
                                   title={user.role === 'admin' ? 'Revoke Admin' : 'Grant Admin'} 
                                   className="p-2.5 bg-white/5 rounded-lg border border-white/5 text-slate-500 hover:text-brand-500 hover:bg-brand-500/10 transition-all cursor-pointer"
                                 >
                                    <Lock className="w-3.5 h-3.5" />
                                 </button>
                                 <button 
                                   onClick={() => handleDelete(user.id)}
                                   title="Purge Operative"
                                   className="p-2.5 bg-rose-600/10 rounded-lg border border-rose-500/20 text-rose-500 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                                 >
                                    <Trash2 className="w-3.5 h-3.5" />
                                 </button>
                              </div>
                           </td>
                        </motion.tr>
                     ))}
                  </AnimatePresence>
               </tbody>
            </table>
         </div>
         
         {filteredUsers.length === 0 && !loading && (
           <div className="p-24 text-center space-y-4">
              <ShieldAlert className="w-12 h-12 text-slate-800 mx-auto" />
              <div>
                 <h4 className="text-lg font-black text-white uppercase tracking-tighter">No Operatives Detected</h4>
                 <p className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.3em] mt-1">Adjust search parameters</p>
              </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default UserManagement;
