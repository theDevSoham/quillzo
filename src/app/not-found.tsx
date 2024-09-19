"use client";
import NavBar from "@/components/custom/NavBar";
import Typewriter from "typewriter-effect";
import NotfoundAnim from "@/lottie/NotfoundAnim";

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
        <div className="w-full max-w-[500px]">
          <NotfoundAnim />
        </div>
        <Typewriter
          onInit={(typewriter) => {
            typewriter.typeString(stringToType).pause().start();
          }}
        />
      </section>
    </main>
  );
};

export default NotFound;
