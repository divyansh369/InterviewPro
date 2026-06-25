import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { sessionApi } from '../api/sessions';

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createSession"],
    mutationFn: sessionApi.createSession,
    onSuccess: () => {
      toast.success("Session created successfully!");
      // Active sessions list refresh to show the newly created session
      queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to create room"),
  });
};

export const useActiveSessions = () => {
  return useQuery({
    queryKey: ["activeSessions"],
    queryFn: sessionApi.getActiveSessions,
  });
};

export const useMyRecentSessions = () => {
  return useQuery({
    queryKey: ["my-recent-sessions"],
    queryFn: sessionApi.getMyRecentSessions,
  });
};

export const useSessionById = (id) => {
  return useQuery({
    queryKey: ["session", id],
    queryFn: () => sessionApi.getSessionById(id),
    enabled: !!id,
    refetchInterval: 5000,
  });
};

export const useJoinSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["joinSession"],
    mutationFn: sessionApi.joinSession,
    onSuccess: () => {
      toast.success("Joined session successfully!");
      queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to join session"),
  });
};

export const useEndSession = () => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationKey: ["endSession"],
    mutationFn: sessionApi.endSession,
    onSuccess: () => {
      toast.success("Session ended successfully!");
      queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
      queryClient.invalidateQueries({ queryKey: ["myRecentSessions"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to end session"),
  });
};