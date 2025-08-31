// // services/enquiryService.ts
// import { transformEnquiries, transformEnquiry } from "@/utils/transform";
// import { Enquiry } from "@/types";

// const BASE_URL = "https://cobbler-backend-1.onrender.com/api/enquiry";

// // Get all
// export async function fetchEnquiries(): Promise<Enquiry[]> {
//   const res = await fetch(BASE_URL);
//   const data = await res.json();
//   return transformEnquiries(data.response || []);
// }

// // Add new
// export async function addEnquiry(payload: Partial<Enquiry>): Promise<Enquiry> {
//   const res = await fetch(BASE_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       name: payload.customerName,
//       phone: payload.phone,
//       location: payload.address,
//       message: payload.message,
//       inquiry_type: payload.inquiryType,
//       product: payload.product,
//       quantity: payload.quantity,
//     }),
//   });
//   const data = await res.json();
//   return transformEnquiry(data.response);
// }

// // Update
// export async function updateEnquiry(id: number, updates: Partial<Enquiry>): Promise<Enquiry> {
//   const res = await fetch(`${BASE_URL}/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       name: updates.customerName,
//       phone: updates.phone,
//       location: updates.address,
//       message: updates.message,
//       inquiry_type: updates.inquiryType,
//       product: updates.product,
//       quantity: updates.quantity,
//       status: updates.status,
//     }),
//   });
//   const data = await res.json();
//   return transformEnquiry(data.response);
// }

// services/enquiryService.ts
import { transformEnquiries, transformEnquiry } from "@/utils/transform";
import { Enquiry } from "@/types";

const BASE_URL = "https://cobbler-backend-1.onrender.com/api/enquiry";

// Get all enquiries
export async function fetchEnquiries(): Promise<Enquiry[]> {
  try {
    const res = await fetch(BASE_URL);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Handle different response structures
    const enquiriesData = data.response || data.data || data || [];
    
    // Ensure we have an array
    if (!Array.isArray(enquiriesData)) {
      console.warn('API did not return an array:', enquiriesData);
      return [];
    }
    
    return transformEnquiries(enquiriesData);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    throw new Error('Failed to fetch enquiries from server');
  }
}

// Add new enquiry
export async function addEnquiry(payload: Partial<Enquiry>): Promise<Enquiry> {
  try {
    const requestBody = {
      name: payload.customerName,
      phone: payload.phone,
      location: payload.address,
      message: payload.message,
      inquiry_type: payload.inquiryType,
      product: payload.product,
      quantity: payload.quantity,
    };

    console.log('Sending request:', requestBody);

    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Server error: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    console.log('Response data:', data);
    
    // Handle different response structures
    const responseData = data.response || data.data || data;
    
    if (!responseData) {
      throw new Error('No data returned from server');
    }

    return transformEnquiry(responseData);
  } catch (error) {
    console.error('Error adding enquiry:', error);
    throw error; // Re-throw to be handled by the component
  }
}

// Update enquiry (for future use)
export async function updateEnquiry(id: number, updates: Partial<Enquiry>): Promise<Enquiry> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: updates.customerName || updates.name,
        phone: updates.phone || updates.number,
        location: updates.address || updates.location,
        message: updates.message,
        inquiry_type: updates.inquiryType,
        product: updates.product,
        quantity: updates.quantity,
        status: updates.status,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const responseData = data.response || data.data || data;
    
    return transformEnquiry(responseData);
  } catch (error) {
    console.error('Error updating enquiry:', error);
    throw error;
  }
}
