import React, { useState, useEffect } from 'react';
import { Plus, Trash2, RefreshCw } from 'lucide-react';

// Firebase configuration - REPLACE THESE WITH YOUR OWN VALUES
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCu8EOp79LuCxs4DGVMQC85wztiT6DkEQc",
  authDomain: "friendsgiving-a25e9.firebaseapp.com",
  databaseURL: "https://friendsgiving-a25e9-default-rtdb.firebaseio.com",
  projectId: "friendsgiving-a25e9",
  storageBucket: "friendsgiving-a25e9.firebasestorage.app",
  messagingSenderId: "984699004191",
  appId: "1:984699004191:web:392e1f6c8f17d6c25f3c2a"
};

export default function FriendsgivingSignup() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ category: 'Side Dish', item: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [db, setDb] = useState(null);

  const categories = ['Main Dish', 'Side Dish', 'Salad', 'Dessert', 'Drinks', 'Other'];

  const defaultItems = [
    { id: 1, category: 'Main Dish', item: 'Turkey', claimedBy: '' },
    { id: 2, category: 'Main Dish', item: 'Ham', claimedBy: '' },
    { id: 3, category: 'Side Dish', item: 'Mashed Potatoes', claimedBy: '' },
    { id: 4, category: 'Side Dish', item: 'Stuffing', claimedBy: '' },
    { id: 5, category: 'Side Dish', item: 'Green Bean Casserole', claimedBy: '' },
    { id: 6, category: 'Side Dish', item: 'Cranberry Sauce', claimedBy: '' },
    { id: 7, category: 'Side Dish', item: 'Mac and Cheese', claimedBy: '' },
    { id: 8, category: 'Salad', item: 'Caesar Salad', claimedBy: '' },
    { id: 9, category: 'Dessert', item: 'Pumpkin Pie', claimedBy: '' },
    { id: 10, category: 'Dessert', item: 'Apple Pie', claimedBy: '' },
    { id: 11, category: 'Dessert', item: 'Pecan Pie', claimedBy: '' },
    { id: 12, category: 'Drinks', item: 'Wine (Red)', claimedBy: '' },
    { id: 13, category: 'Drinks', item: 'Wine (White)', claimedBy: '' },
    { id: 14, category: 'Drinks', item: 'Sparkling Cider', claimedBy: '' },
  ];

  // Initialize Firebase
  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
    script1.async = true;
    
    const script2 = document.createElement('script');
    script2.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js';
    script2.async = true;

    script1.onload = () => {
      document.head.appendChild(script2);
    };

    script2.onload = () => {
      if (window.firebase) {
        try {
          if (!window.firebase.apps.length) {
            window.firebase.initializeApp(FIREBASE_CONFIG);
          }
          const database = window.firebase.database();
          setDb(database);
          
          // Listen for real-time updates
          const itemsRef = database.ref('friendsgiving-items');
          itemsRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
              setItems(data);
            } else {
              // Initialize with default items
              itemsRef.set(defaultItems);
              setItems(defaultItems);
            }
            setLoading(false);
          });
        } catch (err) {
          setError('Failed to connect to Firebase. Please check your configuration.');
          setLoading(false);
        }
      }
    };

    document.head.appendChild(script1);

    return () => {
      if (db) {
        db.ref('friendsgiving-items').off();
      }
    };
  }, []);

  const handleClaimChange = (id, name) => {
    if (!db) return;
    
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, claimedBy: name } : item
    );
    
    db.ref('friendsgiving-items').set(updatedItems).catch(err => {
      console.error('Error updating item:', err);
      setError('Failed to save changes. Please try again.');
    });
  };

  const handleAddItem = () => {
    if (!db || !newItem.item.trim()) return;
    
    const updatedItems = [...items, { 
      id: Date.now(), 
      category: newItem.category, 
      item: newItem.item, 
      claimedBy: '' 
    }];
    
    db.ref('friendsgiving-items').set(updatedItems).then(() => {
      setNewItem({ category: 'Side Dish', item: '' });
    }).catch(err => {
      console.error('Error adding item:', err);
      setError('Failed to add item. Please try again.');
    });
  };

  const handleDeleteItem = (id) => {
    if (!db) return;
    
    const updatedItems = items.filter(item => item.id !== id);
    
    db.ref('friendsgiving-items').set(updatedItems).catch(err => {
      console.error('Error deleting item:', err);
      setError('Failed to delete item. Please try again.');
    });
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-orange-700 text-xl">Loading sign-up sheet...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
          <h2 className="text-red-600 font-bold text-xl mb-2">Connection Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <p className="text-sm text-gray-600">Make sure you've added your Firebase configuration at the top of the code.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-900 mb-2">🦃 Friendsgiving Sign-Up</h1>
          <p className="text-orange-700">Claim a dish to bring to our feast!</p>
          <p className="text-sm text-orange-600 mt-2">
            ✨ Updates automatically in real-time for everyone
          </p>
        </div>

        {categories.map(category => {
          const categoryItems = groupedItems[category] || [];
          if (categoryItems.length === 0) return null;
          
          return (
            <div key={category} className="mb-6">
              <h2 className="text-xl font-semibold text-orange-800 mb-3 border-b-2 border-orange-300 pb-1">
                {category}
              </h2>
              <div className="space-y-2">
                {categoryItems.map(item => (
                  <div key={item.id} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
                    <div className="flex-1 font-medium text-gray-800">
                      {item.item}
                    </div>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={item.claimedBy}
                      onChange={(e) => handleClaimChange(item.id, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Delete item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Item</h3>
          <div className="flex gap-3">
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Item name"
              value={newItem.item}
              onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleAddItem}
              className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center gap-2"
            >
              <Plus size={18} />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}