import { signOut } from "next-auth/react";

export default function App() {
  return (
    <div>
      <h1>You are signed in</h1>
      <button onClick={() => void signOut()}>Sign out</button>
    </div>
  );
}
