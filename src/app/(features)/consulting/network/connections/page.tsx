'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, MessageCircle } from 'lucide-react';
import { Connection, UserProfile } from '../../types';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function ConnectionsPage() {
  const { user } = useUser();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/consulting/network/connections');
      if (response.ok) {
        const data = await response.json();
        setConnections(data.connections);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast({
        title: 'Error',
        description: 'Failed to load connections',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (connectionId: number) => {
    try {
      const response = await fetch(`/api/consulting/network/connections/${connectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Connection accepted!',
        });
        fetchConnections();
      }
    } catch (error) {
      console.error('Error accepting connection:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept connection',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (connectionId: number) => {
    try {
      const response = await fetch(`/api/consulting/network/connections/${connectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Connection rejected',
        });
        fetchConnections();
      }
    } catch (error) {
      console.error('Error rejecting connection:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject connection',
        variant: 'destructive',
      });
    }
  };

  const pending = connections.filter(c => c.status === 'pending');
  const accepted = connections.filter(c => c.status === 'accepted');

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Connections</h1>
        <p className="text-muted-foreground">
          Manage your professional network
        </p>
      </div>

      <Tabs defaultValue="accepted" className="space-y-6">
        <TabsList>
          <TabsTrigger value="accepted">
            Connections ({accepted.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pending.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accepted" className="space-y-4">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : accepted.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No connections yet</p>
                <Link href="/consulting/network/discover">
                  <Button className="mt-4">Discover People</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accepted.map((connection) => (
                <Card key={connection.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {connection.toUserEmail[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {connection.toUserEmail}
                        </CardTitle>
                        <Badge variant="default">Connected</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/consulting/network/messages?email=${connection.toUserEmail}`}>
                      <Button className="w-full" variant="outline">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : pending.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No pending requests</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pending.map((connection) => (
                <Card key={connection.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {connection.fromUserEmail[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{connection.fromUserEmail}</p>
                          <p className="text-sm text-muted-foreground">
                            {connection.message || 'Wants to connect'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAccept(connection.id)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(connection.id)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
