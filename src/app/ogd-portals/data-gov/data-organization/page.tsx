import OrgImage from "~/app/ogd-portals/data-gov/data-organization/OrgImage";
import Link from "next/link";
import { fetchData } from '~/lib/api/fetchData'

export const dynamic = "force-dynamic";

const DataOrganizationsRoute = async () => {
  const { organizations } = await fetchData(
    "/data-organization",
  )
  return (
    <div className="">
      <nav className="w-full border-b py-2 ">
        <div className="mx-auto flex w-4/5 items-center justify-between">
          <Link href="/" className="text-center text-2xl font-semibold">
            Common <span className="text-primary">Data</span> Usage
          </Link>
          <a href="https://commoncitizentech.org" className="hover:underline">
            About CommonCitizenTech initiative
          </a>
        </div>
      </nav>
      <div className="mx-auto mt-20 w-4/5 pb-20">
        <h3 className="mt-10 text-center font-serif text-3xl">
          Organizations on data.gov
        </h3>
        <div className="mt-20 grid grid-cols-4 gap-x-20 gap-y-10">
          {organizations.map((row) => {
            return (
              <a
                key={row.id}
                href={`/ogd-portals/data-gov/data-organization/${row.id}`}
                className="block rounded border-2 bg-white px-5 py-5"
              >
                <div className="flex justify-center">
                  <OrgImage imageUrl={row.imageUrl} orgName={row.title} />
                </div>
                <span className="mt-5 block text-center">{row.title}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DataOrganizationsRoute;
