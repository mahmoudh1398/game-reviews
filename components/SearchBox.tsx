"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Combobox } from "@headlessui/react";
import { useIsClient } from "@/lib/hooks";
import { searchReviews, type SearchableReview } from "@/lib/reviews";

// export interface SearchBoxProps {
//   reviews: SearchableReview[];
// }

export default function SearchBox() {
  const router = useRouter();
  const isClient = useIsClient();
  const [query, setQuery] = useState("");
  const [reviews, setReviews] = useState([]);

  const handleChange = (review: SearchableReview) => {
    router.push(`/reviews/${review.slug}`);
  };

  useEffect(() => {
    if (query.length > 1) {
      (async () => {
        const reviews = await searchReviews(query);
        setReviews(reviews);
      })();
    } else {
      setReviews([]);
    }
  }, [query]);

  if (!isClient) return null;

  return (
    <div className="relative w-48">
      <Combobox onChange={handleChange}>
        <Combobox.Input
          placeholder="Search..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
        <Combobox.Options className="absolute bg-white py-1 w-full">
          {reviews.map((review) => (
            <Combobox.Option key={review.slug} value={review}>
              {({ active }) => (
                <span
                  className={`block px-2 truncate w-full ${
                    active ? "bg-orange-100" : ""
                  }`}
                >
                  {review.title}
                </span>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
    </div>
  );
}
