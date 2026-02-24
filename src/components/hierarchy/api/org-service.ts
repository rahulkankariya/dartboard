import { authService } from "@/lib/api-service";

export const orgService = {
  // Initial API: Load existing chart
  getInitialChart: async () => {

    const response = await authService.getHierarchyChart(); 
    
    return response.data || []; // Returns Employee[]
  },

searchUsers: async (query: string, page: number = 1) => {
  const response = await authService.getHierarchyUsers(page, 10, query);
  
  // Return the users array from the response
  return response?.data?.users || [];
},
  
  addMember: async (userId: string, managerId: string) => {
    return await authService.addHierarchyMember({ userId, managerId });
  },

  
  editMember: async (id: string, managerId: string) => {
    return await authService.editHierarchyMember({ id, managerId });
  },

  
  deleteMember: async (id: string) => {
    return await authService.deleteHierarchyMember({ id });
  }
};