"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/axios"
import { useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export function ProjectForm() {
  const [assignToId, setAssignToId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageproject, setImageProject] = useState("");
  const [loading, setLoading] = useState(false);


  const handleProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/add-project", {
        assignToId,
        title,
        description,
        imageproject: imageproject
      });

      toast.success("Project added successfully!");

      setAssignToId("");
      setTitle("");
      setDescription("");
      setImageProject("");

      setTimeout(() => {
      }, 1500);

    } catch (error: any) {
      console.error("Add Project error:", error);

      let errorMessage = "Add project failed. Please try again.";

      if (error.response) {
        errorMessage = error.response.data?.error || error.response.statusText;
      } else if (error.request) {
        errorMessage = "Network error: Unable to connect to server. Please check your connection.";
      } else {
        errorMessage = error.message || errorMessage;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Project description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="assignToId">Assign To ID</Label>
                <Input
                  id="assignToId"
                  type="text"
                  placeholder="User ID to assign to"
                  value={assignToId}
                  onChange={(e) => setAssignToId(e.target.value)}
                  required
                />
              </div>

              {/* Input: Image URL */}
              <div className="grid gap-3">
                <Label htmlFor="imageproject">Image URL</Label>
                <Input
                  id="imageproject"
                  type="text"
                  placeholder="URL of project image"
                  value={imageproject}
                  onChange={(e) => setImageProject(e.target.value)}
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