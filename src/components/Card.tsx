import { ReactNode } from "react";

interface CardProps {
  label: ReactNode;
  children: ReactNode;
}

function Card({ label, children }: CardProps) {
  return (
    <div className="card card-border bg-base-200 w-full h-full">
      <div className="card-body">
        <h2 className="card-title">
          {label}
        </h2>
        <div className="flex flex-col gap-3 w-full h-full">
        {children}
        </div>
      </div>
    </div>
  )
}

export default Card;
