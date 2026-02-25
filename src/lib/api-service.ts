import { apiRequest } from "./api-client";
import { AuthResponse } from "@/types/auth";

export const authService = {
  async login(payload: Record<string, any>): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/login", {
      method: "POST",
      data: payload,
    });
  },

  async signup(payload: Record<string, any>): Promise<AuthResponse> {
    return apiRequest<AuthResponse>(" /register", {
      method: "POST",
      data: payload,
    });
  },

  async getHierarchyUsers(
    page: number = 1,
    limit: number = 10,
    search: string = "",
  ): Promise<any> {
    const token = getCookie("socket-token");
    if (!token) return;

    // Construct query parameters
    const query = `?start=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;

    return apiRequest(`/hierarchy/user-list${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": "123456789abcdef", // Added from your curl example
      },
    });
  },
  async getHierarchyChart(): Promise<any> {
    const token = getCookie("socket-token");
    if (!token) throw new Error("No auth token found");

    return apiRequest("/hierarchy/chart", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  async addHierarchyMember(payload: {
    userId: string;
    managerId: string;
  }): Promise<any> {
    const token = getCookie("socket-token");
    return apiRequest("/hierarchy/", {
      method: "POST",
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
 async editHierarchyMember(payload: { id: string; managerId: string,userId:string }): Promise<any> {
  console.log("payload",payload)
  const token = getCookie("socket-token");
  // Pass ID in the URL, pass managerId in the body
  return apiRequest(`/hierarchy/${payload.id}`, {
    method: "PUT",
    data: { 
      managerId: payload.managerId,
      userId:payload.userId
     }, 
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
},
async deleteHierarchyMember(payload: { id: string }): Promise<any> {
  const token = getCookie("socket-token");
  // Pass ID in the URL
  return apiRequest(`/hierarchy/${payload.id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
},
};
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};
