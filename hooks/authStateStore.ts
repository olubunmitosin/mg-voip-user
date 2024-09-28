import { AuthStateProps, UserProps } from '@/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStateStore = create<AuthStateProps>()(
  persist(
    (set) => ({
      access_token: '',
      refresh_token: '',
      token_type: 'Bearer',
      expires_at: '',
      user: null,
      layoutSize: 'lg',
      addToken: (token: string, refresh_token: string, token_type: string, expires_at: string) => set({
         access_token: token, 
         refresh_token: refresh_token,
         token_type: token_type,
         expires_at: expires_at,
        }),
      removeToken: () => set({
        access_token: '',
        refresh_token: '',
        token_type: 'Bearer',
        expires_at: '',
        user: null,
      }),
      addUser: (user: UserProps) => set({
        user: user
      }),
      toggleItem: (size: string) => set((state) => ({
        layoutSize: size
      })),
    }),
    {
      name: 'auth-user-store',
      storage: createJSONStorage(() => sessionStorage)
    },
  ),
)