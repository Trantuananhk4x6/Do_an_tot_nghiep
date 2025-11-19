'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';

const industries = [
  'Software Engineering',
  'AI & Machine Learning',
  'Data Science',
  'Cloud Computing',
  'DevOps',
  'Cybersecurity',
  'Mobile Development',
  'Web Development',
  'UI/UX Design',
  'Product Management',
];

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    currentPosition: '',
    desiredPosition: '',
    industry: '',
    yearsOfExperience: 0,
    bio: '',
    skills: '',
    linkedIn: '',
    github: '',
    portfolio: '',
    isMentor: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileData = {
        ...formData,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
      };

      const response = await fetch('/api/consulting/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Profile created successfully!',
        });
        router.push('/consulting');
      } else {
        throw new Error('Failed to create profile');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to create profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Setup Your Profile</h1>
        <p className="text-muted-foreground">
          Complete your professional profile to start connecting
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Tell us about yourself</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentPosition">Current Position</Label>
                <Input
                  id="currentPosition"
                  value={formData.currentPosition}
                  onChange={(e) => setFormData({ ...formData, currentPosition: e.target.value })}
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div>
                <Label htmlFor="desiredPosition">Desired Position</Label>
                <Input
                  id="desiredPosition"
                  value={formData.desiredPosition}
                  onChange={(e) => setFormData({ ...formData, desiredPosition: e.target.value })}
                  placeholder="e.g., Tech Lead"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                min="0"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself and your experience..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="e.g., React, TypeScript, Node.js"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Professional Links</CardTitle>
            <CardDescription>Add your professional profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="linkedIn">LinkedIn Profile</Label>
              <Input
                id="linkedIn"
                type="url"
                value={formData.linkedIn}
                onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div>
              <Label htmlFor="github">GitHub Profile</Label>
              <Input
                id="github"
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div>
              <Label htmlFor="portfolio">Portfolio URL</Label>
              <Input
                id="portfolio"
                type="url"
                value={formData.portfolio}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                placeholder="https://yourportfolio.com"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Mentorship</CardTitle>
            <CardDescription>Are you interested in becoming a mentor?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isMentor"
                checked={formData.isMentor}
                onChange={(e) => setFormData({ ...formData, isMentor: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isMentor" className="cursor-pointer">
                I want to become a mentor and create courses
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end mt-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Profile...' : 'Create Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
}
