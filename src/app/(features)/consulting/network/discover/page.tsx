'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Briefcase, Github, Linkedin, ExternalLink } from 'lucide-react';
import { UserProfile } from '../../types';
import { toast } from '@/hooks/use-toast';

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

export default function DiscoverPeoplePage() {
  const { user } = useUser();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    industry: 'All',
    yearsOfExperience: 0,
    searchQuery: '',
  });

  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.industry !== 'All') params.append('industry', filters.industry);
      if (filters.yearsOfExperience > 0) params.append('yearsOfExperience', filters.yearsOfExperience.toString());
      if (filters.searchQuery) params.append('search', filters.searchQuery);

      const response = await fetch(`/api/consulting/network/discover?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProfiles(data.profiles);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profiles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleConnect = async (profileEmail: string) => {
    try {
      const response = await fetch('/api/consulting/network/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUserEmail: profileEmail,
          message: 'Hi! I would like to connect with you.',
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Connection request sent!',
        });
      } else {
        throw new Error('Failed to send connection request');
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        title: 'Error',
        description: 'Failed to send connection request',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Discover Professionals</h1>
        <p className="text-muted-foreground">
          Find and connect with professionals in your industry
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter by</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, skills..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label>Industry</Label>
              <Select
                value={filters.industry}
                onValueChange={(value) => setFilters({ ...filters, industry: value })}
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
              <Label>Min Years of Experience</Label>
              <Input
                type="number"
                min="0"
                value={filters.yearsOfExperience}
                onChange={(e) => setFilters({ ...filters, yearsOfExperience: Number(e.target.value) })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profiles Grid */}
      {loading ? (
        <div className="text-center py-12">Loading profiles...</div>
      ) : profiles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No profiles found matching your criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <Card key={profile.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback>{profile.fullName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{profile.fullName}</CardTitle>
                    <CardDescription>
                      {profile.currentPosition || 'Professional'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {profile.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {profile.bio}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.yearsOfExperience || 0} years experience</span>
                </div>

                {profile.industry && (
                  <Badge>{profile.industry}</Badge>
                )}

                {profile.skills && profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {profile.skills.slice(0, 3).map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {profile.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{profile.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  {profile.linkedIn && (
                    <a
                      href={profile.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {profile.portfolio && (
                    <a
                      href={profile.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>

                <Button
                  className="w-full"
                  onClick={() => handleConnect(profile.userEmail)}
                  disabled={profile.userEmail === user?.emailAddresses[0]?.emailAddress}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
