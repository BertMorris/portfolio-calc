import React from "react";

type Props = {
  params: { portfolioQuery: string };
};

export default function page({ params }: Props) {
  const query = decodeURIComponent(params.portfolioQuery);

  return (
    <main>
      <h1>This page will contain the bashboard</h1>
      <h2>The dashboard will present the follwing:</h2>
      <ul>
        <li>Portfolio balance beginning with start date to current</li>
        <li>
          Allow users to compare their portfolio performance against the major
          indices and potentially other popular funds
        </li>
        <li>
          Maybe allow users to compare their portfolio against other rebalancing
          strategies ie yearly, quarterly
        </li>
      </ul>
      <h3>URL query: {query}</h3>
    </main>
  );
}
