import { useQuery } from "@tanstack/react-query";
import { getComments, getSprints, getTasks, getUsers } from "../api/taskApi";

export function useTasks() { return useQuery({ queryKey: ["tasks"], queryFn: getTasks }); }
export function useUsers() { return useQuery({ queryKey: ["users"], queryFn: getUsers }); }
export function useSprints() { return useQuery({ queryKey: ["sprints"], queryFn: getSprints }); }
export function useComments(taskId?: number) { return useQuery({ queryKey: ["comments", taskId ?? "all"], queryFn: () => getComments(taskId) }); }
