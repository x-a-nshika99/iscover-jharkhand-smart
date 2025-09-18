import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Clock, Users, Star } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";

const EventCalendar = () => {
  const { events, loading, error } = useEvents();

  if (error) {
    return (
      <section id="events" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-destructive">Error loading events: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-accent text-accent-foreground" variant="secondary">
            Events & Festivals
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Upcoming Cultural
            <span className="block text-transparent bg-gradient-to-r from-accent to-cultural bg-clip-text">
              Events & Festivals
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Immerse yourself in the vibrant cultural celebrations, workshops, and educational 
            events that showcase Jharkhand's rich heritage and traditions.
          </p>
        </div>

        {/* Calendar View Toggle */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button variant="default" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Upcoming Events
          </Button>
          <Button variant="outline" size="sm">Monthly View</Button>
          <Button variant="outline" size="sm">Cultural Festivals</Button>
          <Button variant="outline" size="sm">Workshops</Button>
          <Button variant="outline" size="sm">Educational</Button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-10 w-full mt-4" />
                </CardContent>
              </Card>
            ))
          ) : (
            events.map((event) => (
              <Card key={event.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative overflow-hidden">
                  <img 
                    src={event.image_url || "/src/assets/cultural-festival.jpg"} 
                    alt={event.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge 
                      className={
                        event.category === "cultural" ? "bg-cultural text-cultural-foreground" :
                        event.category === "workshop" ? "bg-eco text-eco-foreground" :
                        "bg-accent text-accent-foreground"
                      }
                    >
                      {event.category}
                    </Badge>
                  </div>
                  {event.price === 0 && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-600 text-white">
                        FREE
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="flex items-start justify-between gap-2">
                    <span>{event.name}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-base">
                    {event.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{new Date(event.event_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{event.event_time || "TBA"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{event.expected_attendees} expected</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {event.highlights.map((highlight) => (
                      <Badge key={highlight} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <span className="text-lg font-bold text-foreground">
                        {event.price === 0 ? "Free Entry" : `₹${event.price}`}
                      </span>
                      {event.price !== 0 && (
                        <span className="text-sm text-muted-foreground ml-1">per person</span>
                      )}
                    </div>
                    <Button 
                      variant={
                        event.category === "cultural" ? "cultural" :
                        event.category === "workshop" ? "eco" : "default"
                      }
                      size="sm"
                    >
                      {event.price === 0 ? "Register Free" : "Book Now"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" size="lg">
            <Calendar className="h-4 w-4 mr-2" />
            View Full Calendar
          </Button>
          <Button variant="default" size="lg">
            Get Event Notifications
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventCalendar;