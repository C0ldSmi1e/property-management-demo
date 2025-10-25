'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatFileSize, formatDate } from '../../../utils/helpers';
import { mockDocuments, mockUsers } from '../../../data/mockData';
import {
  FileText,
  Download,
  Share,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Calendar,
  User,
  Building,
  Tag,
  History,
  Lock,
  Unlock,
  X,
  Wrench
} from 'lucide-react';

interface DocumentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DocumentDetailPage({ params }: DocumentDetailPageProps) {
  const { user } = useAuth();
  const resolvedParams = React.use(params);
  const [isEditing, setIsEditing] = useState(false);
  const [documentForm, setDocumentForm] = useState({
    name: '',
    tags: [] as string[],
    description: ''
  });
  const [newTag, setNewTag] = useState('');

  const document = mockDocuments.find(doc => doc.id === resolvedParams.id);

  React.useEffect(() => {
    if (document) {
      setDocumentForm({
        name: document.name,
        tags: document.tags,
        description: document.name // Mock description
      });
    }
  }, [document]);

  if (!document) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Document not found</h3>
            <p className="text-muted-foreground mb-4">
              The document you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/dashboard/documents">
                Back to Documents
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const uploader = mockUsers.find(u => u.id === document.uploadedBy);

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'lease': return 'bg-blue-100 text-blue-800';
      case 'invoice': return 'bg-green-100 text-green-800';
      case 'receipt': return 'bg-green-100 text-green-800';
      case 'inspection': return 'bg-yellow-100 text-yellow-800';
      case 'insurance': return 'bg-purple-100 text-purple-800';
      case 'permit': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating document:', { id: document.id, ...documentForm });
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !documentForm.tags.includes(newTag.trim())) {
      setDocumentForm({
        ...documentForm,
        tags: [...documentForm.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setDocumentForm({
      ...documentForm,
      tags: documentForm.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const mockVersionHistory = [
    {
      version: '1.2',
      uploadedAt: '2024-10-21T14:30:00Z',
      uploadedBy: 'Sarah Johnson',
      changes: 'Updated lease terms and added pet policy clause',
      fileSize: 267890
    },
    {
      version: '1.1',
      uploadedAt: '2024-10-15T10:00:00Z',
      uploadedBy: 'Sarah Johnson',
      changes: 'Corrected rental amount and lease start date',
      fileSize: 245760
    },
    {
      version: '1.0',
      uploadedAt: '2024-02-01T10:00:00Z',
      uploadedBy: 'Sarah Johnson',
      changes: 'Initial document upload',
      fileSize: 243120
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard/documents" className="hover:text-foreground flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Documents
            </Link>
            <span>/</span>
            <span>{document.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6" />
            <h1 className="text-3xl font-bold tracking-tight">{document.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getDocumentTypeColor(document.type)}>
              {document.type}
            </Badge>
            <Badge variant="outline">{formatFileSize(document.size)}</Badge>
            <Badge variant="secondary">v1.2</Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          {user?.role === 'property_manager' && (
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="mr-2 h-4 w-4" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Document Preview */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Document Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[8.5/11] bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">{document.name}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  PDF Preview - {formatFileSize(document.size)}
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Full Screen
                  </Button>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Document Information</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="docName">Document Name</Label>
                    <Input
                      id="docName"
                      value={documentForm.name}
                      onChange={(e) => setDocumentForm({ ...documentForm, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {documentForm.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
                        <Tag className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="submit" size="sm">Save</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Type</span>
                      <p className="font-medium capitalize">{document.type}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">File Size</span>
                      <p className="font-medium">{formatFileSize(document.size)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Uploaded</span>
                      <p className="font-medium">{formatDate(document.createdAt)}</p>
                    </div>
                  </div>

                  {document.tags.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <span className="text-sm text-muted-foreground">Tags</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {document.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Uploader Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Uploaded By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={uploader?.avatar} />
                  <AvatarFallback>{uploader?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{uploader?.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {uploader?.role.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                  <span>{formatDate(document.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Access Control */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Access Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Unlock className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Shared Access</span>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Accessible by:</p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">Property Managers</Badge>
                  {document.tenantId && (
                    <Badge variant="outline" className="text-xs">Assigned Tenant</Badge>
                  )}
                  {document.serviceRequestId && (
                    <Badge variant="outline" className="text-xs">Service Provider</Badge>
                  )}
                </div>
              </div>

              {user?.role === 'property_manager' && (
                <Button variant="outline" size="sm" className="w-full">
                  <Share className="w-4 h-4 mr-2" />
                  Manage Access
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Document Tabs */}
      <Tabs defaultValue="preview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">Version History</TabsTrigger>
          <TabsTrigger value="sharing">Sharing</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Document Preview</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Full Screen
                  </Button>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-[8.5/11] bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">{document.name}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {document.type.toUpperCase()} Document - {formatFileSize(document.size)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Click "Full Screen" or "Download" to view the complete document
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <span className="text-sm text-muted-foreground">Document Type</span>
                  <p className="font-medium capitalize">{document.type}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">File Size</span>
                  <p className="font-medium">{formatFileSize(document.size)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Created</span>
                  <p className="font-medium">{formatDate(document.createdAt)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Last Modified</span>
                  <p className="font-medium">{formatDate(document.createdAt)}</p>
                </div>
              </div>

              <Separator />

              <div>
                <span className="text-sm text-muted-foreground">Tags</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {document.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <span className="text-sm text-muted-foreground">Related To</span>
                <div className="mt-1 space-y-1">
                  {document.propertyId && (
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Property ID: {document.propertyId}</span>
                    </div>
                  )}
                  {document.tenantId && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Tenant ID: {document.tenantId}</span>
                    </div>
                  )}
                  {document.serviceRequestId && (
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Service Request ID: {document.serviceRequestId}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="w-5 h-5 mr-2" />
                Version History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockVersionHistory.map((version) => (
                  <div key={version.version} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">v{version.version}</span>
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">Version {version.version}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(version.fileSize)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{version.changes}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{version.uploadedBy}</span>
                        <span>{formatDate(version.uploadedAt)}</span>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sharing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sharing Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Public Access</p>
                    <p className="text-xs text-muted-foreground">Anyone with the link can view</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Lock className="w-4 h-4" />
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="font-medium text-sm">Shared With</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">T</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">All Tenants</span>
                      </div>
                      <Badge variant="outline" className="text-xs">View Only</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">PM</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">Property Managers</span>
                      </div>
                      <Badge variant="outline" className="text-xs">Full Access</Badge>
                    </div>
                  </div>
                </div>

                {user?.role === 'property_manager' && (
                  <Button variant="outline" size="sm" className="w-full">
                    <Share className="w-4 h-4 mr-2" />
                    Manage Sharing
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
