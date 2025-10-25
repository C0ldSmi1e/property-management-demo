'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Camera,
  Upload,
  Eye,
  Download,
  Trash2,
  Plus,
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface PropertyImage {
  id: string;
  url: string;
  title: string;
  description?: string;
  category: 'exterior' | 'interior' | 'amenities' | 'other';
  uploadedAt: string;
  uploadedBy: string;
}

interface PropertyGalleryProps {
  propertyId: string;
  images?: PropertyImage[];
  canUpload?: boolean;
  canDelete?: boolean;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({
  propertyId,
  images = [],
  canUpload = false,
  canDelete = false
}) => {
  const [selectedImage, setSelectedImage] = useState<PropertyImage | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Mock images if none provided
  const mockImages: PropertyImage[] = [
    {
      id: '1',
      url: '/properties/sunset-apt-exterior.jpg',
      title: 'Building Exterior',
      description: 'Front view of the apartment building',
      category: 'exterior',
      uploadedAt: '2024-10-15T10:00:00Z',
      uploadedBy: 'Property Manager'
    },
    {
      id: '2',
      url: '/properties/sunset-apt-living.jpg',
      title: 'Living Room',
      description: 'Spacious living area with modern furnishings',
      category: 'interior',
      uploadedAt: '2024-10-15T10:30:00Z',
      uploadedBy: 'Property Manager'
    },
    {
      id: '3',
      url: '/properties/sunset-apt-kitchen.jpg',
      title: 'Kitchen',
      description: 'Fully equipped modern kitchen',
      category: 'interior',
      uploadedAt: '2024-10-15T11:00:00Z',
      uploadedBy: 'Property Manager'
    },
    {
      id: '4',
      url: '/properties/sunset-apt-pool.jpg',
      title: 'Swimming Pool',
      description: 'Community swimming pool and deck area',
      category: 'amenities',
      uploadedAt: '2024-10-15T11:30:00Z',
      uploadedBy: 'Property Manager'
    },
    {
      id: '5',
      url: '/properties/sunset-apt-gym.jpg',
      title: 'Fitness Center',
      description: 'Fully equipped fitness center',
      category: 'amenities',
      uploadedAt: '2024-10-15T12:00:00Z',
      uploadedBy: 'Property Manager'
    },
    {
      id: '6',
      url: '/properties/sunset-apt-bedroom.jpg',
      title: 'Master Bedroom',
      description: 'Spacious master bedroom with walk-in closet',
      category: 'interior',
      uploadedAt: '2024-10-15T12:30:00Z',
      uploadedBy: 'Property Manager'
    }
  ];

  const allImages = images.length > 0 ? images : mockImages;

  const filteredImages = categoryFilter === 'all'
    ? allImages
    : allImages.filter(img => img.category === categoryFilter);

  const categories = [
    { value: 'all', label: 'All Photos', count: allImages.length },
    { value: 'exterior', label: 'Exterior', count: allImages.filter(img => img.category === 'exterior').length },
    { value: 'interior', label: 'Interior', count: allImages.filter(img => img.category === 'interior').length },
    { value: 'amenities', label: 'Amenities', count: allImages.filter(img => img.category === 'amenities').length },
    { value: 'other', label: 'Other', count: allImages.filter(img => img.category === 'other').length }
  ];

  const handleImageClick = (image: PropertyImage) => {
    setSelectedImage(image);
    setCurrentImageIndex(filteredImages.findIndex(img => img.id === image.id));
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;

    let newIndex = currentImageIndex;
    if (direction === 'next') {
      newIndex = (currentImageIndex + 1) % filteredImages.length;
    } else {
      newIndex = currentImageIndex === 0 ? filteredImages.length - 1 : currentImageIndex - 1;
    }

    setCurrentImageIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'exterior': return 'bg-blue-100 text-blue-800';
      case 'interior': return 'bg-green-100 text-green-800';
      case 'amenities': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpload = () => {
    console.log('Uploading images for property:', propertyId);
    setIsUploadDialogOpen(false);
  };

  const handleDelete = (imageId: string) => {
    console.log('Deleting image:', imageId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Property Gallery</h3>
          <p className="text-sm text-muted-foreground">
            {filteredImages.length} photo{filteredImages.length !== 1 ? 's' : ''} available
          </p>
        </div>
        {canUpload && (
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Photos
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Property Photos</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Upload Property Photos</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag & drop images here, or click to browse
                  </p>
                  <Button variant="outline" onClick={handleUpload}>
                    Choose Images
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supports: JPG, PNG, WebP (Max 5MB each, up to 20 images)
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={categoryFilter === category.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter(category.value)}
            className="gap-2"
          >
            {category.label}
            <Badge variant="secondary" className="text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Image Grid */}
      {filteredImages.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredImages.map((image) => (
            <Card key={image.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-video bg-muted">
                {/* Placeholder for actual image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                </div>

                {/* Image overlay */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors group">
                  <div className="absolute top-2 left-2">
                    <Badge className={getCategoryColor(image.category)}>
                      {image.category}
                    </Badge>
                  </div>

                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleImageClick(image)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {canDelete && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(image.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      onClick={() => handleImageClick(image)}
                    >
                      <ZoomIn className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="p-3">
                <h4 className="font-medium text-sm mb-1">{image.title}</h4>
                {image.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {image.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(image.uploadedAt).toLocaleDateString()}
                  </span>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No photos found</h3>
            <p className="text-muted-foreground mb-4">
              {categoryFilter !== 'all'
                ? `No ${categoryFilter} photos available`
                : 'No photos have been uploaded yet'
              }
            </p>
            {canUpload && categoryFilter === 'all' && (
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload First Photo
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>{selectedImage.title}</DialogTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(selectedImage.category)}>
                    {selectedImage.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {currentImageIndex + 1} of {filteredImages.length}
                  </span>
                </div>
              </div>
            </DialogHeader>

            <div className="relative">
              {/* Image Display */}
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <Camera className="w-16 h-16 text-muted-foreground" />
              </div>

              {/* Navigation Arrows */}
              {filteredImages.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                    onClick={() => navigateImage('prev')}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => navigateImage('next')}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Image Details */}
            <div className="space-y-2">
              {selectedImage.description && (
                <p className="text-sm text-muted-foreground">
                  {selectedImage.description}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Uploaded by {selectedImage.uploadedBy}</span>
                <span>{new Date(selectedImage.uploadedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              {canDelete && (
                <Button variant="destructive" onClick={() => handleDelete(selectedImage.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
              <Button variant="outline" onClick={() => setSelectedImage(null)}>
                <X className="mr-2 h-4 w-4" />
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
