export const Footer = () => {
  return (
    <div className="w-full py-4 lg:py-8 bg-foreground text-background bg-gradient-to-r from-blue-600 via-blue-400 to-purple-500">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="flex gap-8 flex-col items-start">
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                FindMyFood
              </h2>
              <p className="text-lg max-w-lg leading-relaxed tracking-tight text-background/75 text-left">
                Because finding food shouldn't be hard
              </p>
            </div>
            <div className="flex gap-20 flex-row">
              <div className="flex flex-col text-sm max-w-lg leading-relaxed tracking-tight text-background/75 text-left">
                <p>SCIS1 SR 2-4</p>
                <p>Singapore Management University</p>
                <p>188065</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};