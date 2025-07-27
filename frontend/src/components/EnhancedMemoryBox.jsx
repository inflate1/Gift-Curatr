import React, { useState, useEffect } from 'react';
import { X, Clock, RefreshCw, ShoppingCart, Trash2, Star, Calendar, User, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { generateRefreshedPrice } from '../mockData';

const EnhancedMemoryBox = ({ isOpen, onClose }) => {
  const [savedItems, setSavedItems] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState('all');
  const [timeRemaining, setTimeRemaining] = useState({});
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'upcoming', 'expired'
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadData();
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

  const loadData = () => {
    const saved = JSON.parse(localStorage.getItem('giftcuratr-saved') || '[]');
    const recipientsList = JSON.parse(localStorage.getItem('giftcuratr-recipients') || '[]');
    setSavedItems(saved);
    setRecipients(recipientsList);
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

  const getRecipientName = (recipientId) => {
    const recipient = recipients.find(r => r.id === recipientId);
    return recipient ? recipient.name : 'Unknown';
  };

  const getFilteredItems = () => {
    let filtered = savedItems;

    // Filter by recipient
    if (selectedRecipient !== 'all') {
      filtered = filtered.filter(item => item.recipientId === selectedRecipient);
    }

    // Filter by status
    if (filterBy === 'upcoming') {
      filtered = filtered.filter(item => !isItemExpired(item));
    } else if (filterBy === 'expired') {
      filtered = filtered.filter(item => isItemExpired(item));
    }

    return filtered;
  };

  const getRecipientGiftCount = (recipientId) => {
    return savedItems.filter(item => item.recipientId === recipientId).length;
  };

  const getUpcomingOccasions = () => {
    const now = Date.now();
    const upcoming = savedItems
      .filter(item => item.occasion?.date && new Date(item.occasion.date).getTime() > now)
      .sort((a, b) => new Date(a.occasion.date).getTime() - new Date(b.occasion.date).getTime())
      .slice(0, 3);
    return upcoming;
  };

  if (!isOpen) return null;

  const filteredItems = getFilteredItems();
  const upcomingOccasions = getUpcomingOccasions();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-800">Memory Box</h2>
            <Badge variant="secondary" className="text-sm">
              {savedItems.length} saved gifts
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Upcoming Occasions Alert */}
        {upcomingOccasions.length > 0 && (
          <div className="px-6 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Upcoming Occasions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {upcomingOccasions.map(item => (
                <Badge key={item.id} className="bg-purple-600 text-white text-xs">
                  {item.occasion.label} - {getRecipientName(item.recipientId)} 
                  ({new Date(item.occasion.date).toLocaleDateString()})
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Recipients</h3>
              <div className="space-y-2">
                <Button
                  variant={selectedRecipient === 'all' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedRecipient('all')}
                >
                  <User className="h-4 w-4 mr-2" />
                  All Recipients
                  <Badge variant="secondary" className="ml-auto">
                    {savedItems.length}
                  </Badge>
                </Button>
                
                {recipients.map(recipient => (
                  <Button
                    key={recipient.id}
                    variant={selectedRecipient === recipient.id ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedRecipient(recipient.id)}
                  >
                    <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mr-2" />
                    {recipient.name}
                    <Badge variant="secondary" className="ml-auto">
                      {getRecipientGiftCount(recipient.id)}
                    </Badge>
                  </Button>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">Filter</h4>
                <div className="space-y-2">
                  <Button
                    variant={filterBy === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setFilterBy('all')}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    All Items
                  </Button>
                  <Button
                    variant={filterBy === 'upcoming' ? 'default' : 'ghost'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setFilterBy('upcoming')}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Active Prices
                  </Button>
                  <Button
                    variant={filterBy === 'expired' ? 'default' : 'ghost'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setFilterBy('expired')}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Expired
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Clock className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-lg">No items found</p>
                    <p className="text-sm">
                      {selectedRecipient === 'all' 
                        ? 'Save items from recommendations to see them here'
                        : `No saved gifts for ${getRecipientName(selectedRecipient)}`}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
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
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">
                            {item.title}
                          </h3>
                          <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
                        </div>
                        
                        <div className="text-xs text-gray-600 mb-2">
                          For {getRecipientName(item.recipientId)}
                        </div>
                        
                        {/* Occasion Badge */}
                        {item.occasion && (
                          <div className="flex items-center space-x-1 mb-2">
                            <Badge className="bg-purple-600 text-white text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              {item.occasion.label}
                            </Badge>
                            {item.occasion.date && (
                              <Badge variant="outline" className="text-xs">
                                {new Date(item.occasion.date).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        {/* Rating */}
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs font-medium ml-1">{item.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            ({item.reviewCount.toLocaleString()})
                          </span>
                        </div>
                        
                        {/* Price */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-800">
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
                        <Button 
                          onClick={() => buyNow(item)}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm"
                          disabled={isItemExpired(item)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {isItemExpired(item) ? 'Expired' : 'Buy on Amazon'}
                        </Button>
                        
                        {/* Saved timestamp */}
                        <div className="mt-2 text-xs text-gray-500">
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
      </div>
    </div>
  );
};

export default EnhancedMemoryBox;