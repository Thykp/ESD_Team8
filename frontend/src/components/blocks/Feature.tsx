import { CreditCard, Clock, Sparkle } from "lucide-react";

const Feature= () => {
  return (
    <section className="min-h-screen flex items-center justify-center py-24 lg:py-32 px-24">
      <div className="container">
        <p className="mb-4 text-sm text-muted-foreground lg:text-base">
          Why FindMyFood?
        </p>
        <h2 className="text-3xl font-medium lg:text-4xl">Here's how we make food ordering effortless</h2>
        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-3">
          <div className="rounded-lg bg-accent p-5">
            <span className="mb-8 flex size-12 items-center justify-center rounded-full bg-background">
              <CreditCard className="size-6" />
            </span>
            <h3 className="mb-2 text-xl font-medium">Single online ordering platform</h3>
            <p className="leading-7 text-muted-foreground">
              With universal payment processing using Stripe, you no longer have to worry about "Cash/PayNow only".
            </p>
          </div>
          <div className="rounded-lg bg-accent p-5">
            <span className="mb-8 flex size-12 items-center justify-center rounded-full bg-background">
              <Clock className="size-6" />
            </span>
            <h3 className="mb-2 text-xl font-medium">Make informed choices</h3>
            <p className="leading-7 text-muted-foreground">
              Real-time queue monitoring allows you to see wait times before you place an order, so you can get food faster.
            </p>
          </div>
          <div className="rounded-lg bg-accent p-5">
            <span className="mb-8 flex size-12 items-center justify-center rounded-full bg-background">
              <Sparkle className="size-6" />
            </span>
            <h3 className="mb-2 text-xl font-medium">Having trouble deciding?</h3>
            <p className="leading-7 text-muted-foreground">
              AI-powered food recommendations can offer personalized suggestions and provide alternatives.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Feature};
