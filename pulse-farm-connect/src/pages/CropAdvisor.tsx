import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, Droplets, Calendar, MapPin } from "lucide-react";

const cropData = {
  kharif: {
    loamy: [
      { name: "Rice", water: "High (1200-1500 mm)", duration: "120-150 days" },
      { name: "Cotton", water: "Medium (600-900 mm)", duration: "150-180 days" },
      { name: "Soybean", water: "Medium (450-600 mm)", duration: "90-120 days" }
    ],
    sandy: [
      { name: "Bajra", water: "Low (400-600 mm)", duration: "70-90 days" },
      { name: "Groundnut", water: "Medium (500-700 mm)", duration: "110-130 days" }
    ],
    clay: [
      { name: "Rice", water: "High (1200-1500 mm)", duration: "120-150 days" },
      { name: "Sugarcane", water: "Very High (1500-2500 mm)", duration: "12-18 months" }
    ]
  },
  rabi: {
    loamy: [
      { name: "Wheat", water: "Medium (450-650 mm)", duration: "120-150 days" },
      { name: "Gram", water: "Low (400-500 mm)", duration: "100-120 days" },
      { name: "Mustard", water: "Low (350-450 mm)", duration: "100-130 days" }
    ],
    sandy: [
      { name: "Barley", water: "Low (350-450 mm)", duration: "120-150 days" },
      { name: "Peas", water: "Medium (400-500 mm)", duration: "90-110 days" }
    ],
    clay: [
      { name: "Wheat", water: "Medium (450-650 mm)", duration: "120-150 days" },
      { name: "Lentil", water: "Low (350-400 mm)", duration: "100-120 days" }
    ]
  },
  zaid: {
    loamy: [
      { name: "Watermelon", water: "Medium (400-600 mm)", duration: "70-90 days" },
      { name: "Cucumber", water: "Medium (350-500 mm)", duration: "50-70 days" },
      { name: "Muskmelon", water: "Medium (400-500 mm)", duration: "65-80 days" }
    ],
    sandy: [
      { name: "Watermelon", water: "Medium (400-600 mm)", duration: "70-90 days" },
      { name: "Bottle Gourd", water: "Medium (400-600 mm)", duration: "60-80 days" }
    ],
    clay: [
      { name: "Tomato", water: "Medium (600-800 mm)", duration: "60-90 days" },
      { name: "Brinjal", water: "Medium (600-900 mm)", duration: "120-140 days" }
    ]
  }
};

const CropAdvisor = () => {
  const [season, setSeason] = useState<string>("");
  const [soilType, setSoilType] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);

  const getSuggestions = () => {
    if (season && soilType) {
      const crops = cropData[season as keyof typeof cropData]?.[soilType as keyof typeof cropData.kharif] || [];
      setResults(crops);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-earth p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Crop Advisor
          </h1>
          <p className="text-muted-foreground mt-1">
            Get crop recommendations based on season and soil type
          </p>
        </div>

        {/* Selection Card */}
        <Card className="p-6 shadow-soft bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Select Season
              </label>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kharif">Kharif (Monsoon)</SelectItem>
                  <SelectItem value="rabi">Rabi (Winter)</SelectItem>
                  <SelectItem value="zaid">Zaid (Summer)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Soil Type
              </label>
              <Select value={soilType} onValueChange={setSoilType}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose soil type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="loamy">Loamy Soil</SelectItem>
                  <SelectItem value="sandy">Sandy Soil</SelectItem>
                  <SelectItem value="clay">Clay Soil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={getSuggestions}
                disabled={!season || !soilType}
                className="w-full bg-gradient-primary"
              >
                Get Recommendations
              </Button>
            </div>
          </div>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">
              Recommended Crops
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((crop, idx) => (
                <Card key={idx} className="p-6 shadow-soft hover:shadow-strong transition-shadow bg-white">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <Sprout className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        {crop.name}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Droplets className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">Water Requirement:</span>
                          <span className="font-medium">{crop.water}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">Growing Period:</span>
                          <span className="font-medium">{crop.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Info Card */}
        <Card className="p-6 bg-muted">
          <h3 className="font-semibold text-foreground mb-3">About Crop Seasons</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-primary mb-1">Kharif (Monsoon)</p>
              <p className="text-muted-foreground">June - October</p>
            </div>
            <div>
              <p className="font-medium text-primary mb-1">Rabi (Winter)</p>
              <p className="text-muted-foreground">October - March</p>
            </div>
            <div>
              <p className="font-medium text-primary mb-1">Zaid (Summer)</p>
              <p className="text-muted-foreground">March - June</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CropAdvisor;
