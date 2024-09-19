"use client";
import NavBar from "@/components/custom/NavBar";
import Image from "next/image";
import notFound from "@/public/images/notfound.webp";
import Typewriter from "typewriter-effect";

const stringToType = `$ echo "Page not found"\n
$ echo "Are you sure you're in the right place?\n
$ echo "Let's check"\n
$ curl $CURRENT_PAGE\n
$ 404\n`;

const NotFound = () => {
  return (
    <main className="w-screen h-screen container mx-auto">
      <NavBar />
      <section className="w-full h-full flex flex-col justify-center items-center gap-10 whitespace-pre-wrap">
        <Image src={notFound} alt="notfound" width={500} height={500} />
        <Typewriter
          onInit={(typewriter) => {
            typewriter
              .typeString(stringToType)
              .pause()
              .start();
          }}
        />
      </section>
    </main>
  );
};

export default NotFound;
