import { landingData } from "@/data/landing";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function Features() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-foreground mb-4 italic">
            Built for Ambitious Builders
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sophisticated tools designed to optimize your time and enhance your meeting intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {landingData.features.map((feature, index) => (
            <Card key={index} className="bg-card border-border">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="font-serif text-xl font-medium text-card-foreground italic">
                  {feature.title}
                </h3>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4">
            <button className="text-foreground border border-border px-8 py-3 rounded-full text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
              join the cohort
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              learn more →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}