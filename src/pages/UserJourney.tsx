import { useState } from 'react';
import { UserJourney as UserJourneyComponent } from '../components/UserJourney';
import { EnhancedAiChat } from '../components/EnhancedAiChat';

export function UserJourney() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <UserJourneyComponent />
      </div>
      <EnhancedAiChat
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        context="journey"
      />
    </div>
  );
}