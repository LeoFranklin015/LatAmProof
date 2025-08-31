"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Globe,
  Wallet,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Shield,
  Users,
  Calendar,
  MapPin,
} from "lucide-react";

// Mock data based on the smart contract structure
const mockReliefProgram = {
  id: 1,
  name: "Argentina Disaster Relief Fund",
  amount: "1000", // 1000 tokens
  maxClaims: 1000,
  totalClaimed: 247,
  active: true,
};

const mockUserVerification = {
  isVerified: true,
  country: "ARG",
  ensId: "leo.arg.eth",
};

export default function ReliefPage() {
  const [isEligible, setIsEligible] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is verified and eligible (Argentina citizens only)
    setIsEligible(
      mockUserVerification.isVerified && mockUserVerification.country === "ARG"
    );
  }, []);

  const handleClaim = async () => {
    setIsLoading(true);
    // Simulate claim process
    setTimeout(() => {
      setIsLoading(false);
      setHasClaimed(true);
    }, 2000);
  };

  const progressPercentage =
    (mockReliefProgram.totalClaimed / mockReliefProgram.maxClaims) * 100;
  const remainingClaims =
    mockReliefProgram.maxClaims - mockReliefProgram.totalClaimed;

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 lg:px-12 border-b border-gray-800">
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
      <div className="max-w-3xl mx-auto p-6 lg:p-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Relief Fund Claim</h1>
          <p className="text-lg text-gray-400">
            Emergency financial assistance for verified Argentina citizens
          </p>
        </div>

        {/* Eligibility Rules Section */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <Shield className="mr-2 h-5 w-5 text-sky-400" />
              Eligibility Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-sky-400" />
                <div>
                  <p className="font-medium text-white">
                    Argentina Citizenship
                  </p>
                  <p className="text-sm text-gray-400">
                    Verified through LatAm Proof
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-sky-400" />
                <div>
                  <p className="font-medium text-white">One Claim Per Person</p>
                  <p className="text-sm text-gray-400">
                    Sybil-resistant verification
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-sky-400" />
                <div>
                  <p className="font-medium text-white">Active Program</p>
                  <p className="text-sm text-gray-400">
                    Claims available until exhausted
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-sky-400" />
                <div>
                  <p className="font-medium text-white">ENS Domain Required</p>
                  <p className="text-sm text-gray-400">
                    Government-verified identity
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">
              {mockReliefProgram.name}
            </CardTitle>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-sky-400">
                  {mockReliefProgram.amount}
                </p>
                <p className="text-sm text-gray-400">USDC</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {remainingClaims}
                </p>
                <p className="text-sm text-gray-400">Claims Left</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress</span>
                <span className="text-white">
                  {mockReliefProgram.totalClaimed} /{" "}
                  {mockReliefProgram.maxClaims}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            {isEligible ? (
              <div className="flex items-center space-x-3 p-4 bg-green-900/20 border border-green-800 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <div>
                  <p className="font-semibold text-green-200">
                    Eligible for Relief
                  </p>
                  <p className="text-sm text-green-400">
                    ENS ID: {mockUserVerification.ensId}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 p-4 bg-red-900/20 border border-red-800 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-400" />
                <div>
                  <p className="font-semibold text-red-200">Not Eligible</p>
                  <p className="text-sm text-red-400">Verification required</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            {hasClaimed ? (
              <div className="text-center space-y-4 py-8">
                <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Claim Successful!
                  </h3>
                  <p className="text-gray-400">
                    Funds transferred to your wallet
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Ready to Claim
                  </h3>
                  <p className="text-gray-400">
                    One-time relief fund for verified citizens
                  </p>
                </div>

                <Button
                  onClick={handleClaim}
                  disabled={!isEligible || isLoading}
                  className="w-full bg-sky-400 hover:bg-sky-500 text-white disabled:opacity-50"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Claim {mockReliefProgram.amount} USDC
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
