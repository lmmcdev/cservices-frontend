import { useMsal } from '@azure/msal-react';

export const useGraphEmailCheck = () => {
  const { instance, accounts } = useMsal();

  const verifyEmailExists = async (email) => {
    if (!email || !email.includes('@')) return false;

    try {
      const response = await instance.acquireTokenSilent({
        scopes: ['User.ReadBasic.All'],
        account: accounts[0],
      });

      const res = await fetch(`https://graph.microsoft.com/v1.0/users/${email}`, {
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
      });

      return res.ok;
    } catch (err) {
      console.error('Error verifying email in Graph:', err);
      return false;
    }
  };

  return { verifyEmailExists };
};
