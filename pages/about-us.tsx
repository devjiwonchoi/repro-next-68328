import { StarLazy } from "../star-lazy/star-lazy";
import { Star } from "../star/star";
import Link from "next/link";

export default function Home() {
  return (
    <>
      About us: <Star />
      <Link href="/">Back to home</Link>
      <StarLazy />
    </>
  );
}
