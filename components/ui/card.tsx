import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, children, ...props }: React.ComponentProps<"div">) {
  // Check if any child is a CardImage component recursively
  const hasCardImage = React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) return false;

    // Check if this child is a CardImage
    const childProps = child.props as any;
    if (childProps && childProps["data-slot"] === "card-image") {
      return true;
    }

    // Recursively check children of this child
    if (childProps && childProps.children) {
      return React.Children.toArray(childProps.children).some((grandChild) => {
        if (!React.isValidElement(grandChild)) return false;
        const grandChildProps = grandChild.props as any;
        return grandChildProps && grandChildProps["data-slot"] === "card-image";
      });
    }

    return false;
  });

  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-xs",
        hasCardImage ? "pt-0" : "py-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardImage({ className, ...props }: React.ComponentProps<"img">) {
  const { src } = props;

  return (
    <img
      data-slot="card-image"
      src={src}
      alt="Card Image"
      className={cn("object-cover rounded-sm", className)}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardContainer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-container"
      className={cn("flex flex-col gap-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardContainer,
  CardImage,
};
