import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Video, Clock } from "lucide-react";

const interviews = [
  {
    id: 1,
    company: "Tech Innovations Inc.",
    logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop",
    position: "Frontend Developer",
    date: "May 15, 2025",
    time: "2:00 PM - 3:00 PM",
    type: "Video Call",
  },
  {
    id: 2,
    company: "Creative Studios",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop",
    position: "UI/UX Designer",
    date: "May 18, 2025",
    time: "10:00 AM - 11:00 AM",
    type: "Video Call",
  },
];

export const UpcomingInterviews = () => {
  return (
    <Card className="p-6 card-shadow hover:card-shadow-hover transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Upcoming Interviews</h3>
          <p className="text-sm text-muted-foreground">Your scheduled interview sessions</p>
        </div>
      </div>

      <div className="space-y-4">
        {interviews.map((interview) => (
          <div 
            key={interview.id}
            className="p-4 rounded-xl bg-gradient-to-r from-accent/5 to-primary/5 border border-accent/20 transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:border-accent/40 cursor-pointer"
          >
            <div className="flex gap-4">
              {/* Company Logo */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary border border-border">
                  <img 
                    src={interview.logo} 
                    alt={`${interview.company} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{interview.position}</h4>
                    <p className="text-sm text-muted-foreground">{interview.company}</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white">
                    <Video className="w-4 h-4 mr-1" />
                    Join
                  </Button>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {interview.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {interview.time}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {interviews.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No upcoming interviews</p>
          </div>
        )}
      </div>
    </Card>
  );
};
