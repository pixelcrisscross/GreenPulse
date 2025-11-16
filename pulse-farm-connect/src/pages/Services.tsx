import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plane, MapPin, Phone, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Services = () => {
  const { toast } = useToast();
  const [requested, setRequested] = useState(false);
  const [formData, setFormData] = useState({
    service: "",
    area: "",
    crop: "",
    acres: ""
  });

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequested(true);
    toast({
      title: "Service Request Submitted",
      description: "Finding nearest drone operator in your area...",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-earth p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Agricultural Services
          </h1>
          <p className="text-muted-foreground mt-1">
            Professional drone spraying and field services
          </p>
        </div>

        {/* Service Request Form */}
        <Card className="p-6 shadow-soft bg-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">Drone Pesticide Spraying</h2>
              <p className="text-sm text-muted-foreground">Quick, efficient, and eco-friendly</p>
            </div>
          </div>

          {!requested ? (
            <form onSubmit={handleRequest} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service">Service Type</Label>
                  <Select value={formData.service} onValueChange={(v) => setFormData({...formData, service: v})}>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pesticide">Pesticide Spraying</SelectItem>
                      <SelectItem value="fertilizer">Fertilizer Application</SelectItem>
                      <SelectItem value="herbicide">Herbicide Treatment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crop">Crop Type</Label>
                  <Input
                    id="crop"
                    placeholder="e.g., Cotton, Rice, Wheat"
                    value={formData.crop}
                    onChange={(e) => setFormData({...formData, crop: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Village/Area</Label>
                  <Input
                    id="area"
                    placeholder="Enter your location"
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="acres">Farm Size (Acres)</Label>
                  <Input
                    id="acres"
                    type="number"
                    placeholder="e.g., 5"
                    value={formData.acres}
                    onChange={(e) => setFormData({...formData, acres: e.target.value})}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-primary">
                Request Service
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg border-2 border-secondary">
                <CheckCircle className="h-8 w-8 text-secondary" />
                <div>
                  <p className="font-semibold text-foreground">Service Request Accepted</p>
                  <p className="text-sm text-muted-foreground">Matched with nearest operator</p>
                </div>
              </div>

              <Card className="p-6 bg-muted">
                <h3 className="font-bold text-foreground mb-4">Assigned Operator</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                      RS
                    </div>
                    <div>
                      <p className="font-semibold">Rajesh Singh</p>
                      <p className="text-sm text-muted-foreground">Certified Drone Operator</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>3.5 km from your location</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>+91 98765 43210</span>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Estimated Cost:</span>
                      <span className="text-lg font-bold text-primary">₹{parseInt(formData.acres || "0") * 250}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Rate: ₹250 per acre (includes material application)
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button className="w-full bg-gradient-primary">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Operator
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setRequested(false)}>
                    Request Another Service
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </Card>

        {/* Benefits Card */}
        <Card className="p-6 bg-white shadow-soft">
          <h3 className="font-bold text-primary mb-4">Why Use Drone Services?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Faster Coverage", desc: "10x faster than manual spraying" },
              { title: "Precise Application", desc: "Reduces pesticide waste by 30%" },
              { title: "Cost Effective", desc: "Lower labor costs and time" },
              { title: "Safer", desc: "Minimizes chemical exposure to workers" }
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-secondary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">{benefit.title}</p>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Services;
