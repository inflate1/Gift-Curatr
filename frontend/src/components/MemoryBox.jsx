import React, { useState, useEffect } from 'react';
import { X, Clock, RefreshCw, ShoppingCart, Trash2, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { generateRefreshedPrice } from '../mockData';

const MemoryBox = ({ isOpen, onClose }) => {
  const [savedItems, setSavedItems] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadSavedItems();
    }
  }, [isOpen]);

  useEffect(() => {
    // Update countdown timer every second
    const interval = setInterval(() => {
      const newTimeRemaining = {};
      savedItems.forEach(item => {
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
  }, [savedItems]);

  const loadSavedItems = () => {
    const saved = JSON.parse(localStorage.getItem('giftcuratr-saved') || '[]');
    setSavedItems(saved);
  };

  const removeItem = (itemId) => {
    const updated = savedItems.filter(item => item.id !== itemId);
    setSavedItems(updated);
    localStorage.setItem('giftcuratr-saved', JSON.stringify(updated));
    
    toast({
      title: "Removed from Memory Box",
      description: "Item has been removed from your saved items",
    });
  };

  const refreshPrice = (itemId) => {
    const updated = savedItems.map(item => {
      if (item.id === itemId) {
        const newPrice = generateRefreshedPrice(item.originalPrice);
        return { ...item, price: newPrice };
      }
      return item;
    });
    
    setSavedItems(updated);
    localStorage.setItem('giftcuratr-saved', JSON.stringify(updated));
    
    toast({
      title: "Price Refreshed",
      description: "Fresh price data has been loaded",
    });
  };

  const buyNow = (item) => {
    console.log(`Redirecting to Amazon: /dp/${item.asin}?tag=giftcuratr-20`);
    toast({
      title: "Redirecting to Amazon",
      description: `Opening ${item.title} on Amazon`,
    });
  };

  const isItemExpired = (item) => {
    return Date.now() > item.expiresAt;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Memory Box</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {savedItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Clock className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg">Your Memory Box is empty</p>
                <p className="text-sm">Save items from recommendations to see them here</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {savedItems.map((item) => (
                <Card 
                  key={item.id} 
                  className={`overflow-hidden transition-all duration-300 ${
                    isItemExpired(item) ? 'border-gray-300 bg-gray-50' : 'border-gray-200'
                  }`}
                >
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className={`w-full h-32 object-cover ${isItemExpired(item) ? 'grayscale' : ''}`}
                    />
                    {/* Timer Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge 
                        variant={isItemExpired(item) ? "secondary" : "destructive"}
                        className="text-xs"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {timeRemaining[item.id] || 'Loading...'}
                      </Badge>
                    </div>
                    {/* Remove Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 left-2 p-1 bg-white/80 hover:bg-white text-gray-700 rounded-full"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium ml-1">{item.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        ({item.reviewCount.toLocaleString()})
                      </span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-800">
                          ${item.price.toFixed(2)}
                        </span>
                        {isItemExpired(item) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="p-1 h-auto"
                            onClick={() => refreshPrice(item.id)}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => buyNow(item)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        disabled={isItemExpired(item)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {isItemExpired(item) ? 'Expired' : 'Buy'}
                      </Button>
                    </div>
                    
                    {/* Saved timestamp */}
                    <div className="mt-3 text-xs text-gray-500">
                      Saved {new Date(item.savedAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryBox;