import { StarLazy } from "../star-lazy/star-lazy";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Hello World</h1>
      <StarLazy />
      <Link href="/about-us">about us</Link>
    </>
  );
}
