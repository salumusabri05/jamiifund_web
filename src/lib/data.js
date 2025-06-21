// lib/data.js
export const campaigns = [
  {
    id: "school-roof",
    title: "Repair Mbeya Primary School Roof",
    description:
      "Help 300 students study safely by fixing classrooms damaged by heavy rains.",
    raised: 850000,
    goal: 1200000,
    category: "Education",
    featured: true,
    createdBy: {
      name: "Juma Mkwawa",
      avatar: "/avatars/juma.jpg", // Optional for future use
    },
    donorCount: 42,
    daysLeft: 15,
    dateCreated: "2025-05-10T08:00:00Z",
    location: "Mbeya, Tanzania",
    updates: [
      {
        date: "2025-06-01T10:30:00Z",
        content:
          "We've secured a contractor who will begin work next week!",
      },
    ],
    gallery: [], // For future image support
  },
  {
    id: "hospital-beds",
    title: "Buy New Maternity Beds for Mwanza Health Center",
    description:
      "Provide expecting mothers with clean, safe beds and improve delivery outcomes.",
    raised: 2100000,
    goal: 5000000,
    category: "Healthcare",
    featured: false,
    createdBy: {
      name: "Dr. Sarah Kimaro",
      avatar: "/avatars/sarah.jpg", // Optional for future use
    },
    donorCount: 78,
    daysLeft: 30,
    dateCreated: "2025-05-25T14:20:00Z",
    location: "Mwanza, Tanzania",
    updates: [],
    gallery: [],
  },
  {
    id: "community-garden",
    title: "Start a Community Garden in Arusha",
    description:
      "Create a sustainable food source and gathering place for our neighborhood.",
    raised: 340000,
    goal: 800000,
    category: "Community",
    featured: true,
    createdBy: {
      name: "Maria Ngeleja",
      avatar: "/avatars/maria.jpg", // Optional for future use
    },
    donorCount: 24,
    daysLeft: 45,
    dateCreated: "2025-06-01T09:15:00Z",
    location: "Arusha, Tanzania",
    updates: [
      {
        date: "2025-06-10T16:00:00Z",
        content:
          "We've identified the perfect plot of land! Now working on securing permission.",
      },
    ],
    gallery: [],
  },
];
