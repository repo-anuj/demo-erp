"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useDemo } from "@/contexts/demo-context"

// Define the schema for project form validation
const projectFormSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  description: z.string().optional(),
  type: z.enum(["internal", "client", "research", "maintenance"], {
    required_error: "Project type is required",
  }),
  status: z.enum(["planning", "in_progress", "on_hold", "completed", "cancelled"], {
    required_error: "Project status is required",
  }),
  startDate: z.string().min(2, "Start date is required"),
  endDate: z.string().min(2, "End date is required"),
  completionPercentage: z.coerce.number().min(0).max(100),
  projectManagerId: z.string().min(1, "Project manager is required"),
  budget: z.coerce.number().min(0, "Budget must be a positive number"),
  expenses: z.coerce.number().min(0, "Expenses must be a positive number"),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Priority is required",
  }),
  notes: z.string().optional(),
  clientName: z.string().optional(),
  clientCompany: z.string().optional(),
  clientEmail: z.string().email().optional(),
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
}

export function AddProjectDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const { toast } = useToast()
  const { employees } = useDemo()

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "internal",
      status: "planning",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Default to 30 days from now
      completionPercentage: 0,
      projectManagerId: "",
      budget: 0,
      expenses: 0,
      priority: "medium",
      notes: "",
      clientName: "",
      clientCompany: "",
      clientEmail: "",
    },
  })

  // Handle adding a tag
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  // Handle tag input keydown (add tag on Enter)
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  // Toggle team member selection
  const toggleTeamMember = (employeeId: string) => {
    if (selectedTeamMembers.includes(employeeId)) {
      setSelectedTeamMembers(selectedTeamMembers.filter(id => id !== employeeId))
    } else {
      setSelectedTeamMembers([...selectedTeamMembers, employeeId])
    }
  }

  // Get employee name by ID
  const getEmployeeName = (id: string) => {
    const employee = employees.find((emp: any) => emp.id === id)
    return employee ? `${employee.firstName} ${employee.lastName}` : ""
  }

  async function onSubmit(data: ProjectFormValues) {
    try {
      setLoading(true)

      // Prepare team members data
      const teamMembers = selectedTeamMembers.map(id => {
        const employee = employees.find((emp: any) => emp.id === id)
        return {
          employeeId: id,
          name: `${employee?.firstName} ${employee?.lastName}`,
          role: employee?.position,
          department: employee?.department,
        }
      })

      // Prepare project manager data
      const manager = employees.find((emp: any) => emp.id === data.projectManagerId)
      const projectManager = {
        employeeId: data.projectManagerId,
        name: `${manager?.firstName} ${manager?.lastName}`,
        role: manager?.position,
        department: manager?.department,
      }

      // Prepare client data if provided
      let client = undefined
      if (data.clientName) {
        client = {
          name: data.clientName,
          company: data.clientCompany || undefined,
          email: data.clientEmail || undefined,
        }
      }

      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and close dialog
      setOpen(false)
      form.reset()
      setSelectedTeamMembers([])
      setTags([])
      
      toast({
        title: "Project Added",
        description: `${data.name} has been added successfully (demo mode).`,
        variant: "default",
      })
      
    } catch (error) {
      console.error("Failed to add project:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] sm:h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Fill in the project details below. All required fields are marked with an asterisk (*).          
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pr-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="client">Client</TabsTrigger>
                <TabsTrigger value="details">Additional Details</TabsTrigger>
              </TabsList>
              
              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select project type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="internal">Internal</SelectItem>
                            <SelectItem value="client">Client</SelectItem>
                            <SelectItem value="research">Research</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="planning">Planning</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="on_hold">On Hold</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="completionPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Completion Percentage *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value))} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Team Tab */}
              <TabsContent value="team" className="space-y-4">
                <FormField
                  control={form.control}
                  name="projectManagerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Manager *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project manager" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employees.map((employee: any) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.firstName} {employee.lastName} - {employee.position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Team Members</FormLabel>
                  <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
                    {employees.length > 0 ? (
                      employees
                        .filter((emp: any) => emp.id !== form.getValues("projectManagerId"))
                        .map((employee: any) => (
                          <div key={employee.id} className="flex items-center space-x-2 py-2">
                            <Checkbox
                              id={`employee-${employee.id}`}
                              checked={selectedTeamMembers.includes(employee.id)}
                              onCheckedChange={() => toggleTeamMember(employee.id)}
                            />
                            <label
                              htmlFor={`employee-${employee.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {employee.firstName} {employee.lastName} - {employee.position} ({employee.department})
                            </label>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Loading employees...</p>
                    )}
                  </div>
                </div>

                {selectedTeamMembers.length > 0 && (
                  <div>
                    <FormLabel>Selected Team Members:</FormLabel>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTeamMembers.map((id) => (
                        <Badge key={id} variant="secondary" className="flex items-center gap-1">
                          {getEmployeeName(id)}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => toggleTeamMember(id)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Client Tab */}
              <TabsContent value="client" className="space-y-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientCompany"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Company</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Additional Details Tab */}
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expenses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expenses *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Tags</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                    />
                    <Button type="button" onClick={handleAddTag}>Add</Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
