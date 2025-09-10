"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function ProjectForm() {
  const [assignToId, setAssignToId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [titleError, setTitleError] = useState("");
  const [assignToError, setAssignToError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/users");
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const validateForm = () => {
    let isValid = true;

    setTitleError("");
    setAssignToError("");

    if (!title.trim()) {
      setTitleError("Title is required");
      isValid = false;
    } else if (title.length < 5 || title.length > 100) {
      setTitleError("Title must be between 5 and 100 characters");
      isValid = false;
    }

    if (!assignToId) {
      setAssignToError("Please select a user to assign this project to");
      isValid = false;
    }

    return isValid;
  };

  const handleProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    // Tampilkan SweetAlert sebagai konfirmasi
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to add this new project?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, add it!'
    });

    if (result.isConfirmed) {
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append("assignToId", assignToId);
        formData.append("title", title);
        formData.append("description", description);
        if (imageFile) {
          formData.append("imageProject", imageFile);
        }

        await api.post("/api/add-project", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Tampilkan SweetAlert sukses
        Swal.fire({
          title: 'Success!',
          text: 'Project added successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          // Redirect setelah SweetAlert selesai
          window.location.href = "/dashboard";
        });

        // Reset form
        setAssignToId("");
        setTitle("");
        setDescription("");
        setImageFile(null);

      } catch (error: any) {
        console.error("Add Project error:", error);

        let errorMessage = "Add project failed. Please try again.";
        if (error.response) {
          if (error.response.data?.details) {
            errorMessage = error.response.data.details;
          } else {
            errorMessage = error.response.data?.message || error.response.statusText;
          }
        } else if (error.request) {
          errorMessage = "Network error: Unable to connect to server. Please check your connection.";
        } else {
          errorMessage = error.message || errorMessage;
        }

        // Tampilkan SweetAlert error
        Swal.fire('Error!', errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Card className="border">
        <CardHeader>
          <CardTitle>Add a New Project</CardTitle>
          <CardDescription>
            Fill in the details below to create a new project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProject}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Project title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (titleError) setTitleError("");
                  }}
                  required
                  maxLength={100}
                />
                {titleError && (
                  <p className="text-sm text-red-500">{titleError}</p>
                )}
                <p className="text-xs text-gray-500">
                  {title.length}/100 characters (minimum 5)
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Project description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="assignToId">Assign To</Label>
                {loadingUsers ? (
                  <div className="text-sm text-gray-500">Loading users...</div>
                ) : users.length === 0 ? (
                  <div className="text-sm text-red-500">No users available</div>
                ) : (
                  <select
                    id="assignToId"
                    value={assignToId}
                    onChange={(e) => {
                      setAssignToId(e.target.value);
                      if (assignToError) setAssignToError("");
                    }}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>Select a user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email}) - {user.role}
                      </option>
                    ))}
                  </select>
                )}
                {assignToError && (
                  <p className="text-sm text-red-500">{assignToError}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="imageProject">Project Image</Label>
                <Input
                  id="imageProject"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? "Adding Project..." : "Add Project"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}