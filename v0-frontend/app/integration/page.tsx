"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Wallet, Code, Copy, Check } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const countries = [
  { code: "ARG", name: "Argentina", flag: "🇦🇷" },
  { code: "BRA", name: "Brazil", flag: "🇧🇷" },
  { code: "CHL", name: "Chile", flag: "🇨🇱" },
  { code: "MEX", name: "Mexico", flag: "🇲🇽" },
];

const generateCodeSnippet = (countryCode: string, countryName: string) => {
  return `// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ILatAmProof} from "../interfaces/ILatamProof.sol";

contract MyGatedContract {
    ILatAmProof public latAmProof;
    
    constructor(address _latAmProof) {
        latAmProof = ILatAmProof(_latAmProof);
    }

    modifier onlyFromCountry{
        require(
            latAmProof.isUserVerifiedForCountry(msg.sender, ${countryCode}),
            "Not verified for this country"
        );
        _;
    }
    
    function ${countryName.toLowerCase()}Only() external onlyFromCountry {
        // Only ${countryName} users can call this

    }
    
    function getVerificationStatus(address user) external view returns (bool) {
        return latAmProof.isUserVerifiedForCountry(user, "${countryCode}");
    }
}`;
};

export default function DevelopersPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!selectedCountry) return;

    const country = countries.find((c) => c.code === selectedCountry);
    if (!country) return;

    const code = generateCodeSnippet(selectedCountry, country.name);
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedCountryData = countries.find((c) => c.code === selectedCountry);

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 lg:p-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Code className="h-8 w-8 text-sky-400" />
            <h1 className="text-4xl font-bold text-white">
              Developer Integration
            </h1>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Integrate LatAm Proof ENS verification into your smart contracts.
            Select a country to generate the corresponding Solidity code
            snippet.
          </p>
        </div>

        {/* Country Selection */}
        <Card className="bg-gray-900 border-gray-800 max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-xl text-white text-center">
              Select Country
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Choose a country..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {countries.map((country) => (
                  <SelectItem
                    key={country.code}
                    value={country.code}
                    className="text-white hover:bg-gray-700"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{country.flag}</span>
                      <span>{country.name}</span>
                      <span className="text-gray-400">({country.code})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Code Snippet */}
        {selectedCountry && selectedCountryData && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-white flex items-center">
                  <span className="text-2xl mr-2">
                    {selectedCountryData.flag}
                  </span>
                  {selectedCountryData.name} Integration Code
                </CardTitle>
                <p className="text-gray-300 mt-1">
                  Smart contract modifier for {selectedCountryData.name} citizen
                  verification
                </p>
              </div>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="border-gray-700 hover:bg-gray-800 bg-transparent text-white"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-sky-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Code
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-gray-800 p-6 rounded-lg overflow-x-auto text-sm font-mono border border-gray-700">
                  <code className="text-gray-100">
                    {generateCodeSnippet(
                      selectedCountry,
                      selectedCountryData.name
                    )}
                  </code>
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documentation */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• Import the ILatAmProof interface in your contract</p>
              <p>
                • Use the onlyFromCountry modifier to restrict function access
              </p>
              <p>
                • The modifier checks if the caller is verified for the
                specified country
              </p>
              <p>
                • Only users with verified ENS domains can execute protected
                functions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">
                Integration Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <p>• Sybil-resistant identity verification</p>
              <p>• Government-backed citizen authentication</p>
              <p>• Seamless ENS domain integration</p>
              <p>• Cross-border financial inclusion support</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
