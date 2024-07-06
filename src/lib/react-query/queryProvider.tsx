import { QueryClient, QueryClientProvider, useMutation, /*useQueryClient*/ } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { SignInAccount, createUserAccount } from '../appwrite/auth'
import { /*INewPost*/ INewUser, /*IUpdatePost*/ } from '@/types'



const queryClient = new QueryClient() 

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      SignInAccount(user),
  });
};

