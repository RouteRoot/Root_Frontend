import Link from "next/link";

type UserCardProps = {
  user?: {
    name: string;
    description: string;
    profileImage: string;
    postCount: number;
    commentCount: number;
  };
};

const mockUser = {
  name: "Guest",
  description: "Community user",
  profileImage: "/bubu11.png",
  postCount: 2,
  commentCount: 2,
};

function UserActionCard() {
  return (
    <>
      <Link href="/community/write">Write</Link>
      <Link href="/community/likes">Likes</Link>
    </>
  );
}

export default function UserCard({ user = mockUser }: UserCardProps) {
  return (
    <>
      <Link href="/mypage">My page</Link>
      <Link href="/community/my-posts">My posts: {user.postCount}</Link>
      <Link href="/community/my-comments">My comments: {user.commentCount}</Link>
      <UserActionCard />
      <pre>{JSON.stringify({ user }, null, 2)}</pre>
    </>
  );
}
