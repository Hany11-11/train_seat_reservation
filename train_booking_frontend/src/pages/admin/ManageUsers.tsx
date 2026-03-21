import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminTemplate } from "@/components/templates/AdminTemplate";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Modal } from "@/components/atoms/Modal";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/ui/label";
import { SearchField } from "@/components/molecules/SearchField";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { User } from "@/types/user";
import { Plus, Pencil, Trash2, Shield, User as UserIcon } from "lucide-react";
import { validateNIC, formatNIC } from "@/utils/nicHelpers";

const ManageUsers = () => {
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();
  const { users, addUser, updateUser, deleteUser } = useAdmin();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    nic: "",
    name: "",
    email: "",
    mobile: "",
    role: "user" as "user" | "admin",
    password: "",
  });

  if (!isAdmin) {
    navigate("/admin/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.nic.includes(search) ||
      user.mobile.includes(search),
  );

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      nic: "",
      name: "",
      email: "",
      mobile: "",
      role: "user",
      password: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      nic: user.nic,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      password: "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate NIC
    if (!validateNIC(formData.nic)) {
      alert("Invalid NIC format. Please enter a valid NIC number.");
      return;
    }

    // Validate mobile
    if (!/^0\d{9}$/.test(formData.mobile)) {
      alert("Invalid mobile number. Must be 10 digits starting with 0.");
      return;
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert("Invalid email format.");
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, {
        nic: formData.nic,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        role: formData.role,
      });
    } else {
      // Auto-generate password: first 6 chars of email + 123
      const autoPassword = formData.email.split("@")[0].substring(0, 6) + "123";
      addUser(
        {
          nic: formData.nic,
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          role: formData.role,
        },
        autoPassword,
      );
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
    }
  };

  return (
    <AdminTemplate title="Manage Users" onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Search by name, email, NIC, or mobile..."
            className="max-w-md"
          />
          <Button onClick={openAddModal} className="gap-2">
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Details</TableHead>
                <TableHead>NIC</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            user.role === "admin"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <Shield className="w-5 h-5" />
                          ) : (
                            <UserIcon className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {user.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">
                        {formatNIC(user.nic)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{user.mobile}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {user.role === "admin" ? "Admin" : "User"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(user)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(user.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add/Edit User Modal */}
        <Modal.Root
          open={isModalOpen}
          onOpenChange={(open) => !open && setIsModalOpen(false)}
        >
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>
                {editingUser ? "Edit User" : "Add New User"}
              </Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="nic">NIC Number</Label>
                <Input
                  id="nic"
                  value={formData.nic}
                  onChange={(e) =>
                    setFormData({ ...formData, nic: e.target.value })
                  }
                  placeholder="e.g., 199012345678"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Old format: 9 digits + V/X, New format: 12 digits
                </p>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  placeholder="0771234567"
                  required
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "user" | "admin") =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingUser ? "Update User" : "Add User"}
                </Button>
              </div>
            </form>
          </Modal.Content>
        </Modal.Root>
      </div>
    </AdminTemplate>
  );
};

export default ManageUsers;
