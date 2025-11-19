'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { MentorCourse } from '../types';
import CourseCard from '../mentor/components/CourseCard';
import { toast } from '@/hooks/use-toast';
import RegisterCourseDialog from './components/RegisterCourseDialog';

const industries = [
  'All',
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

export default function CoursesPage() {
  const { user } = useUser();
  const [courses, setCourses] = useState<MentorCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<MentorCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<MentorCourse | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/consulting/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load courses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = useCallback(() => {
    let filtered = courses;

    // Filter by industry
    if (selectedIndustry !== 'All') {
      filtered = filtered.filter(c => c.industry === selectedIndustry);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.mentorName?.toLowerCase().includes(query)
      );
    }

    // Only show scheduled courses
    filtered = filtered.filter(c => c.status === 'scheduled');

    // Sort by date
    filtered.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

    setFilteredCourses(filtered);
  }, [courses, searchQuery, selectedIndustry]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [filterCourses]);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Available Courses</h1>
        <p className="text-muted-foreground">
          Browse and register for mentorship courses
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses, mentors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
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
        </CardContent>
      </Card>

      {/* Courses Grid */}
      {loading ? (
        <div className="text-center py-12">Loading courses...</div>
      ) : filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No courses found matching your criteria
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedIndustry('All');
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              isMentor={false}
              onRegister={() => setSelectedCourse(course)}
            />
          ))}
        </div>
      )}

      {selectedCourse && (
        <RegisterCourseDialog
          open={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          course={selectedCourse}
          onSuccess={() => {
            fetchCourses();
            setSelectedCourse(null);
          }}
        />
      )}
    </div>
  );
}
