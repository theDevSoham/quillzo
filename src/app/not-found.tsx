import NavBar from "@/components/custom/NavBar";
import TypewriterEffect from "@/components/custom/TypewriterEffect";
import NotfoundAnim from "@/lottie/NotfoundAnim";

const stringToType = `
$ echo "output: $(curl -s $CURRENT_PAGE)"\n
$ output: 404 Page not found. Are you sure you're in the expected zone?\n`;

const NotFound = () => {
  return (
    <main className="w-screen h-screen container mx-auto">
      <section className="w-full h-[80%] flex flex-col justify-center items-center gap-10 whitespace-pre-wrap">
        <div className="w-full max-w-[500px] md:max-h-[350px] max-h-[250px]">
          <NotfoundAnim />
          <TypewriterEffect str={stringToType} />
        </div>
      </section>
    </main>
  );
};

export default NotFound;
