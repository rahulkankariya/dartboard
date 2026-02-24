import { authService } from "@/lib/api-service";

export const orgService = {
  // Initial API: Load existing chart
  getInitialChart: async () => {

    const response = await authService.getHierarchyChart(); 
    
    return response.data || []; // Returns Employee[]
  },

  // Search API: Only called in Modal
  searchUsers: async (query: string) => {
    const response = await authService.getHierarchyUsers(1, 15, query);
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