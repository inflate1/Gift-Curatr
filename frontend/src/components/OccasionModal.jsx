import React, { useState } from 'react';
import { X, Calendar, Gift, Heart, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const OccasionModal = ({ isOpen, onClose, onSave, item, recipientName }) => {
  const [occasionType, setOccasionType] = useState('');
  const [customOccasion, setCustomOccasion] = useState('');
  const [occasionDate, setOccasionDate] = useState('');
  const [notes, setNotes] = useState('');

  const predefinedOccasions = [
    { id: 'birthday', label: 'Birthday', icon: Gift, color: 'bg-pink-500' },
    { id: 'anniversary', label: 'Anniversary', icon: Heart, color: 'bg-red-500' },
    { id: 'holiday', label: 'Holiday', icon: Sparkles, color: 'bg-green-500' },
    { id: 'graduation', label: 'Graduation', icon: Sparkles, color: 'bg-blue-500' },
    { id: 'thank_you', label: 'Thank You', icon: Heart, color: 'bg-purple-500' },
    { id: 'just_because', label: 'Just Because', icon: Gift, color: 'bg-orange-500' },
  ];

  const handleSave = () => {
    const finalOccasion = occasionType === 'custom' ? customOccasion : 
                         predefinedOccasions.find(o => o.id === occasionType)?.label || '';
    
    const occasionData = {
      type: occasionType,
      label: finalOccasion,
      date: occasionDate,
      notes: notes.trim(),
      color: predefinedOccasions.find(o => o.id === occasionType)?.color || 'bg-gray-500'
    };

    onSave(occasionData);
    resetForm();
  };

  const resetForm = () => {
    setOccasionType('');
    setCustomOccasion('');
    setOccasionDate('');
    setNotes('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">Add Occasion</h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Gift Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-800 line-clamp-1">{item.title}</h3>
                <p className="text-sm text-gray-600">For {recipientName}</p>
                <p className="text-sm font-medium text-gray-800">${item.price.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Occasion Selection */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              What's this gift for?
            </Label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {predefinedOccasions.map((occasion) => {
                const IconComponent = occasion.icon;
                return (
                  <Card 
                    key={occasion.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      occasionType === occasion.id 
                        ? 'border-2 border-purple-500 bg-purple-50' 
                        : 'border-2 border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => setOccasionType(occasion.id)}
                  >
                    <CardContent className="p-3 text-center">
                      <div className={`w-8 h-8 ${occasion.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{occasion.label}</span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Custom Occasion */}
            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                occasionType === 'custom' 
                  ? 'border-2 border-purple-500 bg-purple-50' 
                  : 'border-2 border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => setOccasionType('custom')}
            >
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                    <Gift className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Custom Occasion</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Custom Occasion Input */}
          {occasionType === 'custom' && (
            <div className="mb-4">
              <Label htmlFor="custom-occasion" className="text-sm font-medium text-gray-700 mb-2 block">
                Enter custom occasion
              </Label>
              <Input
                id="custom-occasion"
                placeholder="e.g., Housewarming, New Job, Get Well Soon"
                value={customOccasion}
                onChange={(e) => setCustomOccasion(e.target.value)}
              />
            </div>
          )}

          {/* Date Input */}
          <div className="mb-4">
            <Label htmlFor="occasion-date" className="text-sm font-medium text-gray-700 mb-2 block">
              Occasion Date (optional)
            </Label>
            <Input
              id="occasion-date"
              type="date"
              value={occasionDate}
              onChange={(e) => setOccasionDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Notes */}
          <div className="mb-6">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700 mb-2 block">
              Notes (optional)
            </Label>
            <textarea
              id="notes"
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Add any special notes about this gift..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Preview */}
          {occasionType && (
            <div className="mb-6 p-4 bg-purple-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
              <div className="flex items-center space-x-2">
                <Badge className="bg-purple-600 text-white">
                  <Calendar className="h-3 w-3 mr-1" />
                  {occasionType === 'custom' ? customOccasion : 
                   predefinedOccasions.find(o => o.id === occasionType)?.label}
                </Badge>
                {occasionDate && (
                  <Badge variant="outline">
                    {new Date(occasionDate).toLocaleDateString()}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!occasionType || (occasionType === 'custom' && !customOccasion.trim())}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Save Gift
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OccasionModal;