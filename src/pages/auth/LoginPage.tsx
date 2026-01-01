import { Icon } from '@/components/ui';
import { authModel } from '@/redux/auth';
import { useAppDispatch } from '@/redux/hooks';

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const handleSignIn = () => {
    dispatch(authModel.actions.signInWithPopup());
  };
  return (
    <div className="w-full py-3 px-4 mt-[30vh] text-center">
      <h1 className="font-bold text-2xl mb-6">Login</h1>
      <button
        onClick={handleSignIn}
        className="mx-auto flex items-center gap-1 border-2 py-2 px-3 rounded-md transition-colors duration-300 border-gray-400 hover:border-blue-500 hover:text-blue-500"
      >
        <Icon name="google" />
        <p className="font-medium">Sign In with Google</p>
      </button>
    </div>
  );
};
