"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import {
  Globe,
  Wallet,
  CheckCircle,
  User,
  MapPin,
  ExternalLink,
  ArrowLeft,
  X,
  AlertCircle,
} from "lucide-react";

export default function VerifyPage() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [name, setName] = useState("");
  const [showVerificationCard, setShowVerificationCard] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = searchParams.get("page");
  const id = searchParams.get("id");

  const handleVerify = () => {
    if (selectedCountry && name) {
      setShowVerificationCard(true);
    }
  };

  const handleSuccess = () => {
    const countryCode =
      selectedCountry === "argentina" ? "arg" : selectedCountry.slice(0, 3);
    router.push(
      `/verify?page=success&id=${name
        .toLowerCase()
        .replace(" ", "")}.${countryCode}.eth`
    );
  };

  const handleError = () => {
    router.push("/verify?page=error");
  };

  const SuccessPage = () => (
    <div className="min-h-screen bg-background dark relative overflow-hidden">
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

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-88px)] p-6">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Success Animation */}
          <div className="mx-auto w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle className="h-12 w-12 text-white animate-bounce" />
          </div>

          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Verification Successful!
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Your ENS domain has been successfully created and verified
            </p>
            <div className="bg-muted rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-2">
                Your ENS Domain:
              </p>
              <p className="text-lg font-bold text-sky-400">{id}</p>
            </div>
          </div>

          <Button
            onClick={() =>
              window.open(`https://sepolia.app.ens.domains/${id}`, "_blank")
            }
            className="w-full bg-white hover:bg-gray-100 text-black"
            size="lg"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View on ENS
          </Button>
        </div>
      </div>
    </div>
  );

  const ErrorPage = () => (
    <div className="min-h-screen bg-background dark relative overflow-hidden">
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

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-88px)] p-6">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Error Animation */}
          <div className="mx-auto w-24 h-24 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <AlertCircle className="h-12 w-12 text-white animate-bounce" />
          </div>

          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Verification Failed
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              We couldn't verify your identity at this time. Please try again or
              contact support.
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-600 dark:text-red-400">
                Verification failed due to insufficient documentation or invalid
                information.
              </p>
            </div>
          </div>

          <Button
            onClick={() => router.push("/verify")}
            className="w-full bg-white hover:bg-gray-100 text-black"
            size="lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Verify
          </Button>
        </div>
      </div>
    </div>
  );

  if (page === "success") {
    return <SuccessPage />;
  }

  if (page === "error") {
    return <ErrorPage />;
  }

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
                <div className="flex space-x-3">
                  <Button
                    onClick={handleSuccess}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Successful
                  </Button>
                  <Button
                    onClick={handleError}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Error
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
