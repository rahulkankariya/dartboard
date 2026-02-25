import { authService } from "@/lib/api-service";

export const orgService = {
  getInitialChart: async () => {
    const response = await authService.getHierarchyChart();
    return response.data || [];
  },

  searchUsers: async (query: string, page: number = 1) => {
    const response = await authService.getHierarchyUsers(page, 10, query);
    return response?.data?.users || [];
  },

  addMember: async (userId: string, managerId: string) => {
    return await authService.addHierarchyMember({ userId, managerId });
  },

  editMember: async (id: string, managerId: string, userId: string) => {
    return await authService.editHierarchyMember({ id, managerId, userId });
  },

  deleteMember: async (id: string) => {
    return await authService.deleteHierarchyMember({ id });
  },
};
