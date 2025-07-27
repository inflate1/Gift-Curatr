import React, { useState } from 'react';
import { Plus, User, Edit2, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';

const RecipientSelector = ({ selectedRecipient, onRecipientSelect, onRecipientCreate }) => {
  const [recipients, setRecipients] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('giftcuratr-recipients') || '[]');
    return saved;
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecipientName, setNewRecipientName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const { toast } = useToast();

  const createRecipient = () => {
    if (!newRecipientName.trim()) return;
    
    const newRecipient = {
      id: Date.now().toString(),
      name: newRecipientName.trim(),
      createdAt: Date.now(),
      giftCount: 0
    };
    
    const updatedRecipients = [...recipients, newRecipient];
    setRecipients(updatedRecipients);
    localStorage.setItem('giftcuratr-recipients', JSON.stringify(updatedRecipients));
    
    setNewRecipientName('');
    setShowAddForm(false);
    onRecipientCreate(newRecipient);
    
    toast({
      title: "Recipient Added",
      description: `${newRecipient.name} has been added to your list`,
    });
  };

  const editRecipient = (id) => {
    if (!editingName.trim()) return;
    
    const updatedRecipients = recipients.map(r => 
      r.id === id ? { ...r, name: editingName.trim() } : r
    );
    setRecipients(updatedRecipients);
    localStorage.setItem('giftcuratr-recipients', JSON.stringify(updatedRecipients));
    
    setEditingId(null);
    setEditingName('');
    
    toast({
      title: "Recipient Updated",
      description: "Recipient name has been updated",
    });
  };

  const deleteRecipient = (id) => {
    const updatedRecipients = recipients.filter(r => r.id !== id);
    setRecipients(updatedRecipients);
    localStorage.setItem('giftcuratr-recipients', JSON.stringify(updatedRecipients));
    
    // Clear saved gifts for this recipient
    const savedGifts = JSON.parse(localStorage.getItem('giftcuratr-saved') || '[]');
    const filteredGifts = savedGifts.filter(gift => gift.recipientId !== id);
    localStorage.setItem('giftcuratr-saved', JSON.stringify(filteredGifts));
    
    toast({
      title: "Recipient Deleted",
      description: "Recipient and their saved gifts have been removed",
    });
  };

  const getRecipientGiftCount = (recipientId) => {
    const savedGifts = JSON.parse(localStorage.getItem('giftcuratr-saved') || '[]');
    return savedGifts.filter(gift => gift.recipientId === recipientId).length;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Select Recipient</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Recipient
        </Button>
      </div>

      {/* Add New Recipient Form */}
      {showAddForm && (
        <Card className="border-2 border-dashed border-purple-300 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter recipient name (e.g., Mom, Jason, Work Buddy)"
                value={newRecipientName}
                onChange={(e) => setNewRecipientName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createRecipient()}
                className="flex-1"
              />
              <Button onClick={createRecipient} className="px-4">
                Add
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddForm(false);
                  setNewRecipientName('');
                }}
                className="px-4"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recipients List */}
      <div className="grid gap-3">
        {recipients.map((recipient) => (
          <Card 
            key={recipient.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedRecipient?.id === recipient.id 
                ? 'border-2 border-purple-500 bg-purple-50' 
                : 'border-2 border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => !editingId && onRecipientSelect(recipient)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    {editingId === recipient.id ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') editRecipient(recipient.id);
                            if (e.key === 'Escape') {
                              setEditingId(null);
                              setEditingName('');
                            }
                          }}
                          className="text-sm"
                          autoFocus
                        />
                        <Button size="sm" onClick={() => editRecipient(recipient.id)}>
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setEditingId(null);
                            setEditingName('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-medium text-gray-800">{recipient.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>Added {new Date(recipient.createdAt).toLocaleDateString()}</span>
                          <Badge variant="secondary" className="text-xs">
                            {getRecipientGiftCount(recipient.id)} saved gifts
                          </Badge>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {editingId !== recipient.id && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(recipient.id);
                        setEditingName(recipient.name);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRecipient(recipient.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recipients.length === 0 && !showAddForm && (
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">No recipients added yet</p>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Recipient
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecipientSelector;