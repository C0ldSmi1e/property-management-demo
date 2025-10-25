'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Wrench,
  Upload,
  Save,
  ArrowLeft,
  AlertTriangle,
  Camera,
  X
} from 'lucide-react';

export default function NewServiceRequestPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    location: '',
    preferredTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const categories = [
    { value: 'plumbing', label: 'Plumbing', icon: '🔧' },
    { value: 'electrical', label: 'Electrical', icon: '⚡' },
    { value: 'hvac', label: 'HVAC', icon: '🌡️' },
    { value: 'appliances', label: 'Appliances', icon: '📱' },
    { value: 'flooring', label: 'Flooring', icon: '🏠' },
    { value: 'painting', label: 'Painting', icon: '🎨' },
    { value: 'cleaning', label: 'Cleaning', icon: '🧹' },
    { value: 'pest_control', label: 'Pest Control', icon: '🐛' },
    { value: 'security', label: 'Security', icon: '🔒' },
    { value: 'other', label: 'Other', icon: '🔧' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', description: 'Can wait a few days', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', description: 'Should be addressed soon', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', description: 'Needs attention within 24 hours', color: 'bg-orange-100 text-orange-800' },
    { value: 'emergency', label: 'Emergency', description: 'Immediate attention required', color: 'bg-red-100 text-red-800' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Service request submitted:', {
      ...formData,
      tenantId: user?.id,
      images: uploadedImages,
      createdAt: new Date().toISOString()
    });

    // Redirect to service requests list
    router.push('/dashboard/service-requests');
  };

  const handleImageUpload = () => {
    // Simulate image upload
    const newImage = `/service-requests/image-${Date.now()}.jpg`;
    setUploadedImages([...uploadedImages, newImage]);
  };

  const removeImage = (imageToRemove: string) => {
    setUploadedImages(uploadedImages.filter(img => img !== imageToRemove));
  };

  const isFormValid = formData.title && formData.description && formData.category;
  const selectedPriority = priorities.find(p => p.value === formData.priority);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard/service-requests" className="hover:text-foreground flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Service Requests
            </Link>
            <span>/</span>
            <span>New Request</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Submit Service Request</h1>
          <p className="text-muted-foreground">
            Report a maintenance issue or request a service
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Request Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="w-5 h-5 mr-2" />
              Request Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Kitchen faucet is leaking"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Specific Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Master bathroom, Kitchen"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Please provide a detailed description of the issue, including when it started, what you've tried, and any other relevant information..."
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Priority & Timing */}
        <Card>
          <CardHeader>
            <CardTitle>Priority & Timing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Priority Level *</Label>
              <div className="grid gap-3 md:grid-cols-2">
                {priorities.map((priority) => (
                  <div
                    key={priority.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${formData.priority === priority.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-accent/50'
                      }`}
                    onClick={() => setFormData({ ...formData, priority: priority.value })}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge className={priority.color}>
                            {priority.label}
                          </Badge>
                          {priority.value === 'emergency' && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {priority.description}
                        </p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${formData.priority === priority.value
                        ? 'border-primary bg-primary'
                        : 'border-border'
                        }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredTime">Preferred Service Time</Label>
              <Select value={formData.preferredTime} onValueChange={(value) => setFormData({ ...formData, preferredTime: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred time (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                  <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                  <SelectItem value="anytime">Anytime</SelectItem>
                  <SelectItem value="emergency">Emergency - ASAP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Photo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Photos (Optional but Recommended)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadedImages.length > 0 && (
              <div>
                <Label>Uploaded Images</Label>
                <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 mt-2">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                        <Camera className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(image)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-center mt-1 text-muted-foreground">
                        Image {index + 1}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-3">
                Photos help our maintenance team understand the issue better
              </p>
              <Button type="button" variant="outline" onClick={handleImageUpload}>
                <Upload className="w-4 h-4 mr-2" />
                Add Photos
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Supports: JPG, PNG (Max 5MB each, up to 5 photos)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Notice */}
        {formData.priority === 'emergency' && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800 mb-2">Emergency Request Notice</h4>
                  <p className="text-sm text-red-700 mb-3">
                    For life-threatening emergencies or situations that could cause property damage,
                    please call our emergency hotline immediately:
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge variant="destructive" className="text-sm">
                      Emergency: (555) 911-HELP
                    </Badge>
                    <Button variant="outline" size="sm" className="text-red-700 border-red-300">
                      Call Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Actions */}
        <div className="flex gap-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="flex-1 md:flex-initial"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Submitting Request...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Submit Request
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Request Summary */}
      {isFormValid && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <h4 className="font-medium text-blue-800 mb-2">Request Summary</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <p><strong>Title:</strong> {formData.title}</p>
              <p><strong>Category:</strong> {categories.find(c => c.value === formData.category)?.label}</p>
              <p><strong>Priority:</strong> {selectedPriority?.label}</p>
              {formData.location && <p><strong>Location:</strong> {formData.location}</p>}
              {uploadedImages.length > 0 && <p><strong>Photos:</strong> {uploadedImages.length} attached</p>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
