'use client'
import React, { useState } from 'react';

const Page = () => {
  const [eventType, setEventType] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url; // Return the uploaded image URL
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let uploadedImageURL = '';

    // Upload image if a file is selected
    if (selectedImage) {
      uploadedImageURL = await uploadToCloudinary(selectedImage);
      if (!uploadedImageURL) {
        alert("Image upload failed. Please try again.");
        setLoading(false);
        return;
      }
    }

    // Construct event data
    const eventData = {
      eventType,
      venue,
      date,
      time,
      description,
      imageURL: uploadedImageURL, // Use uploaded image URL
    };

    console.log("Event Data Submitted:", eventData);
    alert('Event Submitted Successfully!');

    // Reset form fields
    setEventType('');
    setVenue('');
    setDate('');
    setTime('');
    setDescription('');
    setSelectedImage(null);
    setImageURL('');
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Page</h1>

      <form onSubmit={handleSubmit} className="bg-gray-300 p-6 rounded-lg w-full max-w-lg mx-auto">
        <div className="mb-4">
          <label className="block font-medium">Type:</label>
          <input 
            type="text" 
            value={eventType} 
            onChange={(e) => setEventType(e.target.value)} 
            className="w-full p-2 border rounded"
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Venue:</label>
          <input 
            type="text" 
            value={venue} 
            onChange={(e) => setVenue(e.target.value)} 
            className="w-full p-2 border rounded"
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Date:</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            className="w-full p-2 border rounded"
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Time:</label>
          <input 
            type="time" 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
            className="w-full p-2 border rounded"
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Image:</label>
          <input 
            type="file" 
            className="w-full p-2 border rounded" 
            onChange={(e) => setSelectedImage(e.target.files[0])} 
            required
          />
        </div>

        {selectedImage && (
          <div className="mb-4">
            <p className="text-sm text-blue-600">Image ready to upload on submit.</p>
          </div>
        )}

        <div className="mb-4">
          <label className="block font-medium">Description:</label>
          <input 
            type="text" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="w-full p-2 border rounded"
            required 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Page;
