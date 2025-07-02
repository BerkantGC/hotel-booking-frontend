import { handleUnauthorized } from "@/actions/authApi";
import { fetchService } from "@/utils/fetchService";
import { HotelCommentsResponse } from "@/utils/types";

const HotelCommentsPage = async ({ params }: { params: { id: string } }) => {
    const hotelCommentsResponse = await fetchService(`/comments?hotelId=${params.id}`);
    
    if (hotelCommentsResponse?.status === 401) {
        handleUnauthorized();
    }
    
    const data = hotelCommentsResponse as HotelCommentsResponse;
    const { comments, overall_rating, service_ratings } = data;
    
    return (
        <><div className="max-w-6xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Otel Değerlendirmeleri</h1>

            {/* Overall Rating Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Genel Değerlendirme</h2>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                            <span className="text-3xl font-bold text-blue-600">{!isNaN(overall_rating) ? overall_rating.toFixed(1) : 0}</span>
                            <span className="text-lg text-gray-600 ml-1">/5</span>
                        </div>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => {
                                const rating = overall_rating;
                                const isFullStar = i < Math.floor(rating);
                                const isHalfStar = i === Math.floor(rating) && rating % 1 >= 0.5;

                                return (
                                    <div key={i} className="relative w-5 h-5">
                                        <svg
                                            className="w-5 h-5 text-gray-300 absolute"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        {(isFullStar || isHalfStar) && (
                                            <svg
                                                className="w-5 h-5 text-yellow-400 absolute"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                style={isHalfStar ? { clipPath: 'inset(0 50% 0 0)' } : {}}
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Service Ratings */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-green-600">{!isNaN(service_ratings.LOCATION) ? service_ratings.LOCATION.toFixed(1) : 0}</div>
                        <div className="text-sm text-gray-600 font-medium">Konum</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">{!isNaN(service_ratings.PRICE) ? service_ratings.PRICE.toFixed(1) : 0}</div>
                        <div className="text-sm text-gray-600 font-medium">Fiyat</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-purple-600">{!isNaN(service_ratings.CLEANLINESS) ? service_ratings.CLEANLINESS.toFixed(1) : 0}</div>
                        <div className="text-sm text-gray-600 font-medium">Temizlik</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-orange-600">{!isNaN(service_ratings.STAFF) ? service_ratings.STAFF.toFixed(1) : 0}</div>
                        <div className="text-sm text-gray-600 font-medium">Personel</div>
                    </div>
                </div>
            </div>
        </div><div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Müşteri Yorumları ({comments.length})</h2>
                {comments.map(comment => (
                    <div key={comment.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {comment.user.firstName.charAt(0)}{comment.user.lastName.charAt(0)}
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-800">{comment.user.firstName} {comment.user.lastName}</span>
                                    <div className="text-sm text-gray-500">{comment.days} gün konakladı</div>
                                </div>
                            </div>
                            <span className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>

                        {/* Comment Text */}
                        <p className="text-gray-700 mb-4 leading-relaxed">{comment.text}</p>

                        {/* Individual Ratings */}
                        {comment.ratings && comment.ratings.length > 0 && (
                            <div className="flex flex-wrap gap-3 mb-4">
                                {comment.ratings.map((rating, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg px-3 py-2 text-sm">
                                        <span className="text-gray-600">{rating.service}:</span>
                                        <span className="font-semibold text-blue-600 ml-1">{rating.score}/10</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Admin Answer */}
                        {comment.adminAnswer && (
                            <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4 mt-4">
                                <div className="flex items-center mb-2">
                                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-semibold text-blue-800">Otel Yönetimi Yanıtı</span>
                                </div>
                                <p className="text-blue-700">{comment.adminAnswer}</p>
                                {comment.adminAnsweredAt && (
                                    <div className="text-sm text-blue-600 mt-2">
                                        {new Date(comment.adminAnsweredAt).toLocaleDateString('tr-TR')}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div></>
    );
}

export default HotelCommentsPage;