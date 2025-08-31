"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Globe, Wallet, CheckCircle, User, MapPin } from "lucide-react";

export default function VerifyPage() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [name, setName] = useState("");
  const [showVerificationCard, setShowVerificationCard] = useState(false);

  const handleVerify = () => {
    if (selectedCountry && name) {
      setShowVerificationCard(true);
    }
  };

  return (
    <div className="min-h-screen bg-background dark relative overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:px-12">
        <div className="flex items-center space-x-2">
          <Globe className="h-8 w-8 text-sky-400" />
          <span className="text-2xl font-bold text-sky-400">LatAm Proof</span>
        </div>
        <Button className="bg-white hover:bg-gray-100 text-black">
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-88px)] p-6">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Verify Your Nationality
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose your country and enter your name to begin the verification
              process
            </p>
          </div>

          {/* Verification Form */}
          <div className="space-y-6">
            {/* Country Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-sky-400" />
                Select Your Country
              </label>
              <Select
                value={selectedCountry}
                onValueChange={setSelectedCountry}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mexico">🇲🇽 Mexico</SelectItem>
                  <SelectItem value="argentina">🇦🇷 Argentina</SelectItem>
                  <SelectItem value="brazil">🇧🇷 Brazil</SelectItem>
                  <SelectItem value="chile">🇨🇱 Chile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center">
                <User className="mr-2 h-4 w-4 text-sky-400" />
                Full Name
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerify}
              disabled={!selectedCountry || !name}
              className="w-full bg-white hover:bg-gray-100 text-black disabled:opacity-50"
              size="lg"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Verify Identity
            </Button>
          </div>
        </div>

        {/* Verification Card Modal */}
        {showVerificationCard && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-sky-400 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-black" />
                </div>
                <CardTitle className="text-2xl">
                  Verification Initiated
                </CardTitle>
                <CardDescription>
                  Your identity verification process has begun
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Country:
                    </span>
                    <span className="text-sm font-medium capitalize">
                      {selectedCountry}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Name:</span>
                    <span className="text-sm font-medium">{name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status:
                    </span>
                    <span className="text-sm font-medium text-sky-400">
                      Processing
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  You will receive your verified ENS domain once the process is
                  complete.
                </p>
                <Button
                  onClick={() => setShowVerificationCard(false)}
                  className="w-full bg-white hover:bg-gray-100 text-black"
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
