import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, Wind, Power, Sprout, FileText, Factory } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [moisture, setMoisture] = useState(45);
  const [dryness, setDryness] = useState(55);
  const [pumpStatus, setPumpStatus] = useState(false);

  // Simulate live sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMoisture(prev => Math.min(95, Math.max(5, prev + (Math.random() * 6 - 3))));
      setDryness(prev => Math.min(95, Math.max(5, prev + (Math.random() * 6 - 3))));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const togglePump = () => {
    setPumpStatus(!pumpStatus);
    toast({
      title: pumpStatus ? "Pump Turned OFF" : "Pump Turned ON",
      description: `Water pump is now ${!pumpStatus ? "active" : "inactive"}`,
    });
  };

  const getMoistureStatus = () => {
    if (moisture > 60) return { text: "Optimal - No irrigation needed", color: "text-secondary" };
    if (moisture < 30) return { text: "Critical - Irrigation required", color: "text-destructive" };
    return { text: "Normal - Monitor closely", color: "text-accent" };
  };

  return (
    <div className="min-h-screen bg-gradient-earth p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              GreenPulse Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Sustainable Agriculture Management</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Sprout className="h-4 w-4" />
              Crop Advisor
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Schemes
            </Button>
          </div>
        </div>

        {/* Sensor Data Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Moisture Card */}
          <Card className="p-6 shadow-soft hover:shadow-strong transition-shadow bg-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Droplets className="h-5 w-5" />
                  <span className="text-sm font-medium">Soil Moisture</span>
                </div>
                <div className="text-4xl font-bold text-primary mb-2">
                  {moisture.toFixed(1)}%
                </div>
                <p className={`text-sm font-medium ${getMoistureStatus().color}`}>
                  {getMoistureStatus().text}
                </p>
              </div>
              <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center">
                <Droplets className="h-8 w-8 text-secondary" />
              </div>
            </div>
          </Card>

          {/* Dryness Card */}
          <Card className="p-6 shadow-soft hover:shadow-strong transition-shadow bg-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Wind className="h-5 w-5" />
                  <span className="text-sm font-medium">Soil Dryness</span>
                </div>
                <div className="text-4xl font-bold text-primary mb-2">
                  {dryness.toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground">
                  {dryness > 60 ? "High dryness level" : "Acceptable range"}
                </p>
              </div>
              <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
                <Wind className="h-8 w-8 text-accent" />
              </div>
            </div>
          </Card>

          {/* Pump Control Card */}
          <Card className="p-6 shadow-soft hover:shadow-strong transition-shadow bg-gradient-primary">
            <div className="flex flex-col h-full justify-between text-primary-foreground">
              <div className="flex items-center gap-2 mb-2">
                <Power className="h-5 w-5" />
                <span className="text-sm font-medium">Water Pump</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-3 w-3 rounded-full ${pumpStatus ? 'bg-secondary animate-pulse' : 'bg-muted'}`} />
                <span className="text-2xl font-bold">
                  {pumpStatus ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
              <Button 
                onClick={togglePump}
                variant="secondary"
                className="w-full"
              >
                {pumpStatus ? "Turn OFF" : "Turn ON"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Schemes */}
          <Card className="p-6 shadow-soft bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-primary">Government Schemes</h3>
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-3">
              {[
                { name: "PM Kisan Samman Nidhi", link: "https://pmkisan.gov.in/" },
                { name: "Soil Health Card Scheme", link: "https://soilhealth.dac.gov.in/" },
                { name: "Kisan Credit Card", link: "https://www.india.gov.in/spotlight/kisan-credit-card-kcc" }
              ].map((scheme, idx) => (
                <a
                  key={idx}
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg bg-muted hover:bg-secondary/20 transition-colors"
                >
                  <p className="font-medium text-foreground">{scheme.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Click to visit official website →</p>
                </a>
              ))}
            </div>
          </Card>

          {/* Factory Contacts */}
          <Card className="p-6 shadow-soft bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-primary">Nearby Factories</h3>
              <Factory className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-3">
              {[
                { name: "FreshPack Agro Pvt Ltd", distance: "8 km", product: "Vegetables" },
                { name: "AgroProcess Co-op", distance: "12 km", product: "Grains" }
              ].map((factory, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-muted">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-foreground">{factory.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Accepts: {factory.product}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-accent">{factory.distance}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Status Bar */}
        <Card className="p-4 shadow-soft bg-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <span>Connected to ESP32</span>
            </div>
            <div className="text-muted-foreground">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
