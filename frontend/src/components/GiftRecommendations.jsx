import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, ShoppingCart, Clock, RefreshCw, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { mockGiftRecommendations, generateExpiryTimestamp } from '../mockData';
import OccasionModal from './OccasionModal';

const GiftRecommendations = ({ answers, onBack, onOpenMemoryBox }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState({});
  const [showOccasionModal, setShowOccasionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { toast } = useToast();

  const recipient = answers.recipient;
  const chatAnswers = {
    0: answers[0],
    1: answers[1], 
    2: answers[2]
  };

  useEffect(() => {
    // Add expiry timestamps to recommendations
    const recommendationsWithExpiry = mockGiftRecommendations.map(item => ({
      ...item,
      expiresAt: generateExpiryTimestamp(),
      originalPrice: item.price
    }));
    setRecommendations(recommendationsWithExpiry);

    // Load saved items from localStorage
    const saved = JSON.parse(localStorage.getItem('giftcuratr-saved') || '[]');
    setSavedItems(saved);
  }, []);

  useEffect(() => {
    // Update countdown timer every second
    const interval = setInterval(() => {
      const newTimeRemaining = {};
      recommendations.forEach(item => {
        const remaining = item.expiresAt - Date.now();
        if (remaining > 0) {
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
          newTimeRemaining[item.id] = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          newTimeRemaining[item.id] = 'Expired';
        }
      });
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [recommendations]);

  const handleSaveItem = (item) => {
    setSelectedItem(item);
    setShowOccasionModal(true);
  };

  const handleOccasionSave = (occasionData) => {
    const savedItem = {
      ...selectedItem,
      savedAt: Date.now(),
      recipientId: recipient.id,
      occasion: occasionData
    };
    
    const updatedSaved = [...savedItems, savedItem];
    setSavedItems(updatedSaved);
    localStorage.setItem('giftcuratr-saved', JSON.stringify(updatedSaved));
    
    setShowOccasionModal(false);
    setSelectedItem(null);
    
    toast({
      title: "Added to Memory Box",
      description: `${selectedItem.title} saved for ${recipient.name}`,
    });
  };

  const handleBuyNow = (item) => {
    // Mock Amazon redirect
    console.log(`Redirecting to Amazon: /dp/${item.asin}?tag=giftcuratr-20`);
    toast({
      title: "Redirecting to Amazon",
      description: `Opening ${item.title} on Amazon`,
    });
    // In production, this would be: window.open(`https://amazon.com/dp/${item.asin}?tag=giftcuratr-20`, '_blank');
  };

  const isItemSaved = (itemId) => {
    return savedItems.some(item => item.id === itemId && item.recipientId === recipient.id);
  };

  const isItemExpired = (item) => {
    return Date.now() > item.expiresAt;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-purple-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quiz
          </Button>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={onOpenMemoryBox}
              className="flex items-center"
            >
              <Heart className="h-4 w-4 mr-2" />
              Memory Box ({savedItems.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            Perfect Gifts for Your 
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" " + recipient.name}
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Based on their love for {chatAnswers[1]?.toLowerCase()} and your {chatAnswers[2]} budget
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Prices expire in 23 hours</span>
          </div>
        </div>
      </div>

      {/* Gift Grid */}
      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendations.map((item) => (
              <Card 
                key={item.id} 
                className={`overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${
                  isItemExpired(item) ? 'border-gray-300 bg-gray-50' : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className={`w-full h-48 object-cover ${isItemExpired(item) ? 'grayscale' : ''}`}
                  />
                  {/* Timer Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge 
                      variant={isItemExpired(item) ? "secondary" : "destructive"}
                      className="text-xs font-medium"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {timeRemaining[item.id] || 'Loading...'}
                    </Badge>
                  </div>
                  {/* Save Button */}
                  {!isItemExpired(item) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`absolute top-3 left-3 p-2 rounded-full ${
                        isItemSaved(item.id) 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-white/80 hover:bg-white text-gray-700'
                      }`}
                      onClick={() => handleSaveItem(item)}
                      disabled={isItemSaved(item.id)}
                    >
                      <Heart className={`h-4 w-4 ${isItemSaved(item.id) ? 'fill-current' : ''}`} />
                    </Button>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium ml-1">{item.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      ({item.reviewCount.toLocaleString()} reviews)
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-800">
                        ${item.price.toFixed(2)}
                      </span>
                      {isItemExpired(item) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="p-1 h-auto"
                          onClick={() => {
                            toast({
                              title: "Price Refreshed",
                              description: "New price: $" + (item.price + 0.99).toFixed(2),
                            });
                          }}
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  
                  {/* Buy Button */}
                  <Button 
                    onClick={() => handleBuyNow(item)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    disabled={isItemExpired(item)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isItemExpired(item) ? 'Price Expired' : 'Buy on Amazon'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Occasion Modal */}
      <OccasionModal
        isOpen={showOccasionModal}
        onClose={() => {
          setShowOccasionModal(false);
          setSelectedItem(null);
        }}
        onSave={handleOccasionSave}
        item={selectedItem}
        recipientName={recipient?.name}
      />
    </div>
  );
};

export default GiftRecommendations;