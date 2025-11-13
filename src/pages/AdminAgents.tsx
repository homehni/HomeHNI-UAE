import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { CheckCircle, XCircle, Eye, Loader2, Search, FileText, ExternalLink } from 'lucide-react';
import { getAllAgents, updateAgentVerificationStatus, type AgentRecord } from '@/services/agentService';
import { useToast } from '@/hooks/use-toast';

export const AdminAgents = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<AgentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [selectedAgent, setSelectedAgent] = useState<AgentRecord | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await getAllAgents();
      setAgents(data);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load agents',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (agentId: string) => {
    setActionLoading(agentId);
    try {
      await updateAgentVerificationStatus(agentId, 'verified');
      toast({
        title: 'Success',
        description: 'Agent verified successfully',
      });
      await fetchAgents();
    } catch (error) {
      console.error('Error approving agent:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify agent',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (agentId: string) => {
    setActionLoading(agentId);
    try {
      await updateAgentVerificationStatus(agentId, 'rejected');
      toast({
        title: 'Success',
        description: 'Agent rejected successfully',
      });
      await fetchAgents();
    } catch (error) {
      console.error('Error rejecting agent:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject agent',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (agent: AgentRecord) => {
    setSelectedAgent(agent);
    setViewModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agent.rera_number && agent.rera_number.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || agent.verification_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agent Management</h1>
          <p className="text-muted-foreground mt-1">Review and manage agent verifications</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Agents ({filteredAgents.length})</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAgents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No agents found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>RERA Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>{agent.email}</TableCell>
                    <TableCell>{agent.rera_number || '-'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(agent.verification_status)}>
                        {agent.verification_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(agent.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDetails(agent)}
                          className="h-9 w-9 p-0"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {agent.verification_status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleApprove(agent.id)}
                              disabled={actionLoading === agent.id}
                              className="h-9 w-9 p-0 hover:bg-green-50 hover:text-green-600"
                              title="Approve Agent"
                            >
                              {actionLoading === agent.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleReject(agent.id)}
                              disabled={actionLoading === agent.id}
                              className="h-9 w-9 p-0 hover:bg-red-50 hover:text-red-600"
                              title="Reject Agent"
                            >
                              {actionLoading === agent.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                            </Button>
                          </>
                        )}
                        {agent.verification_status === 'rejected' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleApprove(agent.id)}
                            disabled={actionLoading === agent.id}
                            className="h-9 w-9 p-0 hover:bg-green-50 hover:text-green-600"
                            title="Re-Approve Agent"
                          >
                            {actionLoading === agent.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Details Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agent Details</DialogTitle>
            <DialogDescription>
              View complete agent verification information
            </DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-sm font-medium">{selectedAgent.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm font-medium">{selectedAgent.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">RERA Number</label>
                  <p className="text-sm font-medium">{selectedAgent.rera_number || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge className={getStatusColor(selectedAgent.verification_status)}>
                    {selectedAgent.verification_status}
                  </Badge>
                </div>
              </div>
              
              {selectedAgent.previous_work && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Previous Work</label>
                  <p className="text-sm mt-1">{selectedAgent.previous_work}</p>
                </div>
              )}

              {selectedAgent.verification_documents && selectedAgent.verification_documents.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Verification Documents</label>
                  <div className="mt-2 space-y-2">
                    {selectedAgent.verification_documents.map((doc, index) => (
                      <a
                        key={index}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                        <span>{doc.name}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selectedAgent.documents && selectedAgent.documents.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Additional Documents</label>
                  <div className="mt-2 space-y-2">
                    {selectedAgent.documents.map((doc, index) => (
                      <a
                        key={index}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                        <span>{doc.name}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <label className="font-medium">Created</label>
                  <p>{new Date(selectedAgent.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="font-medium">Last Updated</label>
                  <p>{new Date(selectedAgent.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedAgent && selectedAgent.verification_status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleReject(selectedAgent.id)}
                  disabled={actionLoading === selectedAgent.id}
                >
                  {actionLoading === selectedAgent.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleApprove(selectedAgent.id)}
                  disabled={actionLoading === selectedAgent.id}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {actionLoading === selectedAgent.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </>
                  )}
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

