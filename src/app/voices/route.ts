export async function GET() {
  const voices = [
    {
      id: "1",
      name: "Sarah Chen",
      gender: "female",
      avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b15c?w=150&h=150&fit=crop&crop=face",
      title: "Senior Software Engineer"
    },
    {
      id: "2", 
      name: "David Kim",
      gender: "male",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      title: "Technical Lead"
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      gender: "female",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      title: "HR Manager"
    },
    {
      id: "4",
      name: "Michael Thompson",
      gender: "male",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      title: "Product Manager"
    },
    {
      id: "5",
      name: "Lisa Wang",
      gender: "female", 
      avatarUrl: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
      title: "Data Scientist"
    },
    {
      id: "6",
      name: "James Wilson",
      gender: "male",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", 
      title: "DevOps Engineer"
    },
    {
      id: "7",
      name: "Anna Martinez",
      gender: "female",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      title: "UX Designer"
    },
    {
      id: "8",
      name: "Robert Johnson",
      gender: "male", 
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      title: "Engineering Manager"
    },
    {
      id: "9",
      name: "Jennifer Lee",
      gender: "female",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face", 
      title: "Marketing Director"
    },
    {
      id: "10",
      name: "Alex Chen",
      gender: "male",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      title: "Business Analyst"
    }
  ];

  try {
    return new Response(JSON.stringify(voices), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600", // Cache 1 giờ
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  } catch (error) {
    console.error("Error in voices API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json"
      }
    });
  }
}

// Hỗ trợ OPTIONS method cho CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}