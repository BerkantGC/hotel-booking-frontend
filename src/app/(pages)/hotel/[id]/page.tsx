// app/hotel/[id]/page.tsx
import { ErrorResponse, fetchService } from "@/utils/fetchService";
import { notFound } from "next/navigation";
import Image from "next/image";
import { HotelCommentsResponse, HotelListResponse } from "@/utils/types";
import { getSession, handleUnauthorized } from "@/actions/authApi";

interface HotelDetailProps {
  params: { id: string };
}

export default async function HotelDetailPage({ params }: HotelDetailProps) {
  const {id} = await params;
  const hotelResponse = await fetchService(`/hotels/${params.id}`);
  const hotelCommentsResponse = await fetchService(`/comments?=hotelId=${params.id}`);

  if (hotelCommentsResponse?.status === 401 || hotelResponse?.status === 401) 
    handleUnauthorized();

  const hotel = hotelResponse as HotelListResponse;
  const {comments, overall_rating} = hotelCommentsResponse as HotelCommentsResponse;

  const isSignedIn = await getSession().then(session => !!session?.username);

  // If user is signed in, hotel.price is already discounted by backend
  // Calculate original price for display purposes
  const originalPrice = isSignedIn ? hotel.price / (1 - 15 / 100) : hotel.price;
  const discountPercentage = 15;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image and Hotel Name */}
      <div className="relative h-96 w-full">
        <Image
          src={hotel.image || "/placeholder-hotel.jpg"}
          alt={`${hotel.name} - Hotel Image`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex space-x-8">
            <button className="py-4 px-2 border-b-2 border-blue-500 text-blue-600 font-medium">
              Genel Bakış
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Content - Hotel Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">{hotel.name}</h2>
              <p className="text-gray-600 mb-6">{hotel.location}</p>
              
              {/* Hotel Description/Content would go here */}
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  Bu muhteşem otel, eşsiz manzarası ve üstün hizmet kalitesiyle unutulmaz bir konaklama deneyimi sunuyor. 
                  Modern olanakları ve konforlu odalarıyla misafirlerine en iyi hizmeti vermeye odaklanmıştır.
                </p>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              
              {/* Rating Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`${overall_rating > 4 ? 'bg-green-600' : overall_rating > 3 ? 'bg-yellow-500' : 'bg-red-500'} text-white px-2 py-1 rounded text-sm font-medium`}>
                    {overall_rating}
                  </div>
                  <span className="font-medium text-gray-900">
                    {overall_rating > 4 ? 'Mükemmel' : overall_rating > 3 ? 'İyi' : 'Kötü'}
                  </span>
                </div>
                <a href={`/hotel/${id}/comments`} className="text-blue-600 text-sm hover:underline">
                  {comments?.length} yorumun tümünü göster →
                </a>
              </div>

              {/* Discount Badge */}
              {isSignedIn && (
                <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  🏷️ Üye Fiyatı: %{discountPercentage} indirim
                </div>
              )}

              {/* Price Display */}
              <div className="mb-6">
                { isSignedIn ? (
                  <>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {hotel.price.toLocaleString('tr-TR')} TL
                    </div>
                    <div className="text-gray-500 line-through text-lg mb-2">
                      {originalPrice.toLocaleString('tr-TR')} TL
                    </div>
                  </>
                ) : (
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {hotel.price.toLocaleString('tr-TR')} TL
                  </div>
                )}
                <div className="text-sm text-gray-500 mt-1">
                  vergiler ve ücretler dâhildir
                </div>
              </div>

              {/* Price Details Link */}
              <button className="text-blue-600 text-sm hover:underline mb-6 block">
                Fiyat bilgileri →
              </button>

              {/* Reservation Button */}
              <a href={`/hotel/${id}/book`} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                Rezervasyon yap
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
