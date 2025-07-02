'use client';

import { useState } from 'react';
import { ServiceRating, CommentSubmission } from '@/utils/types';
import { fetchService } from '@/utils/fetchService';

interface CommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
    hotelName: string;
    onSuccess?: () => void;
}

const SERVICES: Array<{ key: ServiceRating['service']; label: string }> = [
    { key: 'CLEANLINESS', label: 'Cleanliness' },
    { key: 'LOCATION', label: 'Location' },
    { key: 'PRICE', label: 'Price' },
    { key: 'STAFF', label: 'Staff' },
];

export default function CommentModal({ isOpen, onClose, bookingId, hotelName, onSuccess }: CommentModalProps) {
    const [ratings, setRatings] = useState<ServiceRating[]>(
        SERVICES.map(service => ({ service: service.key, score: 0 }))
    );
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRatingChange = (service: ServiceRating['service'], score: number) => {
        setRatings(prev => 
            prev.map(rating => 
                rating.service === service ? { ...rating, score } : rating
            )
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate that all ratings are provided
        if (ratings.some(rating => rating.score === 0)) {
            setError('Please provide ratings for all services');
            return;
        }

        if (!text.trim()) {
            setError('Please provide a comment');
            return;
        }

        setIsSubmitting(true);

        try {
            const commentData: CommentSubmission = {
                bookingId,
                rating: ratings.filter(rating => rating.score > 0),
                text: text.trim(),
            };

            await fetchService('/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData),
            });

            // Reset form
            setRatings(SERVICES.map(service => ({ service: service.key, score: 0 })));
            setText('');
            
            if (onSuccess) {
                onSuccess();
            }
            
            onClose();
        } catch (error) {
            setError('Failed to submit comment. Please try again.');
            console.error('Error submitting comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (service: ServiceRating['service'], currentScore: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(service, star)}
                        className={`text-2xl transition-colors ${
                            star <= currentScore 
                                ? 'text-yellow-400 hover:text-yellow-500' 
                                : 'text-gray-300 hover:text-yellow-300'
                        }`}
                    >
                        ★
                    </button>
                ))}
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">
                            Review Your Stay
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                            disabled={isSubmitting}
                        >
                            ×
                        </button>
                    </div>

                    <p className="text-gray-600 mb-6">
                        Share your experience at <strong>{hotelName}</strong>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Ratings */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900">Rate Your Experience</h3>
                            {SERVICES.map((service) => {
                                const currentRating = ratings.find(r => r.service === service.key);
                                return (
                                    <div key={service.key} className="flex justify-between items-center">
                                        <span className="text-gray-700 font-medium">
                                            {service.label}
                                        </span>
                                        {renderStars(service.key, currentRating?.score || 0)}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Comment Text */}
                        <div>
                            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                                Your Comment
                            </label>
                            <textarea
                                id="comment"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Share details about your stay..."
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
