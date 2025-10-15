import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Briefcase, GraduationCap } from "lucide-react"
import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"

const initialExperiences = [
  {
    id: 1,
    title: "Senior Full-Stack Developer",
    company: "TechCorp Solutions",
    period: "2022 - Present",
    description: "Lead development of scalable web applications using React, Node.js, and AWS. Mentored junior developers and architected microservices infrastructure.",
    achievements: [
      "Improved application performance by 40% through code optimization",
      "Led a team of 5 developers on multiple client projects",
      "Implemented CI/CD pipelines reducing deployment time by 60%"
    ]
  },
  {
    id: 2,
    title: "Full-Stack Developer",
    company: "StartupXYZ",
    period: "2020 - 2022",
    description: "Developed and maintained multiple web applications using modern JavaScript frameworks. Collaborated with designers and product managers to deliver user-focused solutions.",
    achievements: [
      "Built 3 major product features from concept to production",
      "Reduced bug reports by 50% through comprehensive testing",
      "Contributed to 200% user growth through performance improvements"
    ]
  }
]

const initialEducation = [
  {
    id: 1,
    degree: "Bachelor of Science in Computer Science",
    school: "Tech University",
    period: "2016 - 2020",
    description: "Graduated Magna Cum Laude with focus on Software Engineering and Web Development."
  },
  {
    id: 2,
    degree: "AWS Certified Solutions Architect",
    school: "Amazon Web Services",
    period: "2021",
    description: "Professional certification in cloud architecture and AWS services."
  }
]

interface ExperienceSectionProps {
  isEditing: boolean
}

export function ExperienceSection({ isEditing }: ExperienceSectionProps) {
  const [experiences, setExperiences] = useState(initialExperiences)
  const [education, setEducation] = useState(initialEducation)
  const [editingExperience, setEditingExperience] = useState<number | null>(null)
  const [editingEducation, setEditingEducation] = useState<number | null>(null)
  const [showAddExperienceForm, setShowAddExperienceForm] = useState(false)
  const [showAddEducationForm, setShowAddEducationForm] = useState(false)
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    period: '',
    description: '',
    achievements: ['']
  })
  const [newEducation, setNewEducation] = useState({
    degree: '',
    school: '',
    period: '',
    description: ''
  })

  const addExperience = () => {
    if (newExperience.title && newExperience.company) {
      setExperiences(prev => [...prev, {
        id: Date.now(),
        ...newExperience,
        achievements: newExperience.achievements.filter(a => a.trim())
      }])
      setNewExperience({
        title: '',
        company: '',
        period: '',
        description: '',
        achievements: ['']
      })
      setShowAddExperienceForm(false)
    }
  }

  const removeExperience = (id: number) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id))
  }

  const addEducation = () => {
    if (newEducation.degree && newEducation.school) {
      setEducation(prev => [...prev, {
        id: Date.now(),
        ...newEducation
      }])
      setNewEducation({
        degree: '',
        school: '',
        period: '',
        description: ''
      })
      setShowAddEducationForm(false)
    }
  }

  const removeEducation = (id: number) => {
    setEducation(prev => prev.filter(edu => edu.id !== id))
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Experience */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Professional Experience
            </div>
            {isEditing && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowAddExperienceForm(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Experience
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div key={index} className="border-l-2 border-primary/20 pl-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="font-semibold text-lg">{exp.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{exp.period}</span>
                    {isEditing && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setEditingExperience(exp.id)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Experience</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this work experience? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => removeExperience(exp.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-primary font-medium mb-2">{exp.company}</p>
                <p className="text-muted-foreground mb-3">{exp.description}</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {exp.achievements.map((achievement, achievementIndex) => (
                    <li key={achievementIndex}>{achievement}</li>
                  ))}
                </ul>
              </div>
            ))}
            
            {isEditing && showAddExperienceForm && (
              <div className="border-l-2 border-dashed border-primary/20 pl-4 space-y-4">
                <h3 className="font-semibold text-lg">Add New Experience</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exp-title">Job Title</Label>
                    <Input
                      id="exp-title"
                      value={newExperience.title}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Senior Developer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="exp-company">Company</Label>
                    <Input
                      id="exp-company"
                      value={newExperience.company}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="exp-period">Period</Label>
                    <Input
                      id="exp-period"
                      value={newExperience.period}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, period: e.target.value }))}
                      placeholder="2022 - Present"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="exp-description">Description</Label>
                  <Textarea
                    id="exp-description"
                    value={newExperience.description}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your role and responsibilities..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addExperience}>Add Experience</Button>
                  <Button variant="outline" onClick={() => setShowAddExperienceForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Education & Certifications
            </div>
            {isEditing && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowAddEducationForm(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Education
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="border-l-2 border-primary/20 pl-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="font-semibold text-lg">{edu.degree}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{edu.period}</span>
                    {isEditing && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setEditingEducation(edu.id)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Education</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this education entry? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => removeEducation(edu.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-primary font-medium mb-2">{edu.school}</p>
                <p className="text-muted-foreground">{edu.description}</p>
              </div>
            ))}
            
            {isEditing && showAddEducationForm && (
              <div className="border-l-2 border-dashed border-primary/20 pl-4 space-y-4">
                <h3 className="font-semibold text-lg">Add New Education</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edu-degree">Degree</Label>
                    <Input
                      id="edu-degree"
                      value={newEducation.degree}
                      onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                      placeholder="Bachelor of Science"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edu-school">School/Institution</Label>
                    <Input
                      id="edu-school"
                      value={newEducation.school}
                      onChange={(e) => setNewEducation(prev => ({ ...prev, school: e.target.value }))}
                      placeholder="University Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edu-period">Period</Label>
                    <Input
                      id="edu-period"
                      value={newEducation.period}
                      onChange={(e) => setNewEducation(prev => ({ ...prev, period: e.target.value }))}
                      placeholder="2016 - 2020"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edu-description">Description</Label>
                  <Textarea
                    id="edu-description"
                    value={newEducation.description}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Additional details about your education..."
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addEducation}>Add Education</Button>
                  <Button variant="outline" onClick={() => setShowAddEducationForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}