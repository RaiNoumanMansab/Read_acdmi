import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  User,
  GraduationCap,
  Plus,
  Save,
  X,
  Check,
  Trash2,
  Edit2,
  Lock,
  BarChart2,
  Receipt,
  Bell,
  Settings,
  UserCheck,
  Calendar,
  FileText,
  Image,
  DollarSign,
  PieChart,
  Award,
  TrendingUp,
  BookOpen,
  Users
} from "lucide-react";
import { useToast } from "../common/Toast";

interface Permission {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  category: string;
}

const ALL_PERMISSIONS: Permission[] = [
  { id: "dashboard.view", label: "View Dashboard", description: "Access main dashboard overview", icon: BarChart2, category: "Dashboard" },
  { id: "students.view", label: "View Students", description: "View student list and profiles", icon: Users, category: "Students" },
  { id: "students.create", label: "Enroll Students", description: "Add new students to system", icon: Users, category: "Students" },
  { id: "students.edit", label: "Edit Students", description: "Modify student information", icon: Users, category: "Students" },
  { id: "students.delete", label: "Delete Students", description: "Remove students from system", icon: Users, category: "Students" },
  { id: "admissions.view", label: "View Admissions", description: "View admission applications", icon: UserCheck, category: "Admissions" },
  { id: "admissions.process", label: "Process Admissions", description: "Approve or reject applications", icon: UserCheck, category: "Admissions" },
  { id: "attendance.view", label: "View Attendance", description: "View attendance records", icon: Calendar, category: "Attendance" },
  { id: "attendance.mark", label: "Mark Attendance", description: "Mark student attendance", icon: Calendar, category: "Attendance" },
  { id: "attendance.edit", label: "Edit Attendance", description: "Modify existing attendance records", icon: Calendar, category: "Attendance" },
  { id: "fees.view", label: "View Fees", description: "View fee vouchers and records", icon: Receipt, category: "Fees" },
  { id: "fees.create", label: "Create Vouchers", description: "Generate fee vouchers", icon: Receipt, category: "Fees" },
  { id: "fees.pay", label: "Record Payment", description: "Mark fees as paid", icon: Receipt, category: "Fees" },
  { id: "teachers.view", label: "View Teachers", description: "View teacher profiles", icon: GraduationCap, category: "Teachers" },
  { id: "teachers.create", label: "Add Teachers", description: "Add new teaching staff", icon: GraduationCap, category: "Teachers" },
  { id: "teachers.edit", label: "Edit Teachers", description: "Modify teacher records", icon: GraduationCap, category: "Teachers" },
  { id: "classes.view", label: "View Classes", description: "View classes and subjects", icon: BookOpen, category: "Academics" },
  { id: "classes.manage", label: "Manage Classes", description: "Create and edit classes/subjects", icon: BookOpen, category: "Academics" },
  { id: "timetable.view", label: "View Timetable", description: "View class timetables", icon: Calendar, category: "Academics" },
  { id: "timetable.manage", label: "Manage Timetable", description: "Edit timetable entries", icon: Calendar, category: "Academics" },
  { id: "homework.view", label: "View Homework", description: "View homework assignments", icon: FileText, category: "Academics" },
  { id: "homework.manage", label: "Manage Homework", description: "Create and assign homework", icon: FileText, category: "Academics" },
  { id: "exams.view", label: "View Exams", description: "View exam schedules and results", icon: Award, category: "Academics" },
  { id: "exams.manage", label: "Manage Exams", description: "Create exams and enter results", icon: Award, category: "Academics" },
  { id: "progress.view", label: "View Progress", description: "View student progress reports", icon: TrendingUp, category: "Academics" },
  { id: "payroll.view", label: "View Payroll", description: "View staff salary records", icon: DollarSign, category: "Finance" },
  { id: "payroll.manage", label: "Manage Payroll", description: "Process and edit payroll", icon: DollarSign, category: "Finance" },
  { id: "accounts.view", label: "View Accounts", description: "View financial ledger (P&L)", icon: PieChart, category: "Finance" },
  { id: "accounts.manage", label: "Manage Accounts", description: "Add/edit financial transactions", icon: PieChart, category: "Finance" },
  { id: "notices.view", label: "View Notices", description: "View school notices", icon: Bell, category: "CMS" },
  { id: "notices.manage", label: "Manage Notices", description: "Create and send notices", icon: Bell, category: "CMS" },
  { id: "blogs.manage", label: "Manage Blogs", description: "Write and publish blog posts", icon: FileText, category: "CMS" },
  { id: "gallery.manage", label: "Manage Gallery", description: "Upload and manage gallery photos", icon: Image, category: "CMS" },
  { id: "events.manage", label: "Manage Events", description: "Create and edit school events", icon: Calendar, category: "CMS" },
  { id: "settings.view", label: "View Settings", description: "View system settings", icon: Settings, category: "System" },
  { id: "settings.manage", label: "Manage Settings", description: "Change system configuration", icon: Settings, category: "System" },
  { id: "roles.manage", label: "Manage Roles", description: "Create and edit roles & permissions", icon: ShieldCheck, category: "System" },
];

const PERM_CATEGORIES = ["Dashboard","Students","Admissions","Attendance","Fees","Teachers","Academics","Finance","CMS","System"];

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  iconName: string;
  isSystem: boolean;
  permissions: string[];
  userCount: number;
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  ShieldAlert, ShieldCheck, GraduationCap, PieChart, User,
};

const DEFAULT_ROLES: Role[] = [
  {
    id: "super-admin", name: "Super Admin",
    description: "Full access — school owner / principal level",
    color: "#E62929", bgColor: "#feecec", iconName: "ShieldAlert",
    isSystem: true, permissions: ALL_PERMISSIONS.map(p => p.id), userCount: 1,
  },
  {
    id: "admin", name: "Admin",
    description: "School administrator — most features except system settings",
    color: "#0B3974", bgColor: "#eff6ff", iconName: "ShieldCheck",
    isSystem: false,
    permissions: ALL_PERMISSIONS.filter(p => !p.id.startsWith("roles") && !p.id.startsWith("settings.manage")).map(p => p.id),
    userCount: 2,
  },
  {
    id: "teacher", name: "Teacher",
    description: "Teaching staff — academics, attendance, and homework",
    color: "#16a34a", bgColor: "#f0fdf4", iconName: "GraduationCap",
    isSystem: false,
    permissions: ["dashboard.view","students.view","attendance.view","attendance.mark","classes.view","timetable.view","homework.view","homework.manage","exams.view","exams.manage","progress.view","notices.view"],
    userCount: 12,
  },
  {
    id: "accountant", name: "Accountant",
    description: "Finance staff — fees, payroll, and accounts only",
    color: "#b45309", bgColor: "#fffbeb", iconName: "PieChart",
    isSystem: false,
    permissions: ["dashboard.view","students.view","fees.view","fees.create","fees.pay","payroll.view","payroll.manage","accounts.view","accounts.manage"],
    userCount: 1,
  },
  {
    id: "receptionist", name: "Receptionist",
    description: "Front desk — admissions, notices, and student info only",
    color: "#7c3aed", bgColor: "#f5f3ff", iconName: "User",
    isSystem: false,
    permissions: ["dashboard.view","students.view","admissions.view","admissions.process","notices.view","notices.manage"],
    userCount: 1,
  },
];

export const RolesView: React.FC = () => {
  const { showToast } = useToast();
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);
  const [selectedRole, setSelectedRole] = useState<Role>(DEFAULT_ROLES[0]);
  const [editingPermissions, setEditingPermissions] = useState(false);
  const [draftPerms, setDraftPerms] = useState<string[]>([]);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [newRoleColor, setNewRoleColor] = useState("#0B3974");
  const [activeCategory, setActiveCategory] = useState("All");

  const handleStartEdit = () => {
    if (selectedRole.isSystem) {
      showToast("System Role Locked", "Super Admin cannot be modified for security.", "error");
      return;
    }
    setDraftPerms([...selectedRole.permissions]);
    setEditingPermissions(true);
  };

  const handleTogglePerm = (permId: string) => {
    setDraftPerms(prev => prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]);
  };

  const handleSavePerms = () => {
    const updated = roles.map(r => r.id === selectedRole.id ? { ...r, permissions: draftPerms } : r);
    setRoles(updated);
    setSelectedRole({ ...selectedRole, permissions: draftPerms });
    setEditingPermissions(false);
    showToast("Permissions Saved", `Role "${selectedRole.name}" updated.`, "success");
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role || role.isSystem) {
      showToast("Cannot Delete", "System roles are protected.", "error");
      return;
    }
    const remaining = roles.filter(r => r.id !== roleId);
    setRoles(remaining);
    setSelectedRole(remaining[0]);
    showToast("Role Deleted", `"${role.name}" removed.`, "success");
  };

  const handleAddRole = () => {
    if (!newRoleName.trim()) { showToast("Name Required", "", "error"); return; }
    const newRole: Role = {
      id: `role-${Date.now()}`, name: newRoleName.trim(),
      description: newRoleDesc.trim() || "Custom role",
      color: newRoleColor, bgColor: "#f8fafc", iconName: "ShieldCheck",
      isSystem: false, permissions: ["dashboard.view"], userCount: 0,
    };
    const updated = [...roles, newRole];
    setRoles(updated);
    setSelectedRole(newRole);
    setShowAddRoleModal(false);
    setNewRoleName(""); setNewRoleDesc(""); setNewRoleColor("#0B3974");
    showToast("Role Created", `"${newRole.name}" added. Now set permissions.`, "success");
    setDraftPerms(["dashboard.view"]);
    setEditingPermissions(true);
  };

  const currentPerms = editingPermissions ? draftPerms : selectedRole.permissions;
  const filteredPerms = activeCategory === "All" ? ALL_PERMISSIONS : ALL_PERMISSIONS.filter(p => p.category === activeCategory);

  const grantedInCat = (cat: string) => {
    const catP = cat === "All" ? ALL_PERMISSIONS : ALL_PERMISSIONS.filter(p => p.category === cat);
    return catP.filter(p => currentPerms.includes(p.id)).length;
  };
  const totalInCat = (cat: string) => cat === "All" ? ALL_PERMISSIONS.length : ALL_PERMISSIONS.filter(p => p.category === cat).length;

  const RoleIcon = ICON_MAP[selectedRole.iconName] || ShieldCheck;

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "#0B3974", display: "flex", alignItems: "center", gap: "10px" }}>
            <ShieldCheck size={26} color="#0B3974" />
            Roles &amp; Permissions
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#64748b" }}>
            Control what each user role can see and do across the system
          </p>
        </div>
        <button onClick={() => setShowAddRoleModal(true)} className="bca-btn bca-btn-primary">
          <Plus size={16} /> Add New Role
        </button>
      </div>

      {/* Two-Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "20px", alignItems: "start" }}>

        {/* Left: Roles List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
            {roles.length} Roles
          </div>
          {roles.map(role => {
            const Icon = ICON_MAP[role.iconName] || ShieldCheck;
            const isActive = selectedRole.id === role.id;
            const pct = Math.round((role.permissions.length / ALL_PERMISSIONS.length) * 100);
            return (
              <div
                key={role.id}
                onClick={() => { if (!editingPermissions) { setSelectedRole(role); setActiveCategory("All"); } }}
                style={{
                  padding: "13px 15px", borderRadius: "12px",
                  border: `2px solid ${isActive ? role.color : "#e2e8f0"}`,
                  backgroundColor: isActive ? role.bgColor : "#ffffff",
                  cursor: editingPermissions ? "not-allowed" : "pointer",
                  opacity: editingPermissions && !isActive ? 0.45 : 1,
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <div style={{ background: role.bgColor, padding: "7px", borderRadius: "8px" }}>
                    <Icon size={16} color={role.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "5px" }}>
                      {role.name}
                      {role.isSystem && (
                        <span style={{ fontSize: "0.58rem", background: "#E62929", color: "#fff", padding: "1px 5px", borderRadius: "4px" }}>SYSTEM</span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#64748b" }}>{role.userCount} user{role.userCount !== 1 ? "s" : ""}</div>
                  </div>
                  {!role.isSystem && (
                    <button onClick={e => { e.stopPropagation(); handleDeleteRole(role.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ flex: 1, height: "4px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: role.color, borderRadius: "4px" }} />
                  </div>
                  <span style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 700 }}>{role.permissions.length}/{ALL_PERMISSIONS.length}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Permission Editor */}
        <div className="bca-card" style={{ padding: 0, overflow: "hidden" }}>
          {/* Role Header */}
          <div style={{
            padding: "18px 22px",
            background: `linear-gradient(135deg, ${selectedRole.color}14, ${selectedRole.color}04)`,
            borderBottom: "1px solid #e2e8f0",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ background: selectedRole.bgColor, padding: "10px", borderRadius: "10px" }}>
                <RoleIcon size={22} color={selectedRole.color} />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "1.05rem" }}>{selectedRole.name}</div>
                <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{selectedRole.description}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {editingPermissions ? (
                <>
                  <button onClick={() => setEditingPermissions(false)} className="bca-btn bca-btn-secondary" style={{ padding: "7px 14px", fontSize: "0.82rem" }}>
                    <X size={14} /> Cancel
                  </button>
                  <button onClick={handleSavePerms} className="bca-btn bca-btn-primary" style={{ padding: "7px 14px", fontSize: "0.82rem", background: "#16a34a" }}>
                    <Save size={14} /> Save
                  </button>
                </>
              ) : (
                <button onClick={handleStartEdit} className="bca-btn bca-btn-primary" style={{ padding: "7px 14px", fontSize: "0.82rem", opacity: selectedRole.isSystem ? 0.55 : 1 }}>
                  {selectedRole.isSystem ? <Lock size={14} /> : <Edit2 size={14} />}
                  {selectedRole.isSystem ? "Locked (System)" : "Edit Permissions"}
                </button>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderBottom: "1px solid #e2e8f0" }}>
            {[
              { label: "Granted", value: currentPerms.length, color: "#16a34a" },
              { label: "Total", value: ALL_PERMISSIONS.length, color: "#0B3974" },
              { label: "Coverage", value: `${Math.round((currentPerms.length / ALL_PERMISSIONS.length) * 100)}%`, color: selectedRole.color },
            ].map((s, i) => (
              <div key={i} style={{ padding: "13px 18px", borderRight: i < 2 ? "1px solid #e2e8f0" : "none", textAlign: "center" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Category Filter */}
          <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid #e2e8f0", padding: "0 16px" }}>
            {["All", ...PERM_CATEGORIES].map(cat => {
              const g = grantedInCat(cat); const t = totalInCat(cat);
              const isA = activeCategory === cat;
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  padding: "9px 13px", background: "none", border: "none",
                  borderBottom: isA ? `2.5px solid ${selectedRole.color}` : "2.5px solid transparent",
                  color: isA ? selectedRole.color : "#64748b",
                  fontWeight: isA ? 700 : 500, fontSize: "0.77rem", cursor: "pointer", whiteSpace: "nowrap",
                  display: "flex", alignItems: "center", gap: "4px",
                }}>
                  {cat}
                  <span style={{ fontSize: "0.64rem", padding: "1px 5px", borderRadius: "8px", background: g === t ? "#dcfce7" : "#f1f5f9", color: g === t ? "#16a34a" : "#64748b", fontWeight: 700 }}>
                    {g}/{t}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Permissions Grid */}
          <div style={{ padding: "16px 18px", maxHeight: "460px", overflowY: "auto" }}>
            {editingPermissions && (
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <button
                  onClick={() => setDraftPerms(prev => [...new Set([...prev, ...filteredPerms.map(p => p.id)])])}
                  style={{ fontSize: "0.74rem", padding: "5px 12px", borderRadius: "6px", border: "1px solid #bbf7d0", background: "#f0fdf4", color: "#16a34a", cursor: "pointer", fontWeight: 700 }}
                >
                  ✓ Grant All
                </button>
                <button
                  onClick={() => setDraftPerms(prev => prev.filter(id => !filteredPerms.find(p => p.id === id)))}
                  style={{ fontSize: "0.74rem", padding: "5px 12px", borderRadius: "6px", border: "1px solid #fecaca", background: "#fff5f5", color: "#E62929", cursor: "pointer", fontWeight: 700 }}
                >
                  ✕ Revoke All
                </button>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "9px" }}>
              {filteredPerms.map(perm => {
                const granted = currentPerms.includes(perm.id);
                const Icon = perm.icon;
                return (
                  <div
                    key={perm.id}
                    onClick={() => editingPermissions && handleTogglePerm(perm.id)}
                    style={{
                      padding: "11px 13px", borderRadius: "10px",
                      border: `1.5px solid ${granted ? selectedRole.color + "55" : "#e2e8f0"}`,
                      background: granted ? selectedRole.bgColor : "#fafafa",
                      cursor: editingPermissions ? "pointer" : "default",
                      display: "flex", alignItems: "flex-start", gap: "9px",
                      transition: "all 0.13s",
                      opacity: !editingPermissions && !granted ? 0.42 : 1,
                    }}
                  >
                    <div style={{
                      width: "26px", height: "26px", borderRadius: "7px",
                      background: granted ? selectedRole.color + "18" : "#f1f5f9",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Icon size={13} color={granted ? selectedRole.color : "#94a3b8"} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.78rem", color: granted ? "#0f172a" : "#94a3b8" }}>{perm.label}</div>
                      <div style={{ fontSize: "0.67rem", color: "#94a3b8", marginTop: "1px" }}>{perm.description}</div>
                    </div>
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                      border: `2px solid ${granted ? selectedRole.color : "#cbd5e1"}`,
                      background: granted ? selectedRole.color : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.13s",
                    }}>
                      {granted && <Check size={10} color="#ffffff" strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "400px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <h3 style={{ margin: "0 0 6px", color: "#0B3974", fontSize: "1.1rem", fontWeight: 800 }}>Create New Role</h3>
            <p style={{ margin: "0 0 20px", fontSize: "0.82rem", color: "#64748b" }}>Define role then set its permissions.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>Role Name *</label>
                <input type="text" value={newRoleName} onChange={e => setNewRoleName(e.target.value)}
                  placeholder="e.g. Vice Principal"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.88rem", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>Description</label>
                <input type="text" value={newRoleDesc} onChange={e => setNewRoleDesc(e.target.value)}
                  placeholder="Brief description of this role"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "0.88rem", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Role Color</label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["#0B3974","#E62929","#16a34a","#b45309","#7c3aed","#0891b2","#64748b"].map(c => (
                    <div key={c} onClick={() => setNewRoleColor(c)} style={{
                      width: "28px", height: "28px", borderRadius: "50%", background: c, cursor: "pointer",
                      border: newRoleColor === c ? "3px solid #0f172a" : "2px solid transparent",
                      boxShadow: newRoleColor === c ? "0 0 0 2px #fff, 0 0 0 4px " + c : "none",
                      transition: "all 0.15s",
                    }} />
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "22px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowAddRoleModal(false)} className="bca-btn bca-btn-secondary" style={{ padding: "9px 18px" }}>Cancel</button>
              <button onClick={handleAddRole} className="bca-btn bca-btn-primary" style={{ padding: "9px 18px" }}>
                <Plus size={15} /> Create Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
