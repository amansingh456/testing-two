import { Suspense } from "react";
import CheckHome from "./components/Home";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckHome />
    </Suspense>
  );
}
//aman
