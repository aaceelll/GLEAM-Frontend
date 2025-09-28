import Image from "next/image"

interface GleamLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function GleamLogo({ size = "md", showText = true }: GleamLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  }

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} relative`}>
        <Image src="/images/gleam-logo.png" alt="GLEAM Logo" fill className="object-contain" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <h1 className={`font-bold text-foreground ${textSizeClasses[size]}`}>GLEAM</h1>
          <p className="text-xs text-muted-foreground leading-tight">Glucose, Learning, Education, and Monitoring</p>
        </div>
      )}
    </div>
  )
}
