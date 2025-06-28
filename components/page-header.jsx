import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const PageHeader = ({
  icon,
  title,
  backlink = "/",
  backlabel = "Back to Home",
}) => {
  return (
    <div className="flex flex-cols justify-between gap-5 mb-8">
      <Link
        href={backlink}
        className="flex items-center text-muted-foreground hover:text-white transition-colors duration-300"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {backlabel}
      </Link>

      <div className="flex flex-row gap-2 ">
        {icon && (
          <div className="text-emerald-400/100">
            {React.cloneElement(icon, {
              className: "h-12 md:h-14 w-12 md:w-14",
            })}
          </div>
        )}
        <h1 className="text-4xl md:text-5xl bg-gradient-to-b from-emerald-500 to-teal-400 font-bold text-transparent bg-clip-text">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default PageHeader;
