import {
  Project,
  Task,
  TaskAssignment,
  TaskDependency,
  Team,
  TeamMember,
  User,
} from '@/app/types/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logOut, setCredentials } from './authSlice'
import { RootState } from '@/app/redux'
import dotenv from 'dotenv'

dotenv.config()

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth = async (
  args: any,
  api: any,
  extraOptions: any
): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 403) {
    console.log('sending refresh token')
    const refreshResult = await baseQuery(
      { url: '/api/refresh/token', method: 'GET', credentials: 'include' },
      api,
      extraOptions
    )

    if (refreshResult?.data) {
      const newToken = (refreshResult?.data as { accessToken: string })
        ?.accessToken
      const user = (api.getState() as RootState).auth.user

      if (user && newToken) {
        api.dispatch(setCredentials({ user, token: newToken }))
        result = await baseQuery(args, api, extraOptions) // Retry original query
      } else {
        console.error('User or new token is missing after refresh')
        api.dispatch(logOut())
      }
    } else {
      console.error('Failed to refresh token')
      api.dispatch(logOut())
    }
  }

  return result
}

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: 'api',
  tagTypes: ['Projects', 'Tasks', 'Teams', 'Users'],

  endpoints: (build) => ({
    // User Endpoints
    getUsers: build.query<User[], void>({
      query: () => '/api/users',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ userId }) => ({
                type: 'Users' as const,
                id: userId,
              })),
              { type: 'Users' as const, id: 'LIST' },
            ]
          : [{ type: 'Users' as const, id: 'LIST' }],
    }),
    getAuthenticatedUser: build.query<{ token: string; user: User }, void>({
      query: () => ({
        url: '/api/users/authenticated',
        method: 'POST', // Should this be GET?
      }),
      providesTags: (result) =>
        result ? [{ type: 'Users', id: result.user.userId }] : [],
    }),

    // Auth Endpoints
    signUpUser: build.mutation<
      { token: string; user: User },
      { username: string; email: string; password: string }
    >({
      query: ({ username, email, password }) => ({
        url: '/api/auth/signup',
        method: 'POST',
        body: { username, email, password },
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    login: build.mutation<
      { token: string; user: User },
      { email: string; password: string }
    >({
      query: ({ email, password }) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: { email, password },
      }),
      // No invalidation needed, credentials set in component/slice
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST',
      }),
      // Invalidate everything on logout? Or handled by clearing state?
      // Let's invalidate common lists for safety
      invalidatesTags: [
        { type: 'Projects', id: 'LIST' },
        { type: 'Tasks', id: 'LIST' },
        { type: 'Teams', id: 'LIST' },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    // Project Endpoints
    getProjects: build.query<Project[], void>({
      query: () => '/api/projects',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Projects' as const, id })),
              { type: 'Projects' as const, id: 'LIST' },
            ]
          : [{ type: 'Projects' as const, id: 'LIST' }],
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: '/api/projects',
        method: 'POST',
        body: project,
      }),
      invalidatesTags: [{ type: 'Projects', id: 'LIST' }],
    }),
    getProjectById: build.query<Project, { projectId: string }>({
      query: ({ projectId }) => `/api/projects/${projectId}`,
      providesTags: (result, error, { projectId }) => [
        { type: 'Projects', id: projectId },
      ],
    }),
    deleteProject: build.mutation<Project, { projectId: string }>({
      query: ({ projectId }) => ({
        url: `/api/projects/${projectId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: 'Projects', id: projectId },
        { type: 'Projects', id: 'LIST' },
      ],
    }),

    // Task Endpoints
    getUserTasks: build.query<Task[], void>({
      query: () => '/api/tasks/',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Tasks' as const, id })),
              { type: 'Tasks' as const, id: 'LIST' },
            ]
          : [{ type: 'Tasks' as const, id: 'LIST' }],
    }),
    getProjectTasks: build.query<Task[], { projectId: string }>({
      query: ({ projectId }) => `/api/tasks/${projectId}`,
      providesTags: (result, error, { projectId }) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Tasks' as const, id })),
              { type: 'Tasks' as const, id: `LIST-${projectId}` },
            ]
          : [{ type: 'Tasks' as const, id: `LIST-${projectId}` }],
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: `/api/tasks/${task.projectId}`,
        method: 'POST',
        body: task,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'Tasks', id: `LIST-${result.projectId}` }] : [],
    }),
    updateTaskStatus: build.mutation<Task, { taskId: string; status: string }>({
      query: ({ taskId, status }) => ({
        url: `/api/tasks/${taskId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: 'Tasks', id: taskId },
      ],
    }),
    deleteTask: build.mutation<Task, { taskId: string }>({
      query: ({ taskId }) => ({
        url: `/api/tasks/${taskId}`,
        method: 'DELETE',
      }),
      // Need projectId to invalidate specific list, invalidating general list for now
      invalidatesTags: (result, error, { taskId }) => [
        { type: 'Tasks', id: taskId },
        { type: 'Tasks', id: 'LIST' },
      ],
    }),
    getProjectDependencies: build.query<
      TaskDependency[],
      { projectId: string }
    >({
      query: ({ projectId }) => `/api/projects/${projectId}/tasks/dependencies`,
      // Dependencies might change when tasks change, provide task list tag?
      providesTags: (result, error, { projectId }) => [
        { type: 'Tasks', id: `LIST-${projectId}` },
      ],
    }),

    // Task Assignment Endpoints
    assignUserToTask: build.mutation<
      TaskAssignment,
      { taskId: string; userId: string }
    >({
      query: ({ taskId, userId }) => ({
        url: `/api/tasks/assign/task`,
        method: 'POST',
        body: { taskId, userId },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: 'Tasks', id: taskId },
      ], // Invalidate task details to show updated assignees
    }),
    removeUserFromTask: build.mutation<
      TaskAssignment,
      { taskId: string; userId: string }
    >({
      query: ({ taskId, userId }) => ({
        url: `/api/tasks/${taskId}/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: 'Tasks', id: taskId },
      ], // Invalidate task details
    }),
    getTaskAssignees: build.query<TeamMember[], { taskId: string }>({
      query: ({ taskId }) => `/api/tasks/${taskId}/assignees`,
      providesTags: (result, error, { taskId }) =>
        result
          ? [
              ...result.map(({ userId }) => ({
                type: 'Users' as const,
                id: userId,
              })),
              { type: 'Users' as const, id: `TASK-ASSIGNEES-${taskId}` },
            ]
          : [{ type: 'Users' as const, id: `TASK-ASSIGNEES-${taskId}` }],
    }),

    // Team Endpoints
    getUserTeams: build.query<Team[], void>({
      query: () => '/api/teams',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Teams' as const, id })),
              { type: 'Teams' as const, id: 'LIST' },
            ]
          : [{ type: 'Teams' as const, id: 'LIST' }],
    }),
    addTeamMember: build.mutation<
      User,
      { teamId: string; userId: string; role?: string }
    >({
      query: ({ teamId, userId, role }) => ({
        url: '/api/teams/members',
        method: 'POST',
        body: { teamId, userId, role },
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: 'Teams', id: teamId },
      ], // Invalidate specific team details
    }),
    removeTeamMember: build.mutation<User, { teamId: string; userId: string }>({
      query: ({ teamId, userId }) => ({
        url: `/api/teams/${teamId}/members/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: 'Teams', id: teamId },
      ], // Invalidate specific team details
    }),
    updateTeamMemberRole: build.mutation<
      User,
      { teamId: string; userId: string; newRole: string }
    >({
      query: ({ teamId, userId, newRole }) => ({
        url: `/api/teams/${teamId}/members/${userId}/role`,
        method: 'PATCH',
        body: { newRole },
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: 'Teams', id: teamId },
      ], // Invalidate specific team details
    }),
    getProjectTeamMembers: build.query<TeamMember[], { projectId: string }>({
      query: ({ projectId }) => `/api/projects/${projectId}/team`,
      providesTags: (result, error, { projectId }) =>
        result
          ? [
              ...result.map(({ userId }) => ({
                type: 'Users' as const,
                id: userId,
              })),
              { type: 'Users' as const, id: `PROJECT-TEAM-${projectId}` },
            ]
          : [{ type: 'Users' as const, id: `PROJECT-TEAM-${projectId}` }],
    }),
    updateUser: build.mutation<
      User,
      { userId: number; username?: string; email?: string }
    >({
      query: ({ userId, ...patch }) => ({
        url: `/api/users/${userId}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'Users', id: userId },
      ],
    }),
  }),
})

export const {
  useGetTaskAssigneesQuery,
  useAssignUserToTaskMutation,
  useRemoveUserFromTaskMutation,
  useGetProjectTeamMembersQuery,
  useUpdateTeamMemberRoleMutation,
  useRemoveTeamMemberMutation,
  useAddTeamMemberMutation,
  useGetUsersQuery,
  useGetUserTeamsQuery,
  useGetUserTasksQuery,
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetProjectTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useGetProjectByIdQuery,
  useDeleteTaskMutation,
  useDeleteProjectMutation,
  useGetProjectDependenciesQuery,
  useLogoutMutation,
  useLoginMutation,
  useGetAuthenticatedUserQuery,
  useSignUpUserMutation,
  useUpdateUserMutation,
} = api
