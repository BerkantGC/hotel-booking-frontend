"use client"
import { useEffect, useState } from "react";
import { Search, MapPin, Calendar, Users, Star, Wifi, Car, Coffee } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Maps from "../Maps";
import { HotelListResponse } from "@/utils/types";

const HomeSearch = ({ onSearch }: {onSearch: (params: any) => void}) => {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    if (!destination.trim()) {
        alert("Please enter a destination.");
        return;
    }
    if (!startDate || !endDate) {
        alert("Please select both start and end dates.");
        return;
    }
    if (guests < 1) {           
        alert("Please enter at least one guest.");
        return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
        alert("End date must be after start date.");
        return;
    }
    if (new Date(startDate) < new Date()) {
        alert("Start date cannot be in the past.");
        return;
    }
    if (new Date(endDate) < new Date()) {
        alert("End date cannot be in the past.");
        return;
    }

    onSearch({ location: destination,  checkIn: startDate,  checkOut: endDate, roomCount: guests });
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      
      <div className="relative z-10 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent block">
                Hotel Stay
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover amazing hotels worldwide with unbeatable prices and premium amenities
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 text-gray-700 placeholder-gray-400"
                  placeholder="Where to?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 text-gray-700"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 text-gray-700"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  min={1}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 text-gray-700"
                  placeholder="Guests"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <button
              onClick={handleSearch}
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-12 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3 text-lg"
            >
              <Search className="w-5 h-5" />
              Search Hotels
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HotelList = ({ hotels, searchParams }) => {
  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'parking': return <Car className="w-4 h-4" />;
      case 'restaurant': return <Coffee className="w-4 h-4" />;
      default: return null;
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  if (!hotels || hotels.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-12 shadow-lg">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to Search?</h2>
            <p className="text-gray-600">Use the search form above to find amazing hotels for your next trip.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Available Hotels</h2>
          {searchParams && (
            <p className="text-gray-600">
              Showing results for {searchParams.destination || 'all destinations'} 
              {searchParams.startDate && ` from ${searchParams.startDate}`}
              {searchParams.endDate && ` to ${searchParams.endDate}`}
              {searchParams.guests > 1 && ` for ${searchParams.guests} guests`}
            </p>
          )}
        </div>
        
        {/* Maps Component */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Hotel Locations</h3>
              <Maps hotels={hotels}/>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <div 
              key={hotel.id} 
              onClick={() => window.location.href = `/hotel/${hotel.id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={hotel.image} 
                  alt={hotel.name} 
                  className="w-full h-56 object-cover transition-transform duration-300 hover:scale-110" 
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full">
                  <span className="font-bold text-blue-600">${hotel.price}</span>
                  <span className="text-gray-500 text-sm">/night</span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{hotel.name}</h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{hotel.location}</span>
                </div>
                
                <div className="flex items-center gap-1 mb-4">
                  {renderStars(hotel.rating || 0)}
                  <span className="text-sm text-gray-500 ml-2">
                    {hotel.rating ? `${hotel.rating} stars` : 'N/A'}
                  </span>
                </div>
                
                {hotel.amenities && (
                  <div className="flex items-center gap-2 mb-4">
                    {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600">
                        {getAmenityIcon(amenity)}
                        <span className="capitalize">{amenity}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HotelSearchApp = ({hotels}: {hotels: HotelListResponse[]}) => {
    const initialSearchParams = useSearchParams();
    const [searchParams, setSearchParams] = useState(initialSearchParams);
    const router = useRouter();
    const [currentHostels, setCurrentHostels] = useState(hotels || []);

    useEffect(() => {
        setCurrentHostels(hotels);
    }, [hotels]);

    const handleSearch = (params: any) => {
        setSearchParams(params);

        const query = new URLSearchParams(params).toString();
        router.push(`/?${query}`);
        // Optionally, you can also fetch hotels based on the search params here
        // fetchHotels(params);
    };

    return (
        <div>
            <HomeSearch onSearch={handleSearch} />
            <HotelList hotels={currentHostels} searchParams={searchParams} />
        </div>
    );
};

export default HotelSearchApp;