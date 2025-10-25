'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '../utils/helpers';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Send,
  Award
} from 'lucide-react';

interface ServiceRating {
  id: string;
  serviceRequestId: string;
  tenantId: string;
  tenantName: string;
  providerId: string;
  providerName: string;
  rating: number;
  feedback: string;
  categories: {
    quality: number;
    timeliness: number;
    communication: number;
    professionalism: number;
  };
  wouldRecommend: boolean;
  createdAt: string;
}

interface ServiceRatingProps {
  serviceRequestId: string;
  providerId?: string;
  showRatingForm?: boolean;
  existingRatings?: ServiceRating[];
}

export const ServiceRating: React.FC<ServiceRatingProps> = ({
  serviceRequestId,
  providerId,
  showRatingForm = false,
  existingRatings = []
}) => {
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [ratingForm, setRatingForm] = useState({
    rating: 0,
    feedback: '',
    categories: {
      quality: 0,
      timeliness: 0,
      communication: 0,
      professionalism: 0
    },
    wouldRecommend: true
  });

  // Mock ratings if none provided
  const mockRatings: ServiceRating[] = [
    {
      id: '1',
      serviceRequestId: '1',
      tenantId: '2',
      tenantName: 'Mike Chen',
      providerId: '3',
      providerName: 'ABC Plumbing Services',
      rating: 5,
      feedback: 'Excellent service! The plumber arrived on time, was very professional, and fixed the issue quickly. The work area was left clean and tidy. Highly recommend!',
      categories: {
        quality: 5,
        timeliness: 5,
        communication: 4,
        professionalism: 5
      },
      wouldRecommend: true,
      createdAt: '2024-10-21T18:00:00Z'
    },
    {
      id: '2',
      serviceRequestId: '3',
      tenantId: '4',
      tenantName: 'Lisa Rodriguez',
      providerId: '5',
      providerName: 'Elite Electrical Services',
      rating: 4,
      feedback: 'Good work overall. The electrician was knowledgeable and fixed the outlet issue. Only minor complaint is they arrived a bit late, but they called ahead to let me know.',
      categories: {
        quality: 5,
        timeliness: 3,
        communication: 4,
        professionalism: 4
      },
      wouldRecommend: true,
      createdAt: '2024-10-18T16:30:00Z'
    }
  ];

  const allRatings = existingRatings.length > 0 ? existingRatings : mockRatings;
  const relevantRatings = providerId
    ? allRatings.filter(r => r.providerId === providerId)
    : allRatings.filter(r => r.serviceRequestId === serviceRequestId);

  const averageRating = relevantRatings.length > 0
    ? relevantRatings.reduce((sum, r) => sum + r.rating, 0) / relevantRatings.length
    : 0;

  const StarRating: React.FC<{ rating: number; interactive?: boolean; onRate?: (rating: number) => void }> = ({
    rating,
    interactive = false,
    onRate
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRate && onRate(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          disabled={!interactive}
        >
          <Star
            className={`w-5 h-5 ${star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
              }`}
          />
        </button>
      ))}
    </div>
  );

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting rating:', {
      serviceRequestId,
      ...ratingForm,
      createdAt: new Date().toISOString()
    });
    setIsRatingDialogOpen(false);
    setRatingForm({
      rating: 0,
      feedback: '',
      categories: { quality: 0, timeliness: 0, communication: 0, professionalism: 0 },
      wouldRecommend: true
    });
  };


  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {relevantRatings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Service Ratings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
                <StarRating rating={averageRating} />
                <p className="text-sm text-muted-foreground mt-1">
                  {relevantRatings.length} review{relevantRatings.length !== 1 ? 's' : ''}
                </p>
              </div>

              <Separator orientation="vertical" className="h-16" />

              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = relevantRatings.filter(r => r.rating === stars).length;
                  const percentage = relevantRatings.length > 0 ? (count / relevantRatings.length) * 100 : 0;

                  return (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-sm w-8">{stars}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendation Rate */}
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm font-medium">Would recommend</span>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">
                  {Math.round((relevantRatings.filter(r => r.wouldRecommend).length / relevantRatings.length) * 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Rating Button */}
      {showRatingForm && (
        <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Star className="mr-2 h-4 w-4" />
              Rate This Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Rate Service Quality</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmitRating} className="space-y-4">
              {/* Overall Rating */}
              <div className="space-y-2">
                <Label>Overall Rating</Label>
                <div className="flex items-center gap-2">
                  <StarRating
                    rating={ratingForm.rating}
                    interactive
                    onRate={(rating) => setRatingForm({ ...ratingForm, rating })}
                  />
                  <span className="text-sm text-muted-foreground">
                    {ratingForm.rating > 0 ? `${ratingForm.rating} star${ratingForm.rating !== 1 ? 's' : ''}` : 'Select rating'}
                  </span>
                </div>
              </div>

              {/* Category Ratings */}
              <div className="space-y-3">
                <Label>Detailed Ratings</Label>
                {Object.entries(ratingForm.categories).map(([category, rating]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm">{getCategoryLabel(category)}</span>
                    <StarRating
                      rating={rating}
                      interactive
                      onRate={(newRating) => setRatingForm({
                        ...ratingForm,
                        categories: { ...ratingForm.categories, [category]: newRating }
                      })}
                    />
                  </div>
                ))}
              </div>

              {/* Recommendation */}
              <div className="space-y-2">
                <Label>Would you recommend this service provider?</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={ratingForm.wouldRecommend ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setRatingForm({ ...ratingForm, wouldRecommend: true })}
                  >
                    <ThumbsUp className="mr-1 h-4 w-4" />
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={!ratingForm.wouldRecommend ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setRatingForm({ ...ratingForm, wouldRecommend: false })}
                  >
                    <ThumbsDown className="mr-1 h-4 w-4" />
                    No
                  </Button>
                </div>
              </div>

              {/* Feedback */}
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback (Optional)</Label>
                <Textarea
                  id="feedback"
                  value={ratingForm.feedback}
                  onChange={(e) => setRatingForm({ ...ratingForm, feedback: e.target.value })}
                  placeholder="Share your experience with this service provider..."
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRatingDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={ratingForm.rating === 0}>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Rating
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Individual Ratings */}
      {relevantRatings.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Reviews</h4>
          {relevantRatings.map((rating) => (
            <Card key={rating.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>{rating.tenantName.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{rating.tenantName}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(rating.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <StarRating rating={rating.rating} />
                        <div className="flex items-center gap-1 mt-1">
                          {rating.wouldRecommend ? (
                            <ThumbsUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <ThumbsDown className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {rating.wouldRecommend ? 'Recommends' : 'Does not recommend'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {rating.feedback && (
                      <p className="text-sm">{rating.feedback}</p>
                    )}

                    {/* Category Breakdown */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {Object.entries(rating.categories).map(([category, score]) => (
                        <div key={category} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{getCategoryLabel(category)}</span>
                          <div className="flex items-center gap-1">
                            <Star className={`w-3 h-3 ${score >= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            <span>{score}/5</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Ratings State */}
      {relevantRatings.length === 0 && !showRatingForm && (
        <Card>
          <CardContent className="py-12 text-center">
            <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No ratings yet</h3>
            <p className="text-muted-foreground">
              Ratings and reviews will appear here after service completion
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  function getCategoryLabel(category: string): string {
    switch (category) {
      case 'quality': return 'Work Quality';
      case 'timeliness': return 'Timeliness';
      case 'communication': return 'Communication';
      case 'professionalism': return 'Professionalism';
      default: return category;
    }
  }
};
