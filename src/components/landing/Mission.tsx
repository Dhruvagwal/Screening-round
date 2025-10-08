import { landingData } from "@/data/landing";

export function Mission() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission Statement */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-foreground mb-8 italic leading-relaxed">
            {landingData.hero.subtitle.split(' ').slice(0, 4).join(' ')}{' '}
            <span className="font-bold italic">
              {landingData.hero.subtitle.split(' ').slice(4).join(' ')}
            </span>
          </h2>
          
          <div className="max-w-2xl mx-auto space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-base">
              {landingData.hero.mission}
            </p>
            
            <p className="text-base">
              {landingData.hero.solution}
            </p>
            
            <p className="text-base font-medium">
              {landingData.hero.cta}
            </p>
          </div>
        </div>

        {/* Technology Description */}
        <div className="border-t border-border pt-16">
          <div className="text-center">
            <h3 className="font-serif text-2xl font-normal text-foreground mb-6 italic">
              Calendar Intelligence via MCP
            </h3>
            <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A sophisticated web application that connects to Google Calendar using Model Context Protocol (MCP), 
              fetching past and upcoming meetings with contextual data to optimize your scheduling workflow 
              and enhance your productivity as an ambitious builder.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}