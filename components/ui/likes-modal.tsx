import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getApiUrl } from "@/config";

interface UserLike {
  username: string;
  name: string;
  avatar: string;
}

interface LikesModalProps {
  open: boolean;
  onClose: () => void;
  likes: string[]; // array of usernames
}

const API_BASE_URL = getApiUrl();

export const LikesModal: React.FC<LikesModalProps> = ({ open, onClose, likes }) => {
  const [users, setUsers] = useState<UserLike[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || likes.length === 0) {
      setUsers([]);
      return;
    }
    setLoading(true);
    // Fetch user details for each username
    Promise.all(
      likes.map(async (username) => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/users/username/${username}`);
          if (!res.ok) throw new Error();
          const data = await res.json();
          return {
            username: data.data.user.username,
            name: data.data.user.name,
            avatar: data.data.user.avatar || "/placeholder.svg",
          };
        } catch {
          return {
            username,
            name: username,
            avatar: "/placeholder.svg",
          };
        }
      })
    ).then((users) => {
      setUsers(users);
      setLoading(false);
    });
  }, [open, likes]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Likes</DialogTitle>
          <DialogClose asChild>
            <button className="absolute right-4 top-4 text-2xl" onClick={onClose}>&times;</button>
          </DialogClose>
        </DialogHeader>
        <div className="divide-y divide-muted max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : users.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No likes yet</div>
          ) : (
            users.map((user) => (
              <div key={user.username} className="flex items-center gap-4 py-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{user.username}</div>
                  <div className="text-sm text-muted-foreground">{user.name}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 