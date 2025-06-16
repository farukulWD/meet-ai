import { AlertCircleIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

interface Props {
  title: string;
  description: string;
  image?: string;
}

function EmptyState({ title, description, image = "/empty.svg" }: Props) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image src={image} alt="Empty" width={240} height={240} />
      <div className="max-w-md mx-auto text-center flex flex-col gap-y-6">
        <h6 className="text-lg font-medium">{title}</h6>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default EmptyState;
