"use server";
import { cookies, headers } from "next/headers";
import { BASE_API } from "./API";

export interface ErrorResponse {
  error: boolean;
  status?: number;
  statusText?: string;
  message?: string;
  data?: any;
}

export async function fetchService(url: string, detail?: RequestInit): Promise<any | ErrorResponse> {
  let token = (await cookies()).get('token')?.value;
  
  // Build headers more carefully
  const baseHeaders: Record<string, string> = {};
  
  // Add authorization if token exists
  if (token) {
    baseHeaders.Authorization = `Bearer ${token}`;
  }
  
  // Add existing headers from detail
  if (detail?.headers) {
    Object.assign(baseHeaders, detail.headers);
  }
  
  // Only add Content-Type if not already set and body is not FormData
  if (detail?.body && !(detail.body instanceof FormData)) {
    if (!baseHeaders['Content-Type'] && !baseHeaders['content-type']) {
      baseHeaders['Content-Type'] = 'application/json';
    }
  }
  
  const detail_with_token = {
    ...detail,
    headers: baseHeaders
  };
  
  console.log(`\n----> API-Request: ${BASE_API}${url}`);
  
  if (detail_with_token.method && detail_with_token.method !== 'GET') {
    console.log(`Body: ${detail_with_token.body}`);
  }
  
  try {
    const response = await fetch(`${BASE_API}${url}`, detail_with_token);
    
    console.log(`----> API-Response Status: ${response.status}`);
    
    if (response.ok) {
      let result: any;
      
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          result = await response.json();
        } else {
          result = {};
        }
      } catch (error) {
        console.error('Failed to parse JSON:', error);
        result = {};
      }
      
      return result;
      
    } else {
      // Handle error responses
      let errorData: any = {};
    
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        }
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      
      console.log(`----> API-Error Response:`, errorData);
      
      // Return error information
      return {
        error: true,
        status: response.status,
        statusText: response.statusText,
        message: errorData.message || `Request failed with status ${response.status}`,
        data: errorData
      };
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return {
      error: true,
      message: 'Network error or server unavailable',
      originalError: error
    };
  }
}