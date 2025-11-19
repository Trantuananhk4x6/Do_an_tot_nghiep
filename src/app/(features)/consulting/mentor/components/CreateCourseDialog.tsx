'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Calendar } from 'lucide-react';

interface CreateCourseDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

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

export default function CreateCourseDialog({ open, onClose, onSuccess }: CreateCourseDialogProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    maxParticipants: 10,
    price: 0,
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    industry: '',
    portfolio: '',
    tags: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.industry) {
        toast({
          title: 'Error',
          description: 'Please select an industry',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Combine date and time
      const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);

      const courseData = {
        title: formData.title,
        description: formData.description,
        maxParticipants: Number(formData.maxParticipants),
        price: Number(formData.price),
        scheduledDate: scheduledDateTime.toISOString(),
        duration: Number(formData.duration),
        industry: formData.industry,
        portfolio: formData.portfolio,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      };

      console.log('Submitting course data:', courseData);

      const response = await fetch('/api/consulting/mentor/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Course created successfully!',
        });
        onSuccess();
        onClose();
        setFormData({
          title: '',
          description: '',
          maxParticipants: 10,
          price: 0,
          scheduledDate: '',
          scheduledTime: '',
          duration: 60,
          industry: '',
          portfolio: '',
          tags: '',
        });
      } else {
        const error = await response.json();
        console.error('API error response:', error);
        throw new Error(error.message || 'Failed to create course');
      }
    } catch (error: any) {
      console.error('Error creating course:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create course',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new mentorship course
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Introduction to React Development"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what students will learn in this course..."
              rows={4}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
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

            <div>
              <Label htmlFor="maxParticipants">Max Participants *</Label>
              <Input
                id="maxParticipants"
                type="number"
                min="1"
                max="100"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scheduledDate">Scheduled Date *</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <Label htmlFor="scheduledTime">Time *</Label>
              <Input
                id="scheduledTime"
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                min="30"
                step="15"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="portfolio">Portfolio URL (optional)</Label>
            <Input
              id="portfolio"
              type="url"
              value={formData.portfolio}
              onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
              placeholder="https://your-portfolio.com"
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated, optional)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="react, javascript, frontend"
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Course'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
