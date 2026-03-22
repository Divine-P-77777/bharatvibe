export const metadata = {
    title: "Login & Sign Up Page | Bharat Vibes",
    description: "Register now in Bharat Vibes",
    keywords: [
      "User", "Authentication", "Bharat Vibes"
    ],
  };
  
  import UserAuth from './UserAuth';
  import ServerStatusWrapper from '@/components/ui/ServerStatusWrapper';
  
  export default function About() {
    return (
      <ServerStatusWrapper>
        <UserAuth />
      </ServerStatusWrapper>
    );
  }
  