import Link from "next/link";
import GraphEmbed from "~/components/GraphEmbed";

export const SubEntitiesList = ({
  title,
  elementId,
  subEntities,
  getSubEntityUrl,
  getSubEntityName,
}) => {
  return (
    <div className="mx-4 mt-10 lg:mx-auto lg:w-1/2" id={elementId}>
      <h2 className="text-center font-serif text-3xl">{title}</h2>
      <ul className="mt-10 list-disc">
        {subEntities.map((subEntity) => {
          return (
            <li key={getSubEntityUrl(subEntity)} className="my-5 text-primary">
              <a
                className="text-black underline hover:text-black/60"
                href={getSubEntityUrl(subEntity)}
              >
                {getSubEntityName(subEntity)}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export const SidePaneTopBox = ({ children }) => (
  <div className="mt-5 border-b px-5 pb-5">{children}</div>
);

export const SidePaneSection = ({ children }) => (
  <div className="mt-5 px-5">{children}</div>
);
const EntityLayout = ({ renderSidePane, graphPath, children }) => {
  return (
    <div className=":grid-cols-3 grid h-screen w-full xl:grid-cols-4">
      <div className="h-full border-r pb-10">
        <div className="sticky top-0 border-b bg-gray-100 px-5 py-2">
          <Link href="/" className="block text-center text-2xl font-semibold">
            Common <span className="text-primary">Data</span> Usage
          </Link>
        </div>
        <div className="mt-5 border-b px-5 pb-5">{renderSidePane()}</div>
      </div>
      <div className="h-full lg:col-span-2 xl:col-span-3">
        <div className="h-[50vh] lg:h-screen">
          <GraphEmbed graphPath={graphPath} />
        </div>
        {children && <div className="border-t bg-white pb-10">{children}</div>}
      </div>
    </div>
  );
};

export default EntityLayout;
