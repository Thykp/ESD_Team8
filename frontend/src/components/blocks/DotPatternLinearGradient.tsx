"use client";

import { cn } from "@/lib/utils";
import { DotPattern } from "../magicui/dot-pattern";

export function DotPatternLinearGradient() {
  return (
    <div className="absolute inset-0">
      <DotPattern
        width={20}
        height={20}
        glow={true}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
        )}
      />
    </div>
  );
}
