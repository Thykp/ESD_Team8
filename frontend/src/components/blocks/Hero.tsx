import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Hero() {
    return (
      <div className="relative overflow-hidden min-h-screen flex items-center justify-center py-24 lg:py-32">
        {/* Gradients */}
        <div
          aria-hidden="true"
          className="flex absolute -top-96 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-gradient-to-r from-background/50 to-background blur-3xl w-[25rem] h-[44rem] rotate-[-60deg]" />
          <div className="bg-gradient-to-tl blur-3xl w-[90rem] h-[50rem] rounded-full origin-top-left -rotate-12 from-primary-foreground via-primary-foreground to-background" />
        </div>
        {/* Content */}
        <div className="relative z-10">
          <div className="container py-10 lg:py-16">
            <div className="max-w-2xl text-center mx-auto">
              <div className="mt-5 max-w-2xl">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Finding Food, Figured Out
                </h1>
              </div>
              <div className="mt-5 max-w-3xl">
                <p className="text-xl text-muted-foreground">
                  Over 20 partner restaurants within and around SMU's campus. <br />
                  With more being added everyday, there's always something good to eat.
                </p>
              </div>

              <div className="mt-8 gap-3 flex justify-center">
                <Link to="/register">
                  <Button size={"lg"} className="bg-gradient-to-r from-blue-600 via-blue-400 to-purple-500">Get started</Button>
                </Link>
                <a href="#about">
                  <Button size={"lg"} variant={"outline"}>
                    Learn more
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  