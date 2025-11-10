import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { FileText, Eye } from "lucide-react";

interface ResumeTemplateCardProps {
  name: string;
  image: string;
  isRecommended?: boolean;
  isMostRecommended?: boolean;
  onSelect: () => void;
  onPreview?: () => void;
}

export const ResumeTemplateCard = ({ name, image, isRecommended, isMostRecommended, onSelect, onPreview }: ResumeTemplateCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card className="overflow-hidden card-shadow hover:card-shadow-hover transition-smooth">
      <div className="relative">
        {isMostRecommended && (
          <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white z-10 shadow-lg font-bold">
            ⭐ Most Recommended
          </Badge>
        )}
        {isRecommended && !isMostRecommended && (
          <Badge className="absolute top-4 right-4 gradient-primary text-white z-10">Recommended</Badge>
        )}
        <div className="p-4 bg-secondary/20">
          <div className="aspect-[3/4] bg-background rounded-lg overflow-hidden shadow-md relative">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <FileText className="w-12 h-12 text-gray-400 animate-pulse" />
              </div>
            )}
            {imageError ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
                <FileText className="w-16 h-16 mb-2" />
                <p className="text-sm">Preview unavailable</p>
              </div>
            ) : (
              <img
                src={`${image}?v=${Date.now()}`}
                alt={name}
                className="w-full h-full object-cover"
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  console.error(`Failed to load image: ${image}`);
                  setImageError(true);
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-center mb-3">{name}</h3>
        <div className="flex gap-2">
          {onPreview && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
              className="w-12 bg-white text-black border border-gray-300 hover:bg-gray-50"
              size="lg"
            >
              <Eye className="w-5 h-5" />
            </Button>
          )}
          <Button onClick={onSelect} className="flex-1 gradient-primary text-white hover:opacity-90" size="lg">
            Choose
          </Button>
        </div>
      </div>
    </Card>
  );
};
