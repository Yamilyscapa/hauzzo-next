"use client";
import { Fragment } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardImage,
  CardFooter,
  CardTitle,
  CardContainer,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyContent } from "@/types/property";
import { formatDescription, formatPrice } from "@/utils/text-formatter";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { urlWithQuery } from "@/lib/url-parsing";

export default function Property(content: PropertyContent) {
  const params = useSearchParams();
  const currentQuery = params.get("query");
  const imageUrl: string =
    Array.isArray(content.images) && content.images.length > 0
      ? content.images[0]
      : "";
  const formattedContent = {
    transaction: content.transaction === "sale" ? "VENTA" : "RENTA",
    price: formatPrice(content.price),
    description: formatDescription(content.description, 85),
  };
  let isLoading: boolean = false;

  return (
    <Card className="w-full max-w-80 h-[26rem] gap-0 overflow-hidden flex flex-col pt-0">
      <Link
        href={
          currentQuery
            ? `${urlWithQuery(content)}&query=${encodeURIComponent(currentQuery)}`
            : urlWithQuery(content)
        }
      >
        {isLoading || !imageUrl ? (
          <Skeleton className="h-60 w-full" />
        ) : (
          <CardImage className="h-60 w-full" src={imageUrl} />
        )}

        <CardContainer className="flex-1 flex flex-col justify-between">
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-full mt-3" />
            ) : (
              <CardTitle className="text-3xl font-bold mt-3">
                {formattedContent.price}
              </CardTitle>
            )}

            {isLoading ? (
              <>
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-full mt-2" />
              </>
            ) : (
              <CardDescription className="text-sm text-gray-500 mt-2">
                {formattedContent.description}
              </CardDescription>
            )}
          </CardContent>

          <CardFooter className="">
            {isLoading ? (
              <Skeleton className="h-4 w-full mt-2" />
            ) : (
              <div className="flex flex-row gap-2 text-overflow-ellipsis overflow-hidden whitespace-nowrap">
                <p className="text-sm font-semibold text-gray-500">
                  {formattedContent.transaction}
                </p>
                <span className="text-sm text-gray-500">|</span>
                {content.tags.map((feature, index) => (
                  <Fragment key={index}>
                    <p className="text-sm text-gray-500">{feature}</p>
                    {index < content.tags.length - 1 && (
                      <span className="text-sm text-gray-500">|</span>
                    )}
                  </Fragment>
                ))}
              </div>
            )}
          </CardFooter>
        </CardContainer>
      </Link>
    </Card>
  );
}
