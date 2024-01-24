import Link from "next/link";
import dataGovLogo from "~/assets/img/data-gov-logo.svg";

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
        A Tool for Graph Analysis of Open Government Data Usage in Open-Source
        Projects
      </h3>
      <div className="mb-5 mt-10 flex justify-center">
        <div
          role="alert"
          className="inline-block rounded border border-orange-500 bg-orange-100 px-5 py-2 text-center leading-loose text-orange-900"
        >
          Common Data Usage tool is currently in a proof-of-concept stage. Major
          changes without previous notice are expected. <br />
          Please, report any issues or suggestions to info@commoncitizentech.org
        </div>
      </div>
      <div className="mx-auto mt-10 w-1/2">
        <h2 className="font-serif text-3xl text-gray-700">About the project</h2>
        <p className="mt-5 leading-loose">
          This project is a research effort to understand how open government
          data (OGD) is used in open-source projects. Preliminary analysis is
          focused on data.gov, the open data portal of the US government. <br />
          This site will be updated as the project progresses.
        </p>
      </div>
      <div className="mx-auto mt-10 w-1/2">
        <h2 className="font-serif text-3xl text-gray-700">
          Browse OGD portals
        </h2>
        <div className="mt-5 grid grid-cols-3 gap-10">
          <Link
            href="/ogd-portals/data-gov/"
            className="flex items-center rounded border-2 bg-white px-5 py-2 transition hover:shadow"
          >
            <div className="">
              <div className="">
                <img alt="Data.gov logo" src={dataGovLogo.src} />
              </div>
              <span className="block text-center text-gray-600">
                US government portal
              </span>
            </div>
          </Link>
        </div>
      </div>
      <span className="mt-16 block text-center font-serif text-lg text-gray-600">
        Project by{" "}
        <a href="https://micorix.dev" className="underline">
          micorix
        </a>{" "}
        as a part of{" "}
        <a href="https://commoncitizentech.org" className="underline">
          CommonCitizenTech initiative
        </a>
      </span>
    </div>
  );
};

export default DataGovIndex;
