"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { FaSpinner, FaImage, FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";

export default function CreateCampaignPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "",
    goalAmount: "",
    endDate: "",
    description: "",
    coverImage: null,
    imagePreview: null
  });
  
  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        // Redirect to login if not authenticated
        router.push("/login?redirect=/campaigns/create");
      }
    });
    
    return () => unsubscribe();
  }, [router]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };
  
  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({
          ...form,
          coverImage: file,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setSubmitError("You must be logged in to create a campaign");
      return;
    }
    
    setIsLoading(true);
    setSubmitError("");
    
    try {
      // In a real app, you'd upload the image to storage first
      // For simplicity, we'll just store the campaign data
      
      const campaignData = {
        title: form.title,
        category: form.category,
        goalAmount: parseFloat(form.goalAmount),
        endDate: new Date(form.endDate),
        description: form.description,
        createdBy: user.uid,
        creatorName: user.displayName || "Anonymous",
        creatorEmail: user.email,
        createdAt: serverTimestamp(),
        amountRaised: 0,
        backers: 0,
        status: "active"
      };
      
      // Add the campaign to Firestore
      const docRef = await addDoc(collection(db, "campaigns"), campaignData);
      
      // Redirect to the new campaign page
      router.push(`/campaign/${docRef.id}`);
    } catch (error) {
      console.error("Error creating campaign:", error);
      setSubmitError("Failed to create campaign. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // If still checking authentication, show loading
  if (user === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-purple-600 text-4xl" />
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Your Campaign</h1>
      
      {submitError && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campaign Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Campaign Title*
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Give your campaign a clear, attention-grabbing title"
            required
          />
        </div>
        
        {/* Category */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Category*
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Select a category</option>
            <option value="medical">Medical</option>
            <option value="education">Education</option>
            <option value="emergency">Emergency Relief</option>
            <option value="community">Community Project</option>
            <option value="business">Small Business</option>
            <option value="personal">Personal Need</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Goal Amount */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Goal Amount (KSH)*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaMoneyBillWave className="text-gray-400" />
              </div>
              <input
                type="number"
                name="goalAmount"
                value={form.goalAmount}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="10,000"
                min="100"
                required
              />
            </div>
          </div>
          
          {/* End Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              End Date*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaCalendarAlt className="text-gray-400" />
              </div>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>
        </div>
        
        {/* Campaign Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Campaign Description*
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows="6"
            placeholder="Tell your story. Why are you raising funds? How will the money be used? Be specific and heartfelt."
            required
          ></textarea>
        </div>
        
        {/* Cover Image */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Cover Image*
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {form.imagePreview ? (
              <div className="mb-4">
                <img 
                  src={form.imagePreview} 
                  alt="Preview" 
                  className="mx-auto h-48 object-contain"
                />
              </div>
            ) : (
              <FaImage className="mx-auto text-gray-400 text-4xl mb-4" />
            )}
            
            <label className="cursor-pointer bg-purple-100 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-200 transition">
              <span>Choose an image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                required={!form.imagePreview}
              />
            </label>
            <p className="mt-2 text-sm text-gray-500">
              High-quality images increase your chances of success
            </p>
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-70 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Creating campaign...
            </>
          ) : (
            "Create Campaign"
          )}
        </button>
      </form>
    </div>
  );
}