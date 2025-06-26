import { useAuth } from "./useAuth";
import { useEmailAuth } from "./useEmail.auth";
import { useOAuth } from "./useOauth.auth";

export const useSupabaseAuth = () => {
  const { getUserInfo, logout } = useAuth();
  const { login, signUp } = useEmailAuth();
  const { loginWithGoogle, loginWithKakao } = useOAuth();

  return {
    login,
    signUp,
    getUserInfo,
    logout,
    loginWithKakao,
    loginWithGoogle,
  };
};
