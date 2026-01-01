import { Icon } from '@/components/ui';
import { authModel } from '@/redux/auth';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export const UserPage = () => {
  const dispatch = useAppDispatch();

  const { displayName, email, photoURL } = useAppSelector(
    authModel.selectors.selectUserInfoWithError,
  );

  const handleLogOut = () => {
    dispatch(authModel.actions.logOut());
  };

  return (
    <div className="w-full px-4 py-3">
      <h1 className="font-bold text-2xl mb-6">User info</h1>
      {photoURL && (
        <div className="mb-2 border-2 border-gray-500 inline-block rounded-full overflow-hidden">
          <img className="w-20 h-20" src={photoURL} />
        </div>
      )}
      <p className="mb-2">
        <span className="font-medium">Name:</span> {displayName}
      </p>
      <p className="mb-6">
        <span className="font-medium">Email:</span> {email}
      </p>
      <button
        onClick={handleLogOut}
        className="flex items-center gap-1 border-2 py-2 px-3 rounded-md transition-colors duration-300 border-gray-400 hover:border-blue-500 hover:text-blue-500"
      >
        <Icon name="logout" />
        <p className="font-medium">Sign Out</p>
      </button>
    </div>
  );
};
