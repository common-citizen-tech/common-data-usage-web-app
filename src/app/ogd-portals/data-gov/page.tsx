import dataGovLogo from "~/assets/img/data-gov-logo.svg";
import Link from "next/link";
import EntitiesSearchBox from "~/app/ogd-portals/data-gov/EntitiesSearchBox";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "data.gov | Common Data Usage",
};
const DataGovIndex = () => {
  return (
    <div className="mx-auto mt-20 w-4/5">
      <h1 className="text-center text-7xl font-bold">
        Common <span className="text-primary">Data</span> Usage
      </h1>
      <span className="mt-5 block text-center">
        by{" "}
        <a href="https://commoncitizentech.org" className="font-semibold">
          Common
          <span className="text-primary">Citizen</span>
          Tech
        </a>{" "}
        initiative
      </span>
      <h3 className="mt-10 text-center font-serif text-2xl">
        Explore data connections on{" "}
        <img
          alt="Data.gov logo"
          src={dataGovLogo.src}
          className="ml-2 inline-block h-12"
        />
      </h3>
      <div className="mx-auto mt-10 w-1/2">
        <EntitiesSearchBox />
      </div>
      <span className="mt-10 block text-center font-serif text-lg">
        You can also{" "}
        <Link
          href="/ogd-portals/data-gov/data-organization"
          className="underline"
        >
          browse organizations
        </Link>{" "}
        or{" "}
        <Link href="/" className="underline">
          go to the about page
        </Link>
      </span>
    </div>
  );
};

export default DataGovIndex;
