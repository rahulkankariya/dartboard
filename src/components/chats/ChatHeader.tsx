import { User } from "@/types/chat";

export default function ChatHeader({ user }: { user: User }) {
  return (
    <div className="p-4 border-b border-app-border flex items-center justify-between bg-app-bg/80 backdrop-blur-md sticky top-0 z-10">
      <div>
        <h2 className="text-sm font-bold text-app-accent uppercase tracking-widest">
          {user.fullName}
        </h2>
        
      </div>
    </div>
  );
}