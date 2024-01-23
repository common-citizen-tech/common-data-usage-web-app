"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "~/lib/api/fetchData";
import { ThreeDots } from "react-loader-spinner";
import {
  getDataOrganizationRoute,
  getDatasetRoute,
  getRepositoryRoute,
} from "~/lib/routes";
import { Combobox } from "@headlessui/react";
import { useRouter } from "next/navigation";

const QUERY_MIN_LEN = 3;

const boxClassName =
  "absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg mb-10";

const searchEntities = (searchQuery) => {
  return fetchData(`/search?query=${searchQuery}`);
};
const AutoCompleteLoader = () => {
  return (
    <Combobox.Options className={boxClassName}>
      <div className="flex justify-center">
        <ThreeDots
          visible={true}
          height="40"
          width="40"
          color="#449ED1"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    </Combobox.Options>
  );
};

const AutoCompleteTypeMoreInfo = () => {
  return (
    <Combobox.Options className={boxClassName}>
      <span className="block px-3 py-2 text-sm text-gray-500">
        Type at least {QUERY_MIN_LEN} characters to start searching
      </span>
    </Combobox.Options>
  );
};

const AutoCompleteBoxSectionTitle = ({ title, count }) => {
  return (
    <span className="block px-3 py-2 text-xl text-gray-800">
      {title} <small>({count})</small>
    </span>
  );
};
const AutoCompleteItem = ({ title, href }) => {
  return (
    <Combobox.Option
      onChange={console.log}
      value={href}
      className="cursor-pointer px-6 text-gray-600 hover:text-primary/80"
    >
      {title}
    </Combobox.Option>
  );
};

const AutoCompleteBox = ({ data, queryLength }) => {
  if (queryLength < QUERY_MIN_LEN) return <AutoCompleteTypeMoreInfo />;
  if (!data) return <AutoCompleteLoader />;
  return (
    <Combobox.Options className={boxClassName}>
      <AutoCompleteBoxSectionTitle
        title="Organizations"
        count={data.dataOrganizations.count}
      />
      {data.dataOrganizations.results.map((org) => (
        <AutoCompleteItem
          key={org.id}
          title={org.title}
          href={getDataOrganizationRoute(org.id)}
        />
      ))}
      <AutoCompleteBoxSectionTitle
        title="Datasets"
        count={data.datasets.count}
      />
      <ul className="">
        {data.datasets.results.map((dataset) => (
          <AutoCompleteItem
            key={dataset.id}
            title={dataset.title}
            href={getDatasetRoute(dataset.id)}
          />
        ))}
      </ul>
      <AutoCompleteBoxSectionTitle
        title="Repositories"
        count={data.repositories.count}
      />
      <ul className="">
        {data.repositories.results.map((repo) => (
          <AutoCompleteItem
            key={repo.repository}
            title={repo.repository}
            href={getRepositoryRoute(repo.repository)}
          />
        ))}
      </ul>
    </Combobox.Options>
  );
};

const EntitiesSearchBox = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["searchAllEntities", searchQuery],
    queryFn: () => searchEntities(searchQuery),
    enabled: searchQuery.length >= QUERY_MIN_LEN,
  });

  const handleComboboxChange = (href) => {
    router.push(href);
  };

  return (
    <Combobox as="div" className="relative" onChange={handleComboboxChange}>
      {({ open }) => (
        <>
          <Combobox.Input
            type="text"
            autoComplete="off"
            onChange={(e) => setSearchQuery(e.target.value)}
            displayValue={() => searchQuery}
            placeholder="Search for dataset, resource, repo"
            className={[
              "block w-full border-2 border-transparent bg-gray-200 px-5 py-2 text-2xl focus:border-white focus:outline-none",
              open ? "rounded-t-lg" : "rounded-lg",
            ].join(" ")}
          />
          <AutoCompleteBox data={data} queryLength={searchQuery.length} />
        </>
      )}
    </Combobox>
  );
};

export default EntitiesSearchBox;
