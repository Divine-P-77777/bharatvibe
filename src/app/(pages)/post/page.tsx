export const metadata = {
    title: "Upload | Bharat Vibes",
    description: "Discover hidden gems, cultures, and places of India.",
    keywords: ["India", "Culture", "Travel", "Explore", "Bharat Vibes"],
  };
  
  import ShareContent from './ShareContent ';
  import ServerStatusWrapper from '@/components/ui/ServerStatusWrapper';
  
  export default function SharePage() {
    return (
      <ServerStatusWrapper>
        <ShareContent />
      </ServerStatusWrapper>
    );
  }
  