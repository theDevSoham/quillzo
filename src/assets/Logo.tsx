import Image from "next/image";

export default function Logo<T>(props: T) {
  return (
    <div {...props}>
      <Image src="/images/logo.webp" alt="logo" width={500} height={500} />
    </div>
  );
}
