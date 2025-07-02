export interface HotelListResponse {
    id: number;
    name: string; 
    location: string;
    rating: number | null;
    price: number;
    room_count: number;
    image: string;
    description: string;
    latitude: number;
    longitude: number; 
}

export interface Comment {
    id: string;
    hotelId: number;
    user: {
        id: string;
        username: string;
        firstName: string;
        lastName: string;
    };
    text: string;
    adminAnswer: string | null;
    days: number;
    createdAt: string;
    adminAnsweredAt: string | null;
    ratings: {service: string; score: number}[];
}

export interface HotelCommentsResponse {
    comments: Comment[];
    overall_rating: number;
    service_ratings: {
        LOCATION: number;
        PRICE: number;
        CLEANLINESS: number;
        STAFF: number;
    };
}

export interface Room {
    id: string;
    roomKind: string;
    guestCount: number;
    price: number;
    available: boolean;
    availablityList: {count: number; date: string}[];
}

export interface Booking {
    hotelName: string;
    id: string;
    hotelId: number;
    roomId: string;
    checkIn: string;
    checkOut: string;
    guestCount: number;
    createdAt: string;
}

export interface Notification {
    id?: string;
    message: string;
    timestamp?: string;
    type?: string;
}

export interface ServiceRating {
    service: 'CLEANLINESS' | 'LOCATION' | 'PRICE' | 'STAFF';
    score: number;
}

export interface CommentSubmission {
    bookingId: string;
    rating: ServiceRating[];
    text: string;
}