'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const categories = [
  "TECHNICAL", "CULTURAL", "SPORTS", "SOCIAL", "ACADEMIC", 
  "WORKSHOP", "SEMINAR", "INDUSTRIAL_VISIT", "PROJECT_EXHIBITION", "OUTREACH", "ORIENTATION"
];

const GalleryAdmin = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [category, setCategory] = useState('TECHNICAL');
  const [carousel, setCarousel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setGalleryItems(data);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
    }
  };

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
      return data.secure_url;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      let uploadedImageURL = '';
      if (photo) {
        uploadedImageURL = await uploadToCloudinary(photo);
        if (!uploadedImageURL) {
          setError("Image upload failed. Please try again.");
          setLoading(false);
          return;
        }
      }

      const galleryData = {
        title,
        description,
        photoUrl: uploadedImageURL,
        category,
        carousel,
      };

      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryData),
      });

      if (!response.ok) {
        throw new Error('Failed to save gallery item.');
      }

      setSuccessMessage('Gallery Item Submitted Successfully!');
      setTitle('');
      setDescription('');
      setPhoto(null);
      setCategory('TECHNICAL');
      setCarousel(false);
      fetchGallery();
    } catch (error) {
      setError(error.message || 'Failed to save gallery item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Gallery Item</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="mb-6 border-green-600">
              <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />

            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />

            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label>Carousel</Label>
            <input type="checkbox" checked={carousel} onChange={() => setCarousel(!carousel)} />

            <Label>Image</Label>
            <Input type="file" onChange={(e) => setPhoto(e.target.files[0])} required />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Gallery Item"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GalleryAdmin;
