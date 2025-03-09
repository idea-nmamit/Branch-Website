"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AchievementsForm = ({ onAchievementAdded }) => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [category, setCategory] = useState("");
  const [rank, setRank] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [researchLink, setResearchLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    // Required fields check
    if (!name || !title || !description || !photoUrl || !category) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const achievementData = {
        name,
        title,
        description,
        photoUrl,
        category,
        rank: rank ? Number(rank) : null,
        githubUrl: githubUrl || null,
        linkedinUrl: linkedinUrl || null,
        instagramUrl: instagramUrl || null,
        researchLink: researchLink || null,
      };

      const response = await fetch("/api/api-achievements-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(achievementData),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit achievement. Status: ${response.status}`);
      }

      setSuccessMessage("Achievement Submitted Successfully!");

      // Reset form
      setName("");
      setTitle("");
      setDescription("");
      setPhotoUrl("");
      setCategory("");
      setRank("");
      setGithubUrl("");
      setLinkedinUrl("");
      setInstagramUrl("");
      setResearchLink("");

      if (onAchievementAdded) {
        onAchievementAdded();
      }
    } catch (error) {
      console.error("Error submitting achievement:", error);
      setError(error.message || "Failed to submit achievement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Add Achievement</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-6 border-green-600 dark:border-green-400">
            <AlertDescription className="text-green-600 dark:text-green-400">{successMessage}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photoUrl">Photo URL *</Label>
            <Input id="photoUrl" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} required />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={category}
              onValueChange={setCategory}
              required
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="competition">Competition</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rank">Rank (Optional)</Label>
            <Input id="rank" type="number" value={rank} onChange={(e) => setRank(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL (Optional)</Label>
            <Input id="githubUrl" type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL (Optional)</Label>
            <Input id="linkedinUrl" type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagramUrl">Instagram URL (Optional)</Label>
            <Input id="instagramUrl" type="url" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="researchLink">Research Link (Optional)</Label>
            <Input id="researchLink" type="url" value={researchLink} onChange={(e) => setResearchLink(e.target.value)} />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Achievement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AchievementsForm;
