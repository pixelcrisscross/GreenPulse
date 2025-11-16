import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Factory, MapPin, Phone, Search, ExternalLink } from "lucide-react";

const mockFactories = [
  {
    name: "FreshPack Agro Pvt Ltd",
    crops: ["Tomato", "Potato", "Onion", "Cabbage"],
    distance: "8 km",
    contact: "+91 98765 43210",
    address: "Pune-Nashik Highway, Pune",
    rating: 4.5
  },
  {
    name: "AgroProcess Co-operative",
    crops: ["Wheat", "Rice", "Soybean", "Cotton"],
    distance: "12 km",
    contact: "+91 91234 56789",
    address: "Industrial Area, Pune",
    rating: 4.7
  },
  {
    name: "Green Valley Foods",
    crops: ["Sugarcane", "Mango", "Banana"],
    distance: "15 km",
    contact: "+91 87654 32109",
    address: "Food Park, Pune",
    rating: 4.3
  },
  {
    name: "Organic Harvest Ltd",
    crops: ["Organic Vegetables", "Organic Grains"],
    distance: "20 km",
    contact: "+91 99887 77665",
    address: "Eco Park, Pune",
    rating: 4.8
  }
];

const Factories = () => {
  const [searchCrop, setSearchCrop] = useState("");
  const [filteredFactories, setFilteredFactories] = useState(mockFactories);

  const handleSearch = () => {
    if (searchCrop.trim()) {
      const filtered = mockFactories.filter(factory =>
        factory.crops.some(crop => 
          crop.toLowerCase().includes(searchCrop.toLowerCase())
        )
      );
      setFilteredFactories(filtered);
    } else {
      setFilteredFactories(mockFactories);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-earth p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Factory Finder
          </h1>
          <p className="text-muted-foreground mt-1">
            Find buyers and processing units for your crops
          </p>
        </div>

        {/* Search Card */}
        <Card className="p-6 shadow-soft bg-white">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter crop name (e.g., Tomato, Wheat, Cotton)"
                value={searchCrop}
                onChange={(e) => setSearchCrop(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="h-12"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="gap-2 h-12 bg-gradient-primary"
            >
              <Search className="h-4 w-4" />
              Search Factories
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Search for factories that accept your crop type. Results are sorted by distance.
          </p>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {filteredFactories.length === 0 ? (
            <Card className="p-8 text-center bg-white shadow-soft">
              <Factory className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-lg font-semibold text-foreground mb-2">No factories found</p>
              <p className="text-muted-foreground">
                Try searching for a different crop or check back later
              </p>
            </Card>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-primary">
                {filteredFactories.length} {filteredFactories.length === 1 ? 'Factory' : 'Factories'} Found
              </h2>
              {filteredFactories.map((factory, idx) => (
                <Card key={idx} className="p-6 shadow-soft hover:shadow-strong transition-shadow bg-white">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Factory className="h-7 w-7 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{factory.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">{factory.distance} away</span>
                            <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                              ⭐ {factory.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Accepts:</p>
                          <div className="flex flex-wrap gap-2">
                            {factory.crops.map((crop, i) => (
                              <span key={i} className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium">
                                {crop}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{factory.address}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{factory.contact}</span>
                        </div>

                        <div className="flex gap-3 mt-4">
                          <Button className="flex-1 bg-gradient-primary gap-2">
                            <Phone className="h-4 w-4" />
                            Contact Factory
                          </Button>
                          <Button variant="outline" className="gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>

        {/* Info Card */}
        <Card className="p-6 bg-muted">
          <h3 className="font-semibold text-foreground mb-3">How It Works</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. Search for your crop type to find interested buyers</p>
            <p>2. Review factory details, distance, and accepted products</p>
            <p>3. Contact the factory directly to discuss terms and pricing</p>
            <p>4. Arrange transportation and complete the deal</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Factories;
